import React, { useState, useEffect, useContext } from 'react';
import './bookingPage.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BookingPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { user } = useContext(AuthContext);

  const regions = {
    서울: ['강남', '홍대', '김포공항', '공덕'],
    충청: ['천안역', '두정역'],
    경기: ['김포', '일산', '동탄', '수원', '안양'],
  };

  const days = Array.from({ length: 6 }, (_, i) => new Date(new Date().setDate(new Date().getDate() + i)));

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/movies`, { withCredentials: true });
        setMovies(res.data.sort((a, b) => b.rating - a.rating));
      } catch (err) {
        console.error("Failed to fetch movies", err);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (selectedMovie && selectedDate) {
      const movie = movies.find((movie) => movie._id === selectedMovie._id);
      setShowtimes(movie.time);
    }
  }, [selectedMovie, selectedDate, movies]);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setSelectedTheater('');
    setSelectedMovie(null);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
  };

  const handleTheaterClick = (theater) => {
    setSelectedTheater(theater);
    setSelectedMovie(null);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setSelectedDate(null);
    setSelectedShowtime(null);
    setShowtimes([]);
    setSeats([]);
    setSelectedSeats([]);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedShowtime(null);
    setSeats([]);
    setSelectedSeats([]);
  };

  const handleShowtimeClick = (showtime) => {
    setSelectedShowtime(showtime);
    const movie = movies.find((movie) => movie._id === selectedMovie._id);
    const selectedTime = movie.time.find((t) => t.time === showtime);
    if (selectedTime) {
      setSeats(selectedTime.seats);
      setSelectedSeats([]);
    }
  };

  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert('로그인 후 예매가 가능합니다.');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const movie = movies.find((movie) => movie._id === selectedMovie._id);
      const selectedTime = movie.time.find((t) => t.time === selectedShowtime);
      const updatedSeats = seats.map((seat) => {
        if (selectedSeats.includes(seat.seatNumber)) {
          return { ...seat, status: 'occupied' };
        }
        return seat;
      });
      selectedTime.seats = updatedSeats;

      // 영화 정보 업데이트
      await axios.put(`${apiUrl}/movies/${movie._id}`, movie, { withCredentials: true });

      // 예매 정보 저장
      await axios.post(`${apiUrl}/reservations`, {
        userId: user._id,
        movieId: movie._id,
        theater: selectedTheater,
        showtime: `${selectedDate.toDateString()} ${selectedShowtime}`,
        seats: selectedSeats,
      }, { withCredentials: true });

      alert("예매가 완료되었습니다!");
      handleShowtimeClick(selectedShowtime);
    } catch (err) {
      console.error("Failed to book seats", err);
      alert("예매 중 오류가 발생했습니다.");
    }
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('ko-KR', { weekday: 'short' });
  };

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-container">
        <div className="step-selection">
          <div className="selection-section">
            <h3>지역 선택</h3>
            <ul>
              {Object.keys(regions).map((region) => (
                <li key={region} onClick={() => handleRegionClick(region)} className={selectedRegion === region ? 'selected' : ''}>
                  {region} {selectedRegion === region && <span>&#10004;</span>}
                </li>
              ))}
            </ul>
          </div>
          {selectedRegion && (
            <div className="selection-section">
              <h3>영화관 선택 ({selectedRegion})</h3>
              <ul>
                {regions[selectedRegion].map((theater) => (
                  <li key={theater} onClick={() => handleTheaterClick(theater)} className={selectedTheater === theater ? 'selected' : ''}>
                    {theater} {selectedTheater === theater && <span>&#10004;</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedTheater && (
            <div className="selection-section">
              <h3>영화 선택 ({<span>평점순</span>})</h3>
              <ul className="movie-list">
                {movies.map((movie) => (
                  <li key={movie._id} onClick={() => handleMovieClick(movie)} className={selectedMovie && selectedMovie._id === movie._id ? 'selected' : ''}>
                    {movie.name} {selectedMovie && selectedMovie._id === movie._id && <span>&#10004;</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedMovie && (
            <div className="selection-section">
              <h3>날짜 선택</h3>
              <ul className="dates-list">
                {days.map((day) => (
                  <li key={day} onClick={() => handleDateClick(day)} className={selectedDate && selectedDate.toDateString() === day.toDateString() ? 'selected' : ''}>
                    {day.getDate()} ({getDayName(day)}) {selectedDate && selectedDate.toDateString() === day.toDateString() && <span>&#10004;</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedDate && (
            <div className="selection-section showtime-section">
              <h3>시간 선택</h3>
              <ul className="showtimes-list">
                {showtimes && showtimes.map((showtime, index) => (
                  <li key={index} onClick={() => handleShowtimeClick(showtime.time)} className={selectedShowtime === showtime.time ? 'selected' : ''}>
                    {showtime.time} - {showtime.seats ? showtime.seats.filter((seat) => seat.status === 'available').length : 0} 좌석 남음
                  </li>
                ))}
              </ul>
            </div>
          )}
          {selectedShowtime && (
            <>
              <div className="selection-section">
                <h3>좌석 선택</h3>
                <div className="screen">S C R E E N</div>
                <div className="seats-container">
                  {seats && seats.map((seat, index) => (
                    <div
                      key={index}
                      className={`seat ${seat.status} ${selectedSeats.includes(seat.seatNumber) ? 'selected' : ''}`}
                      onClick={() => seat.status === 'available' && handleSeatClick(seat.seatNumber)}
                    >
                      {seat.seatNumber}
                    </div>
                  ))}
                </div>
              </div>
              {selectedSeats.length > 0 && user && (
                <div className="booking-button-container">
                  <button onClick={handleBooking} className="booking-button">예매하기</button>
                </div>
              )}
              {!user && (
                <div className="booking-button-container">
                  <p>로그인 후 예매가 가능합니다</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './moviedetail.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import axios from 'axios';


const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/movies/${id}`, { withCredentials: true });
        setMovie(res.data);
      } catch (err) {
        console.error("Failed to fetch movie details", err);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <div>Loading...</div>;
  
  const handleBooking = () => {
    navigate(`/booking`);
  };

  return (
    <div className="movie-detail">
      <Navbar />
      <div className="movie-detail-container">
        <div className="movie-detail-image">
          <img src={movie.photos[0]} alt={movie.name} />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.name}</h1>
          <p>개봉일: {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p>상영 시간: {movie.runtime}</p>
          <p>등급: {movie.rated}</p>
          <p>장르: {movie.type}</p>
          <p>관객 수: {movie.view}</p>
          <p>평점: {movie.rating}점</p>
          <p>{movie.introduction}</p>
          <button className="booking-button" onClick={handleBooking}>예매하기</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetail;
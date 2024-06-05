import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mypage.css';
import { AuthContext } from '../../context/AuthContext';
import Navbar from "../../components/navbar/Navbar";
import Footer from '../../components/footer/Footer';

const Mypage = () => {
  const [mpData, setMpData] = useState({
    username: '',
    email: '',
    phone: '',
    img: '',
    favoriteMovie: '',
  });
  const [reservations, setReservations] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setMpData({
        username: user.username,
        email: user.email,
        phone: user.phone,
        img: user.img,
        favoriteMovie: user.favoriteMovie,
      });
      const fetchReservations = async () => {
        try {
          const apiUrl = process.env.REACT_APP_API_URL;
          const res = await axios.get(`${apiUrl}/reservations/user/${user._id}`, { withCredentials: true });
          setReservations(res.data);
        } catch (err) {
          console.error("Failed to fetch reservations", err);
        }
      };

      fetchReservations();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "img" && files) {
      setNewImage(files[0]);
    } else {
      setMpData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const userId = user._id;
      const updatedData = { ...mpData };

      if (newImage) {
        const formData = new FormData();
        formData.append("file", newImage);
        const uploadRes = await axios.put(`${apiUrl}/users/${userId}/profile-image`, formData, { withCredentials: true });
        updatedData.img = uploadRes.data.filePath;
      }

      const res = await axios.put(`${apiUrl}/users/${userId}`, updatedData, { withCredentials: true });
      alert("프로필이 성공적으로 업데이트되었습니다!");
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      setEditMode(false);
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("프로필 업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      // console.log(`Deleting reservation at: ${apiUrl}/reservations/${reservationId}`);
      const res = await axios.delete(`${apiUrl}/reservations/${reservationId}`, { withCredentials: true });
  
      const { movieId, showtime, seats } = res.data;
      console.log(`Original showtime: ${showtime}`);
  
      // showtime 값을 "HH:MM" 형식으로 변환
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
      const formattedShowtime = new Date(showtime).toLocaleTimeString('ko-KR', timeOptions);
  
      // console.log(`Formatted showtime: ${formattedShowtime}`);
      // console.log(`Updating seats at: ${apiUrl}/movies/${movieId}/cancel-seats`);
  
      await axios.put(`${apiUrl}/movies/${movieId}/cancel-seats`, {
        showtime: formattedShowtime, // 변환된 showtime 값
        seats,
      }, { withCredentials: true });
  
      alert("예매가 취소되었습니다!");
      setReservations((prevReservations) => prevReservations.filter((reservation) => reservation._id !== reservationId));
    } catch (err) {
      console.error("Failed to cancel reservation", err);
      alert("예매 취소 중 오류가 발생했습니다.");
    }
  };
  
  

  const { username, email, favoriteMovie, phone, img } = mpData;

  return (
    <div>
      <Navbar />
      <div className="mypage-container">
        <div className="top-container">
          <h2>마이페이지</h2>
          <button onClick={handleEdit} className="edit-btn">수정</button>
        </div>
        {editMode ? (
          <div className="edit-profile-modal">
            <h2>프로필 편집</h2>
            <div className="form-group">
              <label htmlFor="profilePicture">프로필 사진</label>
              <input
                type="file"
                id="profilePicture"
                name="img"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">아이디</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="favoriteMovie">좋아하는 장르</label>
              <input
                type="text"
                id="favoriteMovie"
                name="favoriteMovie"
                value={favoriteMovie}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">전화번호</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={phone}
                onChange={handleChange}
              />
            </div>
            <button onClick={handleSave} className="submit-btn">저장</button>
          </div>
        ) : (
          <>
            <div className="user-info-container">
              {img && <img src={`${process.env.REACT_APP_API_IMAGE_URL}${img}`} alt="Profile" className="profile-image" />}
              <div className="user-info">
                <p><strong>아이디:</strong> {username}</p>
                <p><strong>이메일:</strong> {email}</p>
                <p><strong>좋아하는 장르:</strong> {favoriteMovie}</p>
                <p><strong>번호:</strong> {phone}</p>
              </div>
            </div>
          </>
        )}
        <div className="reservation-history">
          <h3>예매 내역</h3>
          {reservations.length > 0 ? (
            <ul>
              {reservations.map((reservation) => (
                <li key={reservation._id} className="reservation">
                  <p><strong>영화:</strong> {reservation.movieId.name}</p>
                  <p><strong>영화관:</strong> {reservation.theater}</p>
                  <p><strong>상영시간:</strong> {reservation.showtime}</p>
                  <p><strong>좌석:</strong> {reservation.seats.join(', ')}</p>
                  <p><strong>예매 날짜:</strong> {new Date(reservation.createdAt).toLocaleString()}</p>
                  <button onClick={() => handleCancel(reservation._id)} className="cancel-btn">취소</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>예매 내역이 없습니다.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default Mypage;

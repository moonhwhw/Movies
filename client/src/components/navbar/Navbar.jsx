import React, { useContext, useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
    } catch (err) {
      console.error("로그아웃 오류:", err);
    }
  };

  const handleSearch = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${apiUrl}/movies/search`, {
        params: { query },
        withCredentials: true
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error("검색 오류:", err);
    }
  };

  
  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <img src="https://moble.kr/images/common/logo.png" alt="Moble Logo" />
          </Link>
        </div>
        <div className="nav-items-left">
          <Link to="/" className="nav-link">영화</Link>
          <Link to="/booking" className="nav-link">예매</Link>
        </div>
        <div className="nav-items-right">
          {user ? (
            <>
              <span className="nav-username">{user.username}님</span>
              <Link to="#" className="nav-link" onClick={handleLogout}>로그아웃</Link>
              <Link to="/mypage" className="nav-link">마이페이지</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">로그인</Link>
              <Link to="/register" className="nav-link">회원가입</Link>
            </>
          )}
        </div>
        <div className="nav-search">
          <input
            type="text"
            placeholder="검색"
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((movie) => (
                <Link key={movie._id} to={`/movies/${movie._id}`} className="search-result-item">
                  {movie.name} ({movie.type})
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

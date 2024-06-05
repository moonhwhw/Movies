import React, { useState, useEffect } from 'react';
import './home.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true); // 애니메이션 활성화 상태 추가

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.get(`${apiUrl}/movies`, { withCredentials: true });
        setMovies(res.data);
      } catch (err) {
        console.error("Failed to fetch movies", err);
      }
    };

    fetchMovies();
  }, []);

  const handlePrevClick = () => {
    setTransitionEnabled(true); // 애니메이션 활성화
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(movies.length / 5)) % Math.ceil(movies.length / 5));
  };

  const handleNextClick = () => {
    setTransitionEnabled(true); // 애니메이션 활성화
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(movies.length / 5));
  };

  const getVisibleMovies = () => {
    const startIndex = currentIndex * 5;
    return movies.slice(startIndex, startIndex + 5);
  };

  return (
    <div className="Home">
      <Navbar />
      <div className="carousel-container">
        <button className="carousel-button left" onClick={handlePrevClick}>
          &lt;
        </button>
        <div
          className="movies-container"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {movies.map((movie) => (
            <div key={movie._id} className="movie-item">
              <div className="movie-image-container">
                <img src={movie.photos[0]} alt={movie.name} className="movie-image" />
                <div className="movie-overlay">
                  <Link to={`/movies/${movie._id}`} className="movie-detail-link">
                    상세정보
                  </Link>
                </div>
              </div>
              <div className="movie-info">
                <h3>{movie.name}</h3>
                <p>Rating: {movie.rating}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button right" onClick={handleNextClick}>
          &gt;
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

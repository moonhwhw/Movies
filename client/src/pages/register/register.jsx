import React, { useState, useEffect } from 'react';
import './register.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

// 영화 포스터 이미지 배열
const moviePosters = [
    "https://upload.wikimedia.org/wikipedia/ko/5/55/7%EB%B2%88%EB%B0%A9%EC%9D%98_%EC%84%A0%EB%AC%BC.jpg",
    "https://cdn.news.bbsi.co.kr/news/photo/202312/3137731_481573_205.png",
    "https://cdn.hankyung.com/photo/201902/20190206153210_5c5a7f6a23665_1.jpg",
    // 더 많은 이미지 경로를 추가하세요
];

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        phone: "",
        favoriteMovie: "",
        email: "",
    });
    const [randomPoster, setRandomPoster] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 한 번만 실행
        const randomIndex = Math.floor(Math.random() * moviePosters.length);
        setRandomPoster(moviePosters[randomIndex]);
    }, []);

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.post(`${apiUrl}/auth/register`, {
                username: credentials.username,
                password: credentials.password,
                email: credentials.email,
                favoriteMovie: credentials.favoriteMovie,
                phone: credentials.phone,
            });
            alert("회원가입 성공");
            navigate("/login");
        } catch (err) {
            console.log("Error details:", err.response || err.message || err);
            alert("회원가입 실패");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="registerContainer">
                <div className="registerImage">
                    <img src={randomPoster} alt="Movie Poster" />
                </div>
                <div className="registerForm">
                    <h2>회원가입</h2>
                    <div className="form-group">
                        <label htmlFor="username">이름</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={credentials.phone}
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="favoriteMovie">좋아하는 장르</label>
                        <input
                            type="text"
                            id="favoriteMovie"
                            name="favoriteMovie"
                            value={credentials.favoriteMovie}
                            onChange={handleChange}
                            required />
                    </div>
                    <button
                        type="submit"
                        className="registerButton"
                        onClick={handleClick}>
                        가입하기
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;

import React, { useState, useEffect, useContext } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import { AuthContext } from "../../context/AuthContext";

const images = [
    "https://upload.wikimedia.org/wikipedia/ko/5/55/7%EB%B2%88%EB%B0%A9%EC%9D%98_%EC%84%A0%EB%AC%BC.jpg",
    "https://cdn.news.bbsi.co.kr/news/photo/202312/3137731_481573_205.png",
    "https://cdn.hankyung.com/photo/201902/20190206153210_5c5a7f6a23665_1.jpg",
    "https://i.namu.wiki/i/rrHaHzTJSB5C7asmwf7DtFFVhVRB7mHMxo3W2UgFEskNo7zpQI68SL_2M7Bbftl3YoM-6yp-ydelIm7U2pOwHw.webp",
    "https://i.namu.wiki/i/VgBRaa569IFB_g7lxSLB-qsVej_6EQC0IfLA_zHGcrULB-R5OFXtzpwxe1Z7fiS_V8MCgGdLmMlSfMHNn-vTqvyYGPoB6i7jt7ndiI-W3jrp9CngziUvsUjL3-or-BPHILpyQ86lH8ST3nqacBwT7g.webp",
    "https://media.bunjang.co.kr/product/236992622_%7Bcnt%7D_1695218169_w%7Bres%7D.jpg",
    // 추가 이미지 경로를 입력하세요
];

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined,
    });

    const [randomImage, setRandomImage] = useState("");
    const { loading, error, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 한 번만 실행
        const randomIndex = Math.floor(Math.random() * images.length);
        setRandomImage(images[randomIndex]);
    }, []);

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const res = await axios.post(`${apiUrl}/auth/login`, credentials, { withCredentials: true });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
            navigate("/");
        } catch (err) {
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
        }
    };

    return (
        <body>
        <div className="loginContainer">

            <div className="loginContent">
                <div className="loginImage">
                    <img src={randomImage} alt="Random Movie" />
                </div>
                <div className="loginForm">
                    <h2 className="loginTitle">로그인</h2>
                    <div className="form-group">
                        <label htmlFor="username">ID</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="username"
                            onChange={handleChange}
                            className="lInput"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            placeholder="password"
                            id="password"
                            onChange={handleChange}
                            className="lInput"
                        />
                    </div>
                    <button
                        type="submit"
                        className="loginButton"
                        disabled={loading}
                        onClick={handleClick}
                    >
                        로그인 하기
                    </button>
                    {error && <span className="errorMessage">{error.message}</span>}
                    <button
                        className="registerButton"
                        onClick={() => navigate("/register")}
                    >
                        회원가입 하기
                    </button>
                    <button
                        className="homeButton"
                        onClick={() => navigate("/")}
                    >
                        홈으로 가기
                    </button>
                </div>
            </div>
            <Footer />
        </div>
        </body>
    );
};

export default Login;

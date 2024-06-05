import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Movie from "./pages/movie/Movie";
import List from "./pages/moviedetail/MovieDetail";
import Login from './pages/login/Login';
import Register from './pages/register/register';
import Mypage from './pages/mypage/Mypage';
import MovieDetail from './pages/moviedetail/MovieDetail';
import BookingPage from './pages/bookingpage/BookingPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/movies/:id" element={<MovieDetail/>}/>
    <Route path="/movies/" element={<Movie/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/mypage" element={<Mypage/>}/>
    <Route path="/booking" element={<BookingPage/>}/>
    </Routes>
    </BrowserRouter>
    );
   }

export default App;

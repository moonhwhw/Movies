import express from "express";
import {
  countByType,
  createMovie,
  deleteMovie,
  getMovie,
  getMovieSeats,
  getMovies,
  updateMovie,
} from "../controllers/movie.js";
import Movie from "../models/Movie.js";

import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const movies = await Movie.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(movies);
  } catch (err) {
    console.error("검색 중 오류 발생:", err); // 에러 로그 출력
    res.status(500).json({ error: err.message });
  }
});

//Create 
router.post("/", verifyAdmin, createMovie);

//UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedMovie);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyAdmin, deleteMovie);

//GET
router.get("/find/:id", getMovie);

//GET ALL
router.get("/", getMovies);
router.get("/countByType", countByType);
router.get("/seat/:id", getMovieSeats);

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json("Movie not found");
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 좌석을 사용 가능으로 업데이트
router.put('/:id/cancel-seats', async (req, res) => {
  const { showtime, seats } = req.body;
  try {
    console.log(`Request to cancel seats for movie ID: ${req.params.id}`);
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      console.log('Movie not found');
      return res.status(404).send({ message: 'Movie not found' });
    }

    console.log(`Movie found: ${movie.name}`);
    const selectedShowtime = movie.time.find((t) => t.time === showtime);
    if (!selectedShowtime) {
      console.log(`Showtime not found: ${showtime}`);
      return res.status(404).send({ message: 'Showtime not found' });
    }

    console.log(`Showtime found: ${showtime}`);
    selectedShowtime.seats = selectedShowtime.seats.map((seat) => {
      if (seats.includes(seat.seatNumber)) {
        seat.status = 'available';
      }
      return seat;
    });

    await movie.save();
    console.log('Seats updated successfully');
    res.status(200).send(movie);
  } catch (err) {
    console.error('Failed to update seats', err);
    res.status(500).send({ message: 'Failed to update seats', error: err.message });
  }
});






export default router;
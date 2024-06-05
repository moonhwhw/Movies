import express from 'express';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// 새로운 예매 생성
router.post('/', async (req, res) => {
  const newReservation = new Reservation(req.body);
  try {
    const savedReservation = await newReservation.save();
    res.status(200).json(savedReservation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 특정 사용자 예매 내역 조회
router.get('/user/:userId', async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.params.userId }).populate('movieId');
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    console.log(reservation)
    if (!reservation) {
      return res.status(404).send({ message: 'Reservation not found' });
    }
    res.status(200).send(reservation);
  } catch (err) {
    res.status(500).send({ message: 'Failed to delete reservation', error: err.message });
  }
});


export default router;

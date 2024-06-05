import Seat from "../models/Seat.js";
import Movie from "../models/Movie.js";
import { createError } from "../utils/error.js";

export const createSeat = async (req, res, next) => {
    const movieId = req.params.movieid;
    const newSeat = new Seat(req.body);

    try {
        const savedSeat = await newSeat.save();
        try {
            await Seat.findByIdAndUpdate(movieId, {
                $push: { seats: savedSeat._id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedSeat);
    } catch (err) {
        next(err);
    }
};

export const updateSeat = async (req, res, next) => {
    try {
        const updatedSeat = await Seat.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedSeat);
    } catch (err) {
        next(err);
    }
};

export const updateSeatAvailability = async (req, res, next) => {
    try {
        await Seat.updateOne(
            { "SeatNumbers._id": req.params.id },
            {
                $push: {
                    "SeatNumbers.$.unavailableDates": req.body.dates
                },
            }
        );
        res.status(200).json("Seat status has been updated.");
    } catch (err) {
        next(err);
    }
};

export const deleteSeat = async (req, res, next) => {
    const seatId = req.params.Seatid;
    try {
        await Seat.findByIdAndDelete(req.params.id);
        try {
            await Seat.findByIdAndUpdate(seatId, {
                $pull: { seats: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Seat has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getSeat = async (req, res, next) => {
    try {
        const seat = await Seat.findById(req.params.id);
        res.status(200).json(seat);
    } catch (err) {
        next(err);
    }
};

export const getSeats = async (req, res, next) => {
    try {
        const seats = await Seat.find();
        res.status(200).json(seats);
    } catch (err) {
        next(err);
    }
};

export const selectSeat = async (req, res, next) => {
    const { seatNumber } = req.body;

    try {
        const seat = await Seat.findOne({
            'seatNumbers.number': seatNumber
        });

        if (!seat) {
            return res.status(404).json({ message: 'Seat not found' });
        }

        const seatToUpdate = seat.seatNumbers.find(s => s.number === seatNumber);

        if (!seatToUpdate.isAvailable) {
            return res.status(400).json({ message: 'Seat is already selected' });
        }

        seatToUpdate.isAvailable = false;

        await seat.save();

        res.status(200).json({ message: 'Seat selected successfully' });
    } catch (error) {
        next(error);
    }
};
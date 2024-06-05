import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true,
    },
    theater: {
        type: String,
        required: true,
    },
    showtime: {
        type: String,
        required: true,
    },
    seats: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Reservation", ReservationSchema);

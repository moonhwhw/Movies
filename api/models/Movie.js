import mongoose from "mongoose";
const SeatSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'occupied'],
        default: 'available',
    }
});


const ShowtimeSchema = new mongoose.Schema({
    time: {
      type: String,
      required: true,
    },
    seats: [SeatSchema],
  });


const MovieSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
    },
    type: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
    },
    introduction: {
        type: String,
        required: true,
    },
    
    rating: {
        type: Number,
        min: 0,
        max: 10,
    },
    
    runtime: {
        type: String,
        required: true,
    },
    time : {
        type: [ShowtimeSchema],
        required: true,
    },
    releaseDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
    },
    rated: {
        type: String,
        required: true,
    },
    view: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Movie", MovieSchema);
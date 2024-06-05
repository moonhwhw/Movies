import Movie from "../models/Movie.js";
import Seat from "../models/Seat.js";

export const createMovie = async (req, res, next) => {
    const newMovie = new Movie(req.body);

    try {
        const savedMovie = await newMovie.save();
        res.status(200).json(savedMovie);
    } catch (err) {
        next(err);
    }
};

export const updateMovie = async (req, res, next) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            { new: true}
        );
        res.status(200).json(updatedMovie);
    } catch (err) {
        next(err);
    }
};

export const deleteMovie = async (req, res, next) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Movie has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json(movie);
    } catch (err) {
        next(err);
    }
};

export const getMovies = async (req, res, next) => {
    const { min, max, limit, ...others } = req.query;
    try {
        const Movies = await Movie.find({
            ...others,
            rating: {$gt: min || 0 , $lt: max || 10},
        }).limit(limit);
        res.status(200).json(Movies);
    } catch (err) {
        next(err);
    }
};



export const countByType = async (req, res, next) => {
    try {
        const ActionCount = await Movie.countDocuments({ type: "Action"});
        const ComedyCount = await Movie.countDocuments({ type: "Comedy"});
        const CrimeCount = await Movie.countDocuments({ type : "Crime"});
        const DramaCount = await Movie.countDocuments({ type : "Drama"});
        const RomanceCount = await Movie.countDocuments({ type: "Romance"});
        const HorrorCount = await Movie.countDocuments({ type: "Horror"})

        res.status(200).json([
            { type: "Action", count: ActionCount},
            { type: "Comedy", count: ComedyCount},
            { type: "Crime", count: CrimeCount},
            { type: "Drama", count: DramaCount},
            { type: "Romance", count: RomanceCount},
            { type: "Horror", count: HorrorCount},
        ]);
    } catch (err) {
        next(err);
    }
};

export const getMovieSeats = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
            const list = await Promise.all(
                movie.seats.map((seat) => {
                    return Seat.findById(seat);
                })
            );
            res.status(200).json(list)
    } catch (err) {
        next(err);
    }
};


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import moviesRoute from "./routes/movies.js";
import seatRoute from "./routes/seats.js";
import { fileURLToPath } from "url";
import reservationsRoute from "./routes/reservations.js";



const app = express();
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("mongoDB 연결 완료");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected",() => {
    console.log("mongoDB disconnected!");
});

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/seat", seatRoute);
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use("/api/reservations", reservationsRoute);
app.listen(process.env.PORT, () => {
    connect();
    console.log('Connected to backend');
});



app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});


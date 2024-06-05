import express from "express";
import {
    createSeat,
    deleteSeat,
    getSeat,
    getSeats,
    updateSeat,
    updateSeatAvailability,
    selectSeat
} from "../controllers/seat.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/:movieid", verifyAdmin, createSeat);

//UPDATE
router.put("/availability/:id", updateSeatAvailability);
router.put("/:id", verifyAdmin, updateSeat);
//DELETE
router.delete("/:id/:movieid", verifyAdmin, deleteSeat);
//GET
router.get("/:id", getSeat);
//GET ALL
router.get("/", getSeats);

// 좌석 선택 엔드포인트
router.post("/select-seat", selectSeat);


export default router;
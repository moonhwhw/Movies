import express from "express";
import {login, register, logout, update} from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.put("/update/:userId", update)

export default router;
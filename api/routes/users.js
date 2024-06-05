import express from "express" ;
import {
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    updateProfileImage
} from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
import upload from "../utils/upload.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", verifyUser, getUser);

//GET ALL
router.get("/", verifyAdmin, getUsers);

//프로필 이미지 업데이트
router.put("/:id/profile-image", verifyUser, upload.single('file'), updateProfileImage);

export default router;
import User from "../models/User.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import upload from "../utils/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateUser = async (req, res, next) => {
    const updatedData = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updatedData },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted");
    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err) ;
    }
}
export const updateProfileImage = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const imgPath = req.file.path.replace(/\\/g, "/");
  
      if (!userId) {
        return next(createError(400, "User ID is required"));
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return next(createError(404, "User not found"));
      }
  
      if (user.img) {
        const oldImage = path.join(__dirname, '../', user.img);
        if (fs.existsSync(oldImage)) {
          try {
            fs.unlinkSync(oldImage);
          } catch {
            return next(createError(500, "이미지 삭제 오류"));
          }
        }
      }
  
      user.img = `/uploads/${req.file.filename}`;
      await user.save();
      res.status(200).json({ message: "Profile image updated", user: { img: `uploads/${req.file.filename}` } });
    } catch (e) {
      next(e);
    }
  };
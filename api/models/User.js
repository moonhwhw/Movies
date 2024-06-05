import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        img: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },

        favoriteMovie: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);
export default mongoose.model("User", UserSchema);
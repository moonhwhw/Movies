import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";


export const verifyToken = (req, res, next) => {
    console.log("verifyToken");
    const token = req.cookies.access_token;
    if (!token) {
        return next(createError(401, "You are not authenticated!"));
    }
    console.log("verifyToken step2")
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        req.user = user;
        console.log(req.user);
        //next();
    });
};


export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next);
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, "You are not authorized!"));
        }
    
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next);

    console.log("admin check entry");
    if (req.user.isAdmin) {
        console.log("admin true");
        next();
    } else {
        return next(createError(403, "You are not authorized!"));
    }
}
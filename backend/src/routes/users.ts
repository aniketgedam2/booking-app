import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.post(
    "/register",
    [
        check("firstName", "First Name is required").isString(),
        check("lastName", "Last Name is required").isString(),
        check("email", "email is required").isEmail(),
        check("password", "password with 6 or more characters required").isLength({
            min: 6,
        }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        try {
            let user = await User.findOne({
                email: req.body.email,
            });
            if (user) {
                return res.status(400).json({ message: "User already exists" });
            }

            user = new User(req.body);
            await user.save();

            // create a JWT token and send to the client browser
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET_KEY as string,
                { expiresIn: "1d" }
            );
            // by sending this as n cookie directly gets save in client browser, only acceable by server
            res.cookie("auth_token", token, {
                httpOnly: true, // only accessable by server
                secure: process.env.NODE_ENV === "production", //https only runs on prod thats why
                maxAge: 86400000, // after time expires the jwt token gets expire
            });
            return res.status(200).send({message:"User Registered Ok"});
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: "Somting went wrong" });
        }
    }
);

export default router;

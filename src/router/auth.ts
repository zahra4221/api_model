import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../model/User";
import { TokenBlackList } from "../model/TokenBlackList";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { DecodeToken, checkToken } from "../middlewares/checkToken";

export const authRouter = Router();

authRouter.post("/local/register", async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const userWithEmail = await User.findOne({ email });
        if (userWithEmail) {
            res.status(400).json("Email already exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS!));
            const newUser = new User({ username, password: hashedPassword, email });
            await newUser.save();
            res.json(newUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
});

authRouter.post("/local", async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const userWithEmail = await User.findOne({ email: identifier });
        if (!userWithEmail) {
            res.status(400).json("Email or Password is incorrect");
        } else {
            const userPassword = userWithEmail.password ? userWithEmail.password.toString() : null;
            if (userPassword) {
                const isPasswordCorrect = await bcrypt.compare(password, userPassword);
                if (isPasswordCorrect) {
                    const payload = {
                        id: userWithEmail._id,
                        username: userWithEmail.username,
                        email: userWithEmail.email,
                    };
                    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
                    res.json({
                        token,
                        ...payload
                    });
                } else {
                    res.status(400).json("Email or Password is incorrect");
                }
            } else {
                res.status(400).json("Email or Password is incorrect");
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
});
authRouter.post("/change-password", checkToken, async (req, res) => {
    const { currentPassword, passwordConfirmation, password } = req.body;
    if (passwordConfirmation !== password) {
        res.status(400).json("New passwords do not match");
    } else if (passwordConfirmation.length < 6) {
        res.status(400).json("New password must be at least 6 characters long");
    } else {
        const decoded = jwt.decode(req.token!) as DecodeToken
        try {
            const user = await User.findOne({ _id: decoded.id });
            if (user) {
                const userPassword = user.password ? user.password.toString() : null;
                if (userPassword) {
                    const isPasswordCorrect = await bcrypt.compare(currentPassword, userPassword);
                    if (isPasswordCorrect) {
                        const hashedPassword = await bcrypt.hash(passwordConfirmation, parseInt(process.env.SALT_ROUNDS!));
                        await User.updateOne({ _id: decoded.id }, { password: hashedPassword });
                        res.json("Password changed");
                    } else {
                        res.status(400).json("Current password is incorrect");
                    }
                } else {
                    res.status(400).json("User password is missing or incorrect");
                }
            } else {
                res.status(404).json("User not found");
            }
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    }
});


authRouter.post("/logout", checkToken, async (req, res) => {
    const decoded = jwt.decode(req.token!) as DecodeToken
    try {
        const user = await User.findOne({ _id: decoded.id });
        if (user) {
            await TokenBlackList.create({ token: req.token });
            res.json("Logged out");
        } else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
});

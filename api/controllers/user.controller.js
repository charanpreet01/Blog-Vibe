import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import User from "../models/user.model.js"

export const test = (req, res) => {
    res.json({ message: "API is working" })
}

export const updateUser = async (req, res, next) => {


    if (req.body.password) {
        if (req.body.password < 6) {
            return next(errorHandler(400, "Password must be at least 6 characters"));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            }
        }, { new: true })
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {

        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const isMatch = await bcryptjs.compare(oldPassword, user.password);
        if (!isMatch) {
            return next(errorHandler(400, "Old password is incorrect"));
        }

        if (newPassword !== confirmPassword) {
            return next(errorHandler(400, "New password and confirmation password do not match"));
        }

        if (newPassword === oldPassword) {
            return next(errorHandler(400, "New password cannot be the same as the old password"));
        }

        const hashedPassword = bcryptjs.hashSync(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {

    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('Account has been deleted');
    } catch (error) {
        next(error)
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json("User has been signed out");
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === "asc" ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        })

        const totalUsers = await User.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler(404, "User not found"));
        }

        const { password, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}
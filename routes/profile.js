import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import mongoose from "mongoose";
import UserModel, { userProjection } from "../models/user.js";

const router = Router()

router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.userId)
        const profile = await UserModel.findById(userId, userProjection)
        res.send(profile)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

export default router
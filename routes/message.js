import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import mongoose from "mongoose";
import MessageModel from "../models/message.js";

const router = Router()

router.post('/:receiverId', verifyToken, async (req, res) => {
    try {
        const { content, attachments } = req.body
        const receiverId = new mongoose.Types.ObjectId(req.params.receiverId)
        const message = await MessageModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId() },
            {
                receiverId,
                ownerId: req.JWT,
                content,
                attachments
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        res.send(message)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

export default router
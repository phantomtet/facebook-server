import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import mongoose from "mongoose";
import MessageModel from "../models/message.js";
import { userProjection } from "../models/user.js";
import { clients } from "../websocket/index.js";
import MessageChannelModel from "../models/messageChannel.js";

const router = Router()

router.get('/:receiverId', verifyToken, async (req, res) => {
    try {
        const receiverId = req.params.receiverId
        const getMessages = await MessageModel.find(
            {
                $or: [
                    { owner: req.JWT, receiver: receiverId },
                    { owner: receiverId, receiver: req.JWT }
                ]
            }
        ).sort({ createdAt: -1 }).populate('owner', userProjection).populate('receiver', userProjection)
        res.send(getMessages)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/:receiverId', verifyToken, async (req, res) => {
    try {
        const { content, attachments } = req.body
        const receiverId = new mongoose.Types.ObjectId(req.params.receiverId)
        const createMessageChannel = await MessageChannelModel.findOneAndUpdate(
            {
                type: 0, participants: { $all: [{ $elemMatch: { $eq: req.JWT } }, { $elemMatch: { $eq: receiverId } }] }
            },
            {
                participants: [receiverId, req.JWT]
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        const message = await MessageModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId() },
            {
                receiver: receiverId,
                owner: req.JWT,
                content,
                attachments,
                messageChannel: createMessageChannel._id
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).populate('owner', userProjection).populate('receiver', userProjection)
        res.send(message)
        clients[req.JWT]?.send(JSON.stringify({ eventName: 'receiveMessage', data: message, targetId: receiverId, messageChannelId: createMessageChannel._id }))
        if (req.JWT.toString() !== receiverId.toString()) clients[receiverId]?.send(JSON.stringify({ eventName: 'receiveMessage', data: message, targetId: req.JWT, messageChannelId: createMessageChannel._id }))
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

export default router
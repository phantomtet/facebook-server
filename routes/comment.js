import { Router } from "express";
import verifyToken from '../middleware/authorization.js'
import CommentModel from "../models/comment.js";
import mongoose from "mongoose";
import { userProjection } from "../models/user.js";

const router = Router()

router.post('/', verifyToken, async (req, res) => {
    const { content, attachments, postId } = req.body
    try {
        const createComment = await CommentModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId() }, {
            content, attachments, postId: new mongoose.Types.ObjectId(postId), ownerId: req.JWT
        }, { new: true, upsert: true, setDefaultsOnInsert: true }).populate('ownerId', { ...userProjection })
        res.send(createComment)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

export default router
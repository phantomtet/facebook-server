import { Router } from "express";
import verifyToken from '../middleware/authorization.js'
import CommentModel from "../models/comment.js";
import mongoose from "mongoose";

const router = Router()

router.post('/', verifyToken, async (req, res) => {
    const { content, attachments, postId } = req.body
    try {
        const createComment = await CommentModel.create({
            content, attachments, postId, ownerId: req.JWT
        })
        res.send(createComment)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router
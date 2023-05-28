import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import PostModel from "../models/post.js";

const router = Router()

router.post('/', verifyToken, async (req, res) => {
    try {
        const { content, attachments } = req.body
        const createPost = await PostModel.create({
            ownerId: req.JWT,
            content,
            attachments
        })
        res.send(createPost)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router
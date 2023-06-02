import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import PostModel from "../models/post.js";
import PostReactionModel from "../models/postReaction.js";
import mongoose from "mongoose";

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
router.post('/:postId/reaction', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params
        const { type } = req.body
        const oldReact = await PostReactionModel.findOneAndUpdate(
            { postId, ownerId: req.JWT },
            [{ $set: { postId: new mongoose.Types.ObjectId(postId), ownerId: req.JWT, type: { $cond: [{ $eq: ['$type', type] }, 0, type] } } }],
            { upsert: true, new: false, setDefaultsOnInsert: true }
        )
        const newType = type === oldReact?.type ? 0 : type
        let inc = {}
        let arrayFilters = []
        if (!oldReact) {
            inc['reaction.$[elem].count'] = 1       //postModel.reaction.[elem].count += 1
            inc.totalReaction = 1
            arrayFilters.push({ 'elem.type': type })             // array[where elem.type = type]
        }
        else if (oldReact.type !== type) {
            inc['reaction.$[elem1].count'] = -1
            inc['reaction.$[elem2].count'] = 1
            arrayFilters = [{ 'elem1.type': oldReact.type }, { 'elem2.type': type }]
            if (type === 0) inc.totalReaction = -1
            if (oldReact.type === 0) inc.totalReaction = 1
        }
        else if (type !== 0) {
            inc['reaction.$[elem].count'] = -1
            inc.totalReaction = -1
            arrayFilters.push({ 'elem.type': type })
        }
        const updatePostReact = await PostModel.findOneAndUpdate({ _id: postId },
            {
                $inc: inc,

            },
            {
                arrayFilters, new: true
            },

        )
        res.send({ type: newType, totalReaction: updatePostReact.totalReaction, reaction: updatePostReact.reaction })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


export default router
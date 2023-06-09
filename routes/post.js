import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import PostModel from "../models/post.js";
import PostReactionModel from "../models/postReaction.js";
import mongoose from "mongoose";
import { userProjection } from "../models/user.js";

const router = Router()

router.post('/', verifyToken, async (req, res) => {
    try {
        const { content, attachments } = req.body
        const createPost = await PostModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId() }, {
            owner: req.JWT,
            content,
            attachments
        }, { new: true, upsert: true, setDefaultsOnInsert: true }).populate('owner', userProjection)

        res.send({ ...createPost.toObject(), latestComments: [] })
    } catch (error) {
        res.status(400).send(error)
    }
})
router.post('/:postId/reaction', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params
        const { type } = req.body
        const oldReact = await PostReactionModel.findOneAndUpdate(
            { post: postId, owner: req.JWT },
            [{ $set: { post: new mongoose.Types.ObjectId(postId), owner: req.JWT, type: { $cond: [{ $eq: ['$type', type] }, 0, type] } } }],
            { upsert: true, new: false, setDefaultsOnInsert: true }
        )
        const newType = type === oldReact?.type ? 0 : type
        let inc = {}
        let arrayFilters = []
        if (!oldReact) {
            inc['reaction.$[elem].count'] = 1       //postModel.reaction.[elem].count += 1
            arrayFilters.push({ 'elem.type': type })             // array[where elem.type = type]
        }
        else if (oldReact.type !== type) {
            inc['reaction.$[elem1].count'] = -1
            inc['reaction.$[elem2].count'] = 1
            arrayFilters = [{ 'elem1.type': oldReact.type }, { 'elem2.type': type }]
        }
        else if (type !== 0) {
            inc['reaction.$[elem].count'] = -1
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
        res.send({ currentReaction: newType, reaction: updatePostReact.reaction })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


export default router
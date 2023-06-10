import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import PostModel from "../models/post.js";
import PostReactionModel from "../models/postReaction.js";
import mongoose from "mongoose";
import { userProjection } from "../models/user.js";
import CommentModel from "../models/comment.js";

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
router.get('/:postId/comments', verifyToken, async (req, res) => {
    try {
        const { after, beforeTimestamp } = req.query
        let orExpression = []
        const postId = new mongoose.Types.ObjectId(req.params.postId)
        if (after) orExpression.push({ _id: { $lt: new mongoose.Types.ObjectId(after) } })
        if (beforeTimestamp) orExpression.push({ createdAt: { $gt: new Date(beforeTimestamp) } })
        if (!after && !beforeTimestamp) orExpression = [{}]
        const comments = await CommentModel.find(
            {
                post: postId, $or: orExpression
            }
        ).populate('owner', userProjection).sort({ createdAt: -1 }).limit(10)
        res.send(comments)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})
router.get('/:postId/reaction', verifyToken, async (req, res) => {
    try {
        const postId = new mongoose.Types.ObjectId(req.params.postId)
        const postData = await PostModel.findById(postId)
        const comments = await CommentModel.find(
            { post: postId }
        ).count()
        res.send({ reaction: postData.reaction, totalComment: comments })
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})
export default router
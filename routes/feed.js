import { Router } from "express";
import PostModel from "../models/post.js";
import mongoose from "mongoose";
import verifyToken from "../middleware/authorization.js";
import { userProjection } from "../models/user.js";

const router = Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const { after, before } = req.query
        let orExpression = []
        if (after) orExpression.push({ _id: { $lt: new mongoose.Types.ObjectId(after) } })
        if (before) orExpression.push({ _id: { $gt: new mongoose.Types.ObjectId(before) } })
        if (!after && !before) orExpression = [{}]
        const posts = await PostModel.aggregate([
            {
                $sort: { createdAt: -1 }
            },
            {
                $match: {
                    $or: orExpression
                },
            },
            {
                $limit: 10
            },
            {
                $lookup: {                          // kết hợp bảng comment vào post
                    from: 'comments',
                    foreignField: 'post',
                    localField: '_id',
                    pipeline: [
                        {
                            $sort: { createdAt: -1 },
                        },
                        {
                            $lookup: {              // kết hợp bảng user vào comment
                                from: 'users',
                                foreignField: '_id',
                                localField: 'owner',
                                as: 'owner'
                            }
                        },
                        {
                            $unwind: '$owner'
                        },
                        {
                            $project: {
                                owner: userProjection,
                            }
                        }
                    ],
                    as: 'latestComments'
                }
            },
            {
                $addFields: {
                    totalComment: { $size: '$latestComments' },
                    latestComments: { $slice: ['$latestComments', 2] }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'owner',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    owner: userProjection,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: 'post-reactions',
                    let: { postId: '$_id' },     // $_id la id cua document Post 
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$post', '$$postId'] },
                                        { $eq: ['$owner', req.JWT] }
                                    ]
                                },

                            }
                        },     // $postId, $ownerId la cua post-reactions
                    ],
                    as: 'currentReaction'
                }
            },
            {
                $unwind: {
                    path: '$currentReaction',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ['$$ROOT', { currentReaction: '$$ROOT.currentReaction.type' }]
                    }
                }
            }
        ])
        res.send(posts)
    } catch (error) {
        console.log(error)
    }
})

export default router
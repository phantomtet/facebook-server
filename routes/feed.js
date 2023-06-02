import { Router } from "express";
import PostModel from "../models/post.js";
import mongoose from "mongoose";
import verifyToken from "../middleware/authorization.js";
import { userProjection } from "../models/user.js";

const router = Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        // const posts = await PostModel.aggregate([
        //     {
        //         $lookup: {
        //             from: "comments",
        //             let: { abcdefg: "$_id" },
        //             pipeline: [
        //                 { $match: { $expr: { $eq: ["$postId", "$$abcdefg"] } } },
        //                 { $sort: { createdAt: -1 } },
        //                 { $limit: 4 },
        //                 {
        //                     $lookup: {
        //                         from: "users",
        //                         localField: "ownerId",
        //                         foreignField: "_id",
        //                         as: "owner"
        //                     }
        //                 },
        //                 { $unwind: "$owner" },
        //                 {
        //                     $project: {
        //                         _id: 1,
        //                         createdAt: 1,
        //                         content: 1,
        //                         postId: 1,
        //                         attachments: 1,
        //                         owner: { avatar: 1, name: 1, _id: 1 }
        //                     }
        //                 }
        //             ],
        //             as: "latestComments"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "ownerId",
        //             foreignField: "_id",
        //             as: "owner"
        //         }
        //     },
        //     { $unwind: "$owner" },
        //     {
        //         $project: {
        //             _id: 1,
        //             owner: { avatar: 1, name: 1, _id: 1 },
        //             content: 1,
        //             attachments: 1,
        //             likes: 1,
        //             createdAt: 1,
        //             latestComments: 1,
        //             // "latestComment.owner": 1
        //         }
        //     },
        //     { $sort: { createdAt: -1 } }
        // ])
        const posts = await PostModel.aggregate([
            {
                $lookup: {                          // kết hợp bảng comment vào post
                    from: 'comments',
                    foreignField: 'postId',
                    localField: '_id',
                    pipeline: [
                        {
                            $count: 'totalComment'
                        },
                        {
                            $sort: { createdAt: -1 },
                        },
                        {
                            $limit: 2
                        },
                        {
                            $lookup: {              // kết hợp bảng user vào comment
                                from: 'users',
                                foreignField: '_id',
                                localField: 'ownerId',
                                as: 'owner'
                            }
                        },
                        {
                            $unwind: '$owner'
                        },
                        {
                            $project: {
                                owner: userProjection,
                                ownerId: 0
                            }
                        }
                    ],
                    as: 'latestComments'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'ownerId',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    owner: userProjection,
                    ownerId: 0
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $lookup: {
                    from: 'post-reactions',
                    let: { postId: '$_id', postReactionOwnerId: req.JWT },     // $_id la id cua document Post 
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ['$postId', '$$postId'] }, { $eq: ['$$postReactionOwnerId', '$ownerId'] }] } } },     // $postId, $ownerId la cua post-reactions
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
        ])
        res.send(posts)
    } catch (error) {
        console.log(error)
    }
})

export default router
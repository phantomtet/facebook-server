import { Router } from "express";
import PostModel from "../models/post.js";

const router = Router()

router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    as: "latestComments"
                }
            },
            {
                $unwind: {
                    path: "$latestComments",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "latestComments.ownerId",
                    foreignField: "_id",
                    as: "latestComments.owner"
                }
            },
            // // Chỉ lấy tên và avatar của người dùng
            {
                $project: {
                    _id: 1,
                    ownerId: 1,
                    content: 1,
                    attachments: 1,
                    likes: 1,
                    latestComments: {
                        _id: 1,
                        content: 1,
                        createdAt: 1,
                        owner: {
                            _id: 1,
                            name: 1,
                            avatar: 1,
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: '$latestComments.owner',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    content: {
                        $first: '$content'
                    },
                    attachments: {
                        $first: '$attachments'
                    },
                    ownerId: {
                        $first: '$ownerId'
                    },
                    likes: {
                        $first: '$likes'
                    },
                    latestComments: {
                        $push: '$latestComments'
                    }
                }
            }
        ])
        console.log(posts)
        res.send(posts)
    } catch (error) {
        console.log(error)
    }
})

export default router
import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import MessageChannelModel from "../models/messageChannel.js";
import { userProjection } from "../models/user.js";

const router = Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const query = await MessageChannelModel.aggregate([
            {
                $lookup: {
                    from: 'messages',
                    foreignField: 'messageChannel',
                    localField: '_id',
                    as: 'latestMessage',
                    pipeline: [
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: 'users',
                                foreignField: '_id',
                                localField: 'owner',
                                as: 'owner'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                foreignField: '_id',
                                localField: 'receiver',
                                as: 'receiver'
                            }
                        },
                        { $unwind: '$owner' },
                        { $unwind: '$receiver' },
                        { $project: { owner: userProjection, receiver: userProjection } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'participants',
                    as: 'participants'
                }
            },
            { $unwind: '$participants' },
            {
                $group: {
                    _id: '$_id',
                    latestMessage: { $first: '$latestMessage' },
                    participants: {
                        $push: {
                            $cond: [
                                { $eq: ['$participants._id', req.JWT] },
                                '$$REMOVE',
                                '$participants'
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    participants: userProjection
                }
            },
            { $unwind: '$latestMessage' },
            { $sort: { 'latestMessage.createdAt': -1 } }
        ])
        res.send(query)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})
export default router
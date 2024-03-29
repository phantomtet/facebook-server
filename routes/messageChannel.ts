import { Router } from 'express';
import verifyToken from '../middleware/authorization';
import MessageChannelModel from '../models/messageChannel';
import { userProjection } from '../models/user';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
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
                as: 'owner',
              },
            },
            {
              $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'receiver',
                as: 'receiver',
              },
            },
            { $unwind: '$owner' },
            { $unwind: '$receiver' },
            { $project: { owner: userProjection, receiver: userProjection } },
          ],
        },
      },
      {
        $match: {
          participants: { $all: [req.JWT] },
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'participants',
          as: 'participants',
        },
      },
      { $unwind: '$participants' },
      {
        $addFields: {
          isOwner: { $eq: ['$participants._id', req.JWT] },
        },
      },
      { $sort: { isOwner: 1 } },
      { $project: { isOwner: 0 } },
      {
        $group: {
          _id: '$_id',
          latestMessage: { $first: '$latestMessage' },
          participants: {
            $push: '$participants',
          },
        },
      },
      {
        $project: {
          participants: userProjection,
        },
      },
      { $unwind: '$latestMessage' },
      { $sort: { 'latestMessage.createdAt': -1 } },
      { $limit: 20 },
    ]);
    res.send(query);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
export default router;

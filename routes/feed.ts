import { Router, Request } from 'express';
import PostModel from '../models/post';
import mongoose, { Aggregate } from 'mongoose';
import verifyToken from '../middleware/authorization';
import { userProjection } from '../models/user';
const router = Router();

router.get('/', verifyToken, async (req: Request, res) => {
  try {
    const { after, beforeTimestamp, fromUserId } = req.query;
    let orExpression = [];
    if (after)
      orExpression.push({
        _id: { $lt: new mongoose.Types.ObjectId(after.toString()) },
      });
    if (beforeTimestamp)
      orExpression.push({
        $and: [
          { createdAt: { $gt: new Date(beforeTimestamp.toString()) } },
          { owner: { $ne: req.JWT } },
        ],
      });
    if (!after && !beforeTimestamp) orExpression = [{}];
    const aggregate = [
      {
        $match: {
          $and: [
            fromUserId
              ? {
                  $expr: {
                    $eq: [
                      '$owner',
                      new mongoose.Types.ObjectId(fromUserId.toString()),
                    ],
                  },
                }
              : {},
            {
              $or: orExpression,
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          // kết hợp bảng comment vào post
          from: 'comments',
          foreignField: 'post',
          localField: '_id',
          pipeline: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $lookup: {
                // kết hợp bảng user vào comment
                from: 'users',
                foreignField: '_id',
                localField: 'owner',
                as: 'owner',
              },
            },
            {
              $unwind: '$owner',
            },
            {
              $project: {
                owner: userProjection,
              },
            },
          ],
          as: 'latestComments',
        },
      },
      {
        $addFields: {
          totalComment: { $size: '$latestComments' },
          latestComments: { $slice: ['$latestComments', 2] },
        },
      },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'owner',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
      {
        $project: {
          owner: userProjection,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: 'post-reactions',
          let: { postId: '$_id' }, // $_id la id cua document Post
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$post', '$$postId'] },
                    { $eq: ['$owner', req.JWT] },
                  ],
                },
              },
            }, // $postId, $ownerId la cua post-reactions
          ],
          as: 'currentReaction',
        },
      },
      {
        $unwind: {
          path: '$currentReaction',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$$ROOT',
              { currentReaction: '$$ROOT.currentReaction.type' },
            ],
          },
        },
      },
    ];
    const posts = await PostModel.aggregate(aggregate as any);
    res.send(posts);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

export default router;

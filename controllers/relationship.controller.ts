import { Request, Response } from 'express';
import RelationshipModel from '../models/relationship';
import mongoose from 'mongoose';
import { userProjection } from '../models/user';
export const updateRelationship = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const doc = await RelationshipModel.findOne({
      $or: [
        {
          $and: [
            { user1: new mongoose.Types.ObjectId(userId) },
            { user2: new mongoose.Types.ObjectId(req.JWT) },
          ],
        },
        {
          $and: [
            { user2: new mongoose.Types.ObjectId(userId) },
            { user1: new mongoose.Types.ObjectId(req.JWT) },
          ],
        },
      ],
    });
    if (!doc) {
      await RelationshipModel.create({
        isFriend: false,
        user1: new mongoose.Types.ObjectId(req.JWT),
        user2: new mongoose.Types.ObjectId(userId),
        friendRequestSentBy: new mongoose.Types.ObjectId(req.JWT),
      });
    } else {
      if (doc.friendRequestSentBy?.toString() === req.JWT.toString())
        doc.friendRequestSentBy = null;
      else if (doc.friendRequestSentBy?.toString() === userId) {
        doc.friendRequestSentBy = null;
        doc.isFriend = true;
      } else {
        doc.friendRequestSentBy = new mongoose.Types.ObjectId(req.JWT) as any;
      }
      doc.save();
    }
    res.send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};
export const getRelationship = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const relationship = await RelationshipModel.findOne({
      $or: [
        {
          $and: [
            { user1: new mongoose.Types.ObjectId(userId) },
            { user2: new mongoose.Types.ObjectId(req.JWT) },
          ],
        },
        {
          $and: [
            { user2: new mongoose.Types.ObjectId(userId) },
            { user1: new mongoose.Types.ObjectId(req.JWT) },
          ],
        },
      ],
    });
    res.send(relationship);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getRelativeFriends = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const friends = await RelationshipModel.find({
      $and: [
        { $or: [{ user1: userId }, { user2: userId }] },
        { isFriend: true },
      ],
    })
      .populate('user1', userProjection)
      .populate('user2', userProjection);
    console.log(friends, userId);
    res.send(
      friends.map((item: any) =>
        item.user1._id.toString() === userId ? item.user2 : item.user1,
      ),
    );
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

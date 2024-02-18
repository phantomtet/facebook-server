import { Router } from 'express';
import verifyToken from '../middleware/authorization';
import mongoose from 'mongoose';
import UserModel, { userProjection } from '../models/user';
import {
  updateRelationship,
  getRelationship,
  getRelativeFriends,
} from '../controllers/relationship.controller';
import RelationshipModel from '../models/relationship';

const router = Router();

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const [profile, totalFriends] = await Promise.all([
      UserModel.findById(userId, userProjection),
      RelationshipModel.countDocuments({
        $and: [
          { $or: [{ user1: userId }, { user2: userId }] },
          { isFriend: true },
        ],
      }),
    ]);
    res.send({ ...profile.toJSON(), totalFriends });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.get('/:userId/relationship', verifyToken, getRelationship);
router.get('/:userId/relative-friends', verifyToken, getRelativeFriends);
router.put('/:userId/relationship', verifyToken, updateRelationship);
export default router;

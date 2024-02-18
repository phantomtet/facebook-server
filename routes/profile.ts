import { Router } from 'express';
import verifyToken from '../middleware/authorization';
import mongoose from 'mongoose';
import UserModel, { userProjection } from '../models/user';
import { addFriendHandler } from '../controllers/relationship.controller';

const router = Router();

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const profile = await UserModel.findById(userId, userProjection);
    res.send(profile);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.post('/:userId/add-friend', verifyToken, addFriendHandler);
export default router;

import { Router } from 'express';
import verifyToken from '../middleware/authorization';
import UserModel, { userProjection } from '../models/user';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const contact = await UserModel.find({}, userProjection).limit(20);

    res.send(contact);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

export default router;

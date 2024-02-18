import { Router, Request } from 'express';
import verifyToken from '../middleware/authorization';
import UserModel from '../models/user';
import multer from 'multer';
import { update } from '../controllers/avatar.controllers';

const router = Router();
const upload = multer();

router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.JWT, { email: 0, password: 0 });
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post('/avatar', verifyToken, upload.single('avatar'), update);
export default router;

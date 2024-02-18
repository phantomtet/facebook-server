import { Router } from 'express';
import multer from 'multer';
import lodash from 'lodash';

const router = Router();
const upload = multer();

router.post('/', upload.any(), async (req, res) => {
  try {
    req.files.forEach((file) => {
      lodash.set(req.body, file.fieldname, file);
    });
    console.log('new body', JSON.stringify(req.body));
  } catch (error) {
    res.status(400).send(error);
  }
});

export default router;

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage, storageRef } from '../firebase';
import UserModel from '../models/user';
import { Request } from 'express';
import { v4 } from 'uuid';

export const update = async (req: Request, res) => {
  try {
    const upload = await uploadBytes(storageRef(v4()), req.file.buffer, {
      contentType: req.file.mimetype,
    });
    const url = await getDownloadURL(upload.ref);
    const update = await UserModel.updateOne({ _id: req.JWT }, { avatar: url });
    res.send(update);
  } catch (error) {
    res.status(400).send(error);
  }
};

import { Request, Response } from 'express';
export const addFriendHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
};

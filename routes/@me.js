import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import UserModel from "../models/user.js";

const router = Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.JWT, { email: 0, password: 0 })
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})
export default router
import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import UserModel, { userProjection } from "../models/user.js";

const router = Router()

router.get('/', verifyToken, async (req, res) => {
    try {
        const { query } = req.query
        const regex = new RegExp(`\\b${query}.*`, 'i')
        const search = await UserModel.find({ name: { '$regex': regex } }, { ...userProjection })
        res.send(search)
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router
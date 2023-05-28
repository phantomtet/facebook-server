import { Router } from "express";
import UserModel from '../models/user.js'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        let user = await UserModel.findOne({ email, password })
        if (!user) user = await UserModel.create({
            email, password, name: email
        })
        const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY)
        res.send({
            token,
            name: user.name,
            avatar: user.avatar,
            _id: user._id
        })
    } catch (error) {
        res.status(400).send(error)
    }
})
export default router
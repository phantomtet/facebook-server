import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

const verifyToken = (req, res, next) => {
    const token = req.header('authorization').split(' ')[1]
    if (!token) return res.status(401).send({ message: 'Unauthorized' })
    try {
        const verifyToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
        req.JWT = new mongoose.Types.ObjectId(verifyToken._id)
        next()
    } catch (error) {
        res.status(401).send(error)
    }

}

export default verifyToken
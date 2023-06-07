import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    avatar: {
        type: String,
        default: () => `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
    }
})

export const userProjection = {
    email: 0, password: 0
}

const UserModel = mongoose.model('user', userSchema)
export default UserModel
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
        default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'
    }
})

export const userProjection = {
    email: 0, password: 0
}

const UserModel = mongoose.model('user', userSchema)
export default UserModel
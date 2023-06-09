import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    messageChannelId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    content: {
        type: String
    },
    attachments: [String]
})
const MessageModel = mongoose.model('message', messageSchema)
export default MessageModel
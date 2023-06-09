import mongoose from "mongoose";

const messageChannelSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],
    type: {        // 0 is 1-1 message, 1 is group message
        type: Number,
        default: 0
    },
})
const MessageChannelModel = mongoose.model('message-channel', messageChannelSchema)
export default MessageChannelModel
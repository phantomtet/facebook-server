import mongoose from "mongoose";
const reactSchema = mongoose.Schema({
    _id: false,
    type: Number,
    count: {
        default: 0,
        type: Number,
        min: 0
    }
})
const postSchema = mongoose.Schema({
    ownerId: {
        required: true,
        type: mongoose.Types.ObjectId
    },
    content: String,
    attachments: [String],
    reaction: {
        type: [reactSchema],
        default: [{ type: 1, count: 0 }, { type: 2, count: 0 }, { type: 3, count: 0 }, { type: 4, count: 0 }, { type: 5, count: 0 }, { type: 6, count: 0 }, { type: 7, count: 0 }]
    },
    totalReaction: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const PostModel = mongoose.model('post', postSchema)
export default PostModel
import mongoose from "mongoose";
export const fileSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    }
})
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
    owner: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    content: String,
    attachments: [fileSchema],
    reaction: {
        type: [reactSchema],
        default: [{ type: 1, count: 0 }, { type: 2, count: 0 }, { type: 3, count: 0 }, { type: 4, count: 0 }, { type: 5, count: 0 }, { type: 6, count: 0 }, { type: 7, count: 0 }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const PostModel = mongoose.model('post', postSchema)
export default PostModel
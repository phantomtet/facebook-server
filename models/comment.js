import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    post: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'post'
    },
    attachments: [String]
})
const CommentModel = mongoose.model('comment', commentSchema)
export default CommentModel
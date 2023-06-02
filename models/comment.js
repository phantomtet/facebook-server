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
    ownerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    postId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    attachments: [String]
})
const CommentModel = mongoose.model('comment', commentSchema)
export default CommentModel
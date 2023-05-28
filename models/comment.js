import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    created_at: {
        type: Date,
        default: Date.now()
    },
    content: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    postId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    attachments: [String]
})
const CommentModel = mongoose.model('comment', commentSchema)
export default CommentModel
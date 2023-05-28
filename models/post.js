import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    ownerId: {
        required: true,
        type: mongoose.Types.ObjectId
    },
    content: String,
    attachments: [String],
    likes: {
        default: 0,
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})
const PostModel = mongoose.model('post', postSchema)
export default PostModel
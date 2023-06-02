import mongoose from "mongoose";

const postReactionSchema = mongoose.Schema({
    postId: {
        required: true,
        type: mongoose.Types.ObjectId
    },
    ownerId: {
        required: true,
        type: mongoose.Types.ObjectId
    },
    type: {
        // nothing: 0, like: 1, love: 2, care: 3, haha: 4, wow: 5, sad: 6, angry: 7
        default: 0,
        type: Number
    }
})
const PostReactionModel = mongoose.model('post-reactions', postReactionSchema)
export default PostReactionModel
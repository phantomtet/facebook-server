import mongoose from "mongoose";

const relationshipSchema = mongoose.Schema({
    from: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    to: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    isSendFriendRequest: {
        default: false,
        type: Boolean
    },
    isFriend: {
        default: false,
        type: Boolean
    },
    isBlock: {
        default: false,
        type: Boolean
    }
})
const RelationshipModel = mongoose.model('relationship', relationshipSchema)
export default RelationshipModel
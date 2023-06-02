import mongoose from "mongoose";

const relationshipSchema = mongoose.Schema({
    fromId: {
        required: true,
        type: mongoose.Types.ObjectId
    },
    toId: {
        required: true,
        type: mongoose.Types.ObjectId
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
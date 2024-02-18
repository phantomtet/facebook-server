import mongoose from 'mongoose';

type T_Status = 'block' | 'follow' | 'unfollow';
interface I_RelationConfig {
  isSendFriendRequest: boolean;
  status: T_Status;
}
const relationshipSchema = new mongoose.Schema({
  user1: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  user2: {
    required: true,
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  relationship1: {
    isSendFriendRequest: {
      default: false,
      type: Boolean,
    },
    status: String,
  },
  relationship2: {
    isSendFriendRequest: {
      default: false,
      type: Boolean,
    },
    status: String,
  },
});

const RelationshipModel = mongoose.model('relationship', relationshipSchema);
export default RelationshipModel;

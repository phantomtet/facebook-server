import mongoose from 'mongoose';

type T_Status = 'block' | 'follow' | 'unfollow';
interface I_RelationConfig {
  isSendFriendRequest: boolean;
  status: T_Status;
}
const relationshipSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  user2: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  },
  friendRequestSentBy: mongoose.Types.ObjectId,
  isFriend: Boolean,
});

const RelationshipModel = mongoose.model('relationship', relationshipSchema);
export default RelationshipModel;

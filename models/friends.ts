import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  user1: mongoose.Types.ObjectId,
  user2: mongoose.Types.ObjectId,
});
const friendModel = mongoose.model('friends', friendSchema);
export default friendModel;

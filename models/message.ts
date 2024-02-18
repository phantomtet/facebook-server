import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  messageChannel: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'message-channel',
  },
  content: {
    type: String,
  },
  attachments: [String],
});
const MessageModel = mongoose.model('message', messageSchema);
export default MessageModel;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    required: true,
  },
  sender: String,
  content: String,
  important: {
    type: Boolean,
    default: false,
  },
  reactions: {
    type: Map,
    of: Number,
    default: {},
  },
});

const Message =
  mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

export default Message;
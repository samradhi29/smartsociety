import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  meetingId: string;
  sender: string;
  content: string;
  timestamp: Date;
  isImportant: boolean;
  reactions: Map<string, number>;
}

const messageSchema = new Schema<IMessage>({
  meetingId: { type: String, required: true },
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
  isImportant: { type: Boolean, default: false },
  reactions: { type: Map, of: Number, default: {} },
});

export default mongoose.models.Message || mongoose.model('chatMessage', messageSchema);

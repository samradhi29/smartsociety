import mongoose, { Schema, Document } from "mongoose";

interface UserSchema{
  name : string;
  joinedAt : Date;
}

interface Meeting extends Document {
  purpose: string;
  datetime: Date;
  Endtime  : Date;
    societyname: string;
  type: 'online' | 'offline';
  location?: string;
  createdBy?: mongoose.Types.ObjectId;
  minperson: string;
  status: 'pending' | 'completed' | 'approved';
  votes: mongoose.Types.ObjectId[]; // fix: properly type votes
  usersdata : UserSchema[];
}

const meetingSchema = new Schema<Meeting>({
  purpose: { type: String, required: true },
  datetime: { type: Date, required: true },
  Endtime : {type : Date , required : true  , default : null},
  type: { type: String, enum: ['online', 'offline'], required: true },
  location: { type: String },
  // createdBy: { type: Schema.Types.ObjectId, ref: 'resident', required: true },
  minperson: { type: String, required: true },
   societyname: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'approved'],
    default: 'pending' // fix: match with your usage
  },
  usersdata: [
  {
  name : {
    type : Schema.Types.ObjectId , ref : 'resident' ,
    required : true
  },

joinedAt : {
type : Date 
}
}
],
  votes: [{ type: Schema.Types.ObjectId, ref: 'resident' }] // ✅ add this
});

export default mongoose.models.meeting || mongoose.model('meeting', meetingSchema);

import mongoose, { Schema, Document, model } from "mongoose";

interface Event extends Document {
  name: string;
  description: string;
  dateofevent: Date;
  location: string;
  startTime: string;
  endTime: string;
  societyname: string;    // <-- Added here
  Rsvp: boolean;
  iscompleted: boolean;
  images?: string[];
  attendees?: string[];
}

const EventSchema: Schema<Event> = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  dateofevent: { type: Date, required: true },
  location: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  societyname: { type: String, required: true },   // <-- Added here
  Rsvp: { type: Boolean, default: false },
  iscompleted: { type: Boolean, default: false },
  images: [{ type: String }],
  attendees: [{ type: String, ref: 'User', default: [] }],
});

export default mongoose.models.Event || model<Event>("Event", EventSchema);

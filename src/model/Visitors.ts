import mongoose, { Schema, Document, models, model } from 'mongoose'

export interface Visitor extends Document {
  name: string
  flatno?: string
  purpose: string
  info?: string
  gender: string
  email: string
  entrytime: Date
  outtime?: Date
  societyname : string
}

const visitorSchema: Schema<Visitor> = new Schema({
  name: {
    type: String,
    required: true,
  },
  flatno: {
    type: String,
  },
  purpose: {
    type: String,
  },
  info: {
    type: String,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  entrytime: {
    type: Date,
    default: Date.now, // automatically sets entry time to current time
  },
  outtime: {
    type: Date, // will be set manually when the visitor leaves
  },
  societyname :{
    type : String
  }
})

export const visitorModel =
  models.visitor || model<Visitor>('visitor', visitorSchema)

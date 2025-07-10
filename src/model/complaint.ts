import { Schema , Document , Types, mongo } from "mongoose";
import mongoose  from "mongoose";
export interface Complaint extends Document {
    societyname : string;
     creatername : string;
    complaintext : string;
    catagory : String;
    status : string;
    flatnumber : string;
    createdAt : Date;
    anonymous : Boolean;
    note? : string;
}
const Complaintschema : Schema<Complaint> = new Schema({
     societyname :{
         type : String , 
         trim: true
     } ,
 creatername : {
         type : String , 
         required : true
     }, 
    complaintext :{
        type : String,
        trim : true
    } ,

    status : {
        type : String ,
        default : "pending",
        enum :["inprogress" , "pending" , "resolved" , "rejected"]
    } ,
    flatnumber :{
        type : String ,
    } , 
    createdAt :{
        type : Date
    },
    catagory :{
        type : String , 
    
    },
    note: {
  type: String,
  trim: true,
  default: ""
},
    anonymous : {
        type : Boolean,
        default : false
    }},
    
      {
    timestamps: true, 
  
})

export const ComplaintModel = mongoose.models.Complaint || mongoose.model<Complaint>("Complaint" , Complaintschema); 
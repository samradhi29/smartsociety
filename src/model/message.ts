
import { ScanEye } from "lucide-react";
import { mongo, Schema } from "mongoose";
import mongoose  ,{Document} from "mongoose";
interface message extends Document {
    meetingId : mongoose.Types.ObjectId;
    sender : mongoose.Types.ObjectId;
    content : string;
    timestamp : Date;
    isImportant : boolean;
    reactions : {user : mongoose.Types.ObjectId; type : string}[];

}

const messageSchema = new Schema<message>({
     meetingId: { type: Schema.Types.ObjectId, ref: 'Meeting' },
     sender : {
        type : Schema.Types.ObjectId  , ref : 'Resident' 
     },
     content : String ,
     timestamp : {type : Date , default : Date.now} , 
     isImportant : {type : Boolean , default : false},
     reactions : [
        {
            user :{type : Schema.Types.ObjectId , ref : 'resident'},
            type : String,
        },
     ],
   
})
 export default mongoose.models.message || mongoose.model('message' , messageSchema);

import mongoose , {Schema , Document , Types} from "mongoose";
import { Society } from "./Society";
export interface flats extends Document{
    flatnumber : string;
   block : string;
   floor: number ;
   type : string;
   size : Number;
   isoccupied : boolean;
     society: Types.ObjectId; 
}
const flatsSchema : Schema <flats>= new Schema({
   flatnumber : {
        type : String ,
        required : true,
       
    },
    block :{
        type : String ,
        required : true
    } ,
    floor : {
        type : Number , 
        required : true
    },
   type : {
        type : String , 
        required : true ,
//        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter correct email address"]

    },
    size  :{
        type : String ,
        required : true
    }
    ,
    isoccupied :{
        type : Boolean
    },
    society: {
    type: Schema.Types.ObjectId,
    ref: "Society",
    required: true,
  },

})
export const flatsModel = mongoose.models.flats || mongoose.model<flats>("flats", flatsSchema);

import mongoose , {Schema , Document} from "mongoose";
export interface Society extends Document{
    name : string;
    address : string;
    email :String;
    password : string;
}
const societySchema : Schema <Society>= new Schema({
    name : {
        type : String ,
        required : true,
        unique : true , 
        trim : true
    },
    address : {
        type : String , 
        required : true
    },

})
export const SocietyModel = mongoose.models.society || mongoose.model<Society>("society", societySchema);

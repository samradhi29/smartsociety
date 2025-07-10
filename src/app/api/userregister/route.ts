import { dbconnect } from "@/app/lib/dbconnect";
import { NextResponse } from "next/server";
import { ResidentModel } from "@/model/resident";
import bcrypt from "bcryptjs";
export async function POST(req:Request) {
    await dbconnect();
    try{
        
          const {name , email , flatnumber , phone , gender , age , username , society , password , role} = await req.json();
          if(!name || !email || !flatnumber || !username || !society){
            return NextResponse.json({message : "All fields are required"} , {status : 400});
            
          }
          const exitinguser  = await ResidentModel.findOne({email }
          )
          if(exitinguser){
            return NextResponse.json({message : "admin already registered"} , {status : 400});
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newuser = new ResidentModel({
            name , email , flatnumber , phone , gender , age , username , society , password : hashedPassword , role
          })
          await newuser.save();
          return NextResponse.json({
            message : "user registered"
          } , {status : 200});

    }
    catch(error){
console.error("error" , error);
return NextResponse.json({message : "server error"} , {status : 200})
    }
}
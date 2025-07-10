import { NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { flatsModel } from "@/model/flats";
export async function GET() {
    await dbconnect();
    try{
const flats = await flatsModel.find();

return NextResponse.json({flats});
    }
    catch(error){
console.log("error"  ,error);
return NextResponse.json({message : "failed to fatch" , error} , {status : 500})
    }
}
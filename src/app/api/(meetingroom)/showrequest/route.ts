import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import meeting from "@/model/meeting";

export async function GET(req: NextRequest) {
  await dbconnect();
  try {
    const meetings = await meeting.find({status : "pending"});
   
    return NextResponse.json(meetings); 
  } catch (err) {
    return NextResponse.json(
      { message: "Issue in fetching meetings", error: err },
      { status: 500 }
    );
  }
}

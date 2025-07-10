import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import meeting from "@/model/meeting";

export async function POST(req: NextRequest) {
  await dbconnect();

  try {
    const data = await req.json();
    console.log("📥 Received data:", data);

    // Extract fields one by one from the request body
    const {
      purpose,
      datetime,
      Endtime,
      type,
      location,
      minperson,
      // createdBy,
      societyname,
    } = data;

    // Basic validation (optional but recommended)
    if (!purpose || !datetime || !Endtime || !type || !minperson  || !societyname) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the meeting document explicitly
    const meetingDoc = await meeting.create({
      purpose,
      datetime: new Date(datetime),
      Endtime: new Date(Endtime),
      type,
      location,
      minperson,
      // createdBy,
      societyname,
      // you can add default or initial values here as needed, e.g.
      status: "pending",
      votes: [],
      usersdata: [],
    });

    console.log("✅ Saved meeting:", meetingDoc);

    return NextResponse.json({ success: true, meeting: meetingDoc });
  } catch (error: any) {
    console.error("❌ Error saving meeting:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

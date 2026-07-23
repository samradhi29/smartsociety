import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import meeting from "@/model/meeting";

export async function POST(req: NextRequest) {
  try {
    await dbconnect();
    const { meetingId } = await req.json();

    const updated = await meeting.findByIdAndUpdate(
      meetingId,
      { status: "approved" },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Meeting approved", meeting: updated });
  } catch (err) {
    return NextResponse.json({ message: "Error approving meeting", error: err }, { status: 500 });
  }
}

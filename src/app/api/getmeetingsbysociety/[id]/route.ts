import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import meeting from "@/model/meeting";

// Correct usage of context for dynamic params in App Router
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbconnect();

    // Await the entire params object, then access the id property
    const awaitedParams = await params;
    const societyname = awaitedParams.id;

    const meetings = await meeting.find({ societyname }).sort({ datetime: 1 });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings by society:", error);
    return NextResponse.json(
      { message: "Error fetching meetings", error },
      { status: 500 }
    );
  }
}
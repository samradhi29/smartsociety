import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import meeting from "@/model/meeting";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbconnect();

    const { id } = await params; // ✅ IMPORTANT FIX

    const societyname = id;

    const meetings = await meeting
      .find({ societyname })
      .sort({ datetime: 1 });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings by society:", error);

    return NextResponse.json(
      { message: "Error fetching meetings", error },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { visitorModel } from "@/model/Visitors";
import { dbconnect } from "@/app/lib/dbconnect";

export async function GET(req: NextRequest) {
  await dbconnect();

  // You can get societyname from query string ?societyname=abc
  const { searchParams } = new URL(req.url);
  const societyname = searchParams.get("societyname");

  if (!societyname) {
    return NextResponse.json({ success: false, message: "societyname is required" }, { status: 400 });
  }

  try {
    // Find visitors by societyname
    const visitors = await visitorModel.find({ societyname }).sort({ inTime: -1 });
    return NextResponse.json({ success: true, visitors });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch visitors" }, { status: 500 });
  }
}

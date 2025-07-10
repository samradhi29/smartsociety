import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import Event from "@/model/Event";

export async function GET(req: NextRequest) {
  await dbconnect();
  try {
    const data = await Event.find();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

import { dbconnect } from "@/app/lib/dbconnect";
import { LostAndFoundModel } from "@/model/lostandfoundfrom";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbconnect();
    const items = await LostAndFoundModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

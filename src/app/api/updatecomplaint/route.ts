import { NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect"
import { ComplaintModel } from "@/model/complaint";  // your file path

export async function PUT(req: Request) {
  try {
    const { id, status, note } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Complaint ID is required" }, { status: 400 });
    }

    await dbconnect();

    const updatedComplaint = await ComplaintModel.findByIdAndUpdate(
      id,
      { ...(status && { status }), ...(note !== undefined && { note }) },
      { new: true }
    );

    if (!updatedComplaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json(updatedComplaint, { status: 200 });
  } catch (error: any) {
    console.error("Update Complaint Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

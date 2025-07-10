import { NextRequest, NextResponse } from "next/server";
import { ComplaintModel } from "@/model/complaint";
import { dbconnect } from "@/app/lib/dbconnect";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Missing authentication" }, { status: 401 });
  }

  const { id, status, note } = await req.json();

  if (!id || !status || typeof note !== "string") {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  await dbconnect();

  const complaint = await ComplaintModel.findById(id);

  if (!complaint) {
    return NextResponse.json({ message: "Complaint not found" }, { status: 404 });
  }

  complaint.status = status;
  complaint.note = note;
  await complaint.save();

  return NextResponse.json({ message: "Complaint updated successfully" });
}

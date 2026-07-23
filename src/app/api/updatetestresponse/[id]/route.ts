import { NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { LostAndFoundModel } from "@/model/lostandfoundfrom";

export async function POST(req: Request, context: any) {
  try {
    const { id } = context.params;

    const { responses } = await req.json();

    await dbconnect();

    const updatedDoc = await LostAndFoundModel.findByIdAndUpdate(
      id,
      { $set: { claimTests: responses } },
      { new: true }
    );

    if (!updatedDoc) {
      return NextResponse.json(
        { success: false, message: "Lost item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Claim test responses updated successfully",
      data: updatedDoc,
    });
  } catch (error) {
    console.error("Error updating claim test:", error);

    return NextResponse.json(
      { success: false, message: "Server error updating claim test" },
      { status: 500 }
    );
  }
}
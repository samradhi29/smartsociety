import { NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { societyFlatModel } from "@/model/societyflats";
import { SocietyModel } from "@/model/Society";

export async function GET(req: Request, context: any) {
  await dbconnect();

  try {
    const societyId = context.params.society;

    if (!societyId) {
      return NextResponse.json(
        { message: "Society ID is required" },
        { status: 400 }
      );
    }

    const society = await SocietyModel.findById(societyId);

    if (!society) {
      return NextResponse.json(
        { message: "Society not found" },
        { status: 404 }
      );
    }

    const flats = await societyFlatModel
      .find({ society: society._id })
      .populate("society", "name location")
      .lean();

    return NextResponse.json(
      { message: "Flats fetched successfully", flats },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching flats:", error);

    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { message: "Failed to fetch flats", error: message },
      { status: 500 }
    );
  }
}
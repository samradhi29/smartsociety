import { NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { societyFlatModel } from "@/model/societyflats";
import { SocietyModel } from "@/model/Society";
import * as XLSX from "xlsx";

export async function POST(req: Request) {
  try {
    await dbconnect();

  
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const societyName = formData.get("society") as string | null;

    if (!file || !societyName) {
      return NextResponse.json(
        { message: "File and society are required" },
        { status: 400 }
      );
    }

 
    const society = await SocietyModel.findOne({ name: societyName });
    if (!society) {
      return NextResponse.json(
        { message: `Society '${societyName}' not found` },
        { status: 404 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = XLSX.utils.sheet_to_json(sheet);

    
    const flatsToInsert = data.map((row) => ({
      flatnumber: String(row.flatnumber || "").trim(),
      block: String(row.block || "").trim(),
      floor: Number(row.floor) || 0,
      type: String(row.type || "").trim(),
      size: Number(row.size) || 0,
      members:
        typeof row.members === "string"
          ? row.members.split(",").map((m : any) => m.trim())
          : [],
      society: society._id,
      isoccupied: false,
    }));

    if (flatsToInsert.length === 0) {
      return NextResponse.json(
        { message: "No valid flats found in file" },
        { status: 400 }
      );
    }

    await societyFlatModel.insertMany(flatsToInsert, { ordered: false });

    return NextResponse.json(
      { message: "Flats uploaded successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);

  
    const message =
      error instanceof Error ? error.message : "Unexpected error occurred";

    return NextResponse.json(
      { message: "Error uploading flats", error: message },
      { status: 500 }
    );
  }
}

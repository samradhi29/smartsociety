import mongoose from "mongoose";
import { dbconnect } from "@/app/lib/dbconnect";
import { flatsModel } from "@/model/flats";
import { SocietyModel } from "@/model/Society";
import * as xlsx from "xlsx";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const societyname = formData.get("societyname") as string;

    if (!file || !societyname) {
      return new Response(
        JSON.stringify({ error: "File or society name missing" }),
        {
          status: 400,
        }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames?.[0];
    if (!sheetName) {
      return new Response(JSON.stringify({ error: "Invalid Excel file" }), {
        status: 400,
      });
    }

    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json<any>(sheet);

    console.log("Raw data from Excel:", data);

    await dbconnect();

    // Find society by name first
    const society = await SocietyModel.findOne({ name: societyname });
    if (!society) {
      return new Response(
        JSON.stringify({ error: `Society '${societyname}' not found` }),
        {
          status: 404,
        }
      );
    }

    console.log("Found society:", society._id);

    const validData = data
      .map((item: any) => ({
        flatnumber: item.flatnumber ?? item.FlatNumber ?? item.flatNumber,
        block: item.block ?? item.Block,
        floor: Number(item.floor ?? item.Floor),
        type: item.type ?? item.Type ?? item[' '], // Handle the space key from your data
        size: Number(item.size ?? item.Size),
        isoccupied:
          item.isoccupied === "TRUE" ||
          item.isoccupied === true ||
          item.IsOccupied === true,
        // society: society._id, // Use the found society's ObjectId
      }))
      .filter(
        (flat) =>
          flat.flatnumber &&
          flat.block &&
          !isNaN(flat.floor) &&
          flat.type &&
          !isNaN(flat.size)
      );

    console.log("Flats to be added:", validData);

    if (validData.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid flats found in the Excel file" }),
        {
          status: 400,
        }
      );
    }

    await flatsModel.insertMany(validData);

    return new Response(
      JSON.stringify({ 
        message: "Flats uploaded successfully",
        count: validData.length 
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error uploading flats:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
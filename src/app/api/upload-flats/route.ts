// /app/api/upload-flats/route.ts
import { NextRequest } from "next/server";
import multer from "multer";
import * as xlsx from "xlsx";
import fs from "fs/promises";
import { dbconnect } from "@/app/lib/dbconnect";
import { flatsModel } from "@/model/flats";

// Temporary upload folder
const upload = multer({ dest: "/tmp" });

// A wrapper to make multer work with the App Router
function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new Response(JSON.stringify({ error: "No file uploaded" }), {
      status: 400,
    });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    await dbconnect();
    await flatsModel.insertMany(data);

    return new Response(JSON.stringify({ message: "Flats uploaded successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading flats:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

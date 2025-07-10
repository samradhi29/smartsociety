import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import Event from "@/model/Event";
import cloudinary from "@/app/lib/cloudinary";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbconnect();
  const formData = await req.formData();
  const files = formData.getAll("images");

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  try {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      const uploadResponse = await cloudinary.uploader.upload(dataUri, {
        folder: "event_images", // optional folder in your Cloudinary dashboard
      });

      uploadedUrls.push(uploadResponse.secure_url);
    }

    // Update event with uploaded image URLs
    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      { $push: { images: { $each: uploadedUrls } } },
      { new: true }
    );

    return NextResponse.json({ message: "Uploaded to Cloudinary", urls: uploadedUrls, event: updatedEvent });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload images" }, { status: 500 });
  }
}

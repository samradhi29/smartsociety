import { NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect"; // Ensure you have this
import { SocietyModel } from "@/model/Society";   // Your existing model
import bcrypt from "bcryptjs";

// POST: Register Society
export async function POST(req: Request) {
  await dbconnect();

  try {
    const { name, address, email, password } = await req.json();

    if (!name || !address || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check if admin already exists
    const existingSociety = await SocietyModel.findOne({ email });
    if (existingSociety) {
      return NextResponse.json({ message: "Admin already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSociety = new SocietyModel({
      name,
      address,
      email,
      password: hashedPassword,
    });

    await newSociety.save();

    return NextResponse.json({ message: "Society registered successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

import { dbconnect } from "@/app/lib/dbconnect";
import { NextResponse } from "next/server";
import { ResidentModel } from "@/model/resident";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbconnect();

  try {
    const { name, email, flatnumber, phone, gender, age, username, society, password, role } = await req.json();

    if (!name || !email || !username || !society) {
      return NextResponse.json({ message: "All required fields are missing" }, { status: 400 });
    }

    // Check if resident already exists
    const existingUser = await ResidentModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already registered" }, { status: 400 });
    }

    // Validate or assign default ObjectId for flatnumber
    let flatId;
    if (mongoose.Types.ObjectId.isValid(flatnumber)) {
      flatId = flatnumber; // valid ObjectId
    } else {
      // 👇 fallback dummy ObjectId if invalid or not provided
      flatId = new mongoose.Types.ObjectId("000000000000000000000000");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new ResidentModel({
      name,
      email,
      flatnumber: flatId,
      phone,
      gender,
      age,
      username,
      society,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

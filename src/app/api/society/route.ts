import { NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { SocietyModel } from "@/model/Society";
import { ResidentModel } from "@/model/resident";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbconnect();

  try {
    const {
      societyName,
      societyAddress,
      adminName,
      adminUsername,
      adminEmail,
      adminPassword,
      adminPhone,
      adminAge,
      adminGender,
      flatnumber,
    } = await req.json();

    // Validate required fields
    if (
      !societyName || !societyAddress
    ) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Check for duplicate society
    const existingSociety = await SocietyModel.findOne({societyName : societyName });
    if (existingSociety) {
      return NextResponse.json({ message: "Society already registered with this email" }, { status: 400 });
    }

    // Hash passwords
  
    // Save new society
    const newSociety = new SocietyModel({
      name: societyName,
      address: societyAddress
    });
    await newSociety.save();

    // // Create admin resident
    // const newAdmin = new ResidentModel({
    //   name: adminName,
    //   username: adminUsername,
    //   email: adminEmail,
    //   password: hashedAdminPassword,
    //   phone: adminPhone,
    //   age: adminAge,
    //   gender: adminGender,
    //   flatnumber: new mongoose.Types.ObjectId(flatnumber),
    //   society: newSociety._id,
    //   role: "admin",
    // });
    // await newAdmin.save();

    return NextResponse.json({ message: "Society and admin registered successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error registering society:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

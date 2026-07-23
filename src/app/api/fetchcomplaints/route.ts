import { dbconnect } from "@/app/lib/dbconnect";
import { ComplaintModel } from "@/model/complaint";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbconnect();

    const { role, society, username } = session.user;

    console.log("User Role:", role);
    console.log("User Society:", society);
    console.log("User Name:", username);

    let complaints;

    if (role === "admin") {
      // Admin sees all complaints from their society
      complaints = await ComplaintModel.find({
        societyname: society, // Make sure this field matches exactly in your DB
      }).sort({ createdAt: -1 });
    } else {
      // Regular users see only their own complaints
      complaints = await ComplaintModel.find({
        creatername: username,
        societyname: society, // Optional: extra check if needed
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json(complaints, { status: 200 });

  } catch (err) {
    console.error("Error fetching complaints:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

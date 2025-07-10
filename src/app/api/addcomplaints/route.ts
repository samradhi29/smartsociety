import { NextRequest, NextResponse } from "next/server";
import { ComplaintModel } from "@/model/complaint";
import { flatsModel } from "@/model/flats";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import { dbconnect } from "@/app/lib/dbconnect";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  console.log("Received body in addcomplaints:", body);

  const { flatnumber, text, catagory, anonymous , societyname } = body;

  // Validate required fields
  if (!text || !flatnumber) {
    console.log("Missing required field:", { flatnumber, text });
    return NextResponse.json(
      { message: "Missing required field: flatnumber or text" },
      { status: 400 }
    );
  }

  try {
    await dbconnect();

    // Validate flat existence in the user's society
    // const flat = await flatsModel.findOne({
    //   society: session.user.society,
    //   flatnumber,
    // });

    // if (!flat) {
    //   console.log("Flat not found for society", {
    //     flatnumber,
    //     society: session.user.society,
    //   });
    //   return NextResponse.json(
    //     { message: "Flat does not exist in your society" },
    //     { status: 400 }
    //   );
    // }

    // Create complaint
    const complaint = new ComplaintModel({
      societyname,
      flatnumber,
      creatername: session.user.username,
      complaintext: text,
      createdAt: new Date(),
      catagory,
      anonymous,
    });

    await complaint.save();

    return NextResponse.json(
      { message: "Complaint submitted successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error in /api/addcomplaints:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

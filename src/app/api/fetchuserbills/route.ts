// /app/api/fetchuserbills/route.ts
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import { BillModel } from "@/model/maintainancebill";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.flatnumber) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const flatNumber = session.user.flatnumber;

    const bills = await BillModel.find({ flatNumber }).sort({ year: -1, month: -1 });

    return NextResponse.json({ success: true, bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

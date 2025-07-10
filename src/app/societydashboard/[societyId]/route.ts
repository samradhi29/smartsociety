import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { SocietyModel } from "@/model/Society";
import { flatsModel } from "@/model/flats";
import { visitorModel } from "@/model/Visitors";
import { ComplaintModel } from "@/model/complaint";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest, context: any) {
  await dbconnect();

  // Fix: await context.params
  const { societyId } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("⛔ Unauthorized access attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const society = await SocietyModel.findById(societyId);
    if (!society) {
      console.log("❌ Society not found for ID:", societyId);
      return NextResponse.json({ error: "Society not found" }, { status: 404 });
    }

    const societyName = society.name;
    console.log("🏘️ Society Name:", societyName);

    const flats = await flatsModel.find({ society: society._id });
    console.log("🏢 Fetched Flats:", flats.length);

    const recentComplaints = await ComplaintModel.find({ societyname:  society._id})
      .sort({ createdAt: -1 })
      .limit(5);
    console.log("📋 Recent Complaints:", recentComplaints);

    const recentVisitors = await visitorModel.find({ societyname:  society._id })
      .sort({ entrytime: -1 })
      .limit(5);
    console.log("🚶 Recent Visitors:", recentVisitors);

    return NextResponse.json({ society, flats, recentComplaints, recentVisitors });
  } catch (err) {
    console.error("🔥 Error loading dashboard data:", err);
    return NextResponse.json({ error: "Error loading dashboard data" }, { status: 500 });
  }
}

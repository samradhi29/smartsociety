import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import Event from "@/model/Event";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const societyname = session?.user?.society;

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbconnect();
  try {
    const data = await Event.find({ societyname });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

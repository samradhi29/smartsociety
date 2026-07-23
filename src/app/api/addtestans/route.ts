import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { LostAndFoundModel } from "@/model/lostandfoundfrom";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await dbconnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ans1, ans2, ans3, societyname } = body;

    if (!id || !ans1 || !ans2 || !ans3 || !societyname) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const item = await LostAndFoundModel.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // ✅ Initialize claimTests if undefined
    if (!item.claimTests) {
      item.claimTests = [];
    }

    // ✅ Prevent duplicate submission from same user
    const alreadySubmitted = item.claimTests.some(
      (t: any) => t.user?.toString() === session.user.id
    );
    if (alreadySubmitted) {
      return NextResponse.json({ error: "You already submitted a claim." }, { status: 400 });
    }

    // ✅ Add test response
    item.claimTests.push({
      user: session.user.id,
      answers: [ans1, ans2, ans3],
      societyname,
      attemptedAt: new Date(),
      reviewed: false,
      verified: null,
      passed: false,
    });

    item.status = "pending-review";

    await item.save();

    return NextResponse.json({ message: "Test submitted successfully", item });
  } catch (err: any) {
    console.error("❌ Submission error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

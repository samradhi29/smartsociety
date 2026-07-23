// app/api/gettestdata/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { LostAndFoundModel } from "@/model/lostandfoundfrom";
import { dbconnect } from "@/app/lib/dbconnect";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await dbconnect();

  const item = await LostAndFoundModel.findById(id);

  if (!item || !item.claimTests || item.claimTests.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(item.claimTests);
}

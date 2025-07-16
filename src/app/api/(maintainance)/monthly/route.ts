// src/app/api/cron/monthly/route.ts
import { NextResponse } from "next/server";
import {generateBills} from '@/app/api/(maintainance)/genratebills/route' // adjust path accordingly

export async function GET() {
  try {
    await generateBills();
    return NextResponse.json({ message: "Monthly bills generated" });
  } catch (err: any) {
    console.error("Cron error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

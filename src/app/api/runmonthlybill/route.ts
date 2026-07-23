import { NextResponse } from "next/server";
import { setupMonthlyBill } from "../../../../socket-server/cron/monthlybillgenrate";

export async function GET() {
  try {
    await setupMonthlyBill();
    return NextResponse.json({ success: true, message: "Monthly bill generation triggered" });
  } catch (err) {
    console.error("Error in monthly bill cron:", err);
    return NextResponse.json({ success: false, message: "Error running cron" });
  }
}

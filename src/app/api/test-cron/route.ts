import { setupMonthlyBill } from "../../../../socket-server/cron/monthlybillgenrate";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await setupMonthlyBill();

    return NextResponse.json({
      success: true,
      message: "Cron executed successfully",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Error running cron",
    });
  }
}
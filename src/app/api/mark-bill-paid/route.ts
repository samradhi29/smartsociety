import { NextRequest, NextResponse } from "next/server";
import { dbconnect } from "@/app/lib/dbconnect";
import { BillModel } from "@/model/maintainancebill";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { billId, residentId } = body;

    if (!billId || !residentId) {
      return NextResponse.json({ message: "billId and residentId required" }, { status: 400 });
    }

    await dbconnect();

    const bill = await BillModel.findById(billId);
    if (!bill) return NextResponse.json({ message: "Bill not found" }, { status: 404 });

    bill.paidAmount = bill.totalAmount;
    bill.dueAmount = 0;
    bill.status = "Paid";
    bill.paidBy = residentId;
    bill.paymentDate = new Date();

    await bill.save();

    return NextResponse.json({ message: "Bill marked as paid", bill });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

import { dbconnect } from '@/app/lib/dbconnect';
import { BillModel } from '@/model/maintainancebill';
import { flatsModel } from '@/model/flats';
import { MonthlyChargesModel } from '@/model/monthlycharges';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbconnect();

  const now = new Date();
  const month = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();

  const existing = await BillModel.findOne({ month, year });
  if (existing) {
    return NextResponse.json({ success: false, message: 'Bills already generated' });
  }

  const chargesDoc = await MonthlyChargesModel.findOne({ month, year });
  if (!chargesDoc) {
    return NextResponse.json({ success: false, message: 'No charges set for this month' });
  }

  const totalAmount = chargesDoc.charges.reduce((sum : Number, c : any) => sum + c.amount, 0);
  const flats = await flatsModel.find();

  const bills = flats.map(flat => ({
    flatNumber: flat.flatnumber,
    // residentId: flat.residentId,
    month,
    year,
    charges: chargesDoc.charges,
    totalAmount,
    paidAmount: 0,
    dueAmount: totalAmount,
    status: 'Unpaid',
    dueDate: new Date(year, now.getMonth(), 15)
  }));

  await BillModel.insertMany(bills);

  return NextResponse.json({ success: true, message: 'Bills auto-generated' });
}

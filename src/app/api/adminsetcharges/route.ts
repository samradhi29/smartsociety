import { dbconnect } from '@/app/lib/dbconnect';
import { MonthlyChargesModel } from '@/model/monthlycharges';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]/options';
export async function POST(req: Request) {
  try {
    await dbconnect();
    const { month, year, charges } = await req.json();
const session = await getServerSession(authOptions);
const society = session?.user.society;
    // Basic validation
    if (!month || !year || !Array.isArray(charges) || charges.length === 0) {
      return NextResponse.json({ success: false, message: 'Missing or invalid fields' }, { status: 400 });
    }

    for (const charge of charges) {
      if (!charge.name || typeof charge.name !== 'string' || typeof charge.amount !== 'number' || charge.amount <= 0) {
        return NextResponse.json({ success: false, message: 'Invalid charge data' }, { status: 400 });
      }
    }

    const existing = await MonthlyChargesModel.findOne({ month, year , society });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Charges already set for this month' },
        { status: 400 }
      );
    }

    await MonthlyChargesModel.create({society ,month, year, charges });

    return NextResponse.json({ success: true, message: 'Charges saved successfully' });
  } catch (err) {
    console.error('Error saving monthly charges:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

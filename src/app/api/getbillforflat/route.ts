import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]/options';
import { dbconnect } from '@/app/lib/dbconnect';



import { ResidentModel } from '@/model/resident';
import { BillModel } from '@/model/maintainancebill';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'not logged in' }, { status: 401 });
  }

  await dbconnect();

  const resident = await ResidentModel.findOne({ email: session.user.email })

  if (!resident) {
    return NextResponse.json({ error: 'Resident not found' }, { status: 404 });
  }

  const flatId = resident.flatnumber;

  if (!flatId) {
    return NextResponse.json({ error: 'Flat number not found' }, { status: 404 });
  }

  const bills = await BillModel.find({flat : flatId});

  return NextResponse.json({ bills });
}

// src/app/api/societies/route.ts
import { NextResponse } from 'next/server';
import { SocietyModel } from '@/model/Society';
import { dbconnect } from '@/app/lib/dbconnect'; // Make sure dbconnect is correct

export async function GET() {
  try {
    await dbconnect();
    const societies = await SocietyModel.find();
    return NextResponse.json({ societies });
  } catch (error) {
    console.error('Error fetching societies:', error);
    return NextResponse.json({ message: 'Error fetching societies' }, { status: 500 });
  }
}


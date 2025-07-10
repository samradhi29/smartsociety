import { NextResponse } from 'next/server';
import { dbconnect } from '@/app/lib/dbconnect';
import { OTPModel } from '@/model/Otp';

export async function POST(req: Request) {
  await dbconnect();

  const { email, otp } = await req.json();

  try {
    const record = await OTPModel.findOne({ email, otp });
    if (!record) {
      return NextResponse.json({ success: false, message: 'Invalid OTP' });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ success: false, message: 'OTP Expired' });
    }

    await OTPModel.deleteMany({ email });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
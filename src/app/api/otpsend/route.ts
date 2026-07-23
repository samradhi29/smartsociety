// app/api/otpsend/route.ts
import { NextResponse } from 'next/server';
import { sendMail } from '@/app/lib/mailer';
import { dbconnect } from '@/app/lib/dbconnect';
import { OTPModel } from '@/model/Otp';

export async function POST(req: Request) {
  await dbconnect();

  const { email, otp } = await req.json();

  try {
    // Save OTP to DB
    await OTPModel.create({ email, otp  });

    await sendMail({
      to: email,
      subject: 'Your OTP Code',
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('OTP Send Error:', err);
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }}
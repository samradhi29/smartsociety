import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// Environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Twilio credentials are missing in .env file.");
}

const client = twilio(accountSid, authToken);

export async function POST(req: NextRequest) {
  try {
    const { contactno }: { contactno?: string } = await req.json();

    if (!contactno || !contactno.startsWith("+")) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }

    // Send OTP via Twilio Verify API
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: contactno,
        channel: "sms",
      });

    console.log("OTP sent to:", contactno, "Verification SID:", verification.sid);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err: any) {
    console.error("ERROR in request-otp:", err?.message || err);
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { contact, method } = await request.json();

    if (!contact || !method) {
      return NextResponse.json(
        { error: "Missing contact or method" },
        { status: 400 }
      );
    }

    // Mock success - in real app would trigger email/SMS provider
    console.log(`[Mock] Resending OTP to ${contact} via ${method}`);

    return NextResponse.json(
      { message: "OTP resent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}

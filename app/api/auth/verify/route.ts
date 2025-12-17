import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      );
    }

    // Mock validation logic
    // Accept any code that is '123456' or for now just accept anything valid format
    // But let's make 000000 fail for testing failure case if needed
    if (code === "000000") {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Verification successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

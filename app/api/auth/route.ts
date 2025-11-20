// src/app/api/auth/route.ts
import { NextResponse } from "next/server";

type Mode = "signin" | "signup";

interface AuthRequest {
  mode: Mode;
  identifier: string; // email or phone
  password: string;
  fullName?: string;
}

interface FieldErrors {
  identifier?: string;
  password?: string;
  fullName?: string;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value: string) {
  return /^\+?[1-9]\d{1,14}$/.test(value.trim());
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AuthRequest;

    const { mode, identifier, password, fullName } = body;

    const fieldErrors: FieldErrors = {};

    if (!identifier || !(isEmail(identifier) || isPhone(identifier))) {
      fieldErrors.identifier = "Enter a valid email or E.164 phone number.";
    }

    if (!password || password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters.";
    }

    if (mode === "signup") {
      if (!fullName || fullName.trim().length < 2) {
        fieldErrors.fullName = "Full name is required.";
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 }
      );
    }

    // ----- Replace this block with real authentication logic -----
    // Mock behavior:
    if (mode === "signin") {
      // For demo: reject a particular combination to illustrate failure
      if (identifier === "blocked@example.com") {
        return NextResponse.json({ error: "Account blocked." }, { status: 403 });
      }

      // success
      const user = {
        id: "user_123",
        identifier,
      };

      return NextResponse.json({ ok: true, user }, { status: 200 });
    } else {
      // signup
      // Example: pretend user exists if a particular identifier used
      if (identifier === "exists@example.com") {
        return NextResponse.json({ error: "User already exists." }, { status: 409 });
      }

      // success: create user (mock)
      const newUser = {
        id: "user_new_456",
        identifier,
        fullName: fullName ?? null,
      };

      return NextResponse.json({ ok: true, user: newUser }, { status: 201 });
    }
    // -------------------------------------------------------------
  } catch (err) {
    console.error("Auth route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

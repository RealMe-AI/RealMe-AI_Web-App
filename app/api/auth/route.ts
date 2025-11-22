// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";

type Mode = "signin" | "signup";

interface AuthRequest {
  mode: Mode;
  identifier: string;
  password: string;
  fullName?: string;
}

interface FieldErrors {
  identifier?: string;
  password?: string;
  fullName?: string;
}

// Validation helpers
function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value: string) {
  return /^\+?[1-9]\d{1,14}$/.test(value.trim());
}

// ✔ Correct Next.js 16 API handler signature
export async function POST(request: NextRequest) {
  // Server i18n (Auth namespace only)
  const t = await getTranslations("Auth");

  try {
    const body = (await request.json()) as AuthRequest;
    const { mode, identifier, password, fullName } = body;

    const fieldErrors: FieldErrors = {};

    // Validate identifier
    if (!identifier || !(isEmail(identifier) || isPhone(identifier))) {
      fieldErrors.identifier =
        mode === "signin"
          ? t("error.sign_in.email_number")
          : t("error.sign_up.email_number");
    }

    // Validate password
    if (!password || (mode === "signup" && password.length < 6)) {
      fieldErrors.password =
        mode === "signin"
          ? t("error.sign_in.password.required")
          : t("error.sign_up.password.min_length");
    }

    // Full name (signup only)
    if (mode === "signup" && (!fullName || fullName.trim().length < 2)) {
      fieldErrors.fullName = t("error.sign_up.full_name.required");
    }

    // Return validation errors if any
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        {
          error: t("auth.authentication_failed"),
          fieldErrors,
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // MOCK AUTH LOGIC (replace later)
    // -----------------------------
    if (mode === "signin") {
      if (identifier === "blocked@example.com") {
        return NextResponse.json(
          { error: t("auth.authentication_failed") },
          { status: 403 }
        );
      }

      const user = { id: "user_123", identifier };
      return NextResponse.json(
        { ok: true, user, message: t("auth.button.success") },
        { status: 200 }
      );
    } else {
      if (identifier === "exists@example.com") {
        return NextResponse.json(
          { error: t("auth.authentication_failed") },
          { status: 409 }
        );
      }

      const newUser = {
        id: "user_new_456",
        identifier,
        fullName: fullName ?? null,
      };

      return NextResponse.json(
        { ok: true, user: newUser, message: t("auth.button.success") },
        { status: 201 }
      );
    }

  } catch (err) {
    console.error("Auth route error:", err);
    return NextResponse.json(
      { error: t("error.network") },
      { status: 500 }
    );
  }
}

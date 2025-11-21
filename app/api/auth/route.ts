// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server"; // server-side i18n

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

// Validation helpers
function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPhone(value: string) {
  return /^\+?[1-9]\d{1,14}$/.test(value.trim());
}

// Server POST handler
export async function POST(
  req: Request,
  context: { params?: Record<string, string>; locale?: string }
) {
  // Get the translator for the "Auth" namespace
  const t = await getTranslations(context.locale);

  try {
    const body = (await req.json()) as AuthRequest;
    const { mode, identifier, password, fullName } = body;

    const fieldErrors: FieldErrors = {};

    // Validate identifier
    if (!identifier || !(isEmail(identifier) || isPhone(identifier))) {
      fieldErrors.identifier =
        mode === "signin" ? t("Auth:error.sign_in.email_number") : t("Auth:error.sign_up.email_number");
    }

    // Validate password
    if (!password || (mode === "signup" && password.length < 6)) {
      fieldErrors.password =
        mode === "signin"
          ? t("Auth:error.sign_in.password.required")
          : t("Auth:error.sign_up.password.min_length");
    }

    // Validate full name on signup
    if (mode === "signup" && (!fullName || fullName.trim().length < 2)) {
      fieldErrors.fullName = t("Auth:error.sign_up.full_name.required");
    }

    // Return validation errors if any
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { error: t("Auth:auth.authentication_failed"), fieldErrors },
        { status: 400 }
      );
    }

    // ----- Mock authentication logic -----
    if (mode === "signin") {
      if (identifier === "blocked@example.com") {
        return NextResponse.json({ error: t("Auth:auth.authentication_failed") }, { status: 403 });
      }

      const user = { id: "user_123", identifier };
      return NextResponse.json({ ok: true, user, message: t("Auth:auth.button.success") }, { status: 200 });
    } else {
      if (identifier === "exists@example.com") {
        return NextResponse.json({ error: t("Auth:auth.authentication_failed") }, { status: 409 });
      }

      const newUser = { id: "user_new_456", identifier, fullName: fullName ?? null };
      return NextResponse.json({ ok: true, user: newUser, message: t("Auth:auth.button.success") }, { status: 201 });
    }
    // --------------------------------------
  } catch (err) {
    console.error("Auth route error:", err);
    return NextResponse.json({ error: t("Auth:error.network") }, { status: 500 });
  }
}

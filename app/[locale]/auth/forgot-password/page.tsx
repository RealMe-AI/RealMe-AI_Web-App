"use client";

import { useRouter } from "@/i18n/routing";
import ForgotPasswordEmail from "../../components/auth/ForgotPasswordEmail";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSendCode = async (email: string) => {
    // TODO: Implement actual API call
    console.log("Sending code to:", email);
    // For now, simulate success and navigate to OTP verification (if that page existed)
    // or just show a success message.
    alert(`Code sent to ${email} (Simulation)`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ForgotPasswordEmail
        onSendCode={handleSendCode}
        onBack={() => router.push("/auth")}
        loading={false}
      />
    </div>
  );
}

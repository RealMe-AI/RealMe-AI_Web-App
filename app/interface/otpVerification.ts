import { RefObject } from "react";

export interface OTPVerificationProps {
  email: string;
  otp: string[];
  otpError: string;
  loading: boolean;
  resendLoading: boolean;
  resendTimer: string | number;
  canResend: boolean;
  expired: boolean;
  timerTextClass: string;
  isOtpComplete: boolean;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

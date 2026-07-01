"use client";

import { useSearchParams } from "next/navigation";
import { ReportForm } from "./ReportForm";

export default function ReportFormPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") as "report_bug" | "suggest_feature" | null;
  return <ReportForm variant={type ?? "report_bug"} />;
}

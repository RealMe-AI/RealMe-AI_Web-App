import type { Metadata } from "next";
// import { PricingPlans } from "./PricingPlans";
import { ComingSoon } from "./ComingSoon";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description:
    "Choose the perfect plan for your needs. Free and Pro options available with multilingual AI support.",
};

export default function PricingPlansPage() {
  return <ComingSoon />;
  // return <PricingPlans />;
}

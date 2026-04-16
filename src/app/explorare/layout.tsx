import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explorare oportunități",
  description: "Caută și filtrează oportunități de voluntariat, evenimente, workshopuri, competiții, tabere și burse pentru tineri.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

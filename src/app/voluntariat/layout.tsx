import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voluntariat",
  description: "Descoperă oportunități de voluntariat în România și Europa pentru tineri 14+. Programe verificate de la ONG-uri și agenții naționale.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

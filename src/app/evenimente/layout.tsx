import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evenimente",
  description: "Evenimente pentru tineri în România: conferințe, festivaluri, întâlniri și activități de dezvoltare personală.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import "../globals.css";
import { SessionWrapper } from "@/components/admin/SessionWrapper";

export const metadata: Metadata = {
  title: "Admin – Nisa&Co",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionWrapper>{children}</SessionWrapper>;
}

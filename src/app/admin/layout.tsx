import type { Metadata } from "next";
import "../globals.css";
import { SessionWrapper } from "@/components/admin/SessionWrapper";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../../messages/en.json";

export const metadata: Metadata = {
  title: "Admin – Nisa&Co",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <SessionWrapper>{children}</SessionWrapper>
    </NextIntlClientProvider>
  );
}

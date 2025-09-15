import type { Metadata } from "next";
import "../globals.css";
import { LayoutWithSidebar } from "../components/ClientProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Todothat - Dashboard",
  description: "Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LayoutWithSidebar>{children}</LayoutWithSidebar>
    </Suspense>
  );
}

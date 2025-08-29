import type { Metadata } from "next";
import "../globals.css"; // relative to app/ folder

export const metadata: Metadata = {
  title: "Todothat – Auth",
  description: "Login or create an account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <main>{children}</main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Voice Note Admin",
  description: "Admin-only Gemini transcription workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

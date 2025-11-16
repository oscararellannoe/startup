import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Life Organizer",
  description: "Planifica tus finanzas, hábitos y prioridades con claridad.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" className="bg-night-900 text-white">
      <body className="min-h-screen bg-transparent text-white antialiased">
        {children}
      </body>
    </html>
  );
}

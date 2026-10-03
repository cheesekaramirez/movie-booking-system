import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CinemaWorld | Book tickets now",
  description: "Find your next movie night and book your seats at CinemaWorld.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import TopNavBar from "@/components/TopNavBar";

export const metadata: Metadata = {
  title: "QuizQuest",
  description: "A gamified Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <TopNavBar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}

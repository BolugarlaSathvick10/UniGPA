import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConsoleFilter } from "@/components/ConsoleFilter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniGPA - Universal SGPA & CGPA Calculator",
  description: "Calculate your SGPA and CGPA with support for multiple grading systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConsoleFilter />
        <ThemeProvider>
          <div className="min-h-screen gradient-bg">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MaterialThemeProvider from "@/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadow Sentinel",
  description: "App created by ingine for staking out factions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MaterialThemeProvider>{children}</MaterialThemeProvider>
      </body>
    </html>
  );
}

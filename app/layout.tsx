import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NGIC Inventory",
  description: "Inventory management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col w-full">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

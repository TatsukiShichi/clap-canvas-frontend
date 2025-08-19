import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MediaTabs from "@/components/MediaTabs";
import ConditionalMediaTabs from '@/components/ConditionalMediaTabs'

export const metadata: Metadata = {
  title: "ClapCanvas",
  description: "自由な取引ができるプラットフォーム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-white flex w-full">
        <Sidebar />
        <div className="flex-1 pt-20 pl-[200px] flex flex-col min-h-screen">
         <Header />
         <ConditionalMediaTabs />
         {children}
        </div>
      </body>
    </html>
  );
}
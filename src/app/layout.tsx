import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Thai } from "next/font/google";
import { Sidebar } from "@/components/organisms/Sidebar";
import { currentUser, navItems } from "@/lib/mock";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
});

export const metadata: Metadata = {
  title: "Master Loan Dashboard",
  description: "Track leads, manage applications, and check your metrics today.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex flex-1">
          <Sidebar navItems={navItems} user={currentUser} />
          <main className="flex-1 space-y-6 bg-surface-muted p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

import type React from "react";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import TokenProvider from "@/providers/TokenProvider";
import NextAuthProvider from "@/providers/NextAuthProvider";
import NuqsProvider from "@/providers/NuqsProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Project Management App",
    template: "%s | Project Management App",
  },
  description:
    "Multi-user project management application for teams to collaborate and manage tasks efficiently",
  keywords: [
    "project management",
    "team collaboration",
    "task management",
    "productivity",
    "kanban",
  ],
  authors: [{ name: "Project Management Team" }],
  creator: "Project Management App",
  metadataBase: new URL("https://project-management-app.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://project-management-app.vercel.app",
    title: "Project Management App",
    description: "Multi-user project management application for teams",
    siteName: "Project Management App",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Management App",
    description: "Multi-user project management application for teams",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <NuqsProvider>
            <NextAuthProvider>
              <TokenProvider>
                <Navbar />
                {children}
              </TokenProvider>
            </NextAuthProvider>
          </NuqsProvider>
        </ReactQueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

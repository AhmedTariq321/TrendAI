import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TrendPilot AI — Grow Faster with AI-Powered Social Media Tools",
  description:
    "Generate captions, hooks, viral ideas, and content plans in seconds. Grow your TikTok, Instagram, YouTube, Facebook, and X with the power of AI.",
  keywords: ["social media", "AI", "content creation", "TikTok", "Instagram", "viral"],
  openGraph: {
    title: "TrendPilot AI",
    description: "Grow Faster with AI-Powered Social Media Tools",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}

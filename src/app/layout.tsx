import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/toast";
import { ThemeProvider } from "@/components/themes";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Agent Wallet — Experience Crypto in Color",
  description:
    "Fun, powerful, and secure wallet. Your Digital World, Under Your Control.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <ToastProvider>
          <ThemeProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

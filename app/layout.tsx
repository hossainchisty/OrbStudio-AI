import {
  ClerkProvider
} from '@clerk/nextjs';
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
});

export const metadata: Metadata = {
  title: "OrbStudio - Imagine. Create. Captivate.",
  description: "Professional AI-powered photography and creative assets generator.",
};

import AppBackground from '@/components/AppBackground';
import { LanguageProvider } from '@/lib/LanguageContext';
import { ThemeProvider } from '@/lib/ThemeContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#881337",
          colorText: "var(--foreground)",
          colorBackground: "var(--background)",
          colorInputBackground: "var(--background)",
          colorInputText: "var(--foreground)",
          borderRadius: "1rem",
        },
        elements: {
          formButtonPrimary:
            "bg-[#881337] hover:bg-[#4c0519] text-sm font-bold py-3.5 rounded-2xl shadow-xl shadow-rose-100 dark:shadow-none uppercase tracking-wider transition-all active:scale-95 border-none",
          card: "shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100/50 dark:border-white/5 rounded-[40px] p-10 bg-white/80 dark:bg-black/20 backdrop-blur-3xl",
          headerTitle: "text-3xl font-black text-slate-900 dark:text-white tracking-tight",
          headerSubtitle: "text-slate-500 dark:text-slate-400 font-medium text-base",
          socialButtonsBlockButton: "rounded-2xl border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all font-bold text-slate-600 dark:text-slate-300 h-12",
          formFieldInput: "rounded-2xl border-slate-100 dark:border-white/5 focus:border-[#881337] focus:ring-4 focus:ring-rose-500/10 transition-all py-3 px-4 text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-black/20 font-medium",
          formFieldLabel: "font-bold text-slate-700 dark:text-slate-300 mb-1.5",
          footerActionLink: "text-[#881337] hover:text-[#4c0519] dark:text-rose-400 dark:hover:text-rose-300 font-bold transition-colors",
          dividerLine: "bg-slate-100 dark:bg-white/5",
          dividerText: "text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${hindSiliguri.variable} antialiased transition-colors duration-300`}>
          <ThemeProvider>
            <LanguageProvider>
              <AppBackground />
              {children}
            </LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

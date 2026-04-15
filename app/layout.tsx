import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "../components/ui/app-shell";
import { Toaster } from "../components/ui/sonner";
import type { ReactNode } from "react";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { ui } from '@clerk/ui'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Finance tracker",
  description: "One stop Finance Platform",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return ( 
    <ClerkProvider
      ui={ui}
      appearance={{
        options: {
          logoImageUrl: "https://res.cloudinary.com/dugygdmtz/image/upload/v1751709885/Screenshot_2025-07-05_153429_f1idjd.png",
          socialButtonsVariant: "iconButton",
          logoPlacement: "inside",
        },
        variables: {
          colorPrimary: "#6366f1",
          colorForeground: "#ffffff",
          colorMutedForeground: "#94a3b8",
          colorBackground: "#0f172a",
          colorInput: "#1e293b",
          colorInputForeground: "#ffffff",
          borderRadius: "0.75rem",
          fontFamily: "inherit",
        },
        elements: {
          card: "bg-slate-900/90 backdrop-blur-xl shadow-2xl border border-white/10 rounded-2xl",
          headerTitle: "text-2xl font-bold tracking-tight text-white",
          headerSubtitle: "text-sm text-slate-400",
          socialButtonsBlockButton: "border border-white/10 bg-slate-800 hover:bg-slate-700 transition-all text-white",
          formButtonPrimary: "bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-sm font-medium py-2.5",
          formFieldInput: "bg-slate-800 border-white/10 text-white focus:border-indigo-500 transition-all",
          footerAction: "bg-slate-900/50 rounded-b-2xl border-t border-white/5 pb-4",
          watermark: "hidden"
        }
      }}
    >

    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo-sm.png" sizes="any" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30`}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster richColors theme="dark" />
      </body>
    </html>
     </ClerkProvider>
  );
}

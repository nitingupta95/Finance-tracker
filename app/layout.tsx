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
          colorPrimary: "#2563eb",
          colorForeground: "#ffffff",
          colorMutedForeground: "#64748b",
          colorBackground: "#020617",
          colorInput: "#0f172a",
          colorInputForeground: "#ffffff",
          borderRadius: "1rem",
          fontFamily: "inherit",
        },
        elements: {
          card: "bg-slate-900 border border-white/10 shadow-2xl rounded-3xl",
          headerTitle: "text-2xl font-bold tracking-tight text-white",
          headerSubtitle: "text-[10px] font-bold text-slate-500",
          socialButtonsBlockButton: "border border-white/10 bg-slate-950 hover:bg-slate-900 transition-all text-white rounded-2xl",
          formButtonPrimary: "bg-blue-600 text-white hover:bg-blue-500 transition-all text-sm font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/10",
          formFieldLabel: "text-[10px] font-bold text-slate-500 mb-1",
          formFieldInput: "bg-slate-950 border-white/20 text-white focus:border-blue-500 transition-all rounded-xl py-3 px-4",
          footerAction: "bg-slate-950/50 rounded-b-3xl border-t border-white/10 py-6",
          footerActionText: "text-slate-500 font-bold text-sm",
          footerActionLink: "text-blue-500 hover:text-blue-400 font-bold text-sm ml-1",
          userButtonPopoverCard: "bg-slate-900 border border-white/10 shadow-2xl rounded-3xl",
          userButtonPopoverActionButton: "hover:bg-white/5 transition-all text-slate-100",
          userButtonPopoverActionButtonText: "text-slate-100 font-bold text-sm",
          userButtonPopoverActionButtonIcon: "text-blue-500",
          userButtonPopoverHeaderTitle: "text-white font-bold text-sm tracking-tight",
          userButtonPopoverHeaderSubtitle: "text-slate-500 text-[10px] font-bold",
          userButtonPopoverFooter: "hidden",
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

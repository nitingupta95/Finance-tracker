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
          colorPrimary: "#000000",
          colorForeground: "#111827",
          colorMutedForeground: "#6B7280",
          colorBackground: "#ffffff",
          colorInput: "#ffffff",
          colorInputForeground: "#111827",
          borderRadius: "0.75rem",
          fontFamily: "inherit",
        },
        elements: {
          card: "bg-white/80 backdrop-blur-xl shadow-2xl border border-gray-100 rounded-2xl ring-1 ring-gray-900/5",
          headerTitle: "text-2xl font-bold tracking-tight text-gray-900",
          headerSubtitle: "text-sm text-gray-500",
          socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 transition-all",
          formButtonPrimary: "bg-black text-white hover:bg-black/90 transition-all text-sm font-medium py-2.5",
          formFieldInput: "rounded-lg border-gray-200 focus:border-black focus:ring-black transition-all",
          footerAction: "bg-gray-50/50 rounded-b-2xl border-t border-gray-100/50 pb-4",
          watermark: "hidden"
        }
      }}
    >

    <html lang="en">
      <head>
        <link rel="icon" href="/logo-sm.png" sizes="any" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AppShell>
          {children}
        </AppShell>
        <Toaster richColors />
      </body>
    </html>
     </ClerkProvider>
  );
}

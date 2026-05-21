import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Cpu, HelpCircle, UserCheck } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AntiGravity Core | AI Service Orchestration Platform",
  description: "A futuristic AI booking platform for informal economy services with conversational agent orchestration and cyberpunk dashboard UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#060813] text-slate-100 flex flex-col font-sans relative">
        {/* Background Grids & Ambient Glows */}
        <div className="absolute inset-0 dot-grid pointer-events-none z-0" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] glow-overlay-cyan pointer-events-none z-0" />
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] glow-overlay-purple pointer-events-none z-0" />

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-cyan-950/80 border border-cyan-500/50 rounded-lg text-cyan-400 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-mono font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-500">
                ANTIGRAVITY CORE
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
              <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              <Link href="/assistant" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> AI Assistant
              </Link>
              <Link href="/providers" className="hover:text-pink-400 transition-colors">Find Providers</Link>
              <Link href="/dashboard" className="hover:text-lime-400 transition-colors">My Bookings</Link>
              <Link href="/admin/analytics" className="hover:text-indigo-400 transition-colors">Analytics</Link>
            </nav>

            {/* Status indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
                Agent Online
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow z-10 flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="z-10 border-t border-slate-900 bg-slate-950/20 py-6 text-center text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} AntiGravity Orchestration. Challenge Node 2. Built with Next.js 15 & Tailwind.</p>
        </footer>
      </body>
    </html>
  );
}

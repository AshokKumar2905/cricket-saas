import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Trophy } from "lucide-react";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cricket SaaS Multi-Tenant Engine",
  description: "Enterprise sports analytics and live scoring dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${geist.className} bg-[#020617] text-slate-100 antialiased min-h-screen flex flex-col relative overflow-x-hidden`}>
        {/* Navigation Layer Header */}
        <header className="bg-[#0a1128]/80 border-b border-blue-950/60 sticky top-0 z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-950 to-emerald-500/20 border border-blue-900/40 group-hover:border-emerald-500/30 transition-colors">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tighter text-white uppercase block leading-none">Cricket SaaS</span>
                <span className="text-[10px] text-emerald-500/60 font-mono tracking-widest uppercase mt-1 block font-bold">Engine Workspace</span>
              </div>
            </Link>

            <nav className="flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/blogs" className="hover:text-white transition-colors">Analytics Feed</Link>
              <Link href="/app" className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-sans font-black tracking-normal hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10">
                Console App
              </Link>
            </nav>
          </div>
        </header>

        {/* Dynamic Route View Mount */}
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-slate-950 py-6 border-t border-blue-950 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          © 2026 CRICKET SAAS OPERATIONAL ENGINE. MATCHING ATHLETIC PORTAL CORE GRAPHIC INTERFACE LAYOUT.
        </footer>
      </body>
    </html>
  );
}
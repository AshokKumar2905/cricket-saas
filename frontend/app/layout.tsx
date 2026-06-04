import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { Trophy, Radio } from "lucide-react";
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
      <body 
        id="theme-root-mount"
        className={`${geist.className} text-slate-100 antialiased min-h-screen flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950`}
      >
        {/* GLOBAL FIXED STADIUM BACKDROP LAYER */}
        <div className="fixed inset-0 w-full h-full min-h-screen z-0 pointer-events-none overflow-hidden">
          {/* Base Cricket Stadium High-Contrast Image Layer */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-[0.25] mix-blend-screen scale-105"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=2000')` 
            }}
          />
          {/* Deep Premium Staggered Gradient Mask for Perfect Component Contrast */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#030712]/95 via-[#0b1536]/85 to-[#030712]/98 backdrop-blur-[2px]" />
        </div>

        {/* Global Navigation Header Bar Layer */}
        <header className="bg-[#04091e]/70 border-b border-blue-900/30 sticky top-0 z-50 backdrop-blur-md shadow-lg shadow-black/20 relative w-full">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <Link href="/" className="flex items-center gap-3 group relative z-10">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-950 to-emerald-500/10 border border-blue-900/40 group-hover:border-emerald-500/30 transition-colors shadow-inner">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tighter text-white uppercase block leading-none">
                  Cricket <span className="text-emerald-400 font-light">SaaS</span>
                </span>
                <span className="text-[10px] text-emerald-500/60 font-mono tracking-widest uppercase mt-1.5 block font-bold flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" /> Engine Workspace
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 relative z-10">
              <Link href="/#features" className="hover:text-emerald-400 transition-colors">Features</Link>
              <Link href="/blogs" className="hover:text-emerald-400 transition-colors">Analytics Feed</Link>
              <Link 
                href="/app" 
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-sans font-black tracking-wider text-[11px] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                Console App
              </Link>
            </nav>
            
          </div>
        </header>

        {/* Dynamic Sub-Route View Content Mount Container */}
        <main className="flex-1 flex flex-col w-full relative z-10 bg-transparent">
          {children}
        </main>

        {/* Premium Integrated Footer Layout Element */}
        <footer className="w-full bg-[#02050f]/80 py-6 border-t border-blue-950/60 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest relative z-10 backdrop-blur-sm">
          © 2026 CRICKET SAAS OPERATIONAL ENGINE. MATCHING ATHLETIC PORTAL CORE GRAPHIC INTERFACE LAYOUT.
        </footer>
      </body>
    </html>
  );
}
"use client";

import { motion } from "framer-motion";
import { Radio, Shield, Target, ChevronRight, Activity, Layers } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="w-full bg-[#020617] relative overflow-x-hidden flex-1 flex flex-col">
      {/* Mesh Highlight Background Ambient Overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.15),rgba(0,0,0,0))] pointer-events-none" />

      {/* Hero Presentation Layout Section */}
      <section className="relative pt-20 pb-16 px-6 flex flex-col items-center justify-center text-center border-b border-blue-950/40">
        <div className="max-w-4xl mx-auto z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] tracking-widest px-3 py-1 rounded-full border border-emerald-500/20 uppercase mb-6 shadow-md"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry Broadcast Engine
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none mb-6"
          >
            CRICKET SYSTEMS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 font-light">OPERATOR CONSOLE</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-medium leading-relaxed mb-10"
          >
            Deploy standalone tournament variables, configure multi-tenant team registries, and stream delivery-by-delivery micro-metrics directly to responsive database pipelines.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/app" className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 font-black px-8 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5">
              Launch Workspace App <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/blogs" className="w-full sm:w-auto h-12 inline-flex items-center justify-center gap-2 bg-slate-900 text-slate-300 border border-blue-950 px-8 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-all font-bold">
              Explore Analytics Feed
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Structured Core Bento Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="mb-12 border-l-2 border-emerald-500 pl-4">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400 block">Performance Matrix</span>
          <h2 className="text-xl font-black text-white uppercase mt-1">High-Fidelity Engine Operations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Large Visual Feature Block */}
          <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-slate-900 to-[#0a1128]/40 border border-blue-950/60 p-8 flex flex-col justify-between min-h-[350px] relative overflow-hidden group shadow-xl">
            <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-luminosity group-hover:opacity-20 group-hover:scale-102 transition-all duration-700" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200')` }} />
            <div className="relative z-10">
              <div className="p-3 bg-emerald-500/10 rounded-xl w-fit border border-emerald-500/20 mb-6">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-black uppercase text-white mb-2 tracking-tight">Real-Time Ingestion Console</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">Precision math loops parsing economy tracks, sequential run increments, and fall-of-wicket telemetry variables seamlessly without pipeline blocking delays.</p>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 tracking-wider uppercase relative z-10 bg-slate-950/60 w-fit px-3 py-1 rounded border border-blue-950/40">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Core Stream Engine Online
            </div>
          </div>

          {/* Side Small Feature Card 1 */}
          <div className="rounded-3xl bg-[#0a1128]/40 border border-blue-950/60 p-6 flex flex-col justify-between hover:border-blue-900/60 transition-all group shadow-md">
            <div className="p-3 bg-blue-950/50 border border-blue-900/30 rounded-xl w-fit text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-slate-200 mb-1">Isolated Multi-Tenancy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Strict schema container bounds ensuring full separation of team registries, operator profiles, and schedule grids across individual nodes.</p>
            </div>
          </div>

          {/* Side Small Feature Card 2 */}
          <div className="rounded-3xl bg-[#0a1128]/40 border border-blue-950/60 p-6 flex flex-col justify-between hover:border-blue-900/60 transition-all group shadow-md">
            <div className="p-3 bg-blue-950/50 border border-blue-900/30 rounded-xl w-fit text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-slate-200 mb-1">Dynamic Schema Pipelines</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Automated relational mapping that configures leagues dynamically, safely binding athlete metadata to live scores.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
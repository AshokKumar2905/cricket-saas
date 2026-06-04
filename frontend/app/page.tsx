"use client";

import { motion } from "framer-motion";
import { 
  Radio, 
  Target, 
  ChevronRight, 
  Activity, 
  Layers, 
  Trophy, 
  Users, 
  TrendingUp, 
  Sparkles,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  // Enhanced Framer Motion Variants for Broadcast-Quality Entrances
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="w-full relative overflow-x-hidden flex-1 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 bg-transparent">
      
      {/* Hero Presentation Layout Section */}
      <section className="relative pt-24 pb-16 px-6 flex flex-col items-center justify-center text-center border-b border-blue-950/30 z-10 bg-transparent">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto flex flex-col items-center"
        >
          {/* Live Badge Ticker */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 font-extrabold text-[11px] tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase mb-8 shadow-lg backdrop-blur-md"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Live Telemetry Broadcast Engine
          </motion.div>

          {/* Premium High-Contrast Typography Stack */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.95] mb-6 drop-shadow-2xl"
          >
            CRICKET SYSTEMS <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 font-light tracking-normal">
              OPERATOR CONSOLE
            </span>
          </motion.h1>

          {/* Responsive Layout Subtext */}
          <motion.p 
            variants={itemVariants}
            className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed mb-12 drop-shadow"
          >
            Deploy standalone tournament variables, configure multi-tenant team registries, and stream delivery-by-delivery micro-metrics directly to responsive database pipelines.
          </motion.p>

          {/* Action Call Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-4"
          >
            <Link 
              href="/app" 
              className="w-full sm:w-auto h-14 inline-flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 font-black px-10 rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 active:scale-95"
            >
              Launch Workspace App <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <Link 
              href="/blogs" 
              className="w-full sm:w-auto h-14 inline-flex items-center justify-center gap-2 bg-slate-900/90 text-slate-300 border border-slate-800 px-10 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all font-bold backdrop-blur"
            >
              Explore Analytics Feed
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Real-Time Live Matrix Overview Row */}
      <section className="relative z-10 max-w-7xl mx-auto w-full px-6 -mt-8 mb-12 bg-transparent">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gradient-to-r from-[#0b132b]/90 to-[#0f172a]/90 backdrop-blur-md border border-blue-900/30 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left shadow-2xl"
        >
          <div className="flex items-center gap-3.5 justify-center sm:justify-start px-4 border-b sm:border-b-0 sm:border-r border-blue-950/50 pb-4 sm:pb-0">
            <Trophy className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Tenant Clusters</p>
              <p className="text-sm font-bold text-white">Multi-League Systems</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 justify-center sm:justify-start px-4 border-b sm:border-b-0 sm:border-r border-blue-950/50 pb-4 sm:pb-0">
            <Users className="w-5 h-5 text-teal-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">ORM Integration</p>
              <p className="text-sm font-bold text-white">Cascading Roster Pools</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 justify-center sm:justify-start px-4">
            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Data Stream</p>
              <p className="text-sm font-bold text-white">Async Live Ingestion</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Structured Core Bento Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-12 w-full relative z-10 flex-1 bg-transparent">
        <div className="mb-12 border-l-4 border-emerald-500 pl-4">
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-400 block">Performance Matrix</span>
          <h2 className="text-2xl font-black text-white uppercase mt-1 tracking-tight">High-Fidelity Engine Operations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-transparent">
          
          {/* Main Large Visual Feature Block */}
          <motion.div 
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="md:col-span-2 md:row-span-2 rounded-3xl bg-gradient-to-br from-[#0b1536]/80 to-[#070d1f]/90 border border-blue-900/40 p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden group shadow-2xl backdrop-blur-sm"
          >
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all" />

            <div className="relative z-10">
              <div className="p-3 bg-emerald-500/10 rounded-xl w-fit border border-emerald-500/20 mb-8 shadow-inner">
                <Target className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white mb-3 tracking-tight">Real-Time Ingestion Console</h3>
              <p className="text-sm text-slate-300 max-w-sm leading-relaxed">Precision math loops parsing economy tracks, sequential run increments, and fall-of-wicket telemetry variables seamlessly without pipeline blocking delays.</p>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 tracking-wider uppercase relative z-10 bg-slate-950/80 w-fit px-4 py-2 rounded-xl border border-blue-900/40 shadow-lg mt-6">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Core Stream Engine Online
            </div>
          </motion.div>

          {/* Side Small Feature Card 1 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-[#0b1536]/50 backdrop-blur-sm border border-blue-900/30 p-6 flex flex-col justify-between hover:border-blue-800/50 transition-all group shadow-xl"
          >
            <div className="p-3 bg-blue-950/60 border border-blue-900/40 rounded-xl w-fit text-emerald-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div className="mt-6">
              <h3 className="text-base font-black uppercase text-slate-200 mb-1.5 tracking-tight flex items-center gap-1.5">
                Isolated Multi-Tenancy <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-slate-350 leading-relaxed">Strict schema container bounds ensuring full separation of team registries, operator profiles, and schedule grids across individual nodes.</p>
            </div>
          </motion.div>

          {/* Side Small Feature Card 2 */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="rounded-3xl bg-[#0b1536]/50 backdrop-blur-sm border border-blue-900/30 p-6 flex flex-col justify-between hover:border-blue-800/50 transition-all group shadow-xl"
          >
            <div className="p-3 bg-blue-950/60 border border-blue-900/40 rounded-xl w-fit text-emerald-400 shadow-inner">
              <Layers className="w-5 h-5" />
            </div>
            <div className="mt-6">
              <h3 className="text-base font-black uppercase text-slate-200 mb-1.5 tracking-tight flex items-center gap-1.5">
                Dynamic Schema Pipelines <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-xs text-slate-350 leading-relaxed">Automated relational mapping that configures leagues dynamically, safely binding athlete metadata to live scores.</p>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
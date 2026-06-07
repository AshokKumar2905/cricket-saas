"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, Clock, Activity, Server, Sparkles, ChevronRight, 
  TrendingUp, BarChart3, Hash, Layers, LayoutGrid 
} from "lucide-react";

export default function BlogsOverviewGrid() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Network response failed");
        return res.json();
      })
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data pool connection failure:", err);
        setLoading(false);
      });
  }, []);

  // Split calculations for professional content hierarchy layout
  const featuredBlog = blogs[0];
  const underlyingGridBlogs = blogs.slice(1);

  return (
    <div className="w-full relative overflow-x-hidden min-h-screen flex flex-col flex-1 bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950">
      
      {/* 🏟️ PERMANENT GLOBAL BACKGROUND CONTAINER LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-zinc-950">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop" 
          alt="Cricket Arena Field Backdrop" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950/95" />
      </div>

      {/* Immersive Sports Network Ambient Lighting Overlays and Dot Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.15),rgba(0,0,0,0))] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 py-12 w-full relative z-10 flex-1 flex flex-col bg-transparent space-y-8">
        
        {/* Knowledge Base Header Bar Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div className="border-l-4 border-emerald-500 pl-4">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Knowledge Repository
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
              Cricket Engineering Insights
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl font-medium">
              Technical reporting on high-throughput database design, live score math telemetry, and performance algorithms.
            </p>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-400 font-bold bg-zinc-900/80 border border-zinc-800/80 px-3 py-2 rounded-xl w-fit h-fit shadow-md">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> INGESTION NODE: ACTIVE
          </div>
        </div>

        {loading ? (
          /* LOADING FEED STATE CONTROLLER */
          <div className="flex-1 flex flex-col items-center justify-center py-32 gap-3 bg-transparent">
            <Activity className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest font-bold">
              Parsing Ingestion Content Pools...
            </span>
          </div>
        ) : blogs.length === 0 ? (
          /* EMPTY DATA FEED LAYER */
          <div className="p-16 text-center border border-dashed border-zinc-800 bg-zinc-900/20 backdrop-blur-sm rounded-3xl text-xs font-mono text-zinc-500 uppercase tracking-wider my-auto shadow-2xl">
            No live articles deployed in the system content container.
          </div>
        ) : (
          <>
            {/* 🚀 ADVANCED UI ELEMENT 1: EXECUTIVE FEATURED HEADLINE BANNER */}
            {featuredBlog && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                <div className="lg:col-span-7 relative h-56 sm:h-72 lg:h-[340px] w-full bg-zinc-950">
                  <img 
                    src={featuredBlog.image_url} 
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1540747737956-3787273ac287?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950/80 via-zinc-950/10 to-transparent pointer-events-none" />
                  <span className="absolute top-4 left-4 text-[9px] font-mono font-black tracking-wider uppercase bg-zinc-900 border border-zinc-700 text-emerald-400 px-2.5 py-1 rounded-md shadow">
                    LATEST BRIEFING
                  </span>
                </div>

                <div className="lg:col-span-5 p-6 lg:pr-8 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono uppercase font-bold">
                    <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800/60 rounded text-teal-400">{featuredBlog.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredBlog.read_time || "5 Min"}</span>
                  </div>
                  <h2 className="text-xl font-black uppercase text-white tracking-tight leading-snug">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-xs text-zinc-300 leading-relaxed font-medium line-clamp-3">
                    {featuredBlog.summary}
                  </p>
                  <div className="pt-2">
                    <Link 
                      href={`/blogs/${featuredBlog.id}`}
                      className="inline-flex py-2 px-4 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/30 rounded-xl font-mono font-bold uppercase tracking-wider text-[10px] text-zinc-300 hover:text-emerald-400 items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      Analyze Report <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 🚀 ADVANCED UI ELEMENT 2: SPLIT LAYOUT MEDIA GRID & CHANNEL SIDEBAR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              
              {/* PRIMARY CONTENT FEED CONTAINER (8 Columns) */}
              <div className="lg:col-span-8 space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase block flex items-center gap-1.5 mb-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-zinc-600" /> Compiled Analytics Stream
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-transparent">
                  {(underlyingGridBlogs.length > 0 ? underlyingGridBlogs : blogs).map((article, idx) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      whileHover={{ y: -3 }}
                      className="bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-800/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl group backdrop-blur-md transition-all duration-300 h-[380px]"
                    >
                      <div>
                        <div className="w-full aspect-[16/10] relative overflow-hidden bg-zinc-950 border-b border-zinc-800/60">
                          <img 
                            src={article.image_url} 
                            alt={article.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-103 transition-transform duration-500 group-hover:opacity-95"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1540747737956-3787273ac287?auto=format&fit=crop&q=80&w=800";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent pointer-events-none" />
                          <span className="absolute top-3 left-3 text-[8px] font-mono font-bold uppercase bg-zinc-900/90 border border-zinc-700 rounded text-emerald-400 px-2 py-0.5 shadow-md">
                            {article.category}
                          </span>
                        </div>

                        <div className="p-5 space-y-2">
                          <div className="text-[9px] font-mono text-zinc-500 uppercase font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {article.read_time || "6 Min Read"}
                          </div>
                          <h3 className="text-sm font-black uppercase text-white tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-[11px] text-zinc-300 leading-relaxed line-clamp-3 font-medium">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-5 pt-0">
                        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                          <Link 
                            href={`/blogs/${article.id}`} 
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 group-hover:text-emerald-400 flex items-center gap-1 transition-colors"
                          >
                            Analyze Protocol Report <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400/0 group-hover:opacity-100 group-hover:text-amber-400/80 transition-all duration-300 transform group-hover:rotate-12 pointer-events-none" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* TECHNICAL METRICS & SYSTEM METADATA SIDEBAR (4 Columns) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Status Panel */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-3xl backdrop-blur-md shadow-2xl space-y-4">
                  <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Platform Metrics Log
                  </span>
                  <div className="space-y-3 text-xs font-mono font-bold">
                    <div className="flex justify-between items-center p-2.5 bg-zinc-950 border border-zinc-800/60 rounded-xl">
                      <span className="text-zinc-500 uppercase tracking-wide flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-zinc-600" /> Database Nodes</span>
                      <span className="text-white">Clustered</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-zinc-950 border border-zinc-800/60 rounded-xl">
                      <span className="text-zinc-500 uppercase tracking-wide flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500/50" /> Sync Rate Efficiency</span>
                      <span className="text-emerald-400">99.4%</span>
                    </div>
                  </div>
                </div>

                {/* Trending Tags Module */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-3xl backdrop-blur-md shadow-2xl space-y-3">
                  <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-teal-400" /> Trending Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["#T20Telemetry", "#Aerodynamics", "#PostgresUUID", "#Nextjs15", "#SaaSScores"].map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800/60 text-zinc-400 hover:text-white rounded-lg text-[10px] font-mono transition-colors cursor-pointer shadow-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
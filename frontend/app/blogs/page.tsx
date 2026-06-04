"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; // ✅ Fixed import route
import { BookOpen, Clock, Activity, Server, Sparkles } from "lucide-react";

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

  return (
    <div className="w-full relative overflow-x-hidden min-h-screen flex flex-col flex-1 bg-transparent">
      {/* Immersive Sports Network Ambient Lighting Overlays and Dot Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.15),rgba(0,0,0,0))] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 py-16 w-full relative z-10 flex-1 flex flex-col bg-transparent">
        {/* Knowledge Base Header Bar Block */}
        <div className="mb-12 border-l-4 border-emerald-500 pl-4">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Knowledge Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
            Cricket Engineering Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
            Technical reporting on high-throughput database design, live score math telemetry, and performance algorithms.
          </p>
        </div>

        {loading ? (
          /* LOADING FEED STATE CONTROLLER */
          <div className="flex-1 flex flex-col items-center justify-center py-24 gap-3 bg-transparent">
            <Activity className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Parsing Ingestion Content Pools...
            </span>
          </div>
        ) : blogs.length === 0 ? (
          /* EMPTY DATA FEED LAYER */
          <div className="p-16 text-center border border-dashed border-blue-900/40 bg-[#0b1536]/10 backdrop-blur-sm rounded-3xl text-xs font-mono text-slate-500 uppercase tracking-wider my-auto">
            No live articles deployed in the system content container.
          </div>
        ) : (
          /* ACTIVE ARTICLE RENDER GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-transparent">
            {blogs.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-[#0b1536]/80 to-[#070d1f]/90 border border-blue-900/40 rounded-3xl overflow-hidden flex flex-col justify-between shadow-2xl group backdrop-blur-sm"
              >
                <div>
                  {/* Media Card Preview Window */}
                  <div className="w-full aspect-[16/10] relative overflow-hidden bg-slate-950 border-b border-blue-950/40">
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500 group-hover:opacity-70" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 text-[9px] font-mono font-black uppercase bg-emerald-500 text-zinc-950 px-2.5 py-1 rounded-md shadow-lg tracking-widest">
                      {article.category}
                    </span>
                  </div>

                  {/* Card Meta Content Info */}
                  <div className="p-6">
                    <div className="flex gap-4 items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400/80" /> {article.read_time || "6 Min Read"}
                      </span>
                    </div>
                    <h2 className="text-base font-black uppercase text-white tracking-tight group-hover:text-emerald-400 transition-colors mb-2.5 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-medium">
                      {article.summary}
                    </p>
                  </div>
                </div>
                
                {/* Action Link Footer Block */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between">
                    <Link 
                      href={`/blogs/${article.id}`} 
                      className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
                    >
                      Analyze Protocol Report <BookOpen className="w-3.5 h-3.5" />
                    </Link>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400/0 group-hover:opacity-100 group-hover:text-amber-400/80 transition-all duration-300 transform group-hover:rotate-12" />
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
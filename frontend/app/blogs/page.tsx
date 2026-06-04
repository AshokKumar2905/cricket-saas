"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, Layers } from "lucide-react";

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
    <div className="w-full bg-[#020617] relative overflow-x-hidden min-h-screen flex flex-col flex-1">
      {/* Immersive Sports Network Ambient Lighting Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.12),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-16 w-full relative z-10 flex-1 flex flex-col">
        <div className="mb-12 border-l-2 border-emerald-500 pl-4">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">Knowledge Repository</span>
          <h1 className="text-2xl font-black uppercase text-white tracking-tight mt-0.5">Cricket Engineering Insights</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-md">Technical reporting on high-throughput database design, live score math telemetry, and performance algorithms.</p>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-xs font-mono text-slate-500 uppercase tracking-widest py-24">
            Parsing Ingestion Content Pools...
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-blue-950 rounded-2xl text-xs font-mono text-slate-500 uppercase tracking-wider my-auto">
            No live articles deployed in the system content container.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-[#0a1128]/40 border border-blue-950/60 rounded-2xl overflow-hidden flex flex-col hover:border-blue-900 transition-all group shadow-xl backdrop-blur-md"
              >
                {/* Media Card Preview Window */}
                <div className="w-full aspect-[16/10] relative overflow-hidden bg-slate-950 border-b border-blue-950/40">
                  <img 
                    src={article.image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-102 transition-transform duration-500 group-hover:opacity-75" 
                  />
                  <span className="absolute top-4 left-4 text-[9px] font-mono font-black uppercase bg-emerald-500 text-zinc-950 px-2.5 py-1 rounded shadow-md">
                    {article.category}
                  </span>
                </div>

                {/* Card Meta Content Info */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex gap-4 items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2.5">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500/80" /> {article.read_time || "6 Min Read"}</span>
                    </div>
                    <h2 className="text-base font-black uppercase text-white tracking-tight group-hover:text-emerald-400 transition-colors mb-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-medium">{article.summary}</p>
                  </div>
                  
                  <Link href={`/blogs/${article.id}`} className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 group-hover:text-emerald-300 group-hover:underline w-fit">
                    Analyze Protocol Report <BookOpen className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
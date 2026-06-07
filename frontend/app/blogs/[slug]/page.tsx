"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Layers, Activity, BookOpen, Share2, Tag, Calendar, User, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DetailedBlogPostReader() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [suggestedArticles, setSuggestedArticles] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Network response failed");
        return res.json();
      })
      .then((data) => {
        const matchedPost = data.find((item: any) => item.id.toString() === params.slug);
        setBlog(matchedPost || null);
        // Exclude current article from recommendations feed
        const recommendations = data.filter((item: any) => item.id.toString() !== params.slug).slice(0, 2);
        setSuggestedArticles(recommendations);
        setLoading(false);
      })
      .catch((err) => {
        console.error("CMS record query connection error:", err);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest bg-zinc-950">
        <Activity className="w-6 h-6 text-emerald-400 animate-spin" />
        Parsing Core Document Content...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10 bg-zinc-950 text-zinc-100">
        <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-zinc-950">
          <img 
            src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop" 
            alt="Cricket Field Arena" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-20 select-none"
          />
          <div className="absolute inset-0 bg-zinc-950/95" />
        </div>

        <div className="relative z-10 space-y-4">
          <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl uppercase tracking-widest">
            Error Code: 404_NOT_FOUND
          </span>
          <h2 className="text-xl font-black uppercase text-zinc-300 tracking-tight">
            Specified Analytics Resource Missing
          </h2>
          <button 
            onClick={() => router.push("/blogs")} 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-400 bg-zinc-900 border border-zinc-800 px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Analytics Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden p-4 py-8 sm:p-8 lg:py-12">
      
      {/* 🏟️ PERMANENT GLOBAL BACKGROUND CONTAINER LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-zinc-950">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop" 
          alt="Cricket Arena Field Backdrop" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950/95" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex-1">
        
        {/* Navigation Return Header Row */}
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={() => router.push("/blogs")} 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-400 uppercase tracking-wider transition-all bg-zinc-900/80 border border-zinc-800 px-4 py-2.5 rounded-xl backdrop-blur shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" /> Return to Index Feed
          </button>
          
          <button className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer shadow">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* 📊 ADVANCED SPLIT HIGH-DENSITY MAGAZINE GRID SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: MAIN TECHNICAL COMPILING READING PORT (8 Columns) */}
          <motion.article 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Article Banner Display with Balanced Shading */}
            <div className="w-full aspect-[16/7] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl relative group">
              <img 
                src={blog.image_url} 
                alt={blog.title} 
                className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-102" 
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1540747737956-3787273ac287?auto=format&fit=crop&q=80&w=1200";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
            </div>

            {/* Title & Metadata Header Container */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center text-[10px] font-mono uppercase tracking-wider">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black tracking-widest shadow-sm">
                  {blog.category}
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300 font-bold bg-zinc-900 border border-zinc-800/80 px-3 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" /> {blog.read_time || "5 Min Read"}
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-zinc-400 bg-zinc-900/40 border border-zinc-800/40 px-3 py-1 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" /> June 2026
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-[1.1] drop-shadow-md">
                {blog.title}
              </h1>
            </div>

            {/* Core Body Content Blocks */}
            <div className="text-sm sm:text-base text-zinc-200 leading-relaxed space-y-6 border-t border-zinc-800/80 pt-6 font-medium bg-transparent">
              
              {/* Highlighted Executive Abstract Callout Panel */}
              <p className="text-zinc-200 bg-zinc-900/40 border border-zinc-800/80 border-l-4 border-l-emerald-400 italic text-sm sm:text-base p-5 rounded-r-2xl max-w-full leading-relaxed backdrop-blur-sm shadow-xl">
                {blog.summary}
              </p>
              
              {/* Primary Content Stream Text */}
              <p className="text-zinc-300 font-normal leading-relaxed text-sm sm:text-base antialiased tracking-wide">
                {blog.content || "This enterprise logging container parses telemetry metrics directly across decentralized system data blocks securely, maximizing application operational data processing pipelines."}
              </p>

              <p className="text-zinc-300 font-normal leading-relaxed text-sm sm:text-base antialiased tracking-wide">
                By migrating historical score profiles away from paper documents into unified schema maps, the platform ensures rapid computational throughput on analytics aggregations, preventing system lag during core live traffic feeds.
              </p>
              
              {/* Footer Signature Element */}
              <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest pt-12 flex items-center gap-2 border-t border-zinc-800/60">
                <Layers className="w-4 h-4 text-emerald-400 animate-pulse" /> End of Compiled Analytical Report Document.
              </p>
            </div>
          </motion.article>

          {/* RIGHT AREA: TECHNICAL DISCOVERABILITY METRICS SIDEBAR (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sidebar Block 1: Editorial Author Identity Profile */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-3xl backdrop-blur-md shadow-2xl space-y-4">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Document Author
              </span>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-emerald-400 font-bold font-mono shadow-inner text-sm">
                  GS
                </div>
                <div>
                  <span className="text-xs font-black text-white uppercase block tracking-wide">GullyScores Core</span>
                  <span className="text-[9px] font-mono text-zinc-400 block uppercase mt-0.5 font-bold">Analytics Division</span>
                </div>
              </div>
            </div>

            {/* Sidebar Block 2: High-Density Recommended Article Tracks */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-3xl backdrop-blur-md shadow-2xl space-y-4">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Suggested Technical Logs
              </span>
              
              <div className="space-y-3">
                {suggestedArticles.length === 0 ? (
                  <span className="text-xs text-zinc-500 font-medium">No ancillary reports compiled inside this indexing cluster.</span>
                ) : (
                  suggestedArticles.map(article => (
                    <Link 
                      href={`/blogs/${article.id}`} 
                      key={article.id} 
                      className="block p-3 bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-800/60 hover:border-zinc-700 rounded-2xl transition-all group cursor-pointer shadow"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                          {article.category}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 font-medium">
                          {article.read_time}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-tight mt-2 line-clamp-1 group-hover:text-white transition-colors">
                        {article.title}
                      </h4>
                      <div className="text-[10px] font-mono text-emerald-500/80 group-hover:text-emerald-400 mt-2 flex items-center gap-0.5 tracking-wider font-bold uppercase transition-colors">
                        Read Log <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Layers, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DetailedBlogPostReader() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/blogs")
      .then((res) => {
        if (!res.ok) throw new Error("Network response failed");
        return res.json();
      })
      .then((data) => {
        const matchedPost = data.find((item: any) => item.id.toString() === params.slug);
        setBlog(matchedPost || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("CMS record query connection error:", err);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return (
      /* LOADING DETAILED VIEW STATE LAYER */
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest bg-zinc-950">
        <Activity className="w-6 h-6 text-emerald-400 animate-spin" />
        Parsing Core Document Content...
      </div>
    );
  }

  if (!blog) {
    return (
      /* 404 RESOURCE MISSING CONSOLE */
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10 bg-zinc-950 text-zinc-100">
        {/* Global background fallback layer */}
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
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden p-4 py-12 sm:p-12">
      
      {/* 🏟️ PERMANENT GLOBAL BACKGROUND CONTAINER LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-zinc-950">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop" 
          alt="Cricket Arena Field Backdrop" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 select-none"
        />
        {/* Consistent deep contrast vignette masking layout */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950/95" />
      </div>

      <motion.article 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto w-full bg-transparent relative z-10"
      >
        {/* Navigation Return Hook Button */}
        <button 
          onClick={() => router.push("/blogs")} 
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-400 uppercase tracking-wider mb-8 transition-all bg-zinc-900/80 border border-zinc-800 px-4 py-2.5 rounded-xl backdrop-blur shadow-md active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Return to Index Feed
        </button>

        {/* Article Banner Display with Balanced Tint Shading */}
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-8 border border-zinc-800 bg-zinc-950 shadow-2xl relative">
          <img 
            src={blog.image_url} 
            alt={blog.title} 
            className="w-full h-full object-cover opacity-75 transition-opacity duration-300" 
            onError={(e) => {
              // Fail-safe automatic background recovery handling if the image stream gets broken or blocked
              e.currentTarget.src = "https://images.unsplash.com/photo-1540747737956-3787273ac287?auto=format&fit=crop&q=80&w=1200";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
        </div>

        {/* Category & Analytics Info Meta Badge Row */}
        <div className="flex gap-4 items-center text-[10px] font-mono uppercase tracking-wider mb-5">
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black tracking-widest shadow-sm">
            {blog.category}
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300 font-bold bg-zinc-900 border border-zinc-800/80 px-3 py-1 rounded-lg shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {blog.read_time || "5 Min Read"}
          </span>
        </div>

        {/* Article Headline Typography Stack */}
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-[1.1] drop-shadow-md">
          {blog.title}
        </h1>

        {/* Render Details Content Container Block */}
        <div className="text-sm sm:text-base text-zinc-200 leading-relaxed space-y-6 border-t border-zinc-800/80 pt-6 font-medium bg-transparent">
          
          {/* Article Abstract Summary Section: High Visibility Contrast Fix */}
          <p className="text-zinc-200 bg-zinc-900/80 border border-zinc-800/60 border-l-4 border-l-emerald-500 italic text-sm sm:text-base p-5 rounded-r-2xl max-w-full leading-relaxed backdrop-blur-sm shadow-inner">
            {blog.summary}
          </p>
          
          {/* Main Content Body */}
          <p className="text-zinc-100 font-normal leading-relaxed text-sm sm:text-base antialiased tracking-wide">
            {blog.content || "This enterprise logging container parses telemetry metrics directly across decentralized system data blocks securely, maximizing application operational data processing pipelines."}
          </p>
          
          {/* Report Footer Signature Block */}
          <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest pt-12 flex items-center gap-2 border-t border-zinc-800/60">
            <Layers className="w-4 h-4 text-emerald-400 animate-pulse" /> End of Compiled Analytical Report Document.
          </p>
        </div>
      </motion.article>
    </div>
  );
}
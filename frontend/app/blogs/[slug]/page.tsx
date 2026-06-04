"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Layers, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function DetailedBlogPostReader() {
  const params = useParams();
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-xs font-mono text-slate-500 uppercase tracking-widest bg-transparent">
        <Activity className="w-6 h-6 text-emerald-400 animate-spin" />
        Parsing Core Document Content...
      </div>
    );
  }

  if (!blog) {
    return (
      /* 404 RESOURCE MISSING CONSOLE */
      <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 text-center relative z-10 bg-transparent">
        <span className="text-xs font-mono text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
          Error Code: 404_NOT_FOUND
        </span>
        <h2 className="text-xl font-black uppercase mb-6 text-slate-300 tracking-tight">
          Specified Analytics Resource Missing
        </h2>
        <Link 
          href="/blogs" 
          className="text-xs text-emerald-400 font-mono font-bold hover:text-emerald-300 flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-xl shadow-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 animate-pulse" /> Return to Analytics Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 flex-1 w-full relative z-10 RegalStadiumFix bg-transparent">
      <motion.article 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-3xl mx-auto bg-transparent"
      >
        {/* Navigation Return Hook */}
        <Link 
          href="/blogs" 
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-emerald-400 uppercase tracking-wider mb-8 transition-colors bg-slate-950/60 border border-slate-850 px-4 py-2 rounded-xl backdrop-blur"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Return to Index Feed
        </Link>

        {/* Article Banner Display with Balanced Dark Overlay */}
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-8 border border-blue-900/40 bg-slate-950 shadow-2xl relative">
          <img 
            src={blog.image_url} 
            alt={blog.title} 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
        </div>

        {/* Category & Analytics Info Meta Row */}
        <div className="flex gap-4 items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-4">
          <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold tracking-widest">
            {blog.category}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 font-semibold bg-slate-950/40 border border-slate-850 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {blog.read_time || "5 Min Read"}
          </span>
        </div>

        {/* Article Headline Typography Stack */}
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-[1.1] drop-shadow">
          {blog.title}
        </h1>

        {/* Render Details Content Container Block */}
        <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-6 border-t border-slate-800/80 pt-6 font-medium bg-transparent">
          
          {/* Article Abstract Summary Section */}
          <p className="text-slate-400 italic text-sm sm:text-base border-l-4 border-emerald-400 pl-4 bg-[#0b1536]/10 py-4 pr-4 rounded-r-2xl border-y border-r border-blue-900/10 max-w-full leading-relaxed">
            {blog.summary}
          </p>
          
          {/* Main Content Body */}
          <p className="text-slate-300 font-normal leading-relaxed text-sm sm:text-base antialiased">
            {blog.content || "This enterprise logging container parses telemetry metrics directly across decentralized system data blocks securely, maximizing application operational data processing pipelines."}
          </p>
          
          {/* Report Footer Signature Block */}
          <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest pt-12 flex items-center gap-2 border-t border-slate-900">
            <Layers className="w-4 h-4 text-emerald-500" /> End of Compiled Analytical Report Document.
          </p>
        </div>
      </motion.article>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function DetailedBlogPostReader() {
  const params = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/blogs")
      .then((res) => res.json())
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
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-xs font-mono text-slate-500 uppercase tracking-widest">
        Parsing Core Document Content...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
        <span className="text-xs font-mono text-rose-500 mb-2">Error Code: 404_NOT_FOUND</span>
        <h2 className="text-lg font-black uppercase mb-6 text-zinc-300">Specified Analytics Resource Missing</h2>
        <Link href="/blogs" className="text-xs text-emerald-400 font-mono font-bold hover:underline flex items-center gap-2 bg-slate-900 border border-blue-950 px-4 py-2 rounded-xl">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Analytics Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-16 px-6 flex-1 w-full">
      <motion.article 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-emerald-400 uppercase tracking-wider mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Return to Index Feed
        </Link>

        {/* Article Banner Display */}
        <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8 border border-blue-950 bg-slate-950 shadow-inner">
          <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover opacity-70" />
        </div>

        {/* Category & Tags Row */}
        <div className="flex gap-4 items-center text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-4">
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            {blog.category}
          </span>
          <span className="flex items-center gap-1 text-slate-500"><Clock className="w-3.5 h-3.5" /> {blog.read_time || "5 Min Read"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Render Details Block */}
        <div className="text-sm sm:text-base text-slate-300 leading-relaxed space-y-6 border-t border-blue-950/60 pt-6 font-medium">
          <p className="text-slate-400 italic text-base border-l-2 border-emerald-500 pl-4 mb-6 leading-relaxed">
            {blog.summary}
          </p>
          <p className="text-slate-300">
            {blog.content || "This enterprise logging container parses telemetry metrics directly across decentralized system data blocks securely, maximizing application operational data processing pipelines."}
          </p>
          <p className="text-slate-400 text-xs font-mono pt-12 flex items-center gap-2 border-t border-blue-950/40">
            <Layers className="w-4 h-4 text-emerald-500" /> End of Compiled Analytical Report Document.
          </p>
        </div>
      </motion.article>
    </div>
  );
}
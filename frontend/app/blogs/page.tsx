"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, ChevronRight, Radio, ShieldAlert, Server, BarChart3, TrendingUp, Hash } from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  category: string;
  read_time: string;
}

export default function CricketEngineeringInsightsWorkspace() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function loadBlogData() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8000/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        } else {
          throw new Error("Failed to fetch data stream.");
        }
      } catch (err) {
        console.warn("Backend blog API unreachable. Utilizing robust fail-safe layout defaults.");
        setError(true);
        setArticles([
          {
            id: "1",
            title: "Mastering the Art of Modern Power Hitting",
            summary: "How modern bat design adjustments and biomechanical clearance frames changed the geometry of T20 cricket analytics equations.",
            content: "A deep technical breakdown of wrist extension vectors, hip clearance paths, and optimal ball launching angles across persistent training match structures.",
            image_url: "https://images.unsplash.com/photo-1540747737956-3787217526ed?auto=format&fit=crop&q=80&w=800",
            category: "Technique",
            read_time: "5 Min Read"
          },
          {
            id: "2",
            title: "The Evolution of Reverse Swing in Limited Overs",
            summary: "Analyzing aerodynamic boundary layers and friction vectors on leather cricket ball seam structures under live stadium lights.",
            content: "An aerodynamic evaluation of how pristine core surface maintenance profiles yield sharp late movement inside high-velocity delivery loops.",
            image_url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
            category: "Bowling Analysis",
            read_time: "8 Min Read"
          },
          {
            id: "3",
            title: "Transitioning Local Tournaments From Paper to Digital Platforms",
            summary: "How providing real-time accessible query lookups empowers domestic cricket leagues and optimizes operational stat processing speeds.",
            content: " central database structures deployment parameters allow rapid standup calculation charts, entirely substituting manual handwritten data books.",
            image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
            category: "Productivity",
            read_time: "6 Min Read"
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadBlogData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-3 font-mono">
        <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Streaming Insights Ledger Matrix...</p>
      </div>
    );
  }

  // Extract initial item for layout highlight hero frame
  const featuredPost = articles[0];
  const gridPosts = articles.slice(1);

  return (
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-transparent overflow-x-hidden p-4 py-8 sm:p-6 lg:p-8">
      
      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Navigation Return Row */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-400 transition-all bg-zinc-900/90 border border-zinc-800 rounded-xl px-4 py-2.5 shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} /> RETURN TO CONSOLE APP
          </Link>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-zinc-900 border border-emerald-500/20 px-3 py-1.5 rounded-xl shadow">
            Telemetry Documentation Feed
          </span>
        </div>

        {/* Dynamic API Interruption Status Indicator */}
        {error && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-amber-400 text-xs max-w-xl backdrop-blur-sm shadow-md">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="font-mono">Local Cache Mode Active: Live database cloud sync loops offline. Running standalone repository configurations safely.</span>
          </div>
        )}

        {/* 🚀 LAYOUT PART A: ADVANCED MAGAZINE EXECUTIVE FEATURED HERO BLOCK */}
        {featuredPost && (
          <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-[380px] w-full bg-zinc-950 border-r border-zinc-800/40">
              <img 
                src={featuredPost.image_url} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover object-center transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1540747737956-3787217526ed?auto=format&fit=crop&q=80&w=800";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none" />
              <span className="absolute top-4 left-4 text-[9px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-700 rounded-lg text-emerald-400 px-2.5 py-1 shadow tracking-wider">
                FEATURED REPORT
              </span>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-zinc-500 text-[10px] font-mono uppercase font-bold">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Category: {featuredPost.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.read_time}</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-snug">
                {featuredPost.title}
              </h2>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-medium">
                {featuredPost.summary}
              </p>

              <div className="pt-2">
                <Link 
                  href={`/blogs/${featuredPost.id}`}
                  className="inline-flex py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-sans font-black uppercase tracking-wider text-[11px] rounded-xl shadow-lg transition-all active:scale-[0.98] items-center gap-1.5"
                >
                  Analyze Framework Report <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 🚀 LAYOUT PART B: SPLIT CONTENT OVERVIEW DECK GRID SYSTEM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-start">
          
          {/* LEFT CONTAINER: DENSE ARTICLE LOG ROW ENTRIES (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-mono font-black tracking-widest text-zinc-400 uppercase border-l-4 border-emerald-500 pl-3 mb-4">Ancillary Protocol Research Docs ({articles.length})</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(gridPosts.length > 0 ? gridPosts : articles).map((article) => (
                <div 
                  key={article.id}
                  className="group flex flex-col justify-between bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-md hover:border-zinc-700/80 transition-all shadow-xl h-[390px]"
                >
                  <div>
                    <div className="relative h-40 w-full bg-zinc-950 overflow-hidden border-b border-zinc-800/50">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 opacity-80"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800";
                        }}
                      />
                      <span className="absolute top-3 left-3 inline-block text-[9px] font-mono font-bold uppercase bg-zinc-900 border border-zinc-700 rounded-lg text-emerald-400 px-2 py-0.5 shadow">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="text-zinc-500 text-[9px] font-mono uppercase font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.read_time}
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                        {article.title}
                      </h4>
                      <p className="text-zinc-300 text-[11px] leading-relaxed line-clamp-3 font-medium">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link 
                      href={`/blogs/${article.id}`}
                      className="w-full py-2 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/20 rounded-xl font-mono font-bold uppercase tracking-wider text-[9px] text-zinc-400 hover:text-emerald-400 flex items-center justify-center gap-1 transition-all active:scale-[0.98]"
                    >
                      Analyze Protocol Report <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTAINER: METRICS METADATA SIDEBAR CHANNELS (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sidebar Module 1: Live Platform Running Data Status */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-3xl backdrop-blur-md shadow-2xl space-y-4">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Node Ingestion Telemetry
              </span>
              
              <div className="space-y-3 text-xs font-mono font-bold">
                <div className="flex justify-between items-center p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl">
                  <span className="text-zinc-400 uppercase tracking-wide flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-zinc-500" /> Active Standings</span>
                  <span className="text-white">Clustered</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-zinc-950 border border-zinc-800/80 rounded-xl">
                  <span className="text-zinc-400 uppercase tracking-wide flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-500/60" /> Ingestion Speed</span>
                  <span className="text-emerald-400">99.4%</span>
                </div>
              </div>
            </div>

            {/* Sidebar Module 2: System Trend Tags Channel */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-3xl backdrop-blur-md shadow-2xl space-y-3">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-teal-400" /> Trending Indexes
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {["#T20Telemetry", "#Aerodynamics", "#PostgresUUID", "#Nextjs15", "#SaaSScores"].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-white rounded-lg text-[10px] font-mono transition-colors cursor-pointer shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
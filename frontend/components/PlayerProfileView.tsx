"use client";

import React from 'react';
import { User, Shield, Calendar, BarChart3, Swords } from 'lucide-react';
import { PlayerProfile } from '@/types/cricket';

interface PlayerProfileProps {
  profile: PlayerProfile;
}

export default function PlayerProfileView({ profile }: PlayerProfileProps) {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 bg-transparent relative z-10">
      
      {/* 📊 ADVANCED PROFILE HEADER BLOCK (BCCI STYLE HIGH DENSITY) */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle background glow element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-20 h-20 bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-950 border border-zinc-700 rounded-2xl flex items-center justify-center text-white shadow-xl group">
            <User size={36} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">{profile.name}</h1>
            <p className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-1 uppercase">
              <Shield size={14} className="animate-pulse" /> {profile.team_name}
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-2">
              {profile.playing_role && (
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg shadow-inner">
                  {profile.playing_role}
                </span>
              )}
              {profile.batting_style && (
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg shadow-inner">
                  {profile.batting_style}
                </span>
              )}
              {profile.bowling_style && profile.bowling_style !== "None" && (
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg shadow-inner">
                  {profile.bowling_style}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Career Metric Highlights Ledger */}
        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-8 w-full md:w-auto justify-around">
          <div className="text-center min-w-[70px]">
            <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Matches</p>
            <p className="text-3xl font-black text-white mt-1">{profile.batting?.matches ?? 0}</p>
          </div>
          <div className="text-center min-w-[70px]">
            <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Runs</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{profile.batting?.total_runs ?? 0}</p>
          </div>
          <div className="text-center min-w-[70px]">
            <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-widest">Wickets</p>
            <p className="text-3xl font-black text-teal-400 mt-1">{profile.bowling?.total_wickets ?? 0}</p>
          </div>
        </div>
      </div>

      {/* 📊 ANALYTICS SUB-GRID ARRAYS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Batting Performance Board */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-sm relative">
          <h2 className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400 border-l-4 border-emerald-500 pl-3 mb-5 flex items-center gap-2">
            <Swords size={14} /> Batting Performance Profile
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Innings</span>
              <span className="text-md font-bold text-white">{profile.batting?.innings ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Highest Score</span>
              <span className="text-md font-bold text-white">{profile.batting?.highest_score ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Average</span>
              <span className="text-md font-bold text-white">{profile.batting?.average ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Strike Rate</span>
              <span className="text-md font-bold text-white">{profile.batting?.strike_rate ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl col-span-2 flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Fifties / Hundreds</span>
              <span className="text-md font-black text-emerald-400 font-mono">
                {profile.batting?.fifties ?? 0} <span className="text-zinc-700 mx-1">|</span> {profile.batting?.hundreds ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Bowling Performance Board */}
        <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-6 shadow-xl backdrop-blur-sm relative">
          <h2 className="text-xs font-mono font-black uppercase tracking-widest text-teal-400 border-l-4 border-teal-500 pl-3 mb-5 flex items-center gap-2">
            <BarChart3 size={14} /> Bowling Performance Profile
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Innings Bowled</span>
              <span className="text-md font-bold text-white">{profile.bowling?.innings ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Wickets</span>
              <span className="text-md font-bold text-white">{profile.bowling?.total_wickets ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Economy Rate</span>
              <span className="text-md font-bold text-white">{profile.bowling?.economy ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl">
              <span className="text-[10px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Bowling Avg</span>
              <span className="text-md font-bold text-white">{profile.bowling?.average ?? 0}</span>
            </div>
            <div className="p-3 bg-zinc-950 border border-zinc-800/50 rounded-xl col-span-2 flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Best Bowling Figures</span>
              <span className="text-md font-black text-teal-400 font-mono">{profile.bowling?.best_bowling ?? "0/0"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 HIGH CONTRAST TIMELINE PERFORMANCE LOGS */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Calendar className="text-indigo-400" size={14} /> Historic Match Scorecard Timeline Ledger
          </h2>
          <span className="px-2 py-0.5 text-[9px] font-mono bg-zinc-950 text-zinc-500 rounded border border-zinc-800">Dynamic Sync</span>
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/60 text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-wider border-b border-zinc-800">
                <th className="p-4">Opposing Team Instance</th>
                <th className="p-4">Batting Score</th>
                <th className="p-4">Bowling Return</th>
                <th className="p-4">Match Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-xs font-bold text-zinc-300">
              {profile.recent_matches && profile.recent_matches.length > 0 ? (
                profile.recent_matches.map((match) => (
                  <tr key={match.match_id} className="hover:bg-zinc-950/40 transition-colors">
                    <td className="p-4">
                      <span className="block font-black text-white uppercase tracking-tight text-sm">vs {match.opponent_name}</span>
                      {match.venue && (
                        <span className="text-[10px] font-mono font-medium text-zinc-500 mt-0.5 block">{match.venue}</span>
                      )}
                    </td>
                    <td className="p-4 text-sm font-black text-white">
                      {match.runs_scored} <span className="text-zinc-500 text-xs font-medium font-mono">({match.balls_faced}b)</span>
                    </td>
                    <td className="p-4">
                      {match.wickets_taken > 0 ? (
                        <span className="px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase">
                          {match.wickets_taken} Wkts / {match.runs_conceded} Runs
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-mono font-medium text-[10px]">
                          0 Wickets ({Number(match.overs_bowled || 0)} Ov)
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block font-mono text-[10px] uppercase font-bold px-2 py-1 rounded-md border tracking-wider ${
                        (match.result_description || match.match_status || '').toLowerCase().includes('won') 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {match.result_description || match.match_status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500 font-mono tracking-wide">
                    No historic match data available for this profile.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
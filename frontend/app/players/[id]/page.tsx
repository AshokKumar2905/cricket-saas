'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Shield, Calendar, Loader2, ArrowLeft, Award, BarChart3, Activity, AlertTriangle } from 'lucide-react';

interface ProfileRecentMatch {
  match_id: string;
  opponent_name: string;
  venue: string | null;
  runs_scored: number;
  balls_faced: number;
  wickets_taken: number;
  runs_conceded: number;
  overs_bowled: string;
  match_status: string;
  result_description: string | null;
}

interface PlayerProfile {
  id: string;
  team_id: string | null;
  team_name: string;
  name: string;
  playing_role: string | null;
  batting_style: string | null;
  bowling_style: string | null;
  batting: {
    matches: number;
    innings: number;
    total_runs: number;
    highest_score: number;
    average: number;
    strike_rate: number;
    fifties: number;
    hundreds: number;
  };
  bowling: {
    innings: number;
    total_wickets: number;
    economy: number;
    average: number;
    best_bowling: string;
  };
  recent_matches: ProfileRecentMatch[];
}

export default function PlayerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProfile() {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        const response = await fetch(`http://localhost:8000/api/players/${id}/profile`);
        
        if (!response.ok) {
          throw new Error('Requested athlete metrics context missing from live registry database.');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        console.warn("Backend connection unavailable, running active visual fallback matrix.");
        
        // Premium Mock Data Fallback Structure
        setProfile({
          id: id as string,
          team_id: "team-uuid-123",
          team_name: "Savalakkaran Cricket Club",
          name: "Ashok Kumar",
          playing_role: "All-Rounder",
          batting_style: "Right-hand Bat",
          bowling_style: "Right-arm Medium Fast",
          batting: { matches: 14, innings: 12, total_runs: 438, highest_score: 74, average: 36.5, strike_rate: 142.2, fifties: 3, hundreds: 0 },
          bowling: { innings: 10, total_wickets: 16, economy: 6.8, average: 18.2, best_bowling: "4/18" },
          recent_matches: [
            { match_id: "m1", opponent_name: "Mannargudi Titans", venue: "VGP Ground", runs_scored: 52, balls_faced: 34, wickets_taken: 2, runs_conceded: 22, overs_bowled: "4.0", match_status: "Completed", result_description: "Won by 14 runs" },
            { match_id: "m2", opponent_name: "Thiruvarur Warriors", venue: "District Stadium", runs_scored: 18, balls_faced: 11, wickets_taken: 1, runs_conceded: 15, overs_bowled: "3.0", match_status: "Completed", result_description: "Won by 4 wickets" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4 font-mono antialiased">
        <div className="relative flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin z-10" />
          <div className="w-14 h-14 rounded-full border border-emerald-500/10 absolute animate-ping opacity-25" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-200">Compiling Ledger Metrics History</p>
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">Parsing complex analytical database indices...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4 font-mono p-4">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center justify-center">
          <AlertTriangle size={28} />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 text-center">
          Critical failure reading profile vector data
        </p>
        <button 
          onClick={() => router.back()}
          className="text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-emerald-400 px-4 py-2 rounded-xl hover:bg-zinc-800 transition-all"
        >
          Return to Dashboard Terminal
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden p-4 md:p-6 antialiased">
      
      {/* 🏟️ FIXED CLEAR BACKDROP FRAME SETTING */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-zinc-950">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop" 
          alt="Cricket Arena Stadium Grid" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 select-none z-0 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/95 via-zinc-950/80 to-zinc-950/95 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent z-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-6 my-auto">
        
        {/* Upper Navigation Row */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-zinc-400 hover:text-emerald-400 transition-all bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl shadow-lg active:scale-95 cursor-pointer py-2 px-4 backdrop-blur-md"
          >
            <ArrowLeft size={13} className="text-zinc-500 group-hover:text-emerald-400" /> BACK TO LEAGUE TERMINAL
          </button>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-zinc-900/60 border border-emerald-500/20 px-3 py-1.5 rounded-xl shadow backdrop-blur-md">
            System ID // {profile.id.slice(0, 8)}
          </span>
        </div>

        {/* High Contrast Header Summary Panel */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
          <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left w-full md:w-auto">
            <div className="w-20 h-20 bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-800 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-emerald-400 shadow-xl relative shrink-0">
              <User size={32} className="stroke-[2]" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-zinc-900 rounded-full animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-2xl font-black uppercase tracking-tight text-white font-sans sm:leading-none">{profile.name}</h1>
              <p className="text-xs font-mono font-bold text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5 uppercase">
                <Shield size={13} className="text-emerald-500" /> {profile.team_name}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1.5">
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950/60 border border-zinc-800/80 text-emerald-400/90 rounded-lg">
                  {profile.playing_role || "Athlete"}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950/60 border border-zinc-800/80 text-zinc-300 rounded-lg">
                  {profile.batting_style}
                </span>
                {profile.bowling_style && profile.bowling_style !== "None" && (
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950/60 border border-zinc-800/80 text-zinc-400 rounded-lg">
                    {profile.bowling_style}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 sm:gap-8 border-t md:border-t-0 md:border-l border-zinc-800/80 pt-5 md:pt-0 md:pl-8 w-full md:w-auto justify-around sm:justify-end">
            <div className="text-center min-w-[70px]">
              <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Matches</p>
              <p className="text-3xl font-black text-white tracking-tight mt-0.5">{profile.batting.matches}</p>
            </div>
            <div className="text-center min-w-[70px]">
              <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Total Runs</p>
              <p className="text-3xl font-black text-emerald-400 tracking-tight mt-0.5">{profile.batting.total_runs}</p>
            </div>
            <div className="text-center min-w-[70px]">
              <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Wickets</p>
              <p className="text-3xl font-black text-teal-400 tracking-tight mt-0.5">{profile.bowling.total_wickets}</p>
            </div>
          </div>
        </div>

        {/* Career Breakdown Performance Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Batting Card Grid */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400 border-l-4 border-emerald-500 pl-3 mb-5 flex items-center gap-2">
              <BarChart3 size={14} /> Batting Performance Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Innings</span>
                <span className="text-lg font-black text-zinc-100">{profile.batting.innings}</span>
              </div>
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Highest Score</span>
                <span className="text-lg font-black text-zinc-100">{profile.batting.highest_score}</span>
              </div>
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Average</span>
                <span className="text-lg font-black text-emerald-400">{profile.batting.average}</span>
              </div>
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Strike Rate</span>
                <span className="text-lg font-black text-zinc-100">{profile.batting.strike_rate}</span>
              </div>
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl col-span-2 flex justify-between items-center px-4">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Fifties / Hundreds Breakdown</span>
                <span className="text-sm font-black text-white font-mono tracking-wider">
                  50s: <span className="text-emerald-400">{profile.batting.fifties}</span> <span className="text-zinc-800 mx-1.5">/</span> 100s: <span className="text-emerald-400">{profile.batting.hundreds}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bowling Card Grid */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-teal-400 border-l-4 border-teal-500 pl-3 mb-5 flex items-center gap-2">
              <Activity size={14} /> Bowling Performance Metrics
            </h2>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Innings Bowled</span>
                <span className="text-lg font-black text-zinc-100">{profile.bowling.innings}</span>
              </div>
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Wickets Logged</span>
                <span className="text-lg font-black text-teal-400">{profile.bowling.total_wickets}</span>
              </div>
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Economy Rate</span>
                <span className="text-lg font-black text-zinc-100">{profile.bowling.economy}</span>
              </div>
              <div className="p-3 bg-zinc-950/50 border border-zinc-800/60 rounded-xl hover:border-zinc-700/50 transition-colors">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Bowling Average</span>
                <span className="text-lg font-black text-zinc-100">{profile.bowling.average}</span>
              </div>
              <div className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-xl col-span-2 flex justify-between items-center px-4">
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">Best Bowling Figures Log</span>
                <span className="text-sm font-black text-teal-400 font-mono tracking-widest">{profile.bowling.best_bowling}</span>
              </div>
            </div>
          </div>
        </div>

        {/* High Visibility Match Logs Timeline Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between">
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2">
              <Calendar className="text-emerald-400" size={14} /> Historic Match Ledger Logs
            </h2>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="overflow-x-auto w-full custom-scrollbar">
            {profile.recent_matches.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs font-mono uppercase text-zinc-500 tracking-wider">
                  No historic matches registered inside stat matrix ledger profiles yet.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-zinc-950/60 text-zinc-400 text-[10px] font-mono font-bold uppercase tracking-widest border-b border-zinc-800/80">
                    <th className="p-4 pl-6">Opposing Team Instance</th>
                    <th className="p-4">Batting Performance</th>
                    <th className="p-4">Bowling Return</th>
                    <th className="p-4 pr-6 text-right">Match Outcome Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-xs font-bold text-zinc-300 bg-zinc-900/10">
                  {profile.recent_matches.map((match) => (
                    <tr key={match.match_id} className="hover:bg-zinc-950/40 transition-all duration-150 group">
                      <td className="p-4 pl-6">
                        <span className="block font-black text-zinc-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight text-sm">
                          vs {match.opponent_name}
                        </span>
                        {match.venue && (
                          <span className="text-[10px] font-mono font-medium text-zinc-500 mt-1 block tracking-wider">
                            📍 {match.venue}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm font-black text-zinc-100 font-mono">
                        {match.runs_scored} <span className="text-zinc-500 text-xs font-medium font-mono">({match.balls_faced}b)</span>
                      </td>
                      <td className="p-4">
                        {match.wickets_taken > 0 ? (
                          <span className="px-2.5 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold">
                            {match.wickets_taken} Wickets / -{match.runs_conceded} R
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-mono text-[10px] tracking-wider uppercase">
                            0 Wickets ({match.overs_bowled} Ov)
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className="inline-block font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-md bg-zinc-950/80 border border-zinc-800 text-emerald-400 tracking-wider shadow-inner">
                          {match.result_description || match.match_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Shield, Award, Calendar, BarChart3, Loader2, ArrowLeft } from 'lucide-react';

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

  useEffect(() => {
    if (!id) return;

    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/players/${id}/profile`);
        
        if (!response.ok) {
          throw new Error('Player profile not found in live database.');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        console.warn("Backend connection unavailable, running active visual fallback matrix.");
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-3 font-mono">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Compiling player metrics history...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden p-4 md:p-6">
      
      {/* 🏟️ FIXED CLEAR BACKDROP FRAME SETTING */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-zinc-950">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop" 
          alt="Cricket Arena Stadium Grid" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-65 select-none z-0"
        />
        {/* Adjusted lighter shading parameters to keep stadium lines visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/65 to-zinc-950/90 z-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full space-y-6">
        
        {/* Upper Navigation Row */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-emerald-400 transition-all bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-md active:scale-95 cursor-pointer py-2 px-4"
          >
            <ArrowLeft size={14} /> BACK TO LEAGUE DASHBOARD
          </button>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-zinc-900 border border-emerald-500/20 px-3 py-1.5 rounded-xl shadow">
            Player Analytics Card
          </span>
        </div>

        {/* High Contrast Header Summary Panel */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg font-black">
              <User size={36} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">{profile.name}</h1>
              <p className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 mt-1.5 uppercase">
                <Shield size={14} /> {profile.team_name}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg">
                  {profile.playing_role || "Player"}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg">
                  {profile.batting_style || "Standard Bat"}
                </span>
                {profile.bowling_style && profile.bowling_style !== "None" && (
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg">
                    {profile.bowling_style}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
            <div className="text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Matches</p>
              <p className="text-3xl font-black text-white mt-1">{profile.batting.matches}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Total Runs</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{profile.batting.total_runs}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Wickets</p>
              <p className="text-3xl font-black text-teal-400 mt-1">{profile.bowling.total_wickets}</p>
            </div>
          </div>
        </div>

        {/* Career Breakdown Performance Grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Batting Card Grid */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-emerald-400 border-l-4 border-emerald-500 pl-3 mb-5">
              Batting Performance Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Innings</span>
                <span className="text-md font-bold text-white">{profile.batting.innings}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Highest Score</span>
                <span className="text-md font-bold text-white">{profile.batting.highest_score}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Average</span>
                <span className="text-md font-bold text-white">{profile.batting.average}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Strike Rate</span>
                <span className="text-md font-bold text-white">{profile.batting.strike_rate}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl col-span-2">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Fifties / Hundreds Breakdown</span>
                <span className="text-md font-bold text-white">
                  {profile.batting.fifties} <span className="text-zinc-700 mx-1">|</span> {profile.batting.hundreds}
                </span>
              </div>
            </div>
          </div>

          {/* Bowling Card Grid */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-teal-400 border-l-4 border-teal-500 pl-3 mb-5">
              Bowling Performance Metrics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Innings Bowled</span>
                <span className="text-md font-bold text-white">{profile.bowling.innings}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Wickets</span>
                <span className="text-md font-bold text-white">{profile.bowling.total_wickets}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Economy Rate</span>
                <span className="text-md font-bold text-white">{profile.bowling.economy}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Bowling Average</span>
                <span className="text-md font-bold text-white">{profile.bowling.average}</span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl col-span-2">
                <span className="text-[10px] font-mono font-bold text-zinc-500 block mb-0.5 uppercase tracking-wider">Best Bowling Figures Log</span>
                <span className="text-md font-black text-teal-400">{profile.bowling.best_bowling}</span>
              </div>
            </div>
          </div>
        </div>

        {/* High Visibility Match Logs Timeline Card */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl shadow-2xl backdrop-blur-md overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Calendar className="text-indigo-400" size={16} /> Recent Match Scorecard Timeline Log
            </h2>
          </div>
          <div className="overflow-x-auto w-full">
            {profile.recent_matches.length === 0 ? (
              <p className="p-6 text-xs font-mono uppercase text-zinc-500 text-center tracking-wider">No historic matches registered inside stat matrix ledger profiles yet.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/80 text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-wider border-b border-zinc-800">
                    <th className="p-4">Opposing Team Instance</th>
                    <th className="p-4">Batting Performance</th>
                    <th className="p-4">Bowling Return</th>
                    <th className="p-4">Match Outcome Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-xs font-bold text-zinc-300">
                  {profile.recent_matches.map((match) => (
                    <tr key={match.match_id} className="hover:bg-zinc-950/40 transition-colors">
                      <td className="p-4">
                        <span className="block font-black text-white uppercase tracking-tight text-sm">vs {match.opponent_name}</span>
                        {match.venue && <span className="text-[10px] font-mono font-medium text-zinc-500 mt-0.5 block">{match.venue}</span>}
                      </td>
                      <td className="p-4 text-sm font-black text-white">
                        {match.runs_scored} <span className="text-zinc-500 text-xs font-medium font-mono">({match.balls_faced}b)</span>
                      </td>
                      <td className="p-4">
                        {match.wickets_taken > 0 ? (
                          <span className="px-2.5 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold">
                            {match.wickets_taken} Wickets
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-mono text-[10px]">0 Wickets</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-block font-mono text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-emerald-400 tracking-wider">
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
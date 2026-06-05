import React from 'react';
import { User, Shield, Award, Calendar, BarChart3 } from 'lucide-react';
import { PlayerProfile } from '@/types/cricket';

interface PlayerProfileProps {
  profile: PlayerProfile;
}

export default function PlayerProfileView({ profile }: PlayerProfileProps) {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 bg-slate-50 min-h-screen">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
            <User size={40} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{profile.name}</h1>
            <p className="text-sm font-medium text-blue-600 flex items-center gap-1 mt-1">
              <Shield size={16} /> {profile.teamName}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                {profile.role}
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                {profile.battingStyle}
              </span>
              {profile.bowlingStyle && (
                <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                  {profile.bowlingStyle}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Career Highlights Banner */}
        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-around">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Matches</p>
            <p className="text-2xl font-extrabold text-slate-800">{profile.stats.batting.matches}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Runs</p>
            <p className="text-2xl font-extrabold text-blue-600">{profile.stats.batting.runs}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Wickets</p>
            <p className="text-2xl font-extrabold text-emerald-600">{profile.stats.bowling.wickets}</p>
          </div>
        </div>
      </div>

      {/* Stats Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Batting Stats Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
            <Award className="text-amber-500" size={20} /> Batting Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Innings</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.batting.innings}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Highest Score</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.batting.highestScore}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Average</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.batting.average}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Strike Rate</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.batting.strikeRate}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">50s / 100s</span>
              <span className="text-lg font-bold text-slate-700">
                {profile.stats.batting.fifties} / {profile.stats.batting.hundreds}
              </span>
            </div>
          </div>
        </div>

        {/* Bowling Stats Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3 mb-4">
            <BarChart3 className="text-emerald-500" size={20} /> Bowling Statistics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Innings Bowled</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.bowling.innings}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Wickets</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.bowling.wickets}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Economy Rate</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.bowling.economy}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-400 block mb-0.5">Bowling Avg</span>
              <span className="text-lg font-bold text-slate-700">{profile.stats.bowling.average}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl col-span-2">
              <span className="text-xs text-slate-400 block mb-0.5">Best Bowling Figures</span>
              <span className="text-lg font-bold text-emerald-600">{profile.stats.bowling.bestBowling}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Match Log / Scorecards Replacement */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-indigo-500" size={20} /> Recent Matches Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4">Opponent & Date</th>
                <th className="p-4">Runs Scored</th>
                <th className="p-4">Wickets Taken</th>
                <th className="p-4">Match Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {profile.recentMatches.map((match) => (
                <tr key={match.matchId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <span className="block font-semibold text-slate-800">vs {match.opponent}</span>
                    <span className="text-xs text-slate-400">{match.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-base font-bold text-slate-800">{match.runsScored}</span>
                    <span className="text-xs text-slate-400 font-normal"> ({match.ballsFaced}b)</span>
                  </td>
                  <td className="p-4">
                    {match.wicketsTaken > 0 ? (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                        {match.wicketsTaken} / {match.runsConceded}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">0 wickets</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs font-bold px-2 py-1 rounded-md ${
                      match.result.toLowerCase().includes('won') 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {match.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
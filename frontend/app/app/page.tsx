"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, LogOut, ChevronRight, Mail, Lock, Users, 
  ArrowLeft, CheckCircle, Radio, UserPlus, Phone, Activity
} from 'lucide-react';

export default function HomeApplicationWorkspace() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [organizerEmail, setOrganizerEmail] = useState<string>('Operator');

  const [activeTournament, setActiveTournament] = useState<any | null>(null);
  const [activeTeam, setActiveTeam] = useState<any | null>(null);
  const [activeMatch, setActiveMatch] = useState<any | null>(null);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [tournamentData, setTournamentData] = useState({ name: '', location: '', overs_per_match: 20, ball_type: 'Leather' });
  const [teamData, setTeamData] = useState({ name: '', captain_name: '', logo_url: '' });
  const [playerData, setPlayerData] = useState({ name: '', phone: '', playing_role: 'Batsman', batting_style: 'Right-hand Bat', bowling_style: 'None' });
  const [matchData, setMatchData] = useState({ team_a_id: '', team_b_id: '', venue: '' });

  const [scoreA, setScoreA] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [scoreB, setScoreB] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [currentInnings, setCurrentInnings] = useState<'A' | 'B'>('A');
  const [matchStatus, setMatchStatus] = useState('Live');

  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBallHovered, setIsBallHovered] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    if (savedToken) {
      setToken(savedToken);
      if (savedEmail) setOrganizerEmail(savedEmail);
      fetchTournaments(savedToken);
    }
  }, []);

  const loadLiveScorecardConsole = (match: any) => {
    setActiveMatch(match);
    setScoreA({ runs: match.team_a_runs, wickets: match.team_a_wickets, overs: 0, balls: 0 });
    setScoreB({ runs: match.team_b_runs, wickets: match.team_b_wickets, overs: 0, balls: 0 });
    setMatchStatus('Live');
    setCurrentInnings('A');
  };

  const handleBallDelivered = (runsAdded: number, isWicket: boolean) => {
    if (currentInnings === 'A') {
      let nextBalls = scoreA.balls + 1;
      let nextOvers = scoreA.overs;
      if (nextBalls === 6) { nextOvers += 1; nextBalls = 0; }
      setScoreA({ runs: scoreA.runs + runsAdded, wickets: isWicket ? Math.min(10, scoreA.wickets + 1) : scoreA.wickets, overs: nextOvers, balls: nextBalls });
    } else {
      let nextBalls = scoreB.balls + 1;
      let nextOvers = scoreB.overs;
      if (nextBalls === 6) { nextOvers += 1; nextBalls = 0; }
      setScoreB({ runs: scoreB.runs + runsAdded, wickets: isWicket ? Math.min(10, scoreB.wickets + 1) : scoreB.wickets, overs: nextOvers, balls: nextBalls });
    }
  };

  const saveScoreToDatabase = async () => {
    if (!token || !activeMatch) return;
    const finalOversA = parseFloat(`${scoreA.overs}.${scoreA.balls}`);
    const finalOversB = parseFloat(`${scoreB.overs}.${scoreB.balls}`);
    try {
      await fetch(`http://127.0.0.1:8000/api/matches/${activeMatch.id}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          status: matchStatus,
          score_data: { runs_a: scoreA.runs, wickets_a: scoreA.wickets, overs_a: finalOversA, runs_b: scoreB.runs, wickets_b: scoreB.wickets, overs_b: finalOversB }
        })
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeMatch) saveScoreToDatabase();
  }, [scoreA, scoreB, matchStatus]);

  const fetchTournaments = async (t: string) => {
    const res = await fetch('http://127.0.0.1:8000/api/tournaments', { headers: { 'Authorization': `Bearer ${t}` } });
    if (res.ok) setTournaments(await res.json());
  };

  const loadTournamentControlRoom = async (tournament: any) => {
    setActiveTournament(tournament);
    setActiveTeam(null);
    const teamRes = await fetch(`http://127.0.0.1:8000/api/tournaments/${tournament.id}/teams`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (teamRes.ok) setTeams(await teamRes.json());
    const matchRes = await fetch(`http://127.0.0.1:8000/api/tournaments/${tournament.id}/matches`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (matchRes.ok) setMatches(await matchRes.json());
  };

  const loadTeamRoster = async (team: any) => {
    setActiveTeam(team);
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${team.id}/players`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setPlayers(await res.json());
  };

  const handleCreateTournament = async (e: any) => {
    e.preventDefault(); if (!token) return;
    setLoading(true);
    const res = await fetch('http://127.0.0.1:8000/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(tournamentData)
    });
    if (res.ok) {
      setTournamentData({ name: '', location: '', overs_per_match: 20, ball_type: 'Leather' });
      fetchTournaments(token);
    }
    setLoading(false);
  };

  const handleCreateTeam = async (e: any) => {
    e.preventDefault(); if (!token || !activeTournament) return;
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${activeTournament.id}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(teamData)
    });
    if (res.ok) {
      setTeamData({ name: '', captain_name: '', logo_url: '' });
      loadTournamentControlRoom(activeTournament);
    }
  };

  const handleAddPlayer = async (e: any) => {
    e.preventDefault(); if (!token || !activeTeam) return;
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${activeTeam.id}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(playerData)
    });
    if (res.ok) {
      setPlayerData({ name: '', phone: '', playing_role: 'Batsman', batting_style: 'Right-hand Bat', bowling_style: 'None' });
      loadTeamRoster(activeTeam);
    }
  };

  const handleScheduleMatch = async (e: any) => {
    e.preventDefault(); if (!token || !activeTournament) return;
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${activeTournament.id}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(matchData)
    });
    if (res.ok) {
      setMatchData({ team_a_id: '', team_b_id: '', venue: '' });
      loadTournamentControlRoom(activeTournament);
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault(); setStatusMessage(null);
    const res = await fetch('http://127.0.0.1:8000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name || "Operator", email: formData.email, password: formData.password, phone: formData.phone || null })
    });
    if (res.ok) { setIsLoginView(true); setStatusMessage({ type: 'success', text: 'Operator allocated. Please log in.' }); }
    else { setStatusMessage({ type: 'error', text: 'Registration failed.' }); }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault(); setStatusMessage(null);
    const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    if (res.ok) {
      const d = await res.json();
      localStorage.setItem('token', d.access_token);
      localStorage.setItem('email', formData.email);
      setToken(d.access_token);
      setOrganizerEmail(formData.email);
      fetchTournaments(d.access_token);
    } else { setStatusMessage({ type: 'error', text: 'Access denied.' }); }
  };

  return (
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-transparent">
      {/* Upper Operator Dashboard Header Bar */}
      {token && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-6 flex justify-between items-center relative z-20">
          <div className="text-xs font-mono text-emerald-400 bg-[#0b1536]/40 border border-blue-900/30 px-3 py-1.5 rounded-xl flex items-center gap-2 backdrop-blur-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Operator Instance: <span className="text-white font-bold">{organizerEmail}</span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); setToken(null); setActiveTournament(null); setActiveMatch(null); setActiveTeam(null); }} 
            className="text-xs bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-slate-400 font-bold flex items-center gap-1.5 hover:text-white hover:border-slate-700 transition-all shadow-md active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" /> De-authorize Session
          </button>
        </div>
      )}

      <div className="flex-1 w-full flex flex-col relative z-10 bg-transparent">
        <AnimatePresence mode="wait">
          {!token ? (
            /* LAYER 1: AUTHENTICATION ENTRANCE CONFIGURATION */
            <motion.div key="auth" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-md w-full mx-auto py-20 px-4 bg-transparent">
              <div className="bg-gradient-to-br from-[#0b1536]/90 to-[#070d1f]/95 border border-blue-900/40 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex bg-slate-950/80 border border-slate-900 p-1 rounded-xl mb-6">
                  <button type="button" onClick={() => { setIsLoginView(true); setStatusMessage(null); }} className={`flex-1 py-2 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${isLoginView ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'text-slate-500 hover:text-slate-300'}`}>Operator Login</button>
                  <button type="button" onClick={() => { setIsLoginView(false); setStatusMessage(null); }} className={`flex-1 py-2 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${!isLoginView ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'text-slate-500 hover:text-slate-300'}`}>Create Tenant</button>
                </div>

                <form onSubmit={isLoginView ? handleLogin : handleSignup} className="space-y-4">
                  {!isLoginView && (
                    <div className="relative">
                      <UserPlus className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input type="text" placeholder="Operator Legal Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors" />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input type="password" placeholder="Passphrase Code" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors" />
                  </div>
                  {!isLoginView && (
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input type="tel" placeholder="Contact Mobile Sequence" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors" />
                    </div>
                  )}

                  {statusMessage && (
                    <div className={`p-3.5 text-xs rounded-xl border backdrop-blur-sm ${statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                      {statusMessage.text}
                    </div>
                  )}

                  <button type="submit" className="w-full h-12 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 mt-6">Authorize Channel</button>
                </form>
              </div>
            </motion.div>
          ) : activeMatch ? (
            /* LAYER 2: TELEMETRY LIVE SCORING PANEL CONSOLE */
            <motion.div key="scoring" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent">
              <div className="lg:col-span-2 bg-gradient-to-br from-[#0b1536]/90 to-[#070d1f]/95 border border-blue-900/40 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <button onClick={() => setActiveMatch(null)} className="text-[10px] uppercase font-mono font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 mb-6 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Return to Control Room</button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className={`p-6 rounded-2xl border transition-all cursor-pointer ${currentInnings === 'A' ? 'bg-slate-950/80 border-emerald-500/60 ring-1 ring-emerald-500/20' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`} onClick={() => setCurrentInnings('A')}>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Innings 1 (Team A)</span>
                    <div className="text-5xl font-black mt-2 text-white">{scoreA.runs}<span className="text-slate-500 font-light text-3xl">/{scoreA.wickets}</span></div>
                    <span className="inline-block text-[11px] font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 mt-3 border border-slate-800">Overs: {scoreA.overs}.{scoreA.balls}</span>
                  </div>
                  <div className={`p-6 rounded-2xl border transition-all cursor-pointer ${currentInnings === 'B' ? 'bg-slate-950/80 border-emerald-500/60 ring-1 ring-emerald-500/20' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`} onClick={() => setCurrentInnings('B')}>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Innings 2 (Team B)</span>
                    <div className="text-5xl font-black mt-2 text-white">{scoreB.runs}<span className="text-slate-500 font-light text-3xl">/{scoreB.wickets}</span></div>
                    <span className="inline-block text-[11px] font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 mt-3 border border-slate-800">Overs: {scoreB.overs}.{scoreB.balls}</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-900">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block mb-4 text-center">Interactive Micro-Metrics Trigger</span>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                      <button key={run} onClick={() => handleBallDelivered(run, false)} className="w-14 h-14 bg-blue-950/40 hover:bg-blue-900/80 border border-blue-900/40 hover:border-blue-700 text-white rounded-xl font-black text-sm transition-all shadow-md active:scale-90">{run}</button>
                    ))}
                    <button onClick={() => handleBallDelivered(0, true)} className="px-6 h-14 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95">Wicket</button>
                  </div>
                </div>
              </div>

              {/* Ball Telemetry Animation Module */}
              <div className="bg-[#0b1536]/40 border border-blue-900/30 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[320px] shadow-2xl backdrop-blur-sm relative">
                <div className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none rounded-3xl" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600')` }} />
                <motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-950 border-2 border-red-500/30 shadow-2xl shadow-red-950 cursor-pointer" 
                  animate={{ rotate: isBallHovered ? 360 : 0, scale: isBallHovered ? 1.05 : 1 }} 
                  transition={{ ease: "linear", duration: 4, repeat: Infinity }} 
                  onHoverStart={() => setIsBallHovered(true)} 
                  onHoverEnd={() => setIsBallHovered(false)} 
                />
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-5 flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 shadow">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Telemetry Stream Engaged
                </span>
              </div>
            </motion.div>
          ) : activeTournament ? (
            /* LAYER 3: TOURNAMENT RADAR CONTROL ROOM LAYER */
            <motion.div key="control-room" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent">
              <div className="space-y-6">
                <button onClick={() => { setActiveTournament(null); setActiveTeam(null); }} className="text-[10px] uppercase font-mono font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Return to Leagues Deck</button>
                
                {/* Franchise Creator Card */}
                <div className="bg-gradient-to-br from-[#0b1536]/60 to-[#070d1f]/80 border border-blue-900/30 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                  <h3 className="text-xs font-black uppercase text-slate-200 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Register Franchise</h3>
                  <form onSubmit={handleCreateTeam} className="space-y-3">
                    <input type="text" placeholder="Franchise Team Name" required value={teamData.name} onChange={(e) => setTeamData({...teamData, name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    <input type="text" placeholder="Captain Name" value={teamData.captain_name} onChange={(e) => setTeamData({...teamData, captain_name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    <button type="submit" className="w-full h-11 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-md">Commit Franchise</button>
                  </form>
                </div>

                {/* Athlete Roster Entry System */}
                {activeTeam ? (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-[#0b1536]/60 to-[#070d1f]/80 border border-blue-900/30 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                    <h3 className="text-xs font-black uppercase text-slate-200 mb-1 flex items-center gap-2"><UserPlus className="w-4 h-4 text-teal-400" /> Append Athlete</h3>
                    <p className="text-[9px] font-mono text-slate-400 mb-4 uppercase tracking-wider">Assign variable matrix to: <span className="text-emerald-400 font-bold">{activeTeam.name}</span></p>
                    <form onSubmit={handleAddPlayer} className="space-y-3">
                      <input type="text" placeholder="Athlete Full Name" required value={playerData.name} onChange={(e) => setPlayerData({...playerData, name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                      <select value={playerData.playing_role} onChange={(e) => setPlayerData({...playerData, playing_role: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none">
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-Rounder">All-Rounder</option>
                        <option value="Wicketkeeper">Wicketkeeper</option>
                      </select>
                      <button type="submit" className="w-full h-11 bg-teal-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all shadow-md">Inject Athlete</button>
                    </form>
                  </motion.div>
                ) : (
                  <div className="p-5 border border-dashed border-blue-900/30 bg-slate-950/40 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest rounded-2xl backdrop-blur-sm">
                    Select a franchise card to map roster arrays
                  </div>
                )}

                {/* Fixture Schedule Component */}
                <div className="bg-gradient-to-br from-[#0b1536]/60 to-[#070d1f]/80 border border-blue-900/30 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                  <h3 className="text-xs font-black uppercase text-slate-200 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> Schedule Match Node</h3>
                  <form onSubmit={handleScheduleMatch} className="space-y-3">
                    <select required value={matchData.team_a_id} onChange={(e) => setMatchData({...matchData, team_a_id: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="">Select Franchise A</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select required value={matchData.team_b_id} onChange={(e) => setMatchData({...matchData, team_b_id: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="">Select Franchise B</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input type="text" placeholder="Stadium Venue Oval Name" value={matchData.venue} onChange={(e) => setMatchData({...matchData, venue: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    <button type="submit" className="w-full h-11 bg-purple-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all shadow-md">Generate Match Frame</button>
                  </form>
                </div>
              </div>

              {/* Data Lists Operations Columns Container */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-[#0b1536]/80 to-[#070d1f]/95 border border-blue-900/40 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-4">Registered League Franchises Registry ({teams.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teams.map(team => (
                      <div 
                        key={team.id} 
                        className={`p-4 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${activeTeam?.id === team.id ? 'bg-slate-950/80 border-emerald-500 shadow-md shadow-emerald-950/50' : 'bg-slate-950/30 border-blue-950/40 hover:bg-slate-950/60 hover:border-slate-700'}`} 
                        onClick={() => loadTeamRoster(team)}
                      >
                        <div>
                          <span className="font-extrabold text-white uppercase text-sm tracking-tight block">{team.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 block mt-1.5 uppercase font-bold">Captain: <span className="text-slate-300 font-sans font-medium">{team.captain_name || "Unassigned"}</span></span>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTeam?.id === team.id ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'}`} />
                      </div>
                    ))}
                  </div>

                  {activeTeam && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-5 border-t border-slate-900">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-widest block mb-3">Roster Allocation Array Matrix:</span>
                      <div className="flex flex-wrap gap-2">
                        {players.map(p => (
                          <span key={p.id} className="px-3 py-1.5 text-[10px] bg-slate-950/60 border border-slate-850 rounded-xl font-medium text-slate-300 shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {p.name} <span className="text-slate-500 font-mono text-[9px]">[{p.playing_role}]</span>
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Fixture Registry Matrix List */}
                <div className="bg-gradient-to-br from-[#0b1536]/80 to-[#070d1f]/95 border border-blue-900/40 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-4">Active League Fixtures Core Schedule ({matches.length})</span>
                  <div className="grid grid-cols-1 gap-3">
                    {matches.map(m => (
                      <div key={m.id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex justify-between items-center group hover:border-slate-700 transition-colors">
                        <div>
                          <span className="text-xs font-black text-white uppercase tracking-tight block">Match Event Instance</span>
                          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Venue: <span className="text-slate-300 font-sans">{m.venue || "Stadium Oval"}</span></span>
                        </div>
                        <button onClick={() => loadLiveScorecardConsole(m)} className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all shadow-md active:scale-95">Launch Score Panel</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* LAYER 4: INITIAL MASTER HUB LEAGUE SELECTOR CONTAINER DECK */
            <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent">
              <div className="bg-gradient-to-br from-[#0b1536]/80 to-[#070d1f]/95 border border-blue-900/40 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                <h2 className="font-black text-md text-white uppercase tracking-tight mb-1 flex items-center gap-2"><Trophy className="w-5 h-5 text-emerald-400" /> Instantiate League Frame</h2>
                <p className="text-[11px] text-slate-400 mb-6 font-medium">Provision new multi-tenant tournament configuration maps to PostgreSQL schema records.</p>
                <form onSubmit={handleCreateTournament} className="space-y-4">
                  <input type="text" placeholder="Tournament Branding Name" required value={tournamentData.name} onChange={(e) => setTournamentData({...tournamentData, name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  <input type="text" placeholder="Location Hosting City" value={tournamentData.location} onChange={(e) => setTournamentData({...tournamentData, location: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  <button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 mt-2">{loading ? 'Compiling Ingestion Map...' : 'Deploy Parameters'}</button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4 bg-transparent">
                <h2 className="text-xs font-mono font-black tracking-widest text-slate-400 uppercase border-l-4 border-emerald-500 pl-3 mb-4">Active Multi-Tenant Context Containers ({tournaments.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-transparent">
                  {tournaments.map((t: any) => (
                    <div key={t.id} className="p-6 bg-gradient-to-br from-[#0b1536]/40 to-[#070d1f]/70 border border-blue-900/30 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-blue-800 transition-colors backdrop-blur-sm">
                      <div>
                        <h3 className="font-black text-white text-md uppercase tracking-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">{t.name}</h3>
                        <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-950/80 border border-emerald-500/20 text-emerald-400 mt-2">Active Streaming Mode</span>
                      </div>
                      <button onClick={() => loadTournamentControlRoom(t)} className="mt-8 w-full py-3 bg-slate-950/60 border border-slate-850 hover:border-slate-700 text-xs text-emerald-400 font-extrabold flex items-center justify-center gap-1.5 uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95">
                        Enter Control Room <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
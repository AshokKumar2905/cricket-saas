"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, LogOut, ChevronRight, Mail, Lock, Users, 
  ArrowLeft, Radio, UserPlus, Phone, Activity, MapPin, Plus
} from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  location?: string;
  overs_per_match: number;
  ball_type: string;
}

interface Team {
  id: string;
  name: string;
  captain_name?: string;
  logo_url?: string;
}

interface Player {
  id: string;
  team_id: string;
  name: string;
  phone?: string;
  playing_role: string;
}

interface Match {
  id: string;
  team_a_id: string;
  team_b_id: string;
  venue?: string;
  team_a_runs: number;
  team_a_wickets: number;
  team_b_runs: number;
  team_b_wickets: number;
}

interface StatusMessage {
  type: 'success' | 'error';
  text: string;
}

export default function HomeApplicationWorkspace() {
  const [isLoginView, setIsLoginView] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [organizerEmail, setOrganizerEmail] = useState<string>('Organizer');

  const [activeTournament, setActiveTournament] = useState<Tournament | null>(null);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);

  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [tournamentData, setTournamentData] = useState({ name: '', location: '', overs_per_match: 20, ball_type: 'Leather' });
  const [teamData, setTeamData] = useState({ name: '', captain_name: '', logo_url: '' });
  const [playerData, setPlayerData] = useState({ name: '', phone: '', playing_role: 'Batsman', batting_style: 'Right-hand Bat', bowling_style: 'None' });
  const [matchData, setMatchData] = useState({ team_a_id: '', team_b_id: '', venue: '' });

  const [scoreA, setScoreA] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [scoreB, setScoreB] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [currentInnings, setCurrentInnings] = useState<'A' | 'B'>('A');
  const [matchStatus, setMatchStatus] = useState<string>('Live');

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBallHovered, setIsBallHovered] = useState<boolean>(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    if (savedToken) {
      setToken(savedToken);
      if (savedEmail) setOrganizerEmail(savedEmail);
      fetchTournaments(savedToken);
    }
  }, []);

  const loadLiveScorecardConsole = (match: Match) => {
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

  const loadTournamentControlRoom = async (tournament: Tournament) => {
    setActiveTournament(tournament);
    setActiveTeam(null);
    const teamRes = await fetch(`http://127.0.0.1:8000/api/tournaments/${tournament.id}/teams`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (teamRes.ok) setTeams(await teamRes.json());
    const matchRes = await fetch(`http://127.0.0.1:8000/api/tournaments/${tournament.id}/matches`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (matchRes.ok) setMatches(await matchRes.json());
  };

  const loadTeamRoster = async (team: Team) => {
    setActiveTeam(team);
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${team.id}/players`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setPlayers(await res.json());
  };

  const handleCreateTournament = async (e: FormEvent) => {
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

  const handleCreateTeam = async (e: FormEvent) => {
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

  const handleAddPlayer = async (e: FormEvent) => {
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

  const handleScheduleMatch = async (e: FormEvent) => {
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

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault(); setStatusMessage(null);
    const res = await fetch('http://127.0.0.1:8000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.name || "Organizer", email: formData.email, password: formData.password, phone: formData.phone || null })
    });
    if (res.ok) { setIsLoginView(true); setStatusMessage({ type: 'success', text: 'Account created successfully. Please log in.' }); }
    else { setStatusMessage({ type: 'error', text: 'Registration failed.' }); }
  };

  const handleLogin = async (e: FormEvent) => {
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
    } else { setStatusMessage({ type: 'error', text: 'Invalid credentials. Access Denied.' }); }
  };

  return (
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {token && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-6 flex justify-between items-center relative z-20">
          <div className="text-xs font-mono text-emerald-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 backdrop-blur-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> Signed in as: <span className="text-white font-bold">{organizerEmail}</span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); setToken(null); setActiveTournament(null); setActiveMatch(null); setActiveTeam(null); }} 
            className="text-xs bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-slate-400 font-bold flex items-center gap-1.5 hover:text-white hover:border-slate-700 transition-all shadow-md active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      )}

      <div className="flex-1 w-full flex flex-col relative z-10 bg-transparent">
        <AnimatePresence mode="wait">
          {!token ? (
            <motion.div 
              key="auth" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden"
            >
              <div className="hidden lg:flex lg:col-span-7 relative bg-slate-900 items-center justify-center p-12 overflow-hidden border-r border-slate-800/40">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 filter blur-xs" 
                  style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200')` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                
                <div className="relative z-10 max-w-xl text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                    ⚡ Live Scoring Matrix v2.1
                  </span>
                  <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.95] text-white mb-4">
                    GullyScores <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 font-light tracking-normal">
                      Tournament Deck
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                    Log match updates seamlessly, configure bracket profiles dynamically, and ditch messy scorebooks with an integrated local analytics platform.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 bg-slate-950 relative">
                <div className="absolute -left-20 top-20 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-full max-w-md bg-gradient-to-br from-slate-900/80 to-slate-950/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
                  
                  <div className="flex bg-slate-950/80 border border-slate-900 p-1 rounded-xl mb-8">
                    <button 
                      type="button" 
                      onClick={() => { setIsLoginView(true); setStatusMessage(null); }} 
                      className={`flex-1 py-2.5 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${isLoginView ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Sign In
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setIsLoginView(false); setStatusMessage(null); }} 
                      className={`flex-1 py-2.5 text-[10px] uppercase font-mono font-bold tracking-wider rounded-lg transition-all ${!isLoginView ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      Register Free
                    </button>
                  </div>

                  <form onSubmit={isLoginView ? handleLogin : handleSignup} className="space-y-4">
                    {!isLoginView && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block ml-1">Full Operator Name</label>
                        <div className="relative">
                          <UserPlus className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                          <input type="text" placeholder="e.g. Ashok Kumar" required value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors placeholder-slate-600" />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input type="email" placeholder="name@domain.com" required value={formData.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors placeholder-slate-600" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                        <input type="password" placeholder="••••••••••••" required value={formData.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors placeholder-slate-600" />
                      </div>
                    </div>

                    {!isLoginView && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block ml-1">Mobile Contact Sequence</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                          <input type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors placeholder-slate-600" />
                        </div>
                      </div>
                    )}

                    {statusMessage && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-3.5 text-xs rounded-xl border backdrop-blur-sm ${statusMessage.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {statusMessage.text}
                      </motion.div>
                    )}

                    <button type="submit" className="w-full h-12 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 mt-6">
                      Authorize Access Profile
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : activeMatch ? (
            <motion.div key="scoring" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent">
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <button onClick={() => setActiveMatch(null)} className="text-[10px] uppercase font-mono font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 mb-6 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Back to Match Center</button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className={`p-6 rounded-2xl border transition-all cursor-pointer ${currentInnings === 'A' ? 'bg-slate-950/80 border-emerald-500/60 ring-1 ring-emerald-500/20' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`} onClick={() => setCurrentInnings('A')}>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">1st Innings (Team A)</span>
                    <div className="text-5xl font-black mt-2 text-white">{scoreA.runs}<span className="text-slate-500 font-light text-3xl">/{scoreA.wickets}</span></div>
                    <span className="inline-block text-[11px] font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 mt-3 border border-slate-800">Overs: {scoreA.overs}.{scoreA.balls}</span>
                  </div>
                  <div className={`p-6 rounded-2xl border transition-all cursor-pointer ${currentInnings === 'B' ? 'bg-slate-950/80 border-emerald-500/60 ring-1 ring-emerald-500/20' : 'bg-slate-950/30 border-slate-800 hover:border-slate-700'}`} onClick={() => setCurrentInnings('B')}>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">2nd Innings (Team B)</span>
                    <div className="text-5xl font-black mt-2 text-white">{scoreB.runs}<span className="text-slate-500 font-light text-3xl">/{scoreB.wickets}</span></div>
                    <span className="inline-block text-[11px] font-mono bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 mt-3 border border-slate-800">Overs: {scoreB.overs}.{scoreB.balls}</span>
                  </div>
                </div>

                <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-900">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400 block mb-4 text-center">Tap to Score Current Ball</span>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                      <button key={run} onClick={() => handleBallDelivered(run, false)} className="w-14 h-14 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 border border-slate-800 text-white rounded-xl font-black text-sm transition-all shadow-md active:scale-90">{run}</button>
                    ))}
                    <button onClick={() => handleBallDelivered(0, true)} className="px-6 h-14 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95">Wicket</button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[320px] shadow-2xl backdrop-blur-sm relative">
                <div className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none rounded-3xl" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600')` }} />
                <motion.div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-950 border-2 border-red-500/30 shadow-2xl shadow-red-950 cursor-pointer" 
                  animate={{ rotate: isBallHovered ? 360 : 0, scale: isBallHovered ? 1.05 : 1 }} 
                  transition={{ ease: "linear", duration: 4, repeat: Infinity }} 
                  onHoverStart={() => setIsBallHovered(true)} 
                  onHoverEnd={() => setIsBallHovered(false)} 
                />
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mt-5 flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 shadow">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Feed Sync Active
                </span>
              </div>
            </motion.div>
          ) : activeTournament ? (
            <motion.div key="control-room" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent">
              <div className="space-y-6">
                <button onClick={() => { setActiveTournament(null); setActiveTeam(null); }} className="text-[10px] uppercase font-mono font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"><ArrowLeft className="w-3.5 h-3.5" /> Back to Tournaments</button>
                
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                  <h3 className="text-xs font-black uppercase text-slate-200 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Register a New Team</h3>
                  <form onSubmit={handleCreateTeam} className="space-y-3">
                    <input type="text" placeholder="Team Name (e.g., Savalakkaran CC)" required value={teamData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setTeamData({...teamData, name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    <input type="text" placeholder="Captain's Name" value={teamData.captain_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setTeamData({...teamData, captain_name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    <button type="submit" className="w-full h-11 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-md flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Team</button>
                  </form>
                </div>

                {activeTeam ? (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                    <h3 className="text-xs font-black uppercase text-slate-200 mb-1 flex items-center gap-2"><UserPlus className="w-4 h-4 text-teal-400" /> Add Player to Squad</h3>
                    <p className="text-[9px] font-mono text-slate-400 mb-4 uppercase tracking-wider">Adding to: <span className="text-emerald-400 font-bold">{activeTeam.name}</span></p>
                    <form onSubmit={handleAddPlayer} className="space-y-3">
                      <input type="text" placeholder="Player Full Name" required value={playerData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayerData({...playerData, name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                      <select value={playerData.playing_role} onChange={(e: ChangeEvent<HTMLSelectElement>) => setPlayerData({...playerData, playing_role: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none">
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-Rounder">All-Rounder</option>
                        <option value="Wicketkeeper">Wicketkeeper</option>
                      </select>
                      <button type="submit" className="w-full h-11 bg-teal-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all shadow-md">Add Player</button>
                    </form>
                  </motion.div>
                ) : (
                  <div className="p-5 border border-dashed border-slate-800 bg-slate-950/40 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest rounded-2xl backdrop-blur-sm">
                    Click a registered team card to add players to their squad
                  </div>
                )}

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                  <h3 className="text-xs font-black uppercase text-slate-200 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> Schedule a Match</h3>
                  <form onSubmit={handleScheduleMatch} className="space-y-3">
                    <select required value={matchData.team_a_id} onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchData({...matchData, team_a_id: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="">Select Team A</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select required value={matchData.team_b_id} onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchData({...matchData, team_b_id: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="">Select Team B</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input type="text" placeholder="Match Venue / Ground Oval" value={matchData.venue} onChange={(e: ChangeEvent<HTMLInputElement>) => setMatchData({...matchData, venue: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                    <button type="submit" className="w-full h-11 bg-purple-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all shadow-md">Create Fixture</button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-4">Participating Teams ({teams.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teams.map(team => (
                      <div 
                        key={team.id} 
                        className={`p-4 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${activeTeam?.id === team.id ? 'bg-slate-950/80 border-emerald-500 shadow-md shadow-emerald-950/50' : 'bg-slate-950/30 border-slate-850 hover:bg-slate-950/60 hover:border-slate-700'}`} 
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
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-widest block mb-3">Player Squad List:</span>
                      <div className="flex flex-wrap gap-2">
                        {players.length === 0 ? (
                          <span className="text-xs text-slate-500 font-medium">No players registered in this squad yet.</span>
                        ) : (
                          players.map(p => (
                            <span key={p.id} className="px-3 py-1.5 text-[10px] bg-slate-950/60 border border-slate-850 rounded-xl font-medium text-slate-300 shadow-sm flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {p.name} <span className="text-slate-500 font-mono text-[9px]">[{p.playing_role}]</span>
                            </span>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-4">League Fixtures & Match Centers ({matches.length})</span>
                  <div className="grid grid-cols-1 gap-3">
                    {matches.length === 0 ? (
                      <div className="p-4 border border-dashed border-slate-850 text-slate-500 text-xs text-center rounded-xl font-medium">No matches scheduled for this tournament yet.</div>
                    ) : (
                      matches.map(m => (
                        <div key={m.id} className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl flex justify-between items-center group hover:border-slate-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="p-2.5 bg-slate-900 rounded-xl text-slate-400 border border-slate-850 group-hover:text-emerald-400 transition-colors">🏏</span>
                            <div>
                              <span className="text-xs font-black text-white uppercase tracking-tight block">Match Center Fixture</span>
                              <span className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Ground: <span className="text-slate-300 font-sans">{m.venue || "Local Oval"}</span></span>
                            </div>
                          </div>
                          <button onClick={() => loadLiveScorecardConsole(m)} className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all shadow-md active:scale-95">Open Scorecard</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                <h2 className="font-black text-md text-white uppercase tracking-tight mb-1 flex items-center gap-2"><Trophy className="w-5 h-5 text-emerald-400" /> Create a New Tournament</h2>
                <p className="text-[11px] text-slate-400 mb-6 font-medium">Set up a secure online dashboard to log team tables and live score accounts.</p>
                <form onSubmit={handleCreateTournament} className="space-y-4">
                  <input type="text" placeholder="Tournament Name (e.g., Summer Cup 2026)" required value={tournamentData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setTournamentData({...tournamentData, name: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  <input type="text" placeholder="Location / City Hosting" value={tournamentData.location} onChange={(e: ChangeEvent<HTMLInputElement>) => setTournamentData({...tournamentData, location: e.target.value})} className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  <button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 mt-2">{loading ? 'Creating League Dashboard...' : 'Create Tournament'}</button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4 bg-transparent">
                <h2 className="text-xs font-mono font-black tracking-widest text-slate-400 uppercase border-l-4 border-emerald-500 pl-3 mb-4">Your Active Tournaments ({tournaments.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-transparent">
                  {tournaments.map((t: Tournament) => (
                    <div key={t.id} className="p-6 bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-slate-800/50 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-slate-700 transition-colors backdrop-blur-sm">
                      <div>
                        <h3 className="font-black text-white text-md uppercase tracking-tight line-clamp-1 group-hover:text-emerald-400 transition-colors">{t.name}</h3>
                        <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-950/80 border border-emerald-500/20 text-emerald-400 mt-2">Active Tournament</span>
                      </div>
                      <button onClick={() => loadTournamentControlRoom(t)} className="mt-8 w-full py-3 bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-xs text-emerald-400 font-extrabold flex items-center justify-center gap-1.5 uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95">
                        Manage League <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
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
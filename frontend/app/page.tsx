'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Zap, Calendar, MapPin, Target, Shield, LogOut, 
  Plus, ChevronRight, Activity, Award, User, Phone, Mail, Lock, 
  ArrowLeft, CheckCircle, Radio, Play, RotateCcw, Sparkles, AlertCircle,
  Sliders, Tv, Layers, ChevronLeft, Edit2, Trash2, Save, X, Eye
} from 'lucide-react';

export default function Home() {
  // Authentication states
  const [isLoginView, setIsLoginView] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [organizerName, setOrganizerName] = useState<string>('Organizer');

  // Navigation & Active Context Panels
  const [activeTournament, setActiveTournament] = useState<any | null>(null);
  const [activeTeam, setActiveTeam] = useState<any | null>(null);
  const [activeMatch, setActiveMatch] = useState<any | null>(null);

  // Inline Editing States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editLocation, setEditLocation] = useState<string>('');
  const [editRole, setEditRole] = useState<string>('Batsman');

  // Input form states
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [tournamentData, setTournamentData] = useState({ name: '', location: '', overs_per_match: 20, ball_type: 'Leather' });
  const [teamData, setTeamData] = useState({ name: '', captain_name: '' });
  const [playerData, setPlayerData] = useState({ name: '', playing_role: 'Batsman', batting_style: 'Right-hand Bat', bowling_style: 'None' });
  const [matchData, setMatchData] = useState({ team_a_id: '', team_b_id: '', venue: '' });

  // Scoring Incremental Variables
  const [scoreA, setScoreA] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [scoreB, setScoreB] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [currentInnings, setCurrentInnings] = useState<'A' | 'B'>('A');
  const [matchStatus, setMatchStatus] = useState('Live');

  // Array List states
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBallHovered, setIsBallHovered] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedName = localStorage.getItem('organizerName');
    if (savedToken) {
      setToken(savedToken);
      if (savedName) setOrganizerName(savedName);
      fetchTournaments(savedToken);
    }
  }, []);

  // --- Real-Time Scoring Logic ---
  const loadLiveScorecardConsole = (match: any) => {
    setActiveMatch(match);
    setScoreA({ runs: match.team_a_runs, wickets: match.team_a_wickets, overs: Math.floor(match.team_a_overs), balls: Math.round((match.team_a_overs % 1) * 10) });
    setScoreB({ runs: match.team_b_runs, wickets: match.team_b_wickets, overs: Math.floor(match.team_b_overs), balls: Math.round((match.team_b_overs % 1) * 10) });
    setMatchStatus(match.match_status === 'Scheduled' ? 'Live' : match.match_status);
    setCurrentInnings(match.team_b_runs > 0 || match.team_a_wickets === 10 ? 'B' : 'A');
  };

  const handleBallDelivered = (runsAdded: number, isWicket: boolean) => {
    if (currentInnings === 'A') {
      let nextBalls = scoreA.balls + 1;
      let nextOvers = scoreA.overs;
      if (nextBalls === 6) { nextOvers += 1; nextBalls = 0; }
      const newWickets = isWicket ? Math.min(10, scoreA.wickets + 1) : scoreA.wickets;
      setScoreA({ runs: scoreA.runs + runsAdded, wickets: newWickets, overs: nextOvers, balls: nextBalls });
    } else {
      let nextBalls = scoreB.balls + 1;
      let nextOvers = scoreB.overs;
      if (nextBalls === 6) { nextOvers += 1; nextBalls = 0; }
      const newWickets = isWicket ? Math.min(10, scoreB.wickets + 1) : scoreB.wickets;
      setScoreB({ runs: scoreB.runs + runsAdded, wickets: newWickets, overs: nextOvers, balls: nextBalls });
    }
  };

  const saveScoreToDatabase = async () => {
    if (!token || !activeMatch) return;
    const finalOversA = parseFloat(`${scoreA.overs}.${scoreA.balls}`);
    const finalOversB = parseFloat(`${scoreB.overs}.${scoreB.balls}`);
    try {
      await fetch(`http://127.0.0.1:8000/api/matches/${activeMatch.id}/score?runs_a=${scoreA.runs}&wickets_a=${scoreA.wickets}&overs_a=${finalOversA}&runs_b=${scoreB.runs}&wickets_b=${scoreB.wickets}&overs_b=${finalOversB}&status=${matchStatus}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) { console.error("Database sync error", err); }
  };

  useEffect(() => {
    if (activeMatch) saveScoreToDatabase();
  }, [scoreA, scoreB, matchStatus]);

  // Form input changes
  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleTournamentChange = (e: any) => setTournamentData({ ...tournamentData, [e.target.name]: e.target.value });
  const handleTeamChange = (e: any) => setTeamData({ ...teamData, [e.target.name]: e.target.value });
  const handlePlayerChange = (e: any) => setPlayerData({ ...playerData, [e.target.name]: e.target.value });
  const handleMatchChange = (e: any) => setMatchData({ ...matchData, [e.target.name]: e.target.value });

  // Async API Engines
  const fetchTournaments = async (t: string) => {
    const res = await fetch('http://127.0.0.1:8000/api/tournaments', { headers: { 'Authorization': `Bearer ${t}` } });
    if (res.ok) setTournaments(await res.json());
  };

  const handleCreateTournament = async (e: any) => {
    e.preventDefault(); if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/tournaments', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(tournamentData) });
      if (res.ok) { setTournamentData({ name: '', location: '', overs_per_match: 20, ball_type: 'Leather' }); fetchTournaments(token); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchTeams = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${id}/teams`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setTeams(await res.json());
  };

  const handleCreateTeam = async (e: any) => {
    e.preventDefault(); if (!token || !activeTournament) return;
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${activeTournament.id}/teams`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(teamData) });
    if (res.ok) { setTeamData({ name: '', captain_name: '' }); fetchTeams(activeTournament.id); }
  };

  const fetchMatches = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${id}/matches`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setMatches(await res.json());
  };

  const handleCreateMatch = async (e: any) => {
    e.preventDefault(); if (!token || !activeTournament) return;
    const res = await fetch('http://127.0.0.1:8000/api/tournaments/' + activeTournament.id + '/matches', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ team_a_id: matchData.team_a_id, team_b_id: matchData.team_b_id, venue: matchData.venue || activeTournament.location }) });
    if (res.ok) { setMatchData({ team_a_id: '', team_b_id: '', venue: '' }); fetchMatches(activeTournament.id); }
  };

  const fetchPlayers = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${id}/players`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setPlayers(await res.json());
  };

  const handleCreatePlayer = async (e: any) => {
    e.preventDefault(); if (!token || !activeTeam) return;
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${activeTeam.id}/players`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(playerData) });
    if (res.ok) { setPlayerData({ name: '', playing_role: 'Batsman', batting_style: 'Right-hand Bat', bowling_style: 'None' }); fetchPlayers(activeTeam.id); }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault(); setStatusMessage(null);
    const res = await fetch('http://127.0.0.1:8000/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    if (res.ok) { setIsLoginView(true); setFormData({ name: '', email: '', password: '', phone: '' }); }
    else { setStatusMessage({ type: 'error', text: 'Registration failed. Email might exist.' }); }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault(); setStatusMessage(null);
    const res = await fetch('http://127.0.0.1:8000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, password: formData.password }) });
    if (res.ok) { const d = await res.json(); localStorage.setItem('token', d.access_token); setToken(d.access_token); fetchTournaments(d.access_token); }
    else { setStatusMessage({ type: 'error', text: 'Invalid access credentials.' }); }
  };

  // --- Dynamic View Navigation Routers ---
  const selectTournamentWorkspace = (t: any) => { setActiveTournament(t); setTeams([]); setMatches([]); fetchTeams(t.id); fetchMatches(t.id); };
  const selectTeamWorkspace = (team: any) => { setActiveTeam(team); setPlayers([]); fetchPlayers(team.id); };
  const getTeamNameById = (id: string) => teams.find(t => t.id === id)?.name || 'Contender';

  // --- Relational Cloud Mutation Blocks ---
  const saveEditedTournament = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: editName, location: editLocation })
    });
    if (res.ok) { setEditingId(null); fetchTournaments(token!); if(activeTournament?.id === id) setActiveTournament({...activeTournament, name: editName, location: editLocation}); }
  };

  const deleteTournamentRecord = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete tournament parameter block from cloud memory completely?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { fetchTournaments(token!); if (activeTournament?.id === id) setActiveTournament(null); }
    }
  };

  const saveEditedTeam = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: editName })
    });
    if (res.ok) { setEditingId(null); fetchTeams(activeTournament.id); }
  };

  const deleteTeamRecord = async (id: string) => {
    if (confirm("Remove competitor club instance row?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/teams/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { fetchTeams(activeTournament.id); fetchMatches(activeTournament.id); }
    }
  };

  const saveEditedPlayer = async (id: string) => {
    const res = await fetch(`http://127.0.0.1:8000/api/players/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: editName, playing_role: editRole })
    });
    if (res.ok) { setEditingId(null); fetchPlayers(activeTeam.id); }
  };

  const deletePlayerRecord = async (id: string) => {
    if (confirm("Remove player card from database row?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/players/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchPlayers(activeTeam.id);
    }
  };

  const deleteMatchFixture = async (id: string) => {
    if (confirm("Cancel and delete this match slot entry?")) {
      const res = await fetch(`http://127.0.0.1:8000/api/matches/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { fetchMatches(activeTournament.id); if (activeMatch?.id === id) setActiveMatch(null); }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 antialiased font-sans flex flex-col selection:bg-emerald-500/20 selection:text-emerald-400 relative overflow-x-hidden">
      
      {/* 60% Background Dominance: Premium Atmosphere Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.1),rgba(0,0,0,0))] pointer-events-none" />

      {/* Persistent Navigation Header Bar */}
      <header className="bg-[#0a1128] border-b border-blue-950/60 shadow-xl sticky top-0 z-50 backdrop-blur-md bg-[#0a1128]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTournament(null); setActiveTeam(null); setActiveMatch(null); setEditingId(null); }}>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-950 to-emerald-500/20 border border-blue-900/40 shadow-inner">
              <Trophy className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tighter text-white uppercase block leading-none">Cricket SaaS</span>
              <span className="text-[10px] text-emerald-500/60 font-mono tracking-widest uppercase mt-1 block font-bold">Engine Workspace</span>
            </div>
          </div>

          {token && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-950/60 border border-blue-950">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-slate-400 font-mono">Operator: <strong className="text-slate-200 capitalize">{organizerName}</strong></span>
              </div>
              <button onClick={() => { localStorage.clear(); setToken(null); setActiveTournament(null); setActiveTeam(null); setActiveMatch(null); setEditingId(null); }} className="text-xs bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors flex items-center gap-1.5 font-bold">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content Routing Switchboards */}
      <div className="flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          {!token ? (
            // REGISTRATION SIGNUP/LOGIN GATEWAY MODAL WINDOW
            <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md w-full mx-auto py-16 px-4">
              <div className="flex flex-col items-center text-center gap-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold">Premium UI/UX Production Engine</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">League Operator Portal</h1>
                <p className="text-xs text-slate-400 max-w-xs">Authorize credentials to access relational match streaming matrices and over-by-over scoring blocks.</p>
              </div>

              <div className="bg-[#0a1128] border border-blue-950 rounded-3xl p-8 shadow-2xl relative">
                <div className="flex gap-4 mb-6 border-b border-blue-950/60 pb-2">
                  <button onClick={() => { setIsLoginView(false); setStatusMessage(null); }} className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${!isLoginView ? 'text-emerald-400 border-b-2 border-emerald-400 font-black' : 'text-slate-500'}`}>Signup</button>
                  <button onClick={() => { setIsLoginView(true); setStatusMessage(null); }} className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${isLoginView ? 'text-emerald-400 border-b-2 border-emerald-400 font-black' : 'text-slate-500'}`}>Login</button>
                </div>

                <form onSubmit={isLoginView ? handleLogin : handleSignup} className="space-y-4">
                  {!isLoginView && (
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full bg-[#020617] border border-blue-950 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-200 placeholder-zinc-700 transition-colors" />
                    </div>
                  )}
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full bg-[#020617] border border-blue-950 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-200 placeholder-zinc-700 transition-colors" />
                  </div>
                  {!isLoginView && (
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact Number" className="w-full bg-[#020617] border border-blue-950 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-200 placeholder-zinc-700 transition-colors" />
                    </div>
                  )}
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Security Passphrase" className="w-full bg-[#020617] border border-blue-950 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-200 placeholder-zinc-700 transition-colors" />
                  </div>

                  {statusMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-400 text-xs flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {statusMessage.text}
                    </div>
                  )}

                  <button type="submit" className="w-full h-11 bg-emerald-500 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/5 mt-2">
                    {isLoginView ? 'Authorize Session' : 'Compile Framework Profile'}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            // OPERATING MANAGEMENT VIEW LAYOUTS BLOCK
            <motion.div key="console-workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              
              {/* BRAND OPERATOR DISPATCH FIELD CONSOLE DESIGN */}
              <section className="relative w-full aspect-[21/9] min-h-[340px] max-h-[440px] bg-slate-950 overflow-hidden border-b border-blue-950/60">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#0a1128]/90 to-emerald-500/[0.03] z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(16,185,129,0.06),transparent_60%)]" />
                <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />
                
                <div className="absolute inset-y-0 left-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center z-20">
                  <div className="max-w-xl">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] tracking-widest px-3 py-1 rounded border border-emerald-500/20 uppercase mb-4 shadow-md">
                      <Radio className="w-3.5 h-3.5 animate-pulse" /> Workspace Terminal Active
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none uppercase">
                      CRICKET ENGINE <br />
                      <span className="text-emerald-400 font-light">OPERATOR DISPATCH</span>
                    </h1>
                    <p className="text-xs md:text-sm text-slate-400 mt-4 max-w-md font-medium leading-relaxed">
                      Deploy new tournament parameters, authorize franchise matrices, and stream precision delivery metrics to live digital pipelines.
                    </p>
                  </div>
                </div>
              </section>

              {/* SCHEDULE SLIDER FIXTURES DECK BLOCK */}
              <section className="w-full bg-[#0a1128] border-b border-blue-950/60 py-6 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xs font-black tracking-widest text-white uppercase border-l-2 border-emerald-500 pl-2.5">Matches</h2>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded border border-blue-950/60">
                        Workspace Active Schedule Matrix ({matches.length})
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded bg-slate-950/60 border border-blue-950 text-slate-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded bg-slate-950/60 border border-blue-950 text-slate-400 hover:text-white transition-colors">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeTournament && matches.length > 0 ? (
                      matches.map((m: any) => (
                        <div key={m.id} className="bg-[#020617] border border-blue-950 p-4 rounded-xl flex flex-col justify-between hover:border-blue-900 transition-all shadow-xl group relative">
                          <button onClick={() => deleteMatchFixture(m.id)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400 p-1 rounded transition-colors z-20" title="Delete Fixture">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 tracking-widest mb-2 border-b border-blue-950/60 pb-1.5 pr-6">
                            <span>MATCH SLOT ID: #0{m.id.substring(0,6)}</span>
                            <span className="text-[#10b981] font-bold">● Active Terminal</span>
                          </div>
                          <div className="space-y-2 py-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-slate-200 uppercase tracking-tight">{getTeamNameById(m.team_a_id)}</span>
                              <span className="text-xs font-mono font-black text-slate-400">{m.id === activeMatch?.id ? `${scoreA.runs}/${scoreA.wickets}` : `${m.team_a_runs}/${m.team_a_wickets}`}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-slate-200 uppercase tracking-tight">{getTeamNameById(m.team_b_id)}</span>
                              <span className="text-xs font-mono font-black text-slate-400">{m.id === activeMatch?.id ? `${scoreB.runs}/${scoreB.wickets}` : `${m.team_b_runs}/${m.team_b_wickets}`}</span>
                            </div>
                          </div>
                          <button onClick={() => loadLiveScorecardConsole(m)} className="mt-3 w-full py-2 bg-[#0a1128] border border-blue-950 group-hover:bg-emerald-500/10 border group-hover:border-emerald-500/20 text-emerald-400 font-black rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider">
                            <Play className="w-3 h-3 fill-current" /> Open Scorecard
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 text-center bg-slate-950/40 border border-dashed border-blue-950 rounded-xl text-xs text-slate-500 font-mono tracking-wide">
                        {activeTournament ? "NO LIVE FIXTURE MODULE DEPLOYED IN THIS POOL ARCHITECTURE." : "SELECT AN OPERATOR WORKSPACE BELOW TO PULL MATCH ENTRIES."}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* SYSTEM WORKSPACE DETAIL ACTIONS GRIDS */}
              <section className="max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="w-full">
                  <AnimatePresence mode="wait">
                    
                    {activeMatch ? (
                      // ==========================================
                      // DYNAMIC VIEW 4: LIVE CLICKER SCORING ENGINE TERMINAL
                      // ==========================================
                      <motion.div key="scoring-workspace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-[#0a1128] border border-blue-950 p-6 rounded-2xl shadow-2xl">
                            
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-blue-950/80 pb-4 mb-6">
                              <div>
                                <button onClick={() => { setActiveMatch(null); fetchMatches(activeTournament.id); }} className="text-[10px] font-bold uppercase text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-1 transition-colors tracking-widest">
                                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Workspace Console
                                </button>
                                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Scoring Execution Terminal</h2>
                                <p className="text-xs text-slate-400 font-mono">📍 {activeMatch.venue} • Format: {activeTournament.overs_per_match} Max Overs</p>
                              </div>
                              <select value={matchStatus} onChange={(e) => setMatchStatus(e.target.value)} className="bg-[#020617] border border-blue-950 rounded-lg text-xs text-emerald-400 p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500/20 w-fit uppercase tracking-wider">
                                <option value="Live">🟢 Live Match</option>
                                <option value="Innings Break">Innings Break</option>
                                <option value="Completed">🔴 Match Completed</option>
                              </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              <div className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${currentInnings === 'A' ? 'bg-zinc-900/40 border-emerald-500/30 shadow-xl' : 'bg-slate-950/40 border-blue-950/40 opacity-40'}`} onClick={() => setCurrentInnings('A')}>
                                <h3 className="text-xs uppercase tracking-wider font-black text-zinc-500 mb-3">{getTeamNameById(activeMatch.team_a_id)} (Innings 1)</h3>
                                <div className="text-5xl font-black text-white tracking-tight">{scoreA.runs} <span className="text-slate-600 font-light">/</span> <span className="text-emerald-400">{scoreA.wickets}</span></div>
                                <p className="text-xs text-slate-400 mt-4 font-medium bg-zinc-900/40 w-fit px-2.5 py-1 rounded-md border border-zinc-900">Overs: {scoreA.overs}.{scoreA.balls} / {activeTournament.overs_per_match}</p>
                              </div>

                              <div className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${currentInnings === 'B' ? 'bg-zinc-900/40 border-emerald-500/30 shadow-xl' : 'bg-slate-950/40 border-blue-950/40 opacity-40'}`} onClick={() => setCurrentInnings('B')}>
                                <h3 className="text-xs uppercase tracking-wider font-black text-zinc-500 mb-3">{getTeamNameById(activeMatch.team_b_id)} (Innings 2)</h3>
                                <div className="text-5xl font-black text-white tracking-tight">{scoreB.runs} <span className="text-slate-600 font-light">/</span> <span className="text-emerald-400">{scoreB.wickets}</span></div>
                                <p className="text-xs text-slate-400 mt-4 font-medium bg-zinc-900/40 w-fit px-2.5 py-1 rounded-md border border-zinc-900">Overs: {scoreB.overs}.{scoreB.balls} / {activeTournament.overs_per_match}</p>
                              </div>
                            </div>

                            {matchStatus !== 'Completed' ? (
                              <div className="p-8 bg-[#020617] border border-blue-950 rounded-xl flex flex-col gap-6 items-center shadow-inner">
                                <p className="text-xs text-slate-400 font-bold flex items-center gap-2 uppercase tracking-wider">
                                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Stream Input Allocation: 
                                  <span className="text-emerald-400 font-black uppercase bg-emerald-500/5 px-3 py-1 rounded border border-emerald-500/10">{currentInnings === 'A' ? getTeamNameById(activeMatch.team_a_id) : getTeamNameById(activeMatch.team_b_id)}</span>
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                  {[0, 1, 2, 3].map((run) => (
                                    <button key={run} onClick={() => handleBallDelivered(run, false)} className="w-14 h-14 bg-[#0a1128] border border-blue-950 text-white rounded-xl font-bold hover:bg-slate-800 text-sm transition-all active:scale-95 shadow-md">{run}</button>
                                  ))}
                                  <button onClick={() => handleBallDelivered(4, false)} className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black text-base hover:bg-emerald-500/20 transition-all active:scale-95 shadow-md">4</button>
                                  <button onClick={() => handleBallDelivered(6, false)} className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black text-base hover:bg-emerald-500/20 transition-all active:scale-95 shadow-md">6</button>
                                  <button onClick={() => handleBallDelivered(0, true)} className="w-24 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-black text-xs hover:bg-rose-500/20 uppercase tracking-widest transition-all active:scale-95 shadow-md">Wicket</button>
                                </div>
                                <div className="flex gap-4 border-t border-blue-950/60 pt-6 w-full justify-center">
                                  <button onClick={() => setCurrentInnings(currentInnings === 'A' ? 'B' : 'A')} className="text-xs bg-[#0a1128] border border-blue-950 px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                    <RotateCcw className="w-3.5 h-3.5 text-zinc-500" /> Switch Batting Side Context
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 border border-blue-950 bg-[#020617] rounded-2xl text-center text-slate-500 font-mono text-xs flex flex-col items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-emerald-400" /> Match execution successfully terminated and recorded.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Sidebar: Custom Pure-CSS Cricket Visualizations Layout */}
                        <div className="space-y-6">
                          {/* 1. Isometric Ground Simulation Arena Map Graphic */}
                          <div className="rounded-2xl border border-blue-950 bg-[#0a1128] p-5 flex flex-col gap-4 shadow-xl">
                            <div className="flex items-center gap-2 border-b border-blue-950 pb-2">
                              <Tv className="w-4 h-4 text-emerald-400" />
                              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400">Ground Field Canvas</span>
                            </div>
                            
                            {/* Isometric Field Oval Design */}
                            <div className="w-full aspect-[4/3] bg-gradient-to-b from-emerald-600 to-green-700 rounded-[50%] border-4 border-white/20 relative flex items-center justify-center overflow-hidden shadow-inner shadow-black/30">
                              <div className="absolute inset-4 border border-dashed border-white/10 rounded-[50%]" />
                              
                              {/* Central Pitch Strip */}
                              <div className="w-7 h-24 bg-gradient-to-b from-amber-200 to-amber-300 rounded border-2 border-amber-400/20 flex flex-col justify-between py-1 shadow-md transform rotate-12">
                                <div className="w-full h-1 bg-white/40" />
                                <div className="w-full h-[1px] bg-amber-600/10" />
                                <div className="w-full h-1 bg-white/40" />
                              </div>
                            </div>
                          </div>

                          {/* 2. Interactive Premium Leather Cricket Ball Element */}
                          <div className="rounded-2xl border border-blue-950 bg-[#0a1128] p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px] shadow-xl">
                            <div className="absolute top-4 left-4 flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase font-mono">Physics Canvas</span>
                            </div>
                            <motion.div 
                              className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-950 relative shadow-[0_0_40px_rgba(185,28,28,0.25)] cursor-pointer overflow-hidden flex items-center justify-center mt-4"
                              animate={{ rotate: isBallHovered ? 360 : 0 }}
                              transition={{ ease: "linear", duration: 8, repeat: Infinity }}
                              onHoverStart={() => setIsBallHovered(true)}
                              onHoverEnd={() => setIsBallHovered(false)}
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="absolute inset-y-0 left-1/2 w-2 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 transform -translate-x-1/2 flex flex-col justify-between py-1 opacity-90">
                                {[...Array(10)].map((_, i) => <div key={i} className="w-full h-[2px] bg-red-950/40 my-[1px]" />)}
                              </div>
                              <div className="absolute inset-y-0 left-[calc(1/2-3px)] w-[1px] bg-white/30 transform -translate-x-1/2 border-dashed" />
                              <div className="absolute inset-y-0 left-[calc(1/2+3px)] w-[1px] bg-white/30 transform -translate-x-1/2 border-dashed" />
                            </motion.div>
                            <p className="mt-4 text-[10px] text-center font-mono text-slate-500 max-w-[200px]">
                              Hover over leather element to test rotation aerodynamics.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : activeTeam ? (
                      // ==========================================
                      // VIEW 3: FRANCHISE SQUAD PLAYER CONFIGURATION MATRIX
                      // ==========================================
                      <motion.div key="roster" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="space-y-4">
                          <button onClick={() => { setActiveTeam(null); setEditingId(null); }} className="text-xs text-slate-400 hover:text-emerald-400 font-bold flex items-center gap-1.5 transition-colors uppercase tracking-wider">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Console
                          </button>
                          <div className="bg-zinc-900/20 border border-zinc-800/40 p-6 rounded-2xl shadow-xl backdrop-blur-md">
                            <h2 className="text-2xl font-black text-zinc-100 tracking-tight uppercase">{activeTeam.name}</h2>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold font-mono text-[10px] mt-0.5">Roster Registry</p>
                            
                            <form onSubmit={handleCreatePlayer} className="space-y-4 mt-6">
                              <input type="text" name="name" required value={playerData.name} onChange={handlePlayerChange} placeholder="Athlete Player Name" className="w-full bg-[#070709] border border-zinc-900 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-200" />
                              <select name="playing_role" value={playerData.playing_role} onChange={handlePlayerChange} className="w-full bg-[#070709] border border-zinc-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-400">
                                <option value="Batsman">Batsman</option>
                                <option value="Bowler">Bowler</option>
                                <option value="All-Rounder">All-Rounder</option>
                              </select>
                              <button type="submit" className="w-full h-10 bg-emerald-500 text-zinc-950 font-black uppercase tracking-wider rounded-xl text-xs transition-colors shadow-md">Add Player</button>
                            </form>
                          </div>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                          <h3 className="text-xl font-bold tracking-tight text-zinc-200 flex items-center gap-2">
                            <Users className="w-5 h-5 text-zinc-600" /> Registered Athletes ({players.length})
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {players.map((p: any) => (
                              <div key={p.id} className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/40 flex justify-between items-center shadow-md backdrop-blur-sm">
                                {editingId === p.id ? (
                                  <div className="flex gap-2 w-full items-center">
                                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-slate-950 border border-zinc-800 text-xs px-2 py-1.5 rounded-lg text-zinc-200 focus:outline-none w-1/2" />
                                    <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className="bg-slate-950 border border-zinc-800 text-xs px-2 py-1.5 rounded-lg text-zinc-400 focus:outline-none w-1/3">
                                      <option value="Batsman">Batsman</option>
                                      <option value="Bowler">Bowler</option>
                                      <option value="All-Rounder">All-Rounder</option>
                                    </select>
                                    <button onClick={() => saveEditedPlayer(p.id)} className="p-1.5 bg-emerald-600 rounded text-zinc-950 hover:bg-emerald-500 transition-colors"><Save className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 rounded text-zinc-400 hover:bg-zinc-700 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex flex-col">
                                      <span className="font-bold text-zinc-100">{p.name}</span>
                                      <span className="text-[10px] text-emerald-500/60 font-mono font-bold mt-0.5 uppercase tracking-wider">{p.playing_role}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button onClick={() => startEditPlayer(p)} className="p-1 text-zinc-500 hover:text-blue-400 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => deletePlayerRecord(p.id)} className="p-1 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : activeTournament ? (
                      // ==========================================
                      // VIEW 2: LEAGUE FRAME OPERATIONS WORKSPACE CONSOLE
                      // ==========================================
                      <motion.div key="workspace" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="space-y-4">
                          <button onClick={() => { setActiveTournament(null); setEditingId(null); }} className="text-xs text-slate-400 hover:text-[#10b981] font-bold flex items-center gap-1.5 transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace Hub
                          </button>
                          
                          <div className="p-6 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl shadow-xl backdrop-blur-md">
                            <h3 className="font-bold text-sm text-zinc-200 mb-1 flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" /> Register Club</h3>
                            <p className="text-[11px] text-zinc-500 mb-4">Add a unique franchise participant unit.</p>
                            <form onSubmit={handleCreateTeam} className="space-y-3">
                              <input type="text" name="name" required value={teamData.name} onChange={handleTeamChange} placeholder="Team Name" className="w-full bg-[#070709] border border-zinc-900 p-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-500/40" />
                              <button type="submit" className="w-full py-2.5 bg-zinc-950 border border-zinc-800/60 hover:bg-zinc-900 text-zinc-300 text-xs rounded-xl transition-colors font-semibold">Save Franchise Model</button>
                            </form>
                          </div>

                          <div className="p-6 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl shadow-xl backdrop-blur-md">
                            <h3 className="font-bold text-sm text-zinc-200 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> Compile Match Link</h3>
                            <p className="text-[11px] text-zinc-500 mb-4">Generate scheduled tournament fixtures.</p>
                            <form onSubmit={handleCreateMatch} className="space-y-3">
                              <select name="team_a_id" required value={matchData.team_a_id} onChange={handleMatchChange} className="w-full bg-[#070709] border border-zinc-900 p-2.5 rounded-xl text-xs focus:outline-none text-zinc-400">
                                <option value="">Select First Side</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </select>
                              <select name="team_b_id" required value={matchData.team_b_id} onChange={handleMatchChange} className="w-full bg-[#070709] border border-zinc-900 p-2.5 rounded-xl text-xs focus:outline-none text-zinc-400">
                                <option value="">Select Second Side</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </select>
                              <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider">Authorize Fixture</button>
                            </form>
                          </div>
                        </div>

                        {/* List Matrices display panel */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="space-y-3">
                            <h3 className="font-bold text-lg tracking-tight text-zinc-200 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500" /> Managed Competitors ({teams.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {teams.map((t: any) => (
                                <div key={t.id} className="p-4 bg-zinc-900/10 border border-zinc-800/40 rounded-xl flex justify-between items-center shadow-sm backdrop-blur-sm">
                                  {editingId === t.id ? (
                                    <div className="flex gap-2 w-full items-center">
                                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-slate-950 border border-zinc-800 text-xs px-2 py-1 rounded-lg text-zinc-200 focus:outline-none flex-1" />
                                      <button onClick={() => saveEditedTeam(t.id)} className="p-1.5 bg-emerald-600 rounded text-zinc-950 hover:bg-emerald-500 transition-colors"><Save className="w-3.5 h-3.5" /></button>
                                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 rounded text-zinc-400 hover:bg-zinc-700 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="text-sm font-black text-slate-200 uppercase tracking-tight">{t.name}</span>
                                      <div className="flex items-center gap-1.5">
                                        {/* CRITICAL ROUTING ERROR FIXED: selectTeamWorkspace officially mapped to function loop */}
                                        <button onClick={() => selectTeamWorkspace(t)} className="text-xs text-emerald-400 hover:underline font-bold px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-md uppercase tracking-wider">Squad</button>
                                        <button onClick={() => startEditTeam(t)} className="p-1 text-zinc-500 hover:text-blue-400 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => deleteTeamRecord(t.id)} className="p-1 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      // ==========================================
                      // VIEW 1: PLATFORM TOURNAMENT FRAME SELECTOR HUB BASE
                      // ==========================================
                      <motion.div key="selector" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="bg-zinc-900/20 border border-zinc-800/40 p-6 rounded-3xl shadow-xl relative overflow-hidden backdrop-blur-md">
                          <h2 className="font-bold text-lg text-zinc-100 mb-1 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-400" /> Launch Tournament</h2>
                          <p className="text-xs text-slate-400 mb-6">Instantiate a tournament parameter framework structural engine instance.</p>
                          
                          <form onSubmit={handleCreateTournament} className="space-y-4">
                            <input type="text" name="name" required value={tournamentData.name} onChange={handleTournamentChange} placeholder="League Identifier" className="w-full bg-[#070709] border border-zinc-900 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-200 placeholder-zinc-700 transition-colors font-medium" />
                            <input type="text" name="location" required value={tournamentData.location} onChange={handleTournamentChange} placeholder="Venue Location" className="w-full bg-[#070709] border border-zinc-900 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500/40 text-zinc-200 placeholder-zinc-700 transition-colors font-medium" />
                            <button type="submit" className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md">
                              {loading ? 'Compiling Parameters...' : 'Instantiate Framework'}
                            </button>
                          </form>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                          <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase border-l-2 border-emerald-500 pl-2.5 flex items-center gap-2"><Target className="w-5 h-5 text-zinc-600" /> Active Workspace Pools ({tournaments.length})</h2>
                          {tournaments.length === 0 ? (
                            <div className="border border-dashed border-blue-950 bg-[#0a1128]/20 rounded-2xl py-24 text-center text-slate-500 font-mono text-xs">No live tournament elements deployed. Add parameters via sidebar engine.</div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {tournaments.map((t: any) => (
                                <div key={t.id} className="p-6 bg-zinc-900/20 border border-zinc-800/40 rounded-2xl flex flex-col justify-between shadow-md hover:border-emerald-500/30 transition-colors group backdrop-blur-sm relative">
                                  {editingId === t.id ? (
                                    <div className="space-y-3 w-full py-2">
                                      <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-950 border border-zinc-800 text-xs p-2 rounded-xl text-zinc-200 focus:outline-none" />
                                      <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full bg-slate-950 border border-zinc-800 text-xs p-2 rounded-xl text-zinc-200 focus:outline-none" />
                                      <div className="flex justify-end gap-2">
                                        <button onClick={(e) => saveEditedTournament(t.id, e)} className="px-3 py-1.5 bg-emerald-600 rounded-lg text-zinc-950 font-bold text-xs flex items-center gap-1 hover:bg-emerald-500 transition-all"><Save className="w-3.5 h-3.5" /> Save</button>
                                        <button onClick={(e) => { e.stopPropagation(); setEditingId(null); }} className="px-3 py-1.5 bg-zinc-800 rounded-lg text-zinc-400 text-xs flex items-center gap-1 hover:bg-zinc-700 transition-all"><X className="w-3.5 h-3.5" /> Cancel</button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div>
                                        <div className="flex justify-between items-start mb-2 pr-12">
                                          <h3 className="font-black text-white text-base tracking-tight group-hover:text-emerald-400 transition-colors uppercase leading-none">{t.name}</h3>
                                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-emerald-400 border border-blue-900/50">{t.status || "Active"}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-900" /> {t.location}</p>
                                      </div>
                                      <div className="absolute top-4 right-4 flex items-center gap-1 z-20">
                                        <button onClick={(e) => startEditTournament(t, e)} className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                        <button onClick={(e) => deleteTournamentRecord(t.id, e)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                      </div>
                                      <button onClick={() => selectTournamentWorkspace(t)} className="mt-6 w-full py-2.5 bg-[#070709] border border-zinc-900 hover:border-zinc-800 text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider shadow-inner">
                                        Enter Operator Room <ChevronRight className="w-4 h-4 text-emerald-500" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* SECTION: FOOTER STENCIL LINKS */}
              <section className="w-full bg-[#0a1128] border-t border-blue-950/60 py-12 px-6 md:px-12 mt-12 shadow-inner">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-medium text-slate-400">
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-white tracking-widest border-b border-blue-950 pb-2">Management</h4>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Tournament Selector</p>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Franchise Registries</p>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Match Fixture Links</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-white tracking-widest border-b border-blue-950 pb-2">Telemetry</h4>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Real-Time Scorecards</p>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Over-By-Over Ingestion</p>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Live Broadcaster Nodes</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-white tracking-widest border-b border-blue-950 pb-2">Guidelines</h4>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Match Execution Standards</p>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Roster Limits Matrix</p>
                    <p className="hover:text-blue-400 cursor-pointer transition-colors">Operational Protocols</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black uppercase text-white tracking-widest border-b border-blue-950 pb-2">Platform Node</h4>
                    <p className="text-[11px] font-mono text-slate-500 leading-relaxed uppercase">
                      Base Pipeline Engine configuration matrix. Authorized operations compiled directly via remote backend endpoints.
                    </p>
                  </div>
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="w-full bg-slate-950 py-4 px-6 border-t border-blue-950 text-center text-[10px] font-mono text-slate-500 uppercase tracking-widest">
        © 2026 CRICKET SAAS OPERATIONAL ENGINE. MATCHING ATHLETIC PORTAL CORE GRAPHIC INTERFACE LAYOUT.
      </footer>
    </div>
  );
}


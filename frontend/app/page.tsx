"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Trophy, Calendar, LogOut, ChevronRight, Mail, Lock, Users, 
  ArrowLeft, Radio, UserPlus, Phone, Activity, MapPin, Plus,
  Edit2, Trash2, X, Save, Shield, Swords, RotateCw
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
  tournament_id: string;
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

  // Form State Configurations
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [tournamentData, setTournamentData] = useState({ name: '', location: '', overs_per_match: 20, ball_type: 'Leather' });
  const [teamData, setTeamData] = useState({ name: '', captain_name: '', logo_url: '' });
  const [playerData, setPlayerData] = useState({ name: '', phone: '', playing_role: 'Batsman', batting_style: 'Right-hand Bat', bowling_style: 'None' });
  const [matchData, setMatchData] = useState({ team_a_id: '', team_b_id: '', venue: '' });

  // Live Score State Modules
  const [scoreA, setScoreA] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [scoreB, setScoreB] = useState({ runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [currentInnings, setCurrentInnings] = useState<'A' | 'B'>('A');
  const [matchStatus, setMatchStatus] = useState<string>('Live');

  // NEW: Live Striker / Bowler Telemetry States
  const [striker, setStriker] = useState({ name: "Striker Batsman", runs: 0, balls: 4, fours: 0, sixes: 0 });
  const [nonStriker, setNonStriker] = useState({ name: "Non-Striker", runs: 0, balls: 0, fours: 0, sixes: 0 });
  const [currentBowler, setCurrentBowler] = useState({ name: "Active Bowler", overs: 0, balls: 0, maidens: 0, runs: 0, wickets: 0 });

  // Master Data States
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBallHovered, setIsBallHovered] = useState<boolean>(false);

  // CRUD Overlay Modal Configuration States
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    if (savedToken) {
      setToken(savedToken);
      if (savedEmail) setOrganizerEmail(savedEmail);
      fetchTournaments(savedToken);
    }
  }, []);

  // --- CRUD LIFECYCLE MANAGEMENT ENGINE ---

  const fetchTournaments = async (t: string) => {
    const res = await fetch('http://127.0.0.1:8000/api/tournaments', { headers: { 'Authorization': `Bearer ${t}` } });
    if (res.ok) setTournaments(await res.json());
  };

  const handleUpdateTournament = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingTournament) return;
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${editingTournament.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editingTournament)
    });
    if (res.ok) {
      setEditingTournament(null);
      fetchTournaments(token);
      if (activeTournament?.id === editingTournament.id) setActiveTournament(editingTournament);
    }
  };

  const handleDeleteTournament = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !confirm("Are you sure you want to delete this tournament? All data inside it will be permanently lost.")) return;
    const res = await fetch(`http://127.0.0.1:8000/api/tournaments/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      if (activeTournament?.id === id) setActiveTournament(null);
      fetchTournaments(token);
    }
  };

  const loadTournamentControlRoom = async (tournament: Tournament) => {
    setActiveTournament(tournament);
    setActiveTeam(null);
    const teamRes = await fetch(`http://127.0.0.1:8000/api/tournaments/${tournament.id}/teams`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (teamRes.ok) setTeams(await teamRes.json());
    const matchRes = await fetch(`http://127.0.0.1:8000/api/tournaments/${tournament.id}/matches`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (matchRes.ok) setMatches(await matchRes.json());
  };

  const handleUpdateTeam = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingTeam || !activeTournament) return;
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${editingTeam.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editingTeam)
    });
    if (res.ok) {
      setEditingTeam(null);
      loadTournamentControlRoom(activeTournament);
    }
  };

  const handleDeleteTeam = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !activeTournament || !confirm("Delete this team registration from the participating pool?")) return;
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      if (activeTeam?.id === id) setActiveTeam(null);
      loadTournamentControlRoom(activeTournament);
    }
  };

  const loadTeamRoster = async (team: Team) => {
    setActiveTeam(team);
    const res = await fetch(`http://127.0.0.1:8000/api/teams/${team.id}/players`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) setPlayers(await res.json());
  };

  const handleUpdatePlayer = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingPlayer || !activeTeam) return;
    const res = await fetch(`http://127.0.0.1:8000/api/players/${editingPlayer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editingPlayer)
    });
    if (res.ok) {
      setEditingPlayer(null);
      loadTeamRoster(activeTeam);
    }
  };

  const handleDeletePlayer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !activeTeam || !confirm("Erase this player from the official squad card roster?")) return;
    const res = await fetch(`http://127.0.0.1:8000/api/players/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) loadTeamRoster(activeTeam);
  };

  const handleUpdateMatch = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !editingMatch || !activeTournament) return;
    const res = await fetch(`http://127.0.0.1:8000/api/matches/${editingMatch.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editingMatch)
    });
    if (res.ok) {
      setEditingMatch(null);
      loadTournamentControlRoom(activeTournament);
    }
  };

  const handleDeleteMatch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token || !activeTournament || !confirm("Erase this fixture data record?")) return;
    const res = await fetch(`http://127.0.0.1:8000/api/matches/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) loadTournamentControlRoom(activeTournament);
  };

  // --- SCORECARD PROCESSING ---
  const loadLiveScorecardConsole = (match: Match) => {
    setActiveMatch(match);
    setScoreA({ runs: match.team_a_runs, wickets: match.team_a_wickets, overs: 0, balls: 0 });
    setScoreB({ runs: match.team_b_runs, wickets: match.team_b_wickets, overs: 0, balls: 0 });
    setMatchStatus('Live');
    setCurrentInnings('A');
  };

  const rotateStrikeManual = () => {
    const backup = striker;
    setStriker(nonStriker);
    setNonStriker(backup);
  };

  const handleBallDelivered = (runsAdded: number, isWicket: boolean) => {
    // 1. Update Core Innings Score
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

    // 2. Update In-Game Player Telemetry Stats
    if (!isWicket) {
      setStriker(prev => ({
        ...prev,
        runs: prev.runs + runsAdded,
        balls: prev.balls + 1,
        fours: runsAdded === 4 ? prev.fours + 1 : prev.fours,
        sixes: runsAdded === 6 ? prev.sixes + 1 : prev.sixes
      }));
    } else {
      setStriker({ name: "New Batsman", runs: 0, balls: 0, fours: 0, sixes: 0 });
    }

    // Update Bowler metrics
    let nextBowlerBalls = currentBowler.balls + 1;
    let nextBowlerOvers = currentBowler.overs;
    if (nextBowlerBalls === 6) { nextBowlerOvers += 1; nextBowlerBalls = 0; }
    setCurrentBowler(prev => ({
      ...prev,
      balls: nextBowlerBalls,
      overs: nextBowlerOvers,
      runs: prev.runs + runsAdded,
      wickets: isWicket ? prev.wickets + 1 : prev.wickets
    }));

    // Auto-swap strike on odd runs
    if (runsAdded === 1 || runsAdded === 3) {
      rotateStrikeManual();
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

  // --- SUBMISSIONS HANDLERS ---
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
    <div className="w-full flex-1 flex flex-col relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden">
      
      {/* 🏟️ PERMANENT GLOBAL BACKGROUND CONTAINER LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-zinc-950">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1600&auto=format&fit=crop" 
          alt="Cricket Arena Field Backdrop" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/80 to-zinc-950/95" />
      </div>

      {/* --- DASHBOARD LOGGED-IN NAVIGATION ROOT BAR --- */}
      {token && (
        <div className="w-full bg-zinc-900/60 border-b border-zinc-800/80 px-6 py-4 flex justify-between items-center relative z-20 backdrop-blur-md">
          <div className="text-xs font-mono text-emerald-400 bg-zinc-950/80 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" /> System Live Account: <span className="text-white font-bold">{organizerEmail}</span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); setToken(null); setActiveTournament(null); setActiveMatch(null); setActiveTeam(null); }} 
            className="text-xs bg-zinc-950 border border-zinc-800/80 px-4 py-2 rounded-xl text-zinc-400 font-bold flex items-center gap-1.5 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" /> Leave Workspace
          </button>
        </div>
      )}

      {/* --- VIEW ROUTER RENDERING CONTROLLER CANVAS --- */}
      <div className="flex-1 w-full flex flex-col relative z-10 bg-transparent">
        <AnimatePresence mode="wait">
          {!token ? (
            <motion.div 
              key="auth" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="w-full h-screen max-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-transparent"
            >
              {/* Left Column Section */}
              <div className="hidden lg:flex lg:col-span-7 relative flex-col justify-center px-16 xl:px-24 h-full border-r border-zinc-800/40 bg-transparent">
                <div className="relative z-20 max-w-xl text-left">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
                    ⚡ Live Scoring Matrix v2.3
                  </span>
                  <h1 className="text-5xl font-black tracking-tighter uppercase leading-[0.95] text-white mb-4">
                    GullyScores <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 font-light tracking-normal">
                      Tournament Deck
                    </span>
                  </h1>
                  <p className="text-zinc-300 text-sm leading-relaxed max-w-md mt-4 font-medium">
                    Log match updates seamlessly, configure bracket profiles dynamically, and ditch messy scorebooks with an integrated local analytics platform.
                  </p>
                </div>
              </div>

              {/* Right Column Section: Authentication Controller */}
              <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-12 h-full relative overflow-y-auto bg-zinc-950/80 backdrop-blur-md">
                <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl my-auto">
                  
                  <div className="grid grid-cols-2 p-1 bg-zinc-950 border border-zinc-800/50 rounded-xl mb-8">
                    <button type="button" onClick={() => { setIsLoginView(true); setStatusMessage(null); }} className={`py-2.5 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${isLoginView ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>Sign In</button>
                    <button type="button" onClick={() => { setIsLoginView(false); setStatusMessage(null); }} className={`py-2.5 text-xs uppercase font-mono font-bold tracking-wider rounded-lg transition-all cursor-pointer ${!isLoginView ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}>Register Free</button>
                  </div>

                  <form onSubmit={isLoginView ? handleLogin : handleSignup} className="space-y-5">
                    {!isLoginView && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block ml-1">Full Operator Name</label>
                        <div className="relative">
                          <UserPlus className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                          <input type="text" placeholder="e.g. Ashok Kumar" required value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition-all placeholder-zinc-600" />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block ml-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                        <input type="email" placeholder="name@domain.com" required value={formData.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, email: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition-all placeholder-zinc-600" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                        <input type="password" placeholder="••••••••••••" required value={formData.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, password: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white transition-all placeholder-zinc-600" />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all cursor-pointer mt-4 active:scale-95">Authorize Access Profile</button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : activeMatch ? (
            // --- SCORER APP PANEL BOARD CONTROL CONSOLE ---
            <motion.div key="scoring" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent relative z-10">
              <div className="lg:col-span-2 bg-zinc-900/80 border border-zinc-800 px-6 py-6 rounded-3xl backdrop-blur-md shadow-2xl space-y-6">
                <button onClick={() => setActiveMatch(null)} className="text-[10px] uppercase font-mono font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Back to Match Center</button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-6 rounded-2xl border transition-all cursor-pointer ${currentInnings === 'A' ? 'bg-zinc-950 border-emerald-500 ring-1 ring-emerald-500/10' : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'}`} onClick={() => setCurrentInnings('A')}>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">1st Innings (Team A)</span>
                    <div className="text-5xl font-black mt-2 text-white">{scoreA.runs}<span className="text-zinc-500 font-light text-3xl">/{scoreA.wickets}</span></div>
                    <span className="inline-block text-[11px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 mt-3 border border-zinc-800">Overs: {scoreA.overs}.{scoreA.balls}</span>
                  </div>
                  <div className={`p-6 rounded-2xl border transition-all cursor-pointer ${currentInnings === 'B' ? 'bg-zinc-950 border-emerald-500 ring-1 ring-emerald-500/10' : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'}`} onClick={() => setCurrentInnings('B')}>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block">2nd Innings (Team B)</span>
                    <div className="text-5xl font-black mt-2 text-white">{scoreB.runs}<span className="text-zinc-500 font-light text-3xl">/{scoreB.wickets}</span></div>
                    <span className="inline-block text-[11px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-300 mt-3 border border-zinc-800">Overs: {scoreB.overs}.{scoreB.balls}</span>
                  </div>
                </div>

                {/* 📊 NEW: LIVE TELEMETRY STATS TRACKER OVERLAY CARD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl backdrop-blur-sm">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block flex items-center gap-1"><Swords className="w-3.5 h-3.5 text-emerald-400" /> Active Batsmen</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
                        <span className="font-bold text-white flex items-center gap-1">🏏 {striker.name} *</span>
                        <span className="font-mono font-black text-emerald-400">{striker.runs} <span className="text-zinc-500 font-normal">({striker.balls}b)</span></span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-900/20 p-2 rounded-lg border border-zinc-800/50">
                        <span className="text-zinc-400">{nonStriker.name}</span>
                        <span className="font-mono text-zinc-400">{nonStriker.runs} <span className="text-zinc-600 font-normal">({nonStriker.balls}b)</span></span>
                      </div>
                    </div>
                    <button onClick={rotateStrikeManual} className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 hover:text-emerald-400 flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 transition-all active:scale-95 cursor-pointer"><RotateCw className="w-3 h-3" /> Swap Strike</button>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-teal-400" /> Bowler Spells</span>
                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 text-xs flex justify-between items-center h-[68px]">
                      <div>
                        <span className="font-bold text-white block">{currentBowler.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5 block">Overs: {currentBowler.overs}.{currentBowler.balls}</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-zinc-500 text-[10px] block font-bold uppercase">W-R</span>
                        <span className="font-black text-teal-400 text-sm">{currentBowler.wickets}-{currentBowler.runs}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-zinc-400 block mb-4 text-center">Tap to Score Current Ball</span>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {[0, 1, 2, 3, 4, 6].map((run) => (
                      <button key={run} onClick={() => handleBallDelivered(run, false)} className="w-14 h-14 bg-zinc-900 hover:bg-emerald-500 hover:text-zinc-950 border border-zinc-800 text-white rounded-xl font-black text-sm transition-all shadow-md active:scale-90 cursor-pointer">{run}</button>
                    ))}
                    <button onClick={() => handleBallDelivered(0, true)} className="px-6 h-14 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95 cursor-pointer">Wicket</button>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[320px] shadow-2xl backdrop-blur-md relative">
                <motion.div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-950 border-2 border-red-500/30 shadow-2xl cursor-pointer" animate={{ rotate: isBallHovered ? 360 : 0, scale: isBallHovered ? 1.05 : 1 }} transition={{ ease: "linear", duration: 4, repeat: Infinity }} onHoverStart={() => setIsBallHovered(true)} onHoverEnd={() => setIsBallHovered(false)} />
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase mt-5 flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800 shadow">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Feed Sync Active
                </span>
              </div>
            </motion.div>
          ) : activeTournament ? (
            // --- CONTROL ROOM VIEW CONTROLLER PANELS ---
            <motion.div key="control-room" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent relative z-10">
              <div className="space-y-6">
                <button onClick={() => { setActiveTournament(null); setActiveTeam(null); }} className="text-[10px] uppercase font-mono font-bold text-zinc-400 hover:text-emerald-400 flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer"><ArrowLeft className="w-3.5 h-3.5" /> Back to Tournaments</button>
                
                {/* Create Team Card */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Register a New Team</h3>
                  <form onSubmit={handleCreateTeam} className="space-y-3">
                    <input type="text" placeholder="Team Name (e.g., Savalakkaran CC)" required value={teamData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setTeamData({...teamData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-600 transition-colors" />
                    <input type="text" placeholder="Captain's Full Name" value={teamData.captain_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setTeamData({...teamData, captain_name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-600 transition-colors" />
                    <button type="submit" className="w-full h-11 bg-emerald-500 text-zinc-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"><Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Team</button>
                  </form>
                </div>

                {/* Add Player Card */}
                {activeTeam ? (
                  <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 mb-1 flex items-center gap-2"><UserPlus className="w-4 h-4 text-teal-400" /> Add Player to Squad</h3>
                    <p className="text-[9px] font-mono text-zinc-500 mb-4 uppercase tracking-wider">Target Team: <span className="text-emerald-400 font-bold">{activeTeam.name}</span></p>
                    <form onSubmit={handleAddPlayer} className="space-y-3">
                      <input type="text" placeholder="Player Full Name" required value={playerData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayerData({...playerData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-600" />
                      <select value={playerData.playing_role} onChange={(e: ChangeEvent<HTMLSelectElement>) => setPlayerData({...playerData, playing_role: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none">
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-Rounder">All-Rounder</option>
                        <option value="Wicketkeeper">Wicketkeeper</option>
                      </select>
                      <button type="submit" className="w-full h-11 bg-teal-500 text-zinc-950 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all cursor-pointer active:scale-95">Add Player</button>
                    </form>
                  </motion.div>
                ) : (
                  <div className="p-5 border border-zinc-800 bg-zinc-900/40 text-center text-[10px] font-mono text-zinc-500 uppercase tracking-widest rounded-2xl backdrop-blur-sm">
                    Select a registered team card below to modify its player roster sheet
                  </div>
                )}

                {/* Schedule Match Card */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl backdrop-blur-md">
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-200 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-400" /> Schedule a Match</h3>
                  <form onSubmit={handleScheduleMatch} className="space-y-3">
                    <select required value={matchData.team_a_id} onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchData({...matchData, team_a_id: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="">Select Team A</option>
                      {teams.map(t => <option key={t.id} value={t.id} className="text-zinc-900">{t.name}</option>)}
                    </select>
                    <select required value={matchData.team_b_id} onChange={(e: ChangeEvent<HTMLSelectElement>) => setMatchData({...matchData, team_b_id: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer">
                      <option value="">Select Team B</option>
                      {teams.map(t => <option key={t.id} value={t.id} className="text-zinc-900">{t.name}</option>)}
                    </select>
                    <input type="text" placeholder="Match Venue / Ground Oval" value={matchData.venue} onChange={(e: ChangeEvent<HTMLInputElement>) => setMatchData({...matchData, venue: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-600" />
                    <button type="submit" className="w-full h-11 bg-purple-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all cursor-pointer active:scale-95">Create Fixture</button>
                  </form>
                </div>
              </div>

              {/* CRUD Configuration Tables */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Registered Team Panel list */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-4">Participating Teams ({teams.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teams.map(team => (
                      <div 
                        key={team.id} 
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${activeTeam?.id === team.id ? 'bg-zinc-950 border-emerald-500 shadow-md shadow-emerald-950/50' : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700'}`} 
                        onClick={() => loadTeamRoster(team)}
                      >
                        <div className="flex justify-between items-start w-full">
                          <div>
                            <span className="font-extrabold text-white uppercase text-sm tracking-tight block">{team.name}</span>
                            <span className="text-[10px] font-mono text-zinc-400 block mt-1.5 uppercase font-bold">Captain: <span className="text-emerald-400 font-sans font-medium">{team.captain_name || "Unassigned"}</span></span>
                          </div>
                          
                          {/* Inline Operation Controls Container */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setEditingTeam(team)} className="p-1.5 text-zinc-400 hover:text-teal-400 hover:bg-zinc-900 border border-zinc-800 rounded-md transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => handleDeleteTeam(team.id, e)} className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 border border-zinc-800 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Player Squad roster lists inside selected team */}
                  {activeTeam && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-5 border-t border-zinc-800">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-widest block mb-3">Player Squad Sheet: {activeTeam.name}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {players.length === 0 ? (
                          <span className="text-xs text-zinc-500 font-medium">No players registered in this squad.</span>
                        ) : (
                          players.map(p => (
                            <div key={p.id} className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl flex justify-between items-center group">
                              <Link href={`/players/${p.id}`} className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 border border-zinc-800 rounded">{p.playing_role}</span>
                              </Link>
                              <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingPlayer(p)} className="p-1 text-zinc-400 hover:text-teal-400 rounded"><Edit2 className="w-3 h-3" /></button>
                                <button onClick={(e) => handleDeletePlayer(p.id, e)} className="p-1 text-zinc-400 hover:text-rose-400 rounded"><Trash2 className="w-3 h-3" /></button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Match Centers Fixtures tracking display card block */}
                <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase block mb-4">League Fixtures & Match Centers ({matches.length})</span>
                  <div className="grid grid-cols-1 gap-3">
                    {matches.length === 0 ? (
                      <div className="p-4 border border-dashed border-zinc-800 text-zinc-500 text-xs text-center rounded-xl">No scheduled match formats discovered.</div>
                    ) : (
                      matches.map(m => {
                        const teamA = teams.find(t => t.id === m.team_a_id);
                        const teamB = teams.find(t => t.id === m.team_b_id);
                        const teamAName = teamA ? teamA.name : "Team A";
                        const teamBName = teamB ? teamB.name : "Team B";

                        return (
                          <div key={m.id} className="p-4 bg-zinc-950/40 border border-zinc-800 rounded-2xl flex justify-between items-center group hover:border-zinc-700 transition-all">
                            <div className="flex items-center gap-3">
                              <span className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800 text-emerald-400">🏏</span>
                              <div>
                                <span className="text-xs font-black text-white uppercase tracking-tight block">
                                  {teamAName} <span className="text-zinc-500 font-light font-mono px-1">VS</span> {teamBName}
                                </span>
                                <span className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-zinc-500" /> Ground: <span className="text-zinc-200 font-sans">{m.venue || "Local Oval"}</span></span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditingMatch(m)} className="p-2 text-zinc-500 hover:text-teal-400 hover:bg-zinc-900 border border-zinc-800 rounded-xl transition-all"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={(e) => handleDeleteMatch(m.id, e)} className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-900 border border-zinc-800 rounded-xl transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => loadLiveScorecardConsole(m)} className="px-4 py-2 bg-emerald-500 text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-all cursor-pointer active:scale-95">Open Dashboard</button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // --- GENERAL WORKSPACE HOME DASHBOARD ---
            <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-transparent relative z-10">
              <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md">
                <h2 className="font-black text-md text-white uppercase tracking-tight mb-1 flex items-center gap-2"><Trophy className="w-5 h-5 text-emerald-400" /> Create Tournament</h2>
                <p className="text-[11px] text-zinc-400 mb-6 font-medium">Set up an online dashboard to log live score accounts.</p>
                <form onSubmit={handleCreateTournament} className="space-y-4">
                  <input type="text" placeholder="Tournament Name (e.g., Summer Cup 2026)" required value={tournamentData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setTournamentData({...tournamentData, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-600 transition-colors" />
                  <input type="text" placeholder="Location / City Hosting" value={tournamentData.location} onChange={(e: ChangeEvent<HTMLInputElement>) => setTournamentData({...tournamentData, location: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-600 transition-colors" />
                  <button type="submit" className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all mt-2 cursor-pointer active:scale-95">{loading ? 'Creating Matrix...' : 'Create Tournament'}</button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4 bg-transparent">
                <h2 className="text-xs font-mono font-black tracking-widest text-zinc-400 uppercase border-l-4 border-emerald-500 pl-3 mb-4">Your Active Tournaments ({tournaments.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-transparent">
                  {tournaments.map((t: Tournament) => (
                    <div key={t.id} className="p-6 bg-zinc-900/80 border border-zinc-800/60 rounded-2xl flex flex-col justify-between shadow-xl group hover:border-zinc-700 transition-all backdrop-blur-sm relative">
                      
                      {/* Floating operations menu container */}
                      <div className="absolute top-4 right-4 flex items-center gap-1 z-20">
                        <button onClick={(e) => { e.stopPropagation(); setEditingTournament(t); }} className="p-1.5 bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-teal-400 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={(e) => handleDeleteTournament(t.id, e)} className="p-1.5 bg-zinc-950 border border-zinc-800/80 text-zinc-400 hover:text-rose-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>

                      <div>
                        <h3 className="font-black text-white text-md uppercase tracking-tight line-clamp-1 pr-16 group-hover:text-emerald-400 transition-colors">{t.name}</h3>
                        <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-zinc-950 border border-emerald-500/20 text-emerald-400 mt-2">Active League Matrix</span>
                      </div>
                      <button onClick={() => loadTournamentControlRoom(t)} className="mt-8 w-full py-3 bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 text-xs text-emerald-400 font-extrabold flex items-center justify-center gap-1.5 uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-95">
                        Manage League Room <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- CRUD MODALS STACK MODIFIERS AREA --- */}
      <AnimatePresence>
        {/* Tournament editor Overlay */}
        {editingTournament && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-1.5"><Trophy className="w-4 h-4 text-emerald-400" /> Edit Tournament</h3>
                <button onClick={() => setEditingTournament(null)} className="p-1 text-zinc-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleUpdateTournament} className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Tournament Name</label><input type="text" value={editingTournament.name} onChange={(e) => setEditingTournament({...editingTournament, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" required /></div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Venue Location</label><input type="text" value={editingTournament.location || ''} onChange={(e) => setEditingTournament({...editingTournament, location: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" /></div>
                <button type="submit" className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save Framework Updates</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Team editor Overlay */}
        {editingTeam && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-1.5"><Users className="w-4 h-4 text-emerald-400" /> Edit Team</h3>
                <button onClick={() => setEditingTeam(null)} className="p-1 text-zinc-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleUpdateTeam} className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Team Name</label><input type="text" value={editingTeam.name} onChange={(e) => setEditingTeam({...editingTeam, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" required /></div>
                <div className="space-y-1"><label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Captain Name</label><input type="text" value={editingTeam.captain_name || ''} onChange={(e) => setEditingTeam({...editingTeam, captain_name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" /></div>
                <button type="submit" className="w-full h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Player editor Overlay */}
        {editingPlayer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-1.5"><UserPlus className="w-4 h-4 text-emerald-400" /> Update Player Profile</h3>
                <button onClick={() => setEditingPlayer(null)} className="p-1 text-zinc-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleUpdatePlayer} className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Full Profile Name</label><input type="text" value={editingPlayer.name} onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" required /></div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Playing Field Role</label>
                  <select value={editingPlayer.playing_role} onChange={(e) => setEditingPlayer({...editingPlayer, playing_role: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500">
                    <option value="Batsman">Batsman</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All-Rounder">All-Rounder</option>
                    <option value="Wicketkeeper">Wicketkeeper</option>
                  </select>
                </div>
                <button type="submit" className="w-full h-10 bg-teal-500 text-zinc-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save Player</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Match editor Overlay */}
        {editingMatch && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-400" /> Edit Fixture</h3>
                <button onClick={() => setEditingMatch(null)} className="p-1 text-zinc-500 hover:text-white rounded-lg"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleUpdateMatch} className="space-y-4">
                <div className="space-y-1"><label className="text-[10px] uppercase font-mono font-bold text-zinc-400">Ground Oval Venue</label><input type="text" value={editingMatch.venue || ''} onChange={(e) => setEditingMatch({...editingMatch, venue: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" /></div>
                <button type="submit" className="w-full h-10 bg-purple-500 text-white text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5" /> Synchronize Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
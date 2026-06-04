"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Calendar, Shield, LogOut, ChevronRight, Mail, Lock, Plus, Users, MapPin, Play,
  ArrowLeft, CheckCircle, Radio, Sparkles, AlertCircle, Tv, Zap, UserPlus
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
    <div className="w-full bg-[#020617] text-slate-100 flex-1 flex flex-col relative min-h-screen">
      {token && (
        <div className="max-w-7xl mx-auto w-full px-6 pt-6 flex justify-between items-center">
          <div className="text-xs font-mono text-emerald-400">Namespace: {organizerEmail}</div>
          <button onClick={() => { localStorage.clear(); setToken(null); setActiveTournament(null); setActiveMatch(null); setActiveTeam(null); }} className="text-xs bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-zinc-400 font-bold flex items-center gap-1.5 hover:text-white transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      )}

      <div className="flex-1 w-full flex flex-col">
        <AnimatePresence mode="wait">
          {!token ? (
            <motion.div key="auth" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md w-full mx-auto py-16 px-4">
              <div className="bg-[#0a1128] border border-blue-950 rounded-3xl p-8 shadow-2xl">
                <div className="flex gap-4 mb-6 border-b border-blue-950/60 pb-2">
                  <button onClick={() => setIsLoginView(true)} className={`flex-1 pb-3 text-xs font-bold uppercase ${isLoginView ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-500'}`}>Login</button>
                  <button onClick={() => setIsLoginView(false)} className={`flex-1 pb-3 text-xs font-bold uppercase ${!isLoginView ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-500'}`}>Signup</button>
                </div>
                <form onSubmit={isLoginView ? handleLogin : handleSignup} className="space-y-4">
                  {!isLoginView && <input type="text" placeholder="Operator Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl px-4 py-3 text-sm text-zinc-200" />}
                  <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl px-4 py-3 text-sm text-zinc-200" />
                  <input type="password" placeholder="Passphrase" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl px-4 py-3 text-sm text-zinc-200" />
                  {statusMessage && <div className="p-3 text-xs rounded-xl bg-blue-950 text-slate-300">{statusMessage.text}</div>}
                  <button type="submit" className="w-full h-11 bg-emerald-500 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all">Continue</button>
                </form>
              </div>
            </motion.div>
          ) : activeMatch ? (
            // LIVE SCORING LAYER
            <motion.div key="scoring" className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#0a1128] border border-blue-950 p-6 rounded-3xl">
                <button onClick={() => setActiveMatch(null)} className="text-xs uppercase text-slate-400 hover:text-emerald-400 flex items-center gap-1 mb-4 font-mono"><ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace</button>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`p-6 rounded-2xl border ${currentInnings === 'A' ? 'bg-zinc-900/60 border-emerald-500' : 'border-blue-950'}`} onClick={() => setCurrentInnings('A')}>
                    <span className="text-xs uppercase text-slate-500 font-bold block">Innings 1</span>
                    <div className="text-4xl font-black mt-2">{scoreA.runs}/{scoreA.wickets}</div>
                    <span className="text-xs font-mono block mt-2">Overs: {scoreA.overs}.{scoreA.balls}</span>
                  </div>
                  <div className={`p-6 rounded-2xl border ${currentInnings === 'B' ? 'bg-zinc-900/60 border-emerald-500' : 'border-blue-950'}`} onClick={() => setCurrentInnings('B')}>
                    <span className="text-xs uppercase text-slate-500 font-bold block">Innings 2</span>
                    <div className="text-4xl font-black mt-2">{scoreB.runs}/{scoreB.wickets}</div>
                    <span className="text-xs font-mono block mt-2">Overs: {scoreB.overs}.{scoreB.balls}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 justify-center p-6 bg-slate-950 rounded-2xl">
                  {[0, 1, 2, 3, 4, 6].map((run) => (
                    <button key={run} onClick={() => handleBallDelivered(run, false)} className="w-12 h-12 bg-blue-950 hover:bg-blue-900 text-white rounded-xl font-bold">{run}</button>
                  ))}
                  <button onClick={() => handleBallDelivered(0, true)} className="px-6 h-12 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-black text-xs uppercase tracking-wider">Wicket</button>
                </div>
              </div>
              <div className="bg-[#0a1128] border border-blue-950 p-6 rounded-3xl flex flex-col items-center justify-center min-h-[300px]">
                <motion.div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-950 shadow-2xl cursor-pointer" animate={{ rotate: isBallHovered ? 360 : 0 }} transition={{ ease: "linear", duration: 4, repeat: Infinity }} onHoverStart={() => setIsBallHovered(true)} onHoverEnd={() => setIsBallHovered(false)} />
                <span className="text-[10px] font-mono text-slate-500 uppercase mt-4">Telemetry Stream Engaged</span>
              </div>
            </motion.div>
          ) : activeTournament ? (
            // TOURNAMENT WORKSPACE CONTROL LAYER (TEAMS, PLAYERS, FIXTURES)
            <motion.div key="control-room" className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-6">
                <button onClick={() => { setActiveTournament(null); setActiveTeam(null); }} className="text-xs uppercase text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-mono"><ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard</button>
                
                {/* 1. Register Franchise Team Card */}
                <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
                  <h3 className="text-sm font-black uppercase text-slate-200 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Register Franchise</h3>
                  <form onSubmit={handleCreateTeam} className="space-y-3">
                    <input type="text" placeholder="Team Name" required value={teamData.name} onChange={(e) => setTeamData({...teamData, name: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl p-3 text-xs" />
                    <input type="text" placeholder="Captain Name" value={teamData.captain_name} onChange={(e) => setTeamData({...teamData, captain_name: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl p-3 text-xs" />
                    <button type="submit" className="w-full h-10 bg-emerald-500 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl">Save Franchise</button>
                  </form>
                </div>

                {/* 2. Roster Management Card (Dynamic Player Additions) */}
                {activeTeam ? (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
                    <h3 className="text-sm font-black uppercase text-slate-200 mb-1 flex items-center gap-2"><UserPlus className="w-4 h-4 text-emerald-400" /> Add to {activeTeam.name}</h3>
                    <p className="text-[10px] text-slate-500 mb-4 font-mono">Assign athlete variables to active roster</p>
                    <form onSubmit={handleAddPlayer} className="space-y-3">
                      <input type="text" placeholder="Player Full Name" required value={playerData.name} onChange={(e) => setPlayerData({...playerData, name: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl p-3 text-xs" />
                      <select value={playerData.playing_role} onChange={(e) => setPlayerData({...playerData, playing_role: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl p-3 text-xs text-slate-400">
                        <option value="Batsman">Batsman</option>
                        <option value="Bowler">Bowler</option>
                        <option value="All-Rounder">All-Rounder</option>
                        <option value="Wicketkeeper">Wicketkeeper</option>
                      </select>
                      <button type="submit" className="w-full h-10 bg-teal-500 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-xl">Incorporate Athlete</button>
                    </form>
                  </motion.div>
                ) : (
                  <div className="p-4 border border-dashed border-blue-950/40 text-center text-[10px] font-mono text-slate-500 uppercase">Select a franchise card to manage its player rosters</div>
                )}

                {/* 3. Match Scheduler Panel */}
                <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl">
                  <h3 className="text-sm font-black uppercase text-slate-200 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> Schedule Fixture</h3>
                  <form onSubmit={handleScheduleMatch} className="space-y-3">
                    <select required value={matchData.team_a_id} onChange={(e) => setMatchData({...matchData, team_a_id: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl p-3 text-xs text-slate-400">
                      <option value="">Select Team A</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <select required value={matchData.team_b_id} onChange={(e) => setMatchData({...matchData, team_b_id: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl p-3 text-xs text-slate-400">
                      <option value="">Select Team B</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <input type="text" placeholder="Venue Stadium Name" value={matchData.venue} onChange={(e) => setMatchData({...matchData, venue: e.target.value})} className="w-full bg-[#020617] border border-blue-950 rounded-xl p-3 text-xs" />
                    <button type="submit" className="w-full h-10 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl">Generate Fixture</button>
                  </form>
                </div>
              </div>

              {/* Lists Columns Display */}
              <div className="lg:col-span-2 space-y-6">
                {/* Registered Franchise Teams Grid */}
                <div className="bg-[#0a1128]/40 border border-blue-950 p-6 rounded-3xl">
                  <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-400 mb-4">Registered League Franchises ({teams.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {teams.map(team => (
                      <div key={team.id} className={`p-4 rounded-xl border flex justify-between items-center transition-colors cursor-pointer ${activeTeam?.id === team.id ? 'bg-slate-900 border-emerald-500' : 'bg-slate-950/40 border-blue-950/60 hover:border-blue-900'}`} onClick={() => loadTeamRoster(team)}>
                        <div>
                          <span className="font-bold text-white uppercase text-xs">{team.name}</span>
                          <span className="text-[10px] font-mono text-slate-500 block mt-1">Captain: {team.captain_name || "Unassigned"}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    ))}
                  </div>

                  {/* Render roster players under targeted team context selection */}
                  {activeTeam && (
                    <div className="mt-6 pt-4 border-t border-blue-950/60">
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider"> Roster Allocation for {activeTeam.name}:</span>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {players.map(p => (
                          <span key={p.id} className="px-2.5 py-1 text-[10px] bg-slate-900 border border-blue-950/80 rounded-md font-medium text-slate-300">
                            👤 {p.name} <span className="text-emerald-500 font-mono text-[9px]">({p.playing_role})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fixture Schedule Overview Container */}
                <div className="bg-[#0a1128]/40 border border-blue-950 p-6 rounded-3xl">
                  <h3 className="text-xs font-mono font-black uppercase tracking-widest text-slate-400 mb-4">Active League Fixtures Schedule ({matches.length})</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {matches.map(m => (
                      <div key={m.id} className="p-4 bg-slate-950/60 border border-blue-950 rounded-xl flex justify-between items-center">
                        <div>
                          <span className="text-xs font-black text-white uppercase block">Match Event Instance</span>
                          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Venue: {m.venue || "Stadium Oval"}</span>
                        </div>
                        <button onClick={() => loadLiveScorecardConsole(m)} className="px-4 py-2 bg-emerald-500 text-zinc-950 text-xs font-black uppercase rounded-lg hover:bg-emerald-400 transition-colors">Launch Score Panel</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // MAIN LEAGUE SELECTOR OVERVIEW DECK
            <motion.div key="hub" className="max-w-7xl mx-auto w-full px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-3xl backdrop-blur-md">
                <h2 className="font-bold text-base text-zinc-100 mb-1 flex items-center gap-2"><Trophy className="w-5 h-5 text-emerald-400" /> Launch League Framework</h2>
                <p className="text-[11px] text-slate-400 mb-6">Instantiate automated tournament configurations safely inside database records.</p>
                <form onSubmit={handleCreateTournament} className="space-y-4">
                  <input type="text" placeholder="Tournament Name" required value={tournamentData.name} onChange={(e) => setTournamentData({...tournamentData, name: e.target.value})} className="w-full bg-[#070709] border border-zinc-900 rounded-xl p-3 text-xs font-medium text-zinc-200" />
                  <input type="text" placeholder="Location City" value={tournamentData.location} onChange={(e) => setTournamentData({...tournamentData, location: e.target.value})} className="w-full bg-[#070709] border border-zinc-900 rounded-xl p-3 text-xs font-medium text-zinc-200" />
                  <button type="submit" className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md">{loading ? 'Processing...' : 'Deploy Parameters'}</button>
                </form>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs font-mono font-black tracking-widest text-slate-400 uppercase border-l-2 border-emerald-500 pl-2.5">Active Multi-Tenant Contexts ({tournaments.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournaments.map((t: any) => (
                    <div key={t.id} className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl flex flex-col justify-between group">
                      <div>
                        <h3 className="font-black text-white text-sm uppercase mb-1">{t.name}</h3>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-emerald-400 border border-blue-900/50">Active State</span>
                      </div>
                      <button onClick={() => loadTournamentControlRoom(t)} className="mt-6 w-full py-2.5 bg-[#070709] border border-zinc-900 text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider hover:text-white transition-colors">
                        Enter Control Room <ChevronRight className="w-4 h-4 text-emerald-500" />
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
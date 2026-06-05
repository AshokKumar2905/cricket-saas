export interface PlayerProfile {
  id: number;
  name: string;
  role: string; // e.g., "All-Rounder", "Batter", "Bowler"
  battingStyle: string; // e.g., "Right-hand Bat"
  bowlingStyle: string; // e.g., "Right-arm Fast-medium"
  teamName: string;
  stats: {
    batting: {
      matches: number;
      innings: number;
      runs: number;
      highestScore: number;
      average: number;
      strikeRate: number;
      fifties: number;
      hundreds: number;
    };
    bowling: {
      innings: number;
      wickets: number;
      economy: number;
      average: number;
      bestBowling: string; // e.g., "3/15"
    };
  };
  recentMatches: {
    matchId: number;
    opponent: string;
    date: string;
    runsScored: number;
    ballsFaced: number;
    wicketsTaken: number;
    runsConceded: number;
    result: string;
  }[];
}
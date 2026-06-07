// frontend/types/cricket.ts

/**
 * Interface representing a historic match log inside the player's recent timeline.
 * Mapped directly to ProfileRecentMatch backend schema.
 */
export interface ProfileRecentMatch {
  match_id: string;              // UUID from backend translates to string in JSON
  opponent_name: string;         // Named 'opponent_name' in backend schemas
  venue: string | null;          // Location instance venue string
  runs_scored: number;           // Total runs scored by player in this match instance
  balls_faced: number;           // Total balls faced by player during batting innings
  wickets_taken: number;         // Total wickets taken during bowling innings
  runs_conceded: number;         // Total runs conceded while bowling
  overs_bowled: string | number; // Decimal types from backend map to string/number in JSON
  match_status: string;          // Current match status ledger entry
  result_description: string | null; // Detailed description of match outcome
}

/**
 * Main interface representing a Player Profile core dashboard dataset.
 * Aligned comprehensively with the PlayerProfileResponse Python API payload.
 */
export interface PlayerProfile {
  id: string;                    // Python backend UUID field mapping to client string
  team_id: string | null;        // Structural database relationship key
  team_name: string;             // Corporate/franchise team name payload
  name: string;                  // Full legal name of the athlete
  playing_role: string | null;   // Replaces 'role' to match backend 'playing_role' field
  batting_style: string | null;  // Replaces 'battingStyle' to match backend snake_case format
  bowling_style: string | null;  // Replaces 'bowlingStyle' to match backend snake_case format
  
  /**
   * Batting performance matrix.
   * Note: Lifted directly to root level to align with API response shape (no nested .stats layer).
   */
  batting: {
    matches: number;
    innings: number;
    total_runs: number;          // Replaces 'runs' to match backend schema definition
    highest_score: number;       // Replaces camelCase 'highestScore' 
    average: number;             // Calculated career batting average metric
    strike_rate: number;         // Replaces camelCase 'strikeRate'
    fifties: number;             // Aggregate total count of career half-centuries
    hundreds: number;            // Aggregate total count of career centuries
  };

  /**
   * Bowling performance matrix.
   * Note: Lifted directly to root level to align with API response shape (no nested .stats layer).
   */
  bowling: {
    innings: number;
    total_wickets: number;       // Replaces 'wickets' to match backend schema definition
    economy: number;             // Career economy rate string/number tracking float
    average: number;             // Calculated career bowling average tracking metric
    best_bowling: string;        // Replaces camelCase 'bestBowling' (e.g., "3/15")
  };

  /**
   * Complete timeline ledger array containing historically logged performances.
   */
  recent_matches: ProfileRecentMatch[]; // Replaces 'recentMatches' array to match snake_case response
}
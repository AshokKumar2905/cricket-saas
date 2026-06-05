from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import date
from uuid import UUID
from decimal import Decimal

# --- USER SCHEMAS ---

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


# --- TOURNAMENT SCHEMAS ---

class TournamentCreate(BaseModel):
    name: str
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    overs_per_match: int = 20
    ball_type: str = "Leather"

class TournamentResponse(BaseModel):
    id: UUID
    name: str
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    overs_per_match: int
    ball_type: str
    status: str
    model_config = ConfigDict(from_attributes=True)


# --- TEAM SCHEMAS ---

class TeamCreate(BaseModel):
    name: str
    captain_name: Optional[str] = None
    logo_url: Optional[str] = None

class TeamResponse(BaseModel):
    id: UUID
    name: str
    captain_name: Optional[str] = None
    logo_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# --- PLAYER SCHEMAS ---

class PlayerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    playing_role: Optional[str] = "Batsman"
    batting_style: Optional[str] = "Right-hand Bat"
    bowling_style: Optional[str] = "None"

class PlayerResponse(BaseModel):
    id: UUID
    team_id: Optional[UUID]
    name: str
    phone: Optional[str] = None
    playing_role: Optional[str]
    batting_style: Optional[str]
    bowling_style: Optional[str]
    model_config = ConfigDict(from_attributes=True)


# --- MATCH SCHEMAS ---

class MatchCreate(BaseModel):
    team_a_id: UUID
    team_b_id: UUID
    venue: Optional[str] = None
    match_status: Optional[str] = "Scheduled"

class MatchResponse(BaseModel):
    id: UUID
    tournament_id: UUID
    team_a_id: UUID
    team_b_id: UUID
    venue: Optional[str] = None
    match_status: str
    
    # Team A Score Serialization Fields
    team_a_runs: int
    team_a_wickets: int
    team_a_overs: Decimal  # Safely stream decimal precision overs to frontend
    
    # Team B Score Serialization Fields
    team_b_runs: int
    team_b_wickets: int
    team_b_overs: Decimal  # Safely stream decimal precision overs to frontend
    
    winner_id: Optional[UUID] = None
    result_description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


# --- DYNAMIC PLAYER PROFILE & MATCH LOG SCHEMAS ---

class ProfileRecentMatch(BaseModel):
    match_id: UUID
    opponent_name: str
    venue: Optional[str] = None
    runs_scored: int
    balls_faced: int
    wickets_taken: int
    runs_conceded: int
    overs_bowled: Decimal
    match_status: str
    result_description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ProfileBattingStats(BaseModel):
    matches: int
    innings: int
    total_runs: int
    highest_score: int
    average: float
    strike_rate: float
    fifties: int
    hundreds: int

class ProfileBowlingStats(BaseModel):
    innings: int
    total_wickets: int
    economy: float
    average: float
    best_bowling: str  # e.g., "3/15"

class PlayerProfileResponse(BaseModel):
    id: UUID
    team_id: Optional[UUID] = None
    team_name: str
    name: str
    playing_role: Optional[str]
    batting_style: Optional[str]
    bowling_style: Optional[str]
    batting: ProfileBattingStats
    bowling: ProfileBowlingStats
    recent_matches: List[ProfileRecentMatch]

    model_config = ConfigDict(from_attributes=True)
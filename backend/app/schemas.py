from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, List
from datetime import date
from uuid import UUID

# ==========================================
# 1. AUTHENTICATION SCHEMAS
# ==========================================
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

# ==========================================
# 2. TOURNAMENT SCHEMAS
# ==========================================
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

# ==========================================
# 3. TEAM SCHEMAS
# ==========================================
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

# ==========================================
# 4. PLAYER SCHEMAS
# ==========================================
class PlayerCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    playing_role: Optional[str] = "Batsman"  # e.g., Batsman, Bowler, All-Rounder, Wicketkeeper
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

# ==========================================
# 5. MATCH / FIXTURE SCHEMAS (NEW)
# ==========================================
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
    team_a_runs: int
    team_a_wickets: int
    team_b_runs: int
    team_b_wickets: int
    winner_id: Optional[UUID] = None
    result_description: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)
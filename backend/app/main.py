from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from uuid import UUID
from decimal import Decimal

from app.database import Base, engine, get_db
from app.models import UserModel, TournamentModel, TeamModel, MatchModel, PlayerModel
from app.schemas import (
    UserCreate, UserResponse, LoginRequest, Token, 
    TournamentCreate, TournamentResponse, TeamCreate, TeamResponse,
    PlayerCreate, PlayerResponse, MatchCreate, MatchResponse
)
from app.auth import hash_password, verify_password, create_access_token, get_current_user_id

try:
    print("🔄 Connecting to PostgreSQL and creating schema tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database verification complete! All tables live.")
except Exception as database_error:
    print(f"\n❌ DATABASE CONNECTION FAILURE: {database_error}\n")

app = FastAPI(title="Cricket SaaS Multi-Tenant Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# SEED CRICKET ARTICLES & BLOGS DATABASE
# ==========================================
MOCK_BLOG_DATABASE = [
    {
        "id": "1",
        "title": "Mastering the Art of Modern Power Hitting",
        "summary": "How modern bat design adjustments and biomechanical clearance frames changed the geometry of T20 cricket.",
        "content": "A deep technical breakdown of wrist extension vectors, hip clearance paths, and optimal launching angles. Modern power hitting relies heavily on a stable base and maximizing the swing arc. By analyzing telemetry data from elite ball-strikers, coaches can track handle velocity patterns and clean contact distribution metrics across persistent training cycles.",
        "image_url": "https://images.unsplash.com/photo-1540747737956-3787217526ed?auto=format&fit=crop&q=80&w=800",
        "category": "Technique",
        "read_time": "5 Min Read"
    },
    {
        "id": "2",
        "title": "The Evolution of Reverse Swing in Limited Overs",
        "summary": "Analyzing aerodynamic boundary layers and friction forces on leather ball seam structures.",
        "content": "An analysis of how pristine surface maintenance creates sharp late movement inside high-velocity delivery sequences. When a leather ball travels at high speed, the rough side creates a turbulent boundary layer, while the smooth side maintains a laminar boundary layer. Shifting this aerodynamic pressure differential creates late deviation, making multi-tenant state metrics tracking essential for high-performance telemetry capture engines.",
        "image_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800",
        "category": "Bowling Analysis",
        "read_time": "8 Min Read"
    },
    {
        "id": "3",
        "title": "Transitioning Local Tournaments From Paper to Digital Platforms",
        "summary": "How providing real-time accessible query lookups empowers domestic cricket leagues.",
        "content": "When configuring amateur tournament infrastructures, instant query execution speeds are highly dependent on clean database parameters. Moving away from hand-written paper scorebooks to a centralized digital schema allows anyone to instantly look up tournament standings, match statistics, or check a player's lifelong running run tally without search performance bottlenecks.",
        "image_url": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
        "category": "Productivity",
        "read_time": "6 Min Read"
    }
]

@app.get("/api/blogs")
def get_cricket_blogs():
    return MOCK_BLOG_DATABASE

# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================

@app.post("/api/auth/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(UserModel).filter(UserModel.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="This email address is already registered.")
    new_user = UserModel(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        phone=user_data.phone
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password.")
    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}

# ==========================================
# TOURNAMENT ENDPOINTS
# ==========================================

@app.post("/api/tournaments", response_model=TournamentResponse)
def create_tournament(tournament_data: TournamentCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    new_tournament = TournamentModel(
        organizer_id=UUID(current_user_id),
        name=tournament_data.name,
        location=tournament_data.location,
        overs_per_match=tournament_data.overs_per_match,
        ball_type=tournament_data.ball_type
    )
    db.add(new_tournament)
    db.commit()
    db.refresh(new_tournament)
    return new_tournament

@app.get("/api/tournaments", response_model=List[TournamentResponse])
def get_user_tournaments(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    return db.query(TournamentModel).filter(TournamentModel.organizer_id == UUID(current_user_id)).all()

# ==========================================
# TEAM ENDPOINTS
# ==========================================

@app.post("/api/tournaments/{tournament_id}/teams", response_model=TeamResponse)
def add_team_to_tournament(tournament_id: UUID, team_data: TeamCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == UUID(current_user_id)).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found or unauthorized access.")
    new_team = TeamModel(name=team_data.name, captain_name=team_data.captain_name, logo_url=team_data.logo_url)
    db.add(new_team)
    tournament.teams.append(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

@app.get("/api/tournaments/{tournament_id}/teams", response_model=List[TeamResponse])
def get_tournament_teams(tournament_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == UUID(current_user_id)).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found or unauthorized access.")
    return tournament.teams

# ==========================================
# PLAYER ENDPOINTS
# ==========================================

@app.post("/api/teams/{team_id}/players", response_model=PlayerResponse)
def add_player_to_team(team_id: UUID, player_data: PlayerCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team profile not found.")
    new_player = PlayerModel(
        team_id=team_id,
        name=player_data.name,
        phone=player_data.phone,
        playing_role=player_data.playing_role,
        batting_style=player_data.batting_style,
        bowling_style=player_data.bowling_style
    )
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player

@app.get("/api/teams/{team_id}/players", response_model=List[PlayerResponse])
def get_team_players(team_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    return db.query(PlayerModel).filter(PlayerModel.team_id == team_id).all()

# ==========================================
# MATCH ENDPOINTS
# ==========================================

@app.post("/api/tournaments/{tournament_id}/matches", response_model=MatchResponse)
def schedule_match(tournament_id: UUID, match_data: MatchCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == UUID(current_user_id)).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found or unauthorized access.")
    if match_data.team_a_id == match_data.team_b_id:
        raise HTTPException(status_code=400, detail="Opposing teams cannot be identical.")
    new_match = MatchModel(
        tournament_id=tournament_id,
        team_a_id=match_data.team_a_id,
        team_b_id=match_data.team_b_id,
        venue=match_data.venue,
        match_status="Scheduled"
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

@app.get("/api/tournaments/{tournament_id}/matches", response_model=List[MatchResponse])
def get_tournament_matches(tournament_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == UUID(current_user_id)).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament not found or unauthorized access.")
    return db.query(MatchModel).filter(MatchModel.tournament_id == tournament_id).all()

@app.put("/api/matches/{match_id}/score", response_model=MatchResponse)
def update_match_score(match_id: UUID, payload: Dict[str, Any], db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    match_record = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match_record:
        raise HTTPException(status_code=404, detail="Match record instance not found.")
    
    score_data = payload.get("score_data", {})
    
    # Simple explicit mapping for core fields
    match_record.team_a_runs = score_data.get("runs_a", match_record.team_a_runs)
    match_record.team_a_wickets = score_data.get("wickets_a", match_record.team_a_wickets)
    
    # Safe Decimal casting ensures PostgreSQL Numeric() targets never undergo data type truncation errors
    if "overs_a" in score_data:
        match_record.team_a_overs = Decimal(str(score_data["overs_a"]))
        
    match_record.team_b_runs = score_data.get("runs_b", match_record.team_b_runs)
    match_record.team_b_wickets = score_data.get("wickets_b", match_record.team_b_wickets)
    
    if "overs_b" in score_data:
        match_record.team_b_overs = Decimal(str(score_data["overs_b"]))
        
    match_record.match_status = payload.get("status", match_record.match_status)
    
    db.commit()
    db.refresh(match_record)
    return match_record
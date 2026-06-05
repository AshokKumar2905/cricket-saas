from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from uuid import UUID
from decimal import Decimal

from app.database import Base, engine, get_db
from app.models import UserModel, TournamentModel, TeamModel, MatchModel, PlayerModel, PlayerMatchStatModel, tournament_teams
from app.schemas import (
    UserCreate, UserResponse, LoginRequest, Token, 
    TournamentCreate, TournamentResponse, TournamentUpdate,
    TeamCreate, TeamResponse, TeamUpdate,
    PlayerCreate, PlayerResponse, PlayerUpdate,
    MatchCreate, MatchResponse, MatchUpdate,
    PlayerProfileResponse, ProfileRecentMatch, ProfileBattingStats, ProfileBowlingStats
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
# TOURNAMENT ENDPOINTS (FULL CRUD)
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

@app.put("/api/tournaments/{tournament_id}", response_model=TournamentResponse)
def update_tournament(tournament_id: UUID, payload: TournamentUpdate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == UUID(current_user_id)).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament framework profile not discovered or access denied.")
    
    tournament.name = payload.name
    tournament.location = payload.location
    db.commit()
    db.refresh(tournament)
    return tournament

@app.delete("/api/tournaments/{tournament_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(tournament_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == UUID(current_user_id)).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament registry not found or access denied.")
    
    db.delete(tournament)
    db.commit()
    return None

# ==========================================
# TEAM ENDPOINTS (FULL CRUD)
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

@app.put("/api/teams/{team_id}", response_model=TeamResponse)
def update_team(team_id: UUID, payload: TeamUpdate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    team = db.query(TeamModel).join(TournamentModel, TeamModel.tournaments).filter(
        TeamModel.id == team_id, TournamentModel.organizer_id == UUID(current_user_id)
    ).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team registry sheet not found or unauthorized.")
    
    team.name = payload.name
    team.captain_name = payload.captain_name
    db.commit()
    db.refresh(team)
    return team

@app.delete("/api/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    team = db.query(TeamModel).join(TournamentModel, TeamModel.tournaments).filter(
        TeamModel.id == team_id, TournamentModel.organizer_id == UUID(current_user_id)
    ).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team configuration sheet metadata missing or access denied.")
    
    db.delete(team)
    db.commit()
    return None

# ==========================================
# PLAYER ENDPOINTS (FULL CRUD)
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

@app.put("/api/players/{player_id}", response_model=PlayerResponse)
def update_player(player_id: UUID, payload: PlayerUpdate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    player = db.query(PlayerModel).join(TeamModel).join(TournamentModel, TeamModel.tournaments).filter(
        PlayerModel.id == player_id, TournamentModel.organizer_id == UUID(current_user_id)
    ).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player record not found or access unverified.")
    
    player.name = payload.name
    if payload.playing_role:
        player.playing_role = payload.playing_role
    db.commit()
    db.refresh(player)
    return player

@app.delete("/api/players/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(player_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    player = db.query(PlayerModel).join(TeamModel).join(TournamentModel, TeamModel.tournaments).filter(
        PlayerModel.id == player_id, TournamentModel.organizer_id == UUID(current_user_id)
    ).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player profile missing inside target roster database mapping.")
    
    db.delete(player)
    db.commit()
    return None

# ==========================================
# MATCH ENDPOINTS (FULL CRUD)
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

@app.put("/api/matches/{match_id}", response_model=MatchResponse)
def update_match_details(match_id: UUID, payload: MatchUpdate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    match = db.query(MatchModel).join(TournamentModel).filter(
        MatchModel.id == match_id, TournamentModel.organizer_id == UUID(current_user_id)
    ).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match profile structure missing or access unauthorized.")
    
    match.venue = payload.venue
    db.commit()
    db.refresh(match)
    return match

@app.delete("/api/matches/{match_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_match(match_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    match = db.query(MatchModel).join(TournamentModel).filter(
        MatchModel.id == match_id, TournamentModel.organizer_id == UUID(current_user_id)
    ).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match fixture setup parameters missing or unauthorized.")
    
    db.delete(match)
    db.commit()
    return None

@app.put("/api/matches/{match_id}/score", response_model=MatchResponse)
def update_match_score(match_id: UUID, payload: Dict[str, Any], db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    match_record = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match_record:
        raise HTTPException(status_code=404, detail="Match record instance not found.")
    
    score_data = payload.get("score_data", {})
    
    match_record.team_a_runs = score_data.get("runs_a", match_record.team_a_runs)
    match_record.team_a_wickets = score_data.get("wickets_a", match_record.team_a_wickets)
    
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

# ==========================================
# PLAYER PERFORMANCE PROFILE LOOKUP ENGINE
# ==========================================

@app.get("/api/players/{player_id}/profile", response_model=PlayerProfileResponse)
def get_player_profile_analytics(player_id: UUID, db: Session = Depends(get_db)):
    """
    Queries, builds, and aggregates live statistics directly from match logs
    to completely substitute manual paper scorebooks with real-time computations.
    """
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if not player:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Target player instance not found.")
    
    team_name = "Independent / Free Agent"
    if player.team_id:
        team = db.query(TeamModel).filter(TeamModel.id == player.team_id).first()
        if team:
            team_name = team.name

    scorecards = db.query(PlayerMatchStatModel).filter(PlayerMatchStatModel.player_id == player_id).all()

    # Batting tracking accumulators
    matches_count = len(scorecards)
    batting_innings = 0
    total_runs = 0
    highest_score = 0
    balls_faced = 0
    fifties = 0
    hundreds = 0

    # Bowling tracking accumulators
    bowling_innings = 0
    total_wickets = 0
    total_runs_conceded = 0
    total_overs_bowled = Decimal("0.0")
    best_wickets = -1
    best_runs = 999
    best_bowling_str = "0/0"

    recent_matches_list = []

    for card in scorecards:
        if card.balls_faced > 0 or card.runs_scored > 0:
            batting_innings += 1
            total_runs += card.runs_scored
            balls_faced += card.balls_faced
            
            if card.runs_scored > highest_score:
                highest_score = card.runs_scored
            
            if 50 <= card.runs_scored < 100:
                fifties += 1
            elif card.runs_scored >= 100:
                hundreds += 1

        if card.overs_bowled > 0 or card.wickets_taken > 0:
            bowling_innings += 1
            total_wickets += card.wickets_taken
            total_runs_conceded += card.runs_conceded
            total_overs_bowled += card.overs_bowled

            if card.wickets_taken > best_wickets:
                best_wickets = card.wickets_taken
                best_runs = card.runs_conceded
                best_bowling_str = f"{card.wickets_taken}/{card.runs_conceded}"
            elif card.wickets_taken == best_wickets and card.runs_conceded < best_runs:
                best_runs = card.runs_conceded
                best_bowling_str = f"{card.wickets_taken}/{card.runs_conceded}"

        match_meta = db.query(MatchModel).filter(MatchModel.id == card.match_id).first()
        if match_meta:
            opponent_id = match_meta.team_b_id if match_meta.team_a_id == player.team_id else match_meta.team_a_id
            opponent_team = db.query(TeamModel).filter(TeamModel.id == opponent_id).first()
            opponent_name = opponent_team.name if opponent_team else "Unknown Opponent"

            recent_matches_list.append(
                ProfileRecentMatch(
                    match_id=match_meta.id,
                    opponent_name=opponent_name,
                    venue=match_meta.venue,
                    runs_scored=card.runs_scored,
                    balls_faced=card.balls_faced,
                    wickets_taken=card.wickets_taken,
                    runs_conceded=card.runs_conceded,
                    overs_bowled=card.overs_bowled,
                    match_status=match_meta.match_status,
                    result_description=match_meta.result_description
                )
            )

    batting_avg = round(float(total_runs) / batting_innings, 2) if batting_innings > 0 else 0.0
    strike_rate = round((float(total_runs) / balls_faced) * 100, 2) if balls_faced > 0 else 0.0
    bowling_avg = round(float(total_runs_conceded) / total_wickets, 2) if total_wickets > 0 else 0.0
    economy = round(float(total_runs_conceded) / float(total_overs_bowled), 2) if total_overs_bowled > 0 else 0.0

    return PlayerProfileResponse(
        id=player.id,
        team_id=player.team_id,
        team_name=team_name,
        name=player.name,
        playing_role=player.playing_role,
        batting_style=player.batting_style,
        bowling_style=player.bowling_style,
        batting=ProfileBattingStats(
            matches=matches_count,
            innings=batting_innings,
            total_runs=total_runs,
            highest_score=highest_score,
            average=batting_avg,
            strike_rate=strike_rate,
            fifties=fifties,
            hundreds=hundreds
        ),
        bowling=ProfileBowlingStats(
            innings=bowling_innings,
            total_wickets=total_wickets,
            economy=economy,
            average=bowling_avg,
            best_bowling=best_bowling_str
        ),
        recent_matches=recent_matches_list[:5]
    )
from fastapi import FastAPI, Depends, HTTPException, status, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from typing import List, Optional
from uuid import UUID, uuid4
from pydantic import BaseModel

from .database import Base, engine, get_db
from .models import UserModel, TournamentModel, TeamModel, MatchModel, PlayerModel
from .schemas import (
    UserCreate, UserResponse, LoginRequest, Token, 
    TournamentCreate, TournamentResponse, TeamCreate, TeamResponse,
    PlayerCreate, PlayerResponse, MatchCreate, MatchResponse
)
from .auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

try:
    print("🔄 Connecting to PostgreSQL and creating schema tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database verification complete! All tables live.")
except Exception as database_error:
    print("\n❌ INSTANCE REFLECTION FAILURE!")
    print(f"Error Diagnostic Details: {database_error}\n")

app = FastAPI(title="Cricket SaaS Multi-Tenant Engine")
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token properties.")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or invalid.")

# ==========================================
# NEW FEATURE INGESTION DATA SCHEMAS
# ==========================================
class BlogResponse(BaseModel):
    id: str
    title: str
    summary: str
    content: str
    image_url: str
    category: str

class CartItemBase(BaseModel):
    item_name: str
    price: int
    quantity: int
    image_url: str

class CartItemResponse(CartItemBase):
    id: str

# ==========================================
# SEED REPOSITORIES & DATA POOLS
# ==========================================
CRICKET_IMAGES = {
    "hero_stadium": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1200",
    "leather_ball": "https://images.unsplash.com/photo-1607734834834-d036ba1b575da?auto=format&fit=crop&q=80&w=400",
    "cricket_bat": "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&q=80&w=500",
    "match_action": "https://images.unsplash.com/photo-1540747737956-3787217526ed?auto=format&fit=crop&q=80&w=800"
}

MOCK_BLOG_DATABASE = [
  {
    "id": "b1",
    "title": "Mastering the Art of Modern Power Hitting",
    "summary": "How modern bats and boundary adjustments changed the geometry of T20 cricket.",
    "content": "Deep technical breakdown of wrist extension, hip clearance positions, and strike-rates...",
    "image_url": "https://images.unsplash.com/photo-1540747737956-3787217526ed?auto=format&fit=crop&q=80&w=600",
    "category": "Technique"
  },
  {
    "id": "b2",
    "title": "The Evolution of Reverse Swing in Limited Overs",
    "summary": "Analyzing aerodynamic friction forces on leather ball seam structures.",
    "content": "An analysis of how pristine surface maintenance creates sharp late movement...",
    "image_url": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=600",
    "category": "Bowling Analysis"
  }
]

MOCK_CART_DATABASE = {}

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
# TOURNAMENT CORE CRUD ENDPOINTS
# ==========================================

@app.post("/api/tournaments", response_model=TournamentResponse)
def create_tournament(tournament_data: TournamentCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    new_tournament = TournamentModel(
        organizer_id=current_user_id,
        **tournament_data.model_dump()
    )
    db.add(new_tournament)
    db.commit()
    db.refresh(new_tournament)
    return new_tournament

@app.get("/api/tournaments", response_model=List[TournamentResponse])
def get_user_tournaments(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    return db.query(TournamentModel).filter(TournamentModel.organizer_id == current_user_id).all()

@app.put("/api/tournaments/{tournament_id}", response_model=TournamentResponse)
def update_tournament(tournament_id: UUID, tournament_data: TournamentCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == current_user_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament context not found or unauthorized.")
    tournament.name = tournament_data.name
    tournament.location = tournament_data.location
    db.commit()
    db.refresh(tournament)
    return tournament

@app.delete("/api/tournaments/{tournament_id}")
def delete_tournament(tournament_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == current_user_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament context not found or unauthorized.")
    db.delete(tournament)
    db.commit()
    return {"detail": "Tournament successfully deleted"}

# ==========================================
# TEAM CORE CRUD ENDPOINTS
# ==========================================

@app.post("/api/tournaments/{tournament_id}/teams", response_model=TeamResponse)
def add_team_to_tournament(tournament_id: UUID, team_data: TeamCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == current_user_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament framework not found or unauthorized.")
    
    new_team = TeamModel(**team_data.model_dump())
    db.add(new_team)
    tournament.teams.append(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

@app.get("/api/tournaments/{tournament_id}/teams", response_model=List[TeamResponse])
def get_tournament_teams(tournament_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == current_user_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament context not found.")
    return tournament.teams

@app.put("/api/teams/{team_id}", response_model=TeamResponse)
def update_team(team_id: UUID, team_data: TeamCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Franchise team context not found.")
    team.name = team_data.name
    db.commit()
    db.refresh(team)
    return team

@app.delete("/api/teams/{team_id}")
def delete_team(team_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Franchise team context not found.")
    db.delete(team)
    db.commit()
    return {"detail": "Team successfully deleted"}

# ==========================================
# PLAYER CORE CRUD ENDPOINTS
# ==========================================

@app.post("/api/teams/{team_id}/players", response_model=PlayerResponse)
def add_player_to_team(team_id: UUID, player_data: PlayerCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    team = db.query(TeamModel).filter(TeamModel.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Franchise team profile not found.")
        
    new_player = PlayerModel(team_id=team.id, **player_data.model_dump())
    db.add(new_player)
    db.commit()
    db.refresh(new_player)
    return new_player

@app.get("/api/teams/{team_id}/players", response_model=List[PlayerResponse])
def get_team_players(team_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    return db.query(PlayerModel).filter(PlayerModel.team_id == team_id).all()

@app.put("/api/players/{player_id}", response_model=PlayerResponse)
def update_player(player_id: UUID, player_data: PlayerCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player profile not found.")
    player.name = player_data.name
    player.playing_role = player_data.playing_role
    db.commit()
    db.refresh(player)
    return player

@app.delete("/api/players/{player_id}")
def delete_player(player_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    player = db.query(PlayerModel).filter(PlayerModel.id == player_id).first()
    if not player:
        raise HTTPException(status_code=404, detail="Player profile not found.")
    db.delete(player)
    db.commit()
    return {"detail": "Player successfully deleted"}

# ==========================================
# MATCH CORE CRUD ENDPOINTS
# ==========================================

@app.post("/api/tournaments/{tournament_id}/matches", response_model=MatchResponse)
def schedule_match(tournament_id: UUID, match_data: MatchCreate, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    tournament = db.query(TournamentModel).filter(TournamentModel.id == tournament_id, TournamentModel.organizer_id == current_user_id).first()
    if not tournament:
        raise HTTPException(status_code=404, detail="Tournament framework not found or unauthorized.")
    if match_data.team_a_id == match_data.team_b_id:
        raise HTTPException(status_code=400, detail="Team A and Team B cannot be identical.")

    new_match = MatchModel(tournament_id=tournament_id, **match_data.model_dump())
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

@app.get("/api/tournaments/{tournament_id}/matches", response_model=List[MatchResponse])
def get_tournament_matches(tournament_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    return db.query(MatchModel).filter(MatchModel.tournament_id == tournament_id).all()

@app.delete("/api/matches/{match_id}")
def delete_match(match_id: UUID, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    match_card = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match_card:
        raise HTTPException(status_code=404, detail="Match fixture not found.")
    db.delete(match_card)
    db.commit()
    return {"detail": "Match successfully deleted"}

@app.put("/api/matches/{match_id}/score", response_model=MatchResponse)
def update_match_score(match_id: UUID, runs_a: int, wickets_a: int, overs_a: float, runs_b: int, wickets_b: int, overs_b: float, status: str, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user_id)):
    match_record = db.query(MatchModel).filter(MatchModel.id == match_id).first()
    if not match_record:
        raise HTTPException(status_code=404, detail="Match frame instance not found.")
    match_record.team_a_runs = runs_a
    match_record.team_a_wickets = wickets_a
    match_record.team_a_overs = overs_a
    match_record.team_b_runs = runs_b
    match_record.team_b_wickets = wickets_b
    match_record.team_b_overs = overs_b
    match_record.match_status = status
    db.commit()
    db.refresh(match_record)
    return match_record

# ==========================================
# MEDIA, BLOGS & COMMERCE SHOP REPOSITORIES
# ==========================================

@app.get("/api/media/assets")
def get_platform_media_assets():
    return {"status": "success", "assets": CRICKET_IMAGES}

@app.get("/api/blogs", response_model=List[BlogResponse])
def get_cricket_blogs():
    return MOCK_BLOG_DATABASE

@app.get("/api/cart", response_model=List[CartItemResponse])
def view_shopping_cart(current_user_id: str = Depends(get_current_user_id)):
    return MOCK_CART_DATABASE.get(current_user_id, [])

@app.post("/api/cart", response_model=CartItemResponse)
def add_item_to_cart(item: CartItemBase, current_user_id: str = Depends(get_current_user_id)):
    if current_user_id not in MOCK_CART_DATABASE:
        MOCK_CART_DATABASE[current_user_id] = []
    new_item = CartItemResponse(id=str(uuid4()), **item.model_dump())
    MOCK_CART_DATABASE[current_user_id].append(new_item)
    return new_item

@app.delete("/api/cart/{item_id}")
def remove_item_from_cart(item_id: str, current_user_id: str = Depends(get_current_user_id)):
    if current_user_id in MOCK_CART_DATABASE:
        MOCK_CART_DATABASE[current_user_id] = [i for i in MOCK_CART_DATABASE[current_user_id] if i.id != item_id]
    return {"detail": "Item successfully dropped from session checkout context"}
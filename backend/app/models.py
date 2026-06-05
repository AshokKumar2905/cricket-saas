from sqlalchemy import Column, String, Integer, Date, DateTime, Numeric, Boolean, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Many-to-Many association table for Tournaments and Teams
tournament_teams = Table(
    'tournament_teams',
    Base.metadata,
    Column('tournament_id', UUID(as_uuid=True), ForeignKey('tournaments.id', ondelete='CASCADE'), primary_key=True),
    Column('team_id', UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), primary_key=True)
)


class UserModel(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    tournaments = relationship("TournamentModel", back_populates="organizer", cascade="all, delete-orphan")


class TournamentModel(Base):
    __tablename__ = "tournaments"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    organizer_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(150), nullable=False)
    location = Column(String(150), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    overs_per_match = Column(Integer, default=20)
    ball_type = Column(String(50), default="Leather")
    status = Column(String(50), default="Upcoming")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    organizer = relationship("UserModel", back_populates="tournaments")
    teams = relationship("TeamModel", secondary=tournament_teams, back_populates="tournaments")
    matches = relationship("MatchModel", back_populates="tournament", cascade="all, delete-orphan")


class TeamModel(Base):
    __tablename__ = "teams"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String(100), nullable=False)
    logo_url = Column(String(512), nullable=True)
    captain_name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    tournaments = relationship("TournamentModel", secondary=tournament_teams, back_populates="teams")
    players = relationship("PlayerModel", back_populates="team", cascade="all, delete-orphan")


class PlayerModel(Base):
    __tablename__ = "players"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    team_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    playing_role = Column(String(50), nullable=True)
    batting_style = Column(String(50), nullable=True)
    bowling_style = Column(String(50), nullable=True)

    # Relationships
    team = relationship("TeamModel", back_populates="players")
    # Added reciprocal tracking relationship hook to feed the profile data engine
    stats = relationship("PlayerMatchStatModel", back_populates="player", cascade="all, delete-orphan")


class MatchModel(Base):
    __tablename__ = "matches"
    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    tournament_id = Column(UUID(as_uuid=True), ForeignKey('tournaments.id', ondelete='CASCADE'), nullable=False)
    team_a_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    team_b_id = Column(UUID(as_uuid=True), ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    
    match_date = Column(DateTime(timezone=True), nullable=True)
    venue = Column(String(150), nullable=True)
    match_status = Column(String(50), default="Scheduled")  # e.g., Scheduled, Live, Completed

    # Live Innings Scoring Fields
    team_a_runs = Column(Integer, default=0)
    team_a_wickets = Column(Integer, default=0)
    team_a_overs = Column(Numeric(3, 1), default=0.0)
    
    team_b_runs = Column(Integer, default=0)
    team_b_wickets = Column(Integer, default=0)
    team_b_overs = Column(Numeric(3, 1), default=0.0)

    winner_id = Column(UUID(as_uuid=True), ForeignKey('teams.id'), nullable=True)
    result_description = Column(String(255), nullable=True)

    # Relationships
    tournament = relationship("TournamentModel", back_populates="matches")
    team_a = relationship("TeamModel", foreign_keys=[team_a_id])
    team_b = relationship("TeamModel", foreign_keys=[team_b_id])
    winner = relationship("TeamModel", foreign_keys=[winner_id])
    # Added relationship mapping to track scorecards attached to individual matches
    player_stats = relationship("PlayerMatchStatModel", back_populates="match", cascade="all, delete-orphan")


class PlayerMatchStatModel(Base):
    """
    SaaS Scorecard Metric Model: Maps what a player achieved in an individual local match.
    Directly replaces handwritten local scorecard entries with clean digital structures.
    """
    __tablename__ = "player_match_stats"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    match_id = Column(UUID(as_uuid=True), ForeignKey("matches.id", ondelete="CASCADE"), nullable=False)
    player_id = Column(UUID(as_uuid=True), ForeignKey("players.id", ondelete="CASCADE"), nullable=False)
    
    # Batting details
    runs_scored = Column(Integer, default=0, nullable=False)
    balls_faced = Column(Integer, default=0, nullable=False)
    
    # Bowling details
    overs_bowled = Column(Numeric(3, 1), default=0.0, nullable=False)
    runs_conceded = Column(Integer, default=0, nullable=False)
    wickets_taken = Column(Integer, default=0, nullable=False)

    # Navigation mapping properties
    player = relationship("PlayerModel", back_populates="stats")
    match = relationship("MatchModel", back_populates="player_stats")
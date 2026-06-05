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

    # Added back-population to track what tournaments an organizer handles
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

    # Explicit Relationships added to allow seamless data serialization for frontend queries
    tournament = relationship("TournamentModel", back_populates="matches")
    team_a = relationship("TeamModel", foreign_keys=[team_a_id])
    team_b = relationship("TeamModel", foreign_keys=[team_b_id])
    winner = relationship("TeamModel", foreign_keys=[winner_id])
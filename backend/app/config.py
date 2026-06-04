from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:Ashok@2002@localhost:5432/cricket_db"
    JWT_SECRET_KEY: str = "b8f36c53e8a47291a1045e0388c7b2e91234567890abcdef1234567890abcdef"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
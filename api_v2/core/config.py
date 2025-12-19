"""Basic configuration"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
import os

class Settings(BaseSettings):
    """App settings"""
    APP_NAME: str = "NeoArcana API v2"
    VERSION: str = "2.0.0"
    DEBUG: bool = True
    
    # Load from .env file
    ANTHROPIC_API_KEY: str = os.getenv('ANTHROPIC_API_KEY', '')
    ADMIN_KEY: str = os.getenv('ADMIN_KEY', '29isthenewOne')
    
    # Configure Pydantic to ignore extra fields from .env
    model_config = ConfigDict(
        env_file=".env",
        extra='ignore'  # This tells Pydantic to ignore Flask variables
    )

settings = Settings()
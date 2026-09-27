"""Basic configuration"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
import os

class Settings(BaseSettings):
    """App settings"""
    APP_NAME: str = "NeoArcana API v2"
    VERSION: str = "2.0.0"
    DEBUG: bool = True
    
    # AI Provider: 'bedrock' or 'anthropic'
    AI_PROVIDER: str = os.getenv('AI_PROVIDER', 'bedrock')
    
    # AWS Bedrock settings (for using Amazon Bedrock with AWS credits)
    AWS_ACCESS_KEY_ID: str = os.getenv('AWS_ACCESS_KEY_ID', '')
    AWS_SECRET_ACCESS_KEY: str = os.getenv('AWS_SECRET_ACCESS_KEY', '')
    AWS_REGION: str = os.getenv('AWS_REGION', 'eu-north-1')
    BEDROCK_MODEL_ID: str = os.getenv('BEDROCK_MODEL_ID', 'deepseek.v3.2')

    # Anthropic settings (legacy fallback)
    ANTHROPIC_API_KEY: str = os.getenv('ANTHROPIC_API_KEY', '')
    ADMIN_KEY: str = os.getenv('ADMIN_KEY', '29isthenewOne')
    
    # Configure Pydantic to ignore extra fields from .env
    model_config = ConfigDict(
        env_file=".env",
        extra='ignore'  # This tells Pydantic to ignore Flask variables
    )

settings = Settings()
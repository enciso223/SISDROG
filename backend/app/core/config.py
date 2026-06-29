from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    database_url: str = Field(
        default="sqlite:///./sisdrog.db",
        validation_alias="DATABASE_URL",
    )
    secret_key: str = Field(
        default="cambia_esta_clave_secreta_de_al_menos_32_caracteres",
        validation_alias="SECRET_KEY",
        min_length=32,
    )
    algorithm: str = Field(default="HS256", validation_alias="ALGORITHM")
    access_token_expire_minutes: int = Field(
        default=60,
        validation_alias="ACCESS_TOKEN_EXPIRE_MINUTES",
    )

    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    @field_validator("database_url")
    @classmethod
    def normalize_sqlite_url(cls, value: str) -> str:
        prefix = "sqlite:///./"
        if value.startswith(prefix):
            db_path = ENV_FILE.parent / value.removeprefix(prefix)
            return f"sqlite:///{db_path.resolve()}"
        return value


settings = Settings()

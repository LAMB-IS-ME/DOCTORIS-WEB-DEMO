from pathlib import Path
from pydantic import BaseModel


class Settings(BaseModel):
	project_name: str = "Doctoris Backend Demo"
	api_prefix: str = "/api"

	# Security (demo only — do not use in production)
	secret_key: str = "change-me-in-prod"

	# Storage
	base_dir: Path = Path(__file__).resolve().parents[2]
	data_dir: Path = base_dir / "data"
	upload_dir: Path = data_dir / "uploads"

	# CORS (demo: allow all)
	cors_allow_origins: list[str] = ["*"]
	cors_allow_methods: list[str] = ["*"]
	cors_allow_headers: list[str] = ["*"]

import os

APP_NAME = os.getenv("APP_NAME", "DOCTORIS")

settings = Settings()


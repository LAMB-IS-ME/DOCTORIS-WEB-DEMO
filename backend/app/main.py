from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings

app = FastAPI(title=settings.project_name, version="0.1.0")

app.add_middleware(
	CORSMiddleware,
	allow_origins=settings.cors_allow_origins,
	allow_credentials=True,
	allow_methods=settings.cors_allow_methods,
	allow_headers=settings.cors_allow_headers,
)

# Ensure data dirs
settings.data_dir.mkdir(parents=True, exist_ok=True)
settings.upload_dir.mkdir(parents=True, exist_ok=True)

# Routers
from .api.auth import router as auth_router
from .api.chat import router as chat_router
from .api.files import router as files_router

app.include_router(auth_router, prefix=f"{settings.api_prefix}/auth")
app.include_router(chat_router, prefix=f"{settings.api_prefix}/chat")
app.include_router(files_router, prefix=f"{settings.api_prefix}/files")

@app.get("/health")
def health():
	return {"status": "ok"}
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .utils.helpers import ensure_dirs
from .utils.logger import get_logger
from .core.security import hash_password
from .services.db_service import seed_demo_admin
from .api import auth as auth_api
from .api import files as files_api
from .api import chat as chat_api


logger = get_logger()


def create_app() -> FastAPI:
	ensure_dirs()
	app = FastAPI(title=settings.project_name)

	# CORS (demo: allow all)
	app.add_middleware(
		CORSMiddleware,
		allow_origins=settings.cors_allow_origins,
		allow_credentials=True,
		allow_methods=settings.cors_allow_methods,
		allow_headers=settings.cors_allow_headers,
	)

	# Routers
	app.include_router(auth_api.router, prefix=settings.api_prefix)
	app.include_router(files_api.router, prefix=settings.api_prefix)
	app.include_router(chat_api.router, prefix=settings.api_prefix)

	@app.get("/", tags=["health"])  # simple health check
	def root():
		return {"status": "ok", "name": settings.project_name}

	# Seed demo user
	demo_user = seed_demo_admin(hash_password("demo123"))
	logger.info("Seeded demo user: %s", demo_user.email)

	return app


app = create_app()


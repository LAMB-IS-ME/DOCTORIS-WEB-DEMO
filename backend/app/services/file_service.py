from __future__ import annotations

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "data" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_upload(filename: str, data: bytes) -> Path:
	dest = UPLOAD_DIR / filename
	dest.write_bytes(data)
	return dest


def list_uploads():
	return sorted(p for p in UPLOAD_DIR.glob("*") if p.is_file())
from typing import List, Tuple
from uuid import uuid4

from ..core.config import settings
from ..utils.helpers import ensure_dirs, read_text_from_file


def save_upload(filename: str, data: bytes) -> Path:
	ensure_dirs()
	safe_name = filename.replace("..", "_").replace("/", "_").replace("\\", "_")
	dest = settings.upload_dir / f"{uuid4()}_{safe_name}"
	dest.write_bytes(data)
	return dest


def list_uploads() -> List[Path]:
	ensure_dirs()
	return sorted(settings.upload_dir.glob("*"))


def build_corpus() -> List[Tuple[str, str]]:
	corpus: List[Tuple[str, str]] = []
	for p in list_uploads():
		text = read_text_from_file(p)
		corpus.append((p.name, text))
	return corpus


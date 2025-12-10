from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

from ..core.config import settings


def ensure_dirs() -> None:
	settings.data_dir.mkdir(parents=True, exist_ok=True)
	settings.upload_dir.mkdir(parents=True, exist_ok=True)


def read_text_from_file(path: Path) -> str:
	# Demo: support .txt directly. For .pdf, .png, etc., return a placeholder.
	if path.suffix.lower() == ".txt":
		return path.read_text(encoding="utf-8", errors="ignore")
	return f"[Không hỗ trợ trích xuất nội dung từ {path.suffix} trong bản demo]"


def simple_keyword_search(query: str, corpus: List[Tuple[str, str]], top_k: int = 3) -> List[Tuple[str, str, int]]:
	"""
	Very naive search: score by count of overlapping words.
	corpus: list of (doc_id, text)
	returns: list of (doc_id, snippet, score)
	"""
	q_terms = set(query.lower().split())
	results: List[Tuple[str, str, int]] = []
	for doc_id, text in corpus:
		score = sum(1 for t in q_terms if t in text.lower())
		if score > 0:
			snippet = text[:400]
			results.append((doc_id, snippet, score))
	results.sort(key=lambda x: x[2], reverse=True)
	return results[:top_k]


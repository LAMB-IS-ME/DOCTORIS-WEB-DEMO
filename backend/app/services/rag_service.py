from __future__ import annotations

from typing import List, Tuple


def semantic_search(query: str) -> List[Tuple[str, str]]:
	# Demo: return a fixed citation
	return [("guideline-demo", "Điều trị tiêu chuẩn bao gồm ... (demo snippet)")]

from ..utils.helpers import simple_keyword_search
from .file_service import build_corpus


def retrieve(query: str, top_k: int = 3) -> List[Tuple[str, str]]:
	corpus = build_corpus()
	ranked = simple_keyword_search(query, corpus, top_k=top_k)
	# Return (doc_id, snippet)
	return [(doc_id, snippet) for doc_id, snippet, _ in ranked]


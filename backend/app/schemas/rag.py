from __future__ import annotations

from pydantic import BaseModel
from typing import List, Tuple


class RAGQuery(BaseModel):
	query: str


class RAGCitation(BaseModel):
	doc_id: str
	snippet: str


class RAGAnswer(BaseModel):
	answer: str
	citations: List[RAGCitation] = []
from typing import List, Tuple


class RAGQuery(BaseModel):
	query: str
	top_k: int = 3


class RAGContext(BaseModel):
	doc_id: str
	snippet: str


class RAGResponse(BaseModel):
	answer: str
	contexts: List[RAGContext]


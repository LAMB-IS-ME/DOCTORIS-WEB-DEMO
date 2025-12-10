from __future__ import annotations

from pydantic import BaseModel
from typing import List, Optional


class ChatCreate(BaseModel):
	title: str = "New Chat"


class ChatSessionOut(BaseModel):
	id: str
	title: str


class MessageCreate(BaseModel):
	session_id: str
	content: str


class MessageOut(BaseModel):
	id: str
	role: str
	content: str
	session_id: str
from typing import List


class SessionCreate(BaseModel):
	title: str


class SessionOut(BaseModel):
	id: str
	title: str


class MessageCreate(BaseModel):
	session_id: str
	content: str


class MessageOut(BaseModel):
	id: str
	role: str
	content: str


class ChatTurnOut(BaseModel):
	session: SessionOut
	messages: List[MessageOut]


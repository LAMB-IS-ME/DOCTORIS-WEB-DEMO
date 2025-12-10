from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional
from uuid import uuid4
from datetime import datetime, timezone


@dataclass
class User:
	id: str
	email: str
	full_name: str
	password_hash: str
	created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class ChatSession:
	id: str
	user_id: str
	title: str
	created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


@dataclass
class Message:
	id: str
	session_id: str
	role: str  # "user" | "assistant" | "system"
	content: str
	created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


_users: Dict[str, User] = {}
_users_by_email: Dict[str, str] = {}
_sessions: Dict[str, ChatSession] = {}
_messages: Dict[str, List[Message]] = {}


def create_user(email: str, full_name: str, password_hash: str) -> User:
	if email.lower() in _users_by_email:
		raise ValueError("Email already registered")
	user = User(id=str(uuid4()), email=email.lower(), full_name=full_name, password_hash=password_hash)
	_users[user.id] = user
	_users_by_email[user.email] = user.id
	return user


def get_user_by_email(email: str) -> Optional[User]:
	user_id = _users_by_email.get(email.lower())
	if not user_id:
		return None
	return _users.get(user_id)


def get_user_by_id(user_id: str) -> Optional[User]:
	return _users.get(user_id)


def create_session(user_id: str, title: str) -> ChatSession:
	session = ChatSession(id=str(uuid4()), user_id=user_id, title=title)
	_sessions[session.id] = session
	_messages[session.id] = []
	return session


def get_session(session_id: str) -> Optional[ChatSession]:
	return _sessions.get(session_id)


def list_sessions(user_id: str) -> List[ChatSession]:
	return [s for s in _sessions.values() if s.user_id == user_id]


def add_message(session_id: str, role: str, content: str) -> Message:
	if session_id not in _sessions:
		raise ValueError("Session not found")
	msg = Message(id=str(uuid4()), session_id=session_id, role=role, content=content)
	_messages[session_id].append(msg)
	return msg


def get_messages(session_id: str) -> List[Message]:
	return list(_messages.get(session_id, []))


def seed_demo_admin(password_hash: str) -> User:
	# Create a default demo user if not exists
	email = "demo@doctoris.local"
	existing = get_user_by_email(email)
	if existing:
		return existing
	return create_user(email=email, full_name="Demo User", password_hash=password_hash)


from dataclasses import dataclass


@dataclass
class ChatSessionModel:
	id: str
	user_id: str
	title: str


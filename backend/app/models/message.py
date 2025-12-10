from dataclasses import dataclass


@dataclass
class MessageModel:
	id: str
	session_id: str
	role: str
	content: str


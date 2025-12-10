"""
ORM placeholders (not used in demo). Kept for future SQL/ORM migration.
"""

from dataclasses import dataclass


@dataclass
class UserModel:
	id: str
	email: str
	full_name: str
	password_hash: str


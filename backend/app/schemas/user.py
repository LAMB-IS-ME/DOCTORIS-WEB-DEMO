from __future__ import annotations

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
	email: EmailStr
	full_name: str
	password: str


class UserLogin(BaseModel):
	email: EmailStr
	password: str


class UserOut(BaseModel):
	id: int
	email: EmailStr
	full_name: str


class TokenOut(BaseModel):
	access_token: str
	token_type: str = "bearer"


class UserCreate(BaseModel):
	email: EmailStr
	full_name: str
	password: str


class UserLogin(BaseModel):
	email: EmailStr
	password: str


class UserOut(BaseModel):
	id: str
	email: EmailStr
	full_name: str


class TokenOut(BaseModel):
	access_token: str
	token_type: str = "bearer"


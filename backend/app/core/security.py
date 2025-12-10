from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import base64
from typing import Optional
import hashlib
import secrets

_TOKENS = {}


def hash_password(password: str) -> str:
	return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
	return hash_password(password) == password_hash


def create_token(user_id: int) -> str:
	token = secrets.token_urlsafe(24)
	_TOKENS[token] = user_id
	return token


def get_user_id_from_token(token: str) -> Optional[int]:
	return _TOKENS.get(token)

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .config import settings
from ..services.db_service import get_user_by_id


def hash_password(password: str) -> str:
	return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
	return hmac.compare_digest(hash_password(password), password_hash)


def create_token(user_id: str, expires_in_minutes: int = 60 * 24) -> str:
	# Very simple signed token: base64(user_id|exp|signature)
	exp = int((datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes)).timestamp())
	msg = f"{user_id}|{exp}"
	sig = hmac.new(settings.secret_key.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256).hexdigest()
	raw = f"{msg}|{sig}".encode("utf-8")
	return base64.urlsafe_b64encode(raw).decode("utf-8")


def decode_token(token: str) -> Optional[str]:
	try:
		raw = base64.urlsafe_b64decode(token.encode("utf-8")).decode("utf-8")
		user_id, exp_str, sig = raw.split("|")
		exp = int(exp_str)
		msg = f"{user_id}|{exp}"
		expected_sig = hmac.new(settings.secret_key.encode("utf-8"), msg.encode("utf-8"), hashlib.sha256).hexdigest()
		if not hmac.compare_digest(sig, expected_sig):
			return None
		if datetime.now(timezone.utc).timestamp() > exp:
			return None
		return user_id
	except Exception:
		return None


auth_scheme = HTTPBearer(auto_error=False)


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)) -> str:
	if not credentials:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing credentials")
	user_id = decode_token(credentials.credentials)
	if not user_id:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
	user = get_user_by_id(user_id)
	if not user:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
	return user_id


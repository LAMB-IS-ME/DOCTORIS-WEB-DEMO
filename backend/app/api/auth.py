from fastapi import APIRouter, HTTPException

from ..schemas.user import UserCreate, UserLogin, UserOut, TokenOut
from ..services.db_service import create_user, get_user_by_email
from ..core.security import hash_password, verify_password, create_token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate):
	try:
		user = create_user(
			email=payload.email,
			full_name=payload.full_name,
			password_hash=hash_password(payload.password),
		)
		return UserOut(id=user.id, email=user.email, full_name=user.full_name)
	except ValueError as e:
		raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenOut)
def login(payload: UserLogin):
	user = get_user_by_email(payload.email)
	if not user or not verify_password(payload.password, user.password_hash):
		raise HTTPException(status_code=401, detail="Invalid email or password")
	token = create_token(user.id)
	return TokenOut(access_token=token)


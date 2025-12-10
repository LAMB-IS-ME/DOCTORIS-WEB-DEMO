from fastapi import APIRouter, HTTPException
from ..core.security import get_user_id_from_token
from ..services.db_service import create_session, list_sessions, add_message, get_messages
from ..services.llm_service import simple_reply
from ..schemas.chat import ChatCreate, ChatSessionOut, MessageCreate, MessageOut

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/sessions", response_model=ChatSessionOut)
def create_chat_session(payload: ChatCreate, token: str):
	user_id = get_user_id_from_token(token)
	if not user_id:
		raise HTTPException(status_code=401, detail="Invalid token")
	s = create_session(user_id=str(user_id), title=payload.title)
	return ChatSessionOut(id=s.id, title=s.title)


@router.get("/sessions", response_model=list[ChatSessionOut])
def get_my_sessions(token: str):
	user_id = get_user_id_from_token(token)
	if not user_id:
		raise HTTPException(status_code=401, detail="Invalid token")
	sessions = list_sessions(user_id=str(user_id))
	return [ChatSessionOut(id=s.id, title=s.title) for s in sessions]


@router.post("/message", response_model=list[MessageOut])
def send_message(payload: MessageCreate, token: str):
	user_id = get_user_id_from_token(token)
	if not user_id:
		raise HTTPException(status_code=401, detail="Invalid token")
	user_msg = add_message(session_id=payload.session_id, role="user", content=payload.content)
	assistant_text = simple_reply(payload.content)
	assistant_msg = add_message(session_id=payload.session_id, role="assistant", content=assistant_text)
	msgs = get_messages(payload.session_id)
	return [MessageOut(id=m.id, role=m.role, content=m.content, session_id=m.session_id) for m in msgs]


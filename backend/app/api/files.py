from fastapi import APIRouter, UploadFile, File
from typing import List

from ..services.file_service import save_upload, list_uploads


router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
	data = await file.read()
	path = save_upload(file.filename, data)
	return {"filename": path.name}


@router.get("/list", response_model=List[str])
def list_files():
	return [p.name for p in list_uploads()]


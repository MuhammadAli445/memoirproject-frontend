import os
import tempfile
import assemblyai as aai
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/speech", tags=["Speech To Text"])

ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")

class TranscriptionResponse(BaseModel):
    text: str

@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    if not ASSEMBLYAI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="ASSEMBLYAI_API_KEY is not configured on the server."
        )

    # Read uploaded file content
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

    # Save to a temporary file for AssemblyAI SDK processing
    file_suffix = os.path.splitext(file.filename or "")[1] or ".wav"
    temp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_suffix) as temp_file:
            temp_file.write(contents)
            temp_file_path = temp_file.name

        aai.settings.api_key = ASSEMBLYAI_API_KEY
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(temp_file_path)

        if transcript.status == aai.TranscriptStatus.error:
            raise HTTPException(
                status_code=500,
                detail=f"Transcription failed: {transcript.error}"
            )

        return TranscriptionResponse(text=transcript.text or "")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech-to-text processing failed: {str(e)}")
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass

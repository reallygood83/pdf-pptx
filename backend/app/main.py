from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, Header, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from core.converter import SaaSConverter
from core.security import key_manager
import os
import uuid
from pathlib import Path
from typing import Optional, List, Dict
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, auth, firestore
from pydantic import BaseModel

# Load .env file
load_dotenv()

# Initialize Firebase Admin
cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")

if cred_path and os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app(cred)
else:
    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app()

db = firestore.client()

app = FastAPI(title="NotePPT API")

class UserKeys(BaseModel):
    provider: str
    api_key: str

# Add CORS for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

import tempfile

# Use /tmp for Cloud Run (Read-only filesystem elsewhere)
TEMP_DIR = Path(tempfile.gettempdir())

@app.get("/")
def read_root():
    return {"message": "NotePPT API is running"}

async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/save-keys")
async def save_keys(keys: UserKeys, uid: str = Header(...)):
    # In a real app, you should verify_token(uid) 
    # For now, we take uid from header or token
    encrypted_key = key_manager.encrypt_key(keys.api_key)
    
    user_ref = db.collection("users").document(uid)
    user_ref.set({
        "keys": {
            keys.provider: encrypted_key
        }
    }, merge=True)
    
    return {"message": f"{keys.provider} key saved securely"}

@app.get("/get-keys")
async def get_keys(uid: str = Header(...)):
    user_ref = db.collection("users").document(uid).get()
    if user_ref.exists:
        data = user_ref.to_dict()
        encrypted_keys = data.get("keys", {})
        # We don't return the full key, just masked or boolean presence
        return {p: True for p in encrypted_keys}
    return {}

def cleanup_files(paths: List[Path]):
    for path in paths:
        try:
            if path.exists():
                os.remove(path)
        except Exception as e:
            print(f"Error cleaning up {path}: {e}")

@app.post("/convert")
async def start_conversion(
    request: Request,
    background_tasks: BackgroundTasks,
    pdf_file: UploadFile = File(...),
    provider: str = Form("gemini"),
    api_key: Optional[str] = Form(None),
    model: Optional[str] = Form(None),
    context_text: Optional[str] = Form(None),
    dpi: int = Form(144),
    remove_watermark: bool = Form(True),
    generate_notes: bool = Form(True),
    uid: Optional[str] = Header(None)
):
    job_id = str(uuid.uuid4())
    pdf_path = TEMP_DIR / f"{job_id}.pdf"
    pptx_path = TEMP_DIR / f"{job_id}.pptx"
    
    # Save uploaded PDF
    with open(pdf_path, "wb") as buffer:
        buffer.write(await pdf_file.read())
        
    # API Key retrieval logic (Priority: Request -> Firestore -> Env)
    effective_api_key = api_key
    
    if not effective_api_key and uid:
        try:
            user_ref = db.collection("users").document(uid).get()
            if user_ref.exists:
                data = user_ref.to_dict()
                encrypted_keys = data.get("keys", {})
                encrypted_val = encrypted_keys.get(provider)
                if encrypted_val:
                    effective_api_key = key_manager.decrypt_key(encrypted_val)
        except Exception:
            pass

    if not effective_api_key:
        if provider == 'gemini':
            effective_api_key = os.getenv("GOOGLE_API_KEY")
        elif provider == 'openai':
            effective_api_key = os.getenv("OPENAI_API_KEY")
        elif provider == 'anthropic':
            effective_api_key = os.getenv("ANTHROPIC_API_KEY")
        elif provider == 'grok':
            effective_api_key = os.getenv("XAI_API_KEY")

    if not effective_api_key:
        # Cleanup
        if pdf_path.exists(): os.remove(pdf_path)
        raise HTTPException(status_code=400, detail=f"{provider} API Key is required.")

    # Convert
    effective_model = model
    if provider == 'gemini' and not effective_model:
        effective_model = 'gemini-2.5-flash'

    try:
        converter = SaaSConverter(
            provider=provider,
            api_key=effective_api_key,
            model=effective_model,
            dpi=dpi,
            remove_watermark=remove_watermark
        )
        
        converter.convert(
            pdf_path, 
            pptx_path, 
            generate_notes=generate_notes, 
            context=context_text
        )
        
        if not pptx_path.exists():
            raise Exception("Conversion failed to create output file")
            
        # Schedule cleanup - Temporarily disabled to debug streaming issues
        # background_tasks.add_task(cleanup_files, [pdf_path, pptx_path])
        
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
        
        return FileResponse(
            pptx_path,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename=f"converted_{job_id[:8]}.pptx",
            headers=headers
        )
        
    except Exception as e:
        cleanup_files([pdf_path])
        if pptx_path.exists(): cleanup_files([pptx_path])
        raise HTTPException(status_code=500, detail=str(e))

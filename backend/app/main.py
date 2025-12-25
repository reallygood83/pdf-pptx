from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Header, HTTPException
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
# In production, use service account JSON path or env var
cred_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
if cred_path and os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
else:
    # Fallback/Default for local or if env is not structured yet
    try:
        firebase_admin.initialize_app()
    except Exception:
        print("Firebase Admin could not be initialized. Some features may not work.")

db = firestore.client()

app = FastAPI(title="NotePPT API")

class UserKeys(BaseModel):
    provider: str
    api_key: str

# Add CORS for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)

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

@app.post("/convert")
async def start_conversion(
    background_tasks: BackgroundTasks,
    pdf_file: UploadFile = File(...),
    provider: str = "gemini",
    api_key: Optional[str] = None,
    model: Optional[str] = None,
    context_text: Optional[str] = None,
    dpi: int = 144,
    remove_watermark: bool = True,
    generate_notes: bool = True,
    uid: Optional[str] = Header(None)
):
    job_id = str(uuid.uuid4())
    pdf_path = TEMP_DIR / f"{job_id}.pdf"
    pptx_path = TEMP_DIR / f"{job_id}.pptx"
    
    with open(pdf_path, "wb") as buffer:
        buffer.write(await pdf_file.read())
        
    # API Key retrieval logic (Priority: Request -> Firestore -> Env)
    effective_api_key = api_key
    
    if not effective_api_key and uid:
        # Try fetch from Firestore
        user_ref = db.collection("users").document(uid).get()
        if user_ref.exists:
            data = user_ref.to_dict()
            encrypted_keys = data.get("keys", {})
            encrypted_val = encrypted_keys.get(provider)
            if encrypted_val:
                effective_api_key = key_manager.decrypt_key(encrypted_val)

    if not effective_api_key:
        # Fallback to Server Keys
        if provider == 'gemini':
            effective_api_key = os.getenv("GOOGLE_API_KEY")
        elif provider == 'openai':
            effective_api_key = os.getenv("OPENAI_API_KEY")
        elif provider == 'anthropic':
            effective_api_key = os.getenv("ANTHROPIC_API_KEY")
        elif provider == 'grok':
            effective_api_key = os.getenv("XAI_API_KEY")

    if not effective_api_key:
        raise HTTPException(status_code=400, detail=f"{provider} API Key is required. Please provide it or save it in settings.")

    # Initialize Converter
    converter = SaaSConverter(
        provider=provider,
        api_key=effective_api_key,
        model=model,
        dpi=dpi,
        remove_watermark=remove_watermark
    )
    
    # Run conversion
    converter.convert(
        pdf_path, 
        pptx_path, 
        generate_notes=generate_notes, 
        context=context_text
    )
    
    return {
        "job_id": job_id,
        "status": "completed",
        "download_url": f"http://localhost:8000/download/{job_id}"
    }

@app.get("/download/{job_id}")
def download_result(job_id: str):
    # Serve the file
    from fastapi.responses import FileResponse
    pptx_path = TEMP_DIR / f"{job_id}.pptx"
    if pptx_path.exists():
        return FileResponse(
            pptx_path, 
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename=f"converted.pptx"
        )
    return {"error": "File not found"}

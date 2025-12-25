from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from .core.converter import SaaSConverter
import os
import uuid
from pathlib import Path

app = FastAPI(title="NotePPT API")

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
    generate_notes: bool = True
):
    job_id = str(uuid.uuid4())
    pdf_path = TEMP_DIR / f"{job_id}.pdf"
    pptx_path = TEMP_DIR / f"{job_id}.pptx"
    
    with open(pdf_path, "wb") as buffer:
        buffer.write(await pdf_file.read())
        
    # Initialize Converter
    converter = SaaSConverter(
        provider=provider,
        api_key=api_key,
        model=model,
        dpi=dpi,
        remove_watermark=remove_watermark
    )
    
    # Run conversion (In a real SaaS, this should be a background task)
    # background_tasks.add_task(converter.convert, pdf_path, pptx_path, generate_notes, context_text)
    
    # For MVP, we run it synchronously and return
    converter.convert(
        pdf_path, 
        pptx_path, 
        generate_notes=generate_notes, 
        context=context_text
    )
    
    return {
        "job_id": job_id,
        "status": "completed",
        "download_url": f"http://localhost:8000/download/{job_id}" # Update with real URL in prod
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

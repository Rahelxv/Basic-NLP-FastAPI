from fastapi import FastAPI, Response, status, HTTPException, File, UploadFile, Form
from fastapi.params import Body
from pydantic import BaseModel
import time
from typing import Annotated 
from fastapi.middleware.cors import CORSMiddleware
#importing tools
from app.Services.N_gram import NLP_basic_ngram


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Izinkan list origins di atas
    allow_credentials=True,
    allow_methods=["*"],             # Izinkan semua method (GET, POST, PUT, DELETE, dll)
    allow_headers=["*"],             # Izinkan semua header
)

#default route 
@app.get("/")
def root():
    return {"message": "bellow World"}

#recive data from frontend
ALLOWED_MIME_TYPES = [
    "text/csv",                                                         # Untuk .csv
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", # Untuk .xlsx
    "application/vnd.ms-excel"                                          # Untuk .xls (opsional)
]


@app.post("/upload")
async def taking_upload(file: Annotated[UploadFile, File()]):
    #batasi ukuran file (5mb max)
    MAX_FILE_SIZE = 5 * 1024 * 1024 
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail="FILE IS TOO LARGE")
    #batasi file type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file!")

    #baca isi file// metode untuk membaca file menjadikan dia bytes 1010 etc
    content = await file.read()

    #masukan file dari client ke tools n-gram dulu
    try:
        stats, ngrams = NLP_basic_ngram(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_size" : f"{(file.size / 1024 / 1024):.2f} MB",
        "statistics": stats,
        "ngrams": {
            "unigrams": ngrams[0],
            "bigrams": ngrams[1],
            "trigrams": ngrams[2]
        }
    }
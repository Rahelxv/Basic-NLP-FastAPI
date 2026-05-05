from fastapi import FastAPI, Response, status, HTTPException, File, UploadFile, Form
from fastapi.params import Body
from pydantic import BaseModel
import time
from fastapi.middleware.cors import CORSMiddleware

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
@app.post("/upload")
def taking_upload(file: UploadFile = File(...)):
    return{
        "filename" : file.filename,
        "content_type": file.content_type
    }
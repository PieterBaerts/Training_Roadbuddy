# backend/main.py
from fastapi import FastAPI, HTTPException
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import carpools
from pydantic import BaseModel

models.Base.metadata.create_all(bind=engine)



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




@app.post("/test/reset")
def reset_database():
    from database import Base, engine, SessionLocal
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # optioneel: voeg testdata toe
    db = SessionLocal()
    db.close()
    return {"status": "reset done"}


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}



# Routers
app.include_router(carpools.router)



# Dummy login model
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login")
def login(data: LoginRequest):
    if data.username == "alice" and data.password == "secret123":
        return {"username": data.username, "role": "user"}
    if data.username == "admin" and data.password == "admin123":
        return {"username": data.username, "role": "admin"}
    raise HTTPException(status_code=401, detail="Invalid credentials")



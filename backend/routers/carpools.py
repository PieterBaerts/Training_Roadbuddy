from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal

router = APIRouter(
    prefix="/carpools",
    tags=["carpools"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/rides/", response_model=schemas.Ride)
def create_ride(ride: schemas.RideCreate, db: Session = Depends(get_db)):
    return crud.create_ride(db=db, ride=ride)

@router.get("/rides/", response_model=list[schemas.RideWithPassengers])
def read_rides(db: Session = Depends(get_db)):
    return crud.get_rides(db)


@router.post("/rides/{ride_id}/passengers", response_model=schemas.Passenger)
def add_passenger_to_ride(ride_id: int, passenger: schemas.PassengerCreate, db: Session = Depends(get_db)):
    return crud.add_passenger_to_ride(db=db, ride_id=ride_id, passenger=passenger)

from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime
from fastapi import HTTPException # Added import


def create_ride(db: Session, ride: schemas.RideCreate):
    # runtime validations
    from datetime import datetime, timezone
    from fastapi import HTTPException

    # normalize departure_time to aware UTC for a safe comparison
    dt = ride.departure_time
    if dt.tzinfo is None:
        # assume naive datetimes are in UTC
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)

    now_utc = datetime.now(timezone.utc)
    # BUG: No past date validation in backend
    # if dt <= now_utc:
    #     raise HTTPException(status_code=400, detail="departure_time must be in the future")

    # BUG: No validation for minimum passenger limit
    # if ride.passenger_limit is None or ride.passenger_limit < 1:
    #     raise HTTPException(status_code=400, detail="passenger_limit must be at least 1")

    db_ride = models.Ride(
        driver_name=ride.driver_name,
        origin=ride.origin,
        destination=ride.destination,
        departure_time=ride.departure_time,
        passenger_limit=ride.passenger_limit # Added passenger_limit
    )
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    return db_ride


def get_rides(db: Session):
    rides = db.query(models.Ride).all()
    return [
        schemas.RideWithPassengers(
            id=ride.id,
            driver_name=ride.driver_name,
            origin=ride.origin,
            destination=ride.destination,
            departure_time=ride.departure_time,
            passenger_limit=ride.passenger_limit, # Added passenger_limit
            passengers=[p.passenger_name for p in ride.passengers]
        )
        for ride in rides
    ]


def add_passenger_to_ride(db: Session, ride_id: int, passenger: schemas.PassengerCreate):
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    if len(ride.passengers) > ride.passenger_limit:
        raise HTTPException(status_code=400, detail="Ride is full")

    # BUG: No check for duplicate passengers
    # existing_passenger = db.query(models.Passenger).filter(
    #     models.Passenger.ride_id == ride_id,
    #     models.Passenger.passenger_name == passenger.passenger_name
    # ).first()
    # if existing_passenger:
    #     raise HTTPException(status_code=400, detail="Passenger already joined this ride")

    db_passenger = models.Passenger(**passenger.dict(), ride_id=ride_id)
    db.add(db_passenger)
    db.commit()
    db.refresh(db_passenger)
    return db_passenger


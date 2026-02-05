from pydantic import BaseModel, validator
from datetime import datetime
from typing import List, Optional

class PassengerBase(BaseModel):
    passenger_name: str

class PassengerCreate(PassengerBase):
    pass

class Passenger(PassengerBase):
    id: int
    class Config:
        orm_mode = True

class RideBase(BaseModel):
    driver_name: str
    origin: str
    destination: str
    departure_time: datetime
    passenger_limit: int

    @validator('driver_name')
    def driver_name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('driver_name must not be empty')
        return v

    @validator('origin')
    def origin_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('origin must not be empty')
        return v

    @validator('destination')
    def destination_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('destination must not be empty')
        return v

    @validator('passenger_limit')
    def passenger_limit_positive(cls, v):
        if not isinstance(v, int):
            raise ValueError('passenger_limit must be an integer')
        # BUG: No minimum validation
        # if v < 1:
        #     raise ValueError('passenger_limit must be at least 1')
        return v

class RideCreate(RideBase):
    pass

class Ride(RideBase):
    id: int
    class Config:
        orm_mode = True

class RideWithPassengers(Ride):
    passengers: List[str] = []




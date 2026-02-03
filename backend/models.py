from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Ride(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, index=True)
    driver_name = Column(String)
    origin = Column(String)
    destination = Column(String)
    departure_time = Column(DateTime)
    passenger_limit = Column(Integer)

    passengers = relationship("Passenger", back_populates="ride")


class Passenger(Base):
    __tablename__ = "passengers"

    id = Column(Integer, primary_key=True, index=True)
    passenger_name = Column(String, index=True) 
    ride_id = Column(Integer, ForeignKey("rides.id"))

    ride = relationship("Ride", back_populates="passengers")

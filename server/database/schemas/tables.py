from typing import Optional

from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4


class User(SQLModel, table=True):
    id: UUID = Field(default=uuid4, primary_key=True)
    name: str
    grade: str
    email: str


class Patient(SQLModel, table=True):
    id: UUID = Field(default=uuid4, primary_key=True)
    name: str
    age: int
    bone_density_gram_per_centimeter_sq: Optional[float] = None
    height_millimeter: Optional[float] = None
    width_millimeter: Optional[float] = None
    thickness_millimeter: Optional[float] = None
    area_millimeter_sq: Optional[float] = None

    class Config:
        from_attributes = True

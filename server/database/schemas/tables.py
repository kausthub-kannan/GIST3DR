from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4


class User(SQLModel, table=True):
    id: UUID = Field(default=uuid4, primary_key=True)
    name: str
    email: str
    hashed_password: str


class Patient(SQLModel, table=True):
    id: UUID = Field(default=uuid4, primary_key=True)
    name: str
    age: int
    bone_density_gram_per_centimeter_sq: int | None
    height_millimeter: float | None
    width_millimeter: float | None
    thickness_millimeter: float | None
    area_millimeter_sq: float | None

    class Config:
        from_attributes = True

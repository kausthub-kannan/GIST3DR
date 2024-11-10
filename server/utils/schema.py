from pydantic import BaseModel, EmailStr
from typing import List, Optional
import numpy as np


class Detections(BaseModel):
    xyxy: List[List[float]]
    confidence: List[float]
    class_id: List[int]
    mask: List[List[bool]]

    class Config:
        arbitrary_types_allowed = True

    def to_numpy(self):
        """Convert lists to numpy arrays if needed"""
        return {
            "xyxy": np.array(self.xyxy),
            "confidence": np.array(self.confidence),
            "class_id": np.array(self.class_id),
            "mask": np.array(self.mask) if self.mask is not None else None,
        }


class PatientIndividual(BaseModel):
    id: str
    name: str
    age: int
    bone_density_gram_per_centimeter_sq: float | None
    height_millimeter: float | None
    width_millimeter: float | None
    thickness_millimeter: float | None
    area_millimeter_sq: float | None
    cancellous_url: str | None
    cortical_url: str | None
    nerve_canal_url: str | None

    class Config:
        orm_mode = True


class UserSignUp(BaseModel):
    email: EmailStr
    password: str
    grade: str = "junior"
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserSignIn(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

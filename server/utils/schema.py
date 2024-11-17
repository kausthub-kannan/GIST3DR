from numpy._typing import NDArray
from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional, Union, Dict
import numpy as np


class Detections(BaseModel):
    xyxy: Union[List[List[float]], NDArray[np.float64]]
    confidence: Union[List[float], NDArray[np.float64]]
    class_id: Union[List[int], NDArray[np.int64]]
    mask: Optional[Union[List[List[bool]], NDArray[np.bool_]]] = None

    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {
            np.ndarray: lambda x: x.tolist(),
            np.bool_: bool,
            np.int64: int,
            np.float64: float,
        },
    }

    @field_validator("mask", mode="before")
    def validate_mask(cls, v):
        if v is None:
            return v
        if isinstance(v, np.ndarray):
            if v.dtype != np.bool_:
                v = v.astype(np.bool_)
            return v
        return v

    @field_validator("xyxy", "confidence", "class_id", mode="before")
    def validate_arrays(cls, v):
        if isinstance(v, np.ndarray):
            return v
        return v

    def to_numpy(self) -> dict[str, NDArray]:
        """Convert all fields to numpy arrays"""
        return {
            "xyxy": np.asarray(self.xyxy, dtype=np.float64),
            "confidence": np.asarray(self.confidence, dtype=np.float64),
            "class_id": np.asarray(self.class_id, dtype=np.int64),
            "mask": (
                np.asarray(self.mask, dtype=np.bool_) if self.mask is not None else None
            ),
        }

    def model_dump(self, **kwargs):
        """Override model_dump to properly handle numpy arrays"""
        return super().model_dump(mode="json", **kwargs)


class PatientIndividual(BaseModel):
    id: str
    name: str
    age: int
    bone_density_gram_per_centimeter_sq: float | None
    height_millimeter: float | None
    width_millimeter: float | None
    thickness_millimeter: float | None
    area_millimeter_sq: float | None
    modal_urls: Dict[str, str | None] = {
        "cancellous": None,
        "cortical": None,
        "nerve_canal": None,
    }
    gif_urls: Dict[str, str | None] = {
        "cancellous": None,
        "cortical": None,
        "nerve_canal": None,
    }

    class Config:
        from_attributes = True


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

# models.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class Profile(BaseModel):
    uid: str
    name: str
    email: EmailStr
    allergy: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone_number: Optional[str] = None

class UpdateProfile(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    allergy: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    phone_number: Optional[str] = None

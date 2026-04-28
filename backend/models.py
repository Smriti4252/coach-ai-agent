from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class LeadScore(str, Enum):
    hot = "HOT"
    warm = "WARM"
    cold = "COLD"


class LeadForm(BaseModel):
    name: str
    email: str
    phone: str
    goal: str                  # weight loss, business growth, confidence etc
    timeline: str              # how soon they want to start
    budget: str                # their budget range
    format: str                # 1:1 or group, calls or WhatsApp
    urgency: str               # how urgent is their need


class Lead(BaseModel):
    name: str
    email: str
    phone: str
    goal: str
    timeline: str
    budget: str
    format: str
    urgency: str
    score: Optional[str] = None           # HOT / WARM / COLD
    score_reason: Optional[str] = None    # why the AI gave that score
    booked_slot: Optional[str] = None     # confirmed call time
    package: Optional[str] = None         # coaching package generated
    status: Optional[str] = "new"         # new / booked / onboarded
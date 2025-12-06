from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ============ User Schemas ============
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============ Doctor Schemas ============
class DoctorSignup(BaseModel):
    # User fields
    username: str
    email: EmailStr
    password: str
    # Doctor fields
    hospital: str
    specialization: str
    qualification: str
    profile_picture: Optional[str] = None
    age: Optional[int] = None
    license_number: Optional[str] = None
    years_of_experience: Optional[int] = None
    auto_accept: bool = False


class DoctorUpdate(BaseModel):
    """Schema for updating doctor profile."""
    hospital: Optional[str] = None
    specialization: Optional[str] = None
    qualification: Optional[str] = None
    profile_picture: Optional[str] = None
    age: Optional[int] = None
    license_number: Optional[str] = None
    years_of_experience: Optional[int] = None
    auto_accept: Optional[bool] = None


class DoctorResponse(BaseModel):
    id: int
    user_id: int
    hospital: str
    specialization: str
    qualification: str
    profile_picture: Optional[str] = None
    age: Optional[int] = None
    license_number: Optional[str] = None
    years_of_experience: Optional[int] = None
    auto_accept: bool
    user: UserResponse

    class Config:
        from_attributes = True


# ============ Patient Schemas ============
class PatientSignup(BaseModel):
    # User fields
    username: str
    email: EmailStr
    password: str
    # Patient fields
    date_of_birth: Optional[datetime] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[str] = None
    profile_picture: Optional[str] = None


class PatientUpdate(BaseModel):
    """Schema for updating patient profile."""
    date_of_birth: Optional[datetime] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[str] = None
    profile_picture: Optional[str] = None


class PatientResponse(BaseModel):
    id: int
    user_id: int
    date_of_birth: Optional[datetime] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history: Optional[str] = None
    profile_picture: Optional[str] = None
    user: UserResponse

    class Config:
        from_attributes = True


# ============ Auth Schemas ============
class SigninRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str  # "doctor" or "patient"
    user_id: int


class SignupResponse(BaseModel):
    message: str
    user_id: int
    role: str


# ============ Entry Schemas ============
class EntryCreate(BaseModel):
    """Schema for creating a new entry."""
    doctor_id: str | int  # Accept both string and int for BigInt compatibility
    top_view_url: Optional[str] = None
    bottom_view_url: Optional[str] = None
    amount_voided: Optional[float] = None
    diameter_of_commode: Optional[float] = None
    notes: Optional[str] = None
    
    @property
    def doctor_id_int(self) -> int:
        """Return doctor_id as integer."""
        return int(self.doctor_id)


class EntryResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    time: datetime
    top_view_url: Optional[str] = None
    bottom_view_url: Optional[str] = None
    amount_voided: Optional[float] = None
    diameter_of_commode: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EntryWithDetails(EntryResponse):
    """Entry with patient and doctor details."""
    doctor: DoctorResponse
    patient: PatientResponse

    class Config:
        from_attributes = True


# ============ Report Schemas ============
class ReportCreate(BaseModel):
    """Schema for creating a new report."""
    entry_id: str | int  # Accept both string and int for BigInt compatibility
    report_url: Optional[str] = None
    report_type: str  # e.g., "diagnosis", "prescription", "lab_results"
    title: str
    description: Optional[str] = None


class ReportResponse(BaseModel):
    id: int
    entry_id: int
    report_url: Optional[str] = None
    report_type: str
    title: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EntryWithReports(EntryResponse):
    """Entry with patient details and reports."""
    patient: PatientResponse
    reports: list[ReportResponse] = []

    class Config:
        from_attributes = True


# ============ Analysis Schemas ============
class AnalysisCreate(BaseModel):
    """Schema for creating/updating an analysis."""
    entry_id: str | int  # Accept both for BigInt compatibility
    annotated_video_url: Optional[str] = None
    clinical_report_url: Optional[str] = None
    flow_timeseries_url: Optional[str] = None
    qmax_report_json: Optional[str] = None  # JSON string


class AnalysisResponse(BaseModel):
    id: int
    entry_id: int
    annotated_video_url: Optional[str] = None
    clinical_report_url: Optional[str] = None
    flow_timeseries_url: Optional[str] = None
    qmax_report_json: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True



class EntryCreate(BaseModel):
    doctor_id: int
    amount_voided: Optional[float] = None
    diameter_of_commode: Optional[float] = None
    notes: Optional[str] = None
    # Note: video_urls are handled separately via file uploads

class EntryResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    time: datetime
    top_view_url: Optional[str]
    bottom_view_url: Optional[str]
    amount_voided: Optional[float]
    diameter_of_commode: Optional[float]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# For backward compatibility with direct URL submissions
class EntryCreateWithUrls(EntryCreate):
    top_view_url: Optional[str] = None
    bottom_view_url: Optional[str] = None

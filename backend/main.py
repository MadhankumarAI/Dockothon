from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json

from routers.auth_router import router as auth_router
from routers.doctor_router import router as doctor_router
from routers.patient_router import router as patient_router
from routers.entry_router import router as entry_router
from routers.report_router import router as report_router
from routers.analysis_router import router as analysis_router
from fastapi.middleware.cors import CORSMiddleware

class BigIntJSONEncoder(json.JSONEncoder):
    """Custom JSON encoder that converts large integers to strings for JavaScript compatibility."""
    def default(self, obj):
        return super().default(obj)
    
    def encode(self, obj):
        return super().encode(self._convert_big_ints(obj))
    
    def _convert_big_ints(self, obj):
        """Recursively convert integers larger than JS safe integer to strings."""
        MAX_SAFE_INT = 9007199254740991  # 2^53 - 1
        
        if isinstance(obj, dict):
            return {k: self._convert_big_ints(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_big_ints(item) for item in obj]
        elif isinstance(obj, int) and abs(obj) > MAX_SAFE_INT:
            return str(obj)
        return obj


class BigIntJSONResponse(JSONResponse):
    """Custom JSON response that handles BigInt conversion."""
    def render(self, content) -> bytes:
        return json.dumps(
            content,
            cls=BigIntJSONEncoder,
            ensure_ascii=False,
            allow_nan=False,
            indent=None,
            separators=(",", ":"),
        ).encode("utf-8")


app = FastAPI(
    title="Dockothon API",
    description="Medical platform API for doctors and patients",
    version="1.0.0",
    default_response_class=BigIntJSONResponse  # Use custom response for all endpoints
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Exact frontend origin
    allow_credentials=True,                   # Needed if sending cookies or auth headers
    allow_methods=["*"],                       # Allow all HTTP methods
    allow_headers=["*"],                       # Allow all headers
)
# Include routers
app.include_router(auth_router)
app.include_router(doctor_router)
app.include_router(patient_router)
app.include_router(entry_router)
app.include_router(report_router)
app.include_router(analysis_router)


@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "Dockothon API is running"}


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

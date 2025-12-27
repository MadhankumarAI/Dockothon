# 🏥 Uroflow Computer Vision Analysis System

<div align="center">

**A cutting-edge medical analysis platform combining advanced computer vision, real-time analytics, and clinical reporting for urinary flow assessment**

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [OpenCV Model Setup](#opencv-model-setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Clinical Metrics](#-clinical-metrics)
- [How It Works](#-how-it-works)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

The **Uroflow Computer Vision Analysis System** is a comprehensive medical platform that revolutionizes urinary flow assessment through advanced computer vision techniques. The system processes video recordings of urinary streams to extract clinical metrics such as **Qmax** (peak flow rate), flow time, voiding time, and hesitancy patterns.

This platform combines:
- 🎥 **Advanced CV Engine**: Multi-view stream segmentation with ROI locking and geometric filtering
- 🚀 **Modern Web Frontend**: Responsive React application with real-time visualization
- ⚡ **Robust Backend API**: FastAPI-powered REST API with authentication and database management
- 📊 **Clinical Reporting**: Automated generation of medical-grade reports with visual analytics

---

## 🏗️ Architecture

![System Architecture](arch.png)

The system follows a **modular three-tier architecture**:

### 1. **Frontend Layer** (React + Vite)
- User authentication and patient management
- Video upload and analysis request submission
- Real-time progress tracking
- Interactive report visualization
- Responsive UI with TailwindCSS

### 2. **Backend Layer** (FastAPI + SQLAlchemy)
- RESTful API endpoints
- JWT-based authentication
- Database management (CockroachDB/PostgreSQL)
- Video processing orchestration
- Report generation and storage
- Email notifications

### 3. **Computer Vision Engine** (OpenCV + NumPy)
- **Calibration**: Auto-detects physical reference (26cm blue line)
- **Preprocessing**: Frame extraction and ROI detection
- **Segmentation**: Advanced stream isolation using:
  - Background subtraction (MOG2)
  - ROI locking and tracking
  - Width-based gating (removes hands/body parts)
  - Geometric filtering (aspect ratio analysis)
  - Vertical dilation (connects stream fragments)
- **Ensemble Analysis**: Multi-view fusion with confidence weighting
- **Flow Estimation**: Velocity tracking and volume normalization
- **Visualization**: Annotated video generation

---

## ✨ Key Features

### 🎯 Advanced Stream Segmentation
- **ROI Locking**: Automatically locks onto the urine stream position and tracks it throughout the video
- **Width-Based Gating**: Removes thick objects (hands, body parts) while preserving the thin stream
- **Geometric Filtering**: Uses aspect ratio analysis to distinguish stream from background artifacts
- **Vertical Dilation**: Connects broken stream fragments for continuous detection
- **Multi-View Support**: Combines top and side camera views with confidence weighting

### 📊 Clinical Metrics
- **Qmax**: Peak flow rate measurement (ml/s)
- **Average Flow Rate**: Mean flow throughout voiding
- **Flow Time**: Duration of actual urine flow
- **Voiding Time**: Total time from start to finish
- **Time to Qmax**: Time taken to reach peak flow
- **Hesitancy Detection**: Identifies delayed stream initiation
- **Volume Normalization**: Adjusts flow curve to match manually measured voided volume

### 🔐 Security & Management
- JWT-based authentication with role-based access control
- Secure patient data management
- HIPAA-compliant data handling
- Cloudinary integration for secure media storage
- Email notifications for report delivery

### 📈 Reporting & Visualization
- Clinical-grade dual-panel reports
- Interactive flow curve visualization
- Frame-by-frame analysis data (CSV export)
- Annotated video playback with stream overlay
- JSON-formatted metric summaries

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with modern hooks |
| **Vite** | Lightning-fast build tool and dev server |
| **TailwindCSS 4** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API communication |
| **Simplex Noise** | Procedural background animations |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance async web framework |
| **SQLAlchemy** | ORM for database operations |
| **CockroachDB/PostgreSQL** | Distributed SQL database |
| **Pydantic** | Data validation and settings management |
| **Python-JOSE** | JWT token handling |
| **Passlib + Bcrypt** | Password hashing |
| **Cloudinary** | Cloud-based media storage |
| **Python-Multipart** | File upload handling |

### Computer Vision Engine
| Technology | Purpose |
|------------|---------|
| **OpenCV** | Core computer vision operations |
| **NumPy** | Numerical computations |
| **SciPy** | Signal processing and smoothing |
| **Pandas** | Data manipulation and CSV export |
| **Matplotlib** | Clinical report visualization |
| **MediaPipe** | Advanced pose detection (optional) |

---

## 📁 Project Structure

```
clean-doc_ag/
├── Dockothon/
│   ├── arch.png                    # System architecture diagram
│   │
│   ├── frontend/                   # React Web Application
│   │   ├── src/
│   │   │   ├── components/         # Reusable UI components
│   │   │   ├── pages/              # Route-based page components
│   │   │   ├── contexts/           # React context providers
│   │   │   ├── services/           # API service layer
│   │   │   ├── App.jsx             # Main application component
│   │   │   └── main.jsx            # Application entry point
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   ├── backend/                    # FastAPI Backend
│   │   ├── routers/                # API route handlers
│   │   │   ├── auth_router.py      # Authentication endpoints
│   │   │   ├── patient_router.py   # Patient management
│   │   │   ├── entry_router.py     # Patient entry creation
│   │   │   ├── analysis_router.py  # Video analysis triggers
│   │   │   ├── report_router.py    # Report generation
│   │   │   ├── doctor_router.py    # Doctor management
│   │   │   └── chat_router.py      # Chat functionality
│   │   ├── src/                    # CV engine integration
│   │   ├── scripts/                # Utility scripts
│   │   ├── config/                 # Configuration files
│   │   ├── main.py                 # FastAPI application
│   │   ├── models.py               # SQLAlchemy models
│   │   ├── schemas.py              # Pydantic schemas
│   │   ├── database.py             # Database connection
│   │   ├── auth.py                 # Authentication logic
│   │   ├── dependencies.py         # Dependency injection
│   │   ├── analysis_runner.py      # CV analysis orchestration
│   │   ├── report_generator.py     # Report creation
│   │   ├── cloudinary_service.py   # Media upload service
│   │   ├── email_service.py        # Email notifications
│   │   └── requirements.txt
│   │
│   └── opencv_model/               # Computer Vision Engine
│       ├── src/
│       │   ├── calibration.py      # Physical reference detection
│       │   ├── segmentation.py     # Stream segmentation (ROI + Width gating)
│       │   ├── tracking.py         # Velocity tracking
│       │   ├── flow_estimation.py  # Flow rate calculation
│       │   ├── volume.py           # Volume normalization
│       │   ├── visualize.py        # Video annotation
│       │   └── ensemble/           # Multi-view fusion
│       ├── scripts/
│       │   └── run_analysis.py     # Main analysis script
│       ├── data/                   # Input videos and calibration
│       ├── outputs/                # Analysis results
│       └── requirements.txt
│
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **PostgreSQL** or **CockroachDB** - [PostgreSQL](https://www.postgresql.org/) | [CockroachDB](https://www.cockroachlabs.com/)
- **Git** - [Download](https://git-scm.com/)

---

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd Dockothon/backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/uroflow_db
   
   # JWT Secret
   SECRET_KEY=your-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # Cloudinary (for media storage)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Email (optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```

5. **Initialize the database**
   ```bash
   python init_db.py
   ```

6. **Run the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   
   📚 **API Documentation**: Visit `http://localhost:8000/docs` for interactive Swagger UI

---

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd Dockothon/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   
   Create a `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production** (optional)
   ```bash
   npm run build
   npm run preview
   ```

---

### OpenCV Model Setup

1. **Navigate to the OpenCV model directory**
   ```bash
   cd Dockothon/opencv_model
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Prepare calibration data**
   
   Place a calibration image (`top.png`) with a 26cm blue reference line in the `data/` directory.

5. **Run standalone analysis** (optional)
   ```bash
   python scripts/run_analysis.py \
       --top-video data/top.mp4 \
       --calibration-image data/top.png \
       --output-dir outputs/ \
       --volume 369
   ```

---

## 💡 Usage

### 1. **User Registration & Login**
- Navigate to the frontend application
- Register as a new user (Doctor/Admin)
- Log in with your credentials

### 2. **Patient Management**
- Create patient profiles with demographic information
- View patient history and previous analyses

### 3. **Video Upload & Analysis**
- Create a new patient entry
- Upload top-view and/or side-view videos
- Provide calibration image (if available)
- Enter manually measured voided volume
- Submit for analysis

### 4. **View Results**
- Monitor analysis progress in real-time
- View generated clinical reports
- Download annotated videos
- Export flow data as CSV
- Access JSON metrics

### 5. **Dual-View Ensemble Analysis**

For best results, upload both top and side views:

```bash
python scripts/run_analysis.py \
    --top-video data/top.mp4 \
    --side-video data/side.mp4 \
    --calibration-image data/top.png \
    --output-dir outputs_ensemble/ \
    --volume 369
```

**Outputs**:
- `annotated_top.mp4` / `annotated_side.mp4`: Visualization videos with stream overlay
- `clinical_report.png`: Clinical-grade dual-panel report
- `flow_timeseries.csv`: Frame-by-frame flow data
- `qmax_report.json`: Summary metrics in JSON format

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | User login (returns JWT) |
| GET | `/auth/me` | Get current user info |

### Patient Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patients/` | Create new patient |
| GET | `/patients/` | List all patients |
| GET | `/patients/{id}` | Get patient details |
| PUT | `/patients/{id}` | Update patient info |
| DELETE | `/patients/{id}` | Delete patient |

### Analysis & Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/entries/` | Create patient entry with videos |
| GET | `/entries/{id}` | Get entry details |
| POST | `/analysis/run/{entry_id}` | Trigger CV analysis |
| GET | `/reports/{entry_id}` | Get analysis report |

For complete API documentation, visit `http://localhost:8000/docs` after starting the backend.

---

## 📊 Clinical Metrics

The system calculates the following clinical parameters:

| Metric | Description | Unit |
|--------|-------------|------|
| **Qmax** | Maximum flow rate | ml/s |
| **Qavg** | Average flow rate | ml/s |
| **Flow Time** | Duration of continuous flow | seconds |
| **Voiding Time** | Total time from start to end | seconds |
| **Time to Qmax** | Time to reach peak flow | seconds |
| **Hesitancy** | Delay before stream initiation | seconds |
| **Voided Volume** | Total volume (normalized) | ml |

### Flow Curve Characteristics
- **Smoothing**: Savitzky-Golay filter / Rolling mean
- **Clamping**: 0-80 ml/s (physiological limits)
- **Normalization**: Scaled to match manual volume measurement

---

## 🔬 How It Works

### Segmentation Pipeline

```
Frame Input
    ↓
Background Subtraction (MOG2)
    ↓
ROI Filtering (if locked)
    ↓
Width-Based Gating (remove thick objects)
    ↓
Morphological Cleanup
    ↓
Vertical Dilation (connect fragments)
    ↓
Geometric Filtering (aspect ratio)
    ↓
Stream Contour Output
```

### Key Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| **MOG2 varThreshold** | 10 | High sensitivity background subtraction |
| **ROI Width** | 120px | Narrow focus on stream region |
| **Thick Object Kernel** | 40×40px | Hand/body part removal |
| **Vertical Dilation Kernel** | 5×25px | Stream fragment connection |
| **Aspect Ratio Threshold** | 1.2 (locked) / 2.0 (unlocked) | Stream shape validation |

### Ensemble Logic

The system fuses top and side views using **confidence-weighted averaging**:

$$Q_{final} = \frac{\sum_{i} w_i \cdot Q_i}{\sum_{i} w_i}$$

**Confidence Score** is determined by:
- Signal continuity (penalizing dropouts)
- Signal stability (penalizing high-frequency noise)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenCV Community** for the powerful computer vision library
- **FastAPI Team** for the modern web framework
- **React Team** for the excellent UI library
- **Medical Professionals** who provided domain expertise

---

<div align="center">

**Built with ❤️ for better healthcare**

[Report Bug](https://github.com/yourusername/uroflow-cv/issues) · [Request Feature](https://github.com/yourusername/uroflow-cv/issues)

</div>

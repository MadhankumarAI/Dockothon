# Uroflow Video Analysis CV Engine

This project implements a deterministic computer-vision pipeline to analyze top-view videos of urinary streams. It estimates flow metrics like **Qmax** (maximum flow rate) and instantaneous flow over time.

## Architecture

The system follows a modular architecture:
1.  **Calibration**: Auto-detects a physical reference (blue line = 26cm) in `top.png` to establish pixel-to-cm scale.
2.  **Preprocessing**: Reads video frames and extracts Region of Interest (ROI).
3.  **Segmentation**: Isolates the fluid stream using background subtraction (MOG2) and morphological operations.
4.  **Ensemble Analysis**:
    -   Combines metrics from Top and Side views.
    -   Calculates **Confidence Scores** based on signal continuity and noise.
    -   Performs **Weighted Fusion** ($Q_{final} = \frac{\sum w_i Q_i}{\sum w_i}$).
    -   Applies **Post-processing**: Smoothing, clamping, and scale normalization using total manual volume.
5.  **Visualization**: Outputs annotated videos and clinical-grade reports.

## Project Structure

- `src/`: Core python modules.
- `scripts/`: CLI entry points.
- `data/`: Calibration images and input videos.
- `outputs/`: Results (videos, CSVs, reports).
- `tests/`: Unit tests.

## Setup

```bash
pip install -r requirements.txt
```

## Usage

### 1. Generate Synthetic Test Video (if no real video is available)
```bash
python scripts/generate_test_video.py --output data/sample_videos/synthetic_test.mp4
```

### 2. Run Ensemble Analysis (Top + Side)
```bash
python scripts/run_analysis.py \
  --top-video data/top.mp4 \
  --side-video data/side.mp4 \
  --output-dir outputs/ \
  --volume 369
```

### Outputs
Check `outputs/` for:
- `annotated_top.mp4`, `annotated_side.mp4`: Analysis videos.
- `clinical_report.png`: Unified flow report.
- `qmax_report.json`: JSON output with final Qmax.
- `flow_timeseries.csv`: Final fused timeseries data.

## Ensemble Logic
The system fuses the Top and Side views using a confidence-weighted average. The confidence score is determined by:
- Signal continuity (penalizing dropouts).
- Signal stability (penalizing high-frequency noise).
The final curve is smoothed (Savitzky-Golay/Rolling Mean) and clamped to realistic physiological limits (0-80 ml/s) to filter artifacts. Qmax is extracted from this refined curve.

## Assumptions
- The camera is looking top-down.
- The blue bar in `top.png` is exactly 26 cm.
- The stream cross-section is approximated as circular based on the observed top-down width (Area = $\pi \times (width/2)^2$) or contour area logic.

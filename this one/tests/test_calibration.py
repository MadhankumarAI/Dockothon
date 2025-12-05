import pytest
import os
import sys
import numpy as np
import cv2

# Ensure src is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.calibration import compute_pixel_to_cm_scale

CALIB_IMG_PATH = "data/top.png"

def test_calibration_file_exists():
    assert os.path.exists(CALIB_IMG_PATH), "top.png should be in data/"

@pytest.mark.skipif(not os.path.exists(CALIB_IMG_PATH), reason="top.png missing")
def test_compute_pixel_to_cm_scale_real():
    try:
        scale = compute_pixel_to_cm_scale(CALIB_IMG_PATH)
        assert scale > 0
        assert scale < 10.0 # Heuristic check
    except RuntimeError:
        pytest.fail("Calibration failed on real image")

def test_compute_pixel_to_cm_scale_synthetic(tmp_path):
    # Create a synthetic calibration image with a known blue line
    img_path = str(tmp_path / "test_calib.png")
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    
    # Draw blue line (length 50)
    # OpenCV BGR -> Blue is (255, 0, 0)
    # But detector uses HSV ranges for Blue. 
    # Blue in HSV is H=120. BGR (255, 0, 0) -> HSV(120, 255, 255)
    cv2.line(img, (25, 50), (75, 50), (255, 0, 0), 5)
    
    cv2.imwrite(img_path, img)
    
    scale = compute_pixel_to_cm_scale(img_path, known_length_cm=10.0)
    
    # Length is 50px. Known length 10cm. Scale should be 0.2 cm/px.
    assert abs(scale - 0.2) < 0.01

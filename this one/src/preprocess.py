import cv2
import numpy as np

def read_video_frames(video_path, max_frames=None, resize_shape=None):
    """
    Generator that yields video frames.
    
    Args:
        video_path: Path to video file.
        max_frames: Max frames to read.
        resize_shape: (width, height) to resize frames to.
    
    Yields:
        (frame_id, frame_bgr)
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video: {video_path}")
    
    frame_idx = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if resize_shape:
            frame = cv2.resize(frame, resize_shape)
            
        yield frame_idx, frame
        
        frame_idx += 1
        if max_frames and frame_idx >= max_frames:
            break
            
    cap.release()

def extract_roi(frame, roi_rect=None):
    """
    Extracts ROI from frame.
    roi_rect: (x, y, w, h)
    """
    if roi_rect is None:
        return frame
    x, y, w, h = roi_rect
    return frame[y:y+h, x:x+w]

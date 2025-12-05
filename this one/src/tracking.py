import cv2
import numpy as np

def get_centroid(contour):
    M = cv2.moments(contour)
    if M["m00"] != 0:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
        return (cx, cy)
    return None

def estimate_velocity_optical_flow(prev_gray, curr_gray, mask, px_to_cm, fps):
    """
    Estimates average velocity in cm/s using Farneback Optical Flow within the mask.
    """
    if mask is None or cv2.countNonZero(mask) == 0:
        return 0.0
        
    # Calculate Optical Flow
    flow = cv2.calcOpticalFlowFarneback(prev_gray, curr_gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
    
    # Mask the flow to only the stream area
    flow_masked = cv2.bitwise_and(flow, flow, mask=mask)
    
    # Get magnitude and angle
    mag, ang = cv2.cartToPolar(flow_masked[..., 0], flow_masked[..., 1])
    
    # Average magnitude in pixels/frame
    # We only care about non-zero pixels (the stream)
    # Using np.mean on the whole array includes zeros from the mask.
    # We need to index into the masked area.
    valid_indices = mask > 0
    if not np.any(valid_indices):
        return 0.0
        
    avg_mag_px_per_frame = np.mean(mag[valid_indices])
    
    # Convert to cm/s
    # velocity_cm_s = avg_mag_px_per_frame * px_to_cm * fps
    velocity_cm_s = avg_mag_px_per_frame * px_to_cm * fps
    
    return velocity_cm_s

class StreamTracker:
    def __init__(self, px_to_cm):
        self.px_to_cm = px_to_cm
        self.prev_frame_gray = None
    
    def process(self, frame, mask, contour, fps):
        """
        Track stream stats.
        Returns: { 'area_cm2': float, 'velocity_cm_s': float, 'centroid': (x,y) }
        """
        if self.px_to_cm <= 0:
            raise ValueError("Invalid pixel_to_cm scale")

        curr_frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        stats = {
            'area_px': 0,
            'area_cm2': 0.0,
            'velocity_cm_s': 0.0,
            'centroid': None
        }

        if contour is not None:
            area_px = cv2.contourArea(contour)
            # Area in cm^2 = area_px * (px_to_cm)^2
            area_cm2 = area_px * (self.px_to_cm ** 2)
            centroid = get_centroid(contour)
            
            stats['area_px'] = area_px
            stats['area_cm2'] = area_cm2
            stats['centroid'] = centroid
            
            # Velocity estimation
            if self.prev_frame_gray is not None:
                vel = estimate_velocity_optical_flow(self.prev_frame_gray, curr_frame_gray, mask, self.px_to_cm, fps)
                stats['velocity_cm_s'] = vel
            else:
                # First frame, no velocity yet
                stats['velocity_cm_s'] = 0.0
        
        self.prev_frame_gray = curr_frame_gray
        return stats

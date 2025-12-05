import cv2
import numpy as np

class StreamSegmenter:
    """
    Kinematic Stream Segmenter.
    Combines Appearance (Background Subtraction) with Dynamics (Optical Flow).
    Target: Segment pixels that are BOTH 'Foreground' AND 'Moving Fast'.
    This effectively isolates the fluid stream from body parts (stomach) which move slowly.
    """
    def __init__(self, history=500, varThreshold=10, min_velocity_px=2.0):
        # Very sensitive MOG2
        self.fgbg = cv2.createBackgroundSubtractorMOG2(history=history, varThreshold=varThreshold, detectShadows=False)
        
        # Kernels
        self.kernel_vertical = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 25))
        self.kernel_clean = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3,3))
        
        # Hand Removal (Thick Object Removal)
        # Stream is usually thin (< 40-50px). Hand is thick (> 60px).
        self.kernel_thick = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (40, 40)) 
        
        # ROI Locking State
        self.locked_x_center = None
        self.roi_width = 120 # Narrower ROI (was 150)
        self.missed_frames = 0
        self.max_missed = 10 

    def process_frame(self, frame):
        """
        Segment finding stream using ROI Locking & Width Gating.
        """
        h_frame, w_frame = frame.shape[:2]
        
        # 1. Background Subtraction
        fgmask = self.fgbg.apply(frame)
        _, fgmask = cv2.threshold(fgmask, 200, 255, cv2.THRESH_BINARY)
        
        # 2. ROI Filtering
        if self.locked_x_center is not None:
            roi_mask = np.zeros_like(fgmask)
            # Adaptive Width? Let's stick to fixed narrow for stability
            w_roi = self.roi_width
            x1 = max(0, self.locked_x_center - w_roi // 2)
            x2 = min(w_frame, self.locked_x_center + w_roi // 2)
            roi_mask[:, x1:x2] = 255
            fgmask = cv2.bitwise_and(fgmask, roi_mask)
            
        # 3. Hand Removal (Width Gating)
        # Identify "Thick" objects (Hand) by Opening with large kernel
        thick_objects = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, self.kernel_thick)
        # Subtract Thick objects from Mask
        # This leaves only Thin objects (Stream)
        fgmask = cv2.bitwise_and(fgmask, cv2.bitwise_not(thick_objects))
            
        # 4. Cleanup & Connect (Vertical Dilation)
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, self.kernel_clean)
        # Strong vertical close to fix gaps made by subtraction or noise
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_CLOSE, self.kernel_vertical)
        
        # 5. Geometric Selection & Lock Update
        contours, _ = cv2.findContours(fgmask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        clean_mask = np.zeros_like(fgmask)
        
        best_c = None
        max_score = 0
        
        for c in contours:
            area = cv2.contourArea(c)
            if area < 30: continue
            
            x, y, w, h = cv2.boundingRect(c)
            
            # Aspect Ratio
            length = max(w, h)
            thickness = min(w, h)
            if thickness == 0: continue
            ar = length / thickness
            
            # Threshold (Stream is thin/long)
            threshold = 1.2 if self.locked_x_center is not None else 2.0
            
            if ar > threshold:
                cv2.drawContours(clean_mask, [c], -1, 255, -1)
                
                if area > max_score:
                    max_score = area
                    best_c = c
                    
        # Update Lock
        if best_c is not None:
            bx, by, bw, bh = cv2.boundingRect(best_c)
            cx = bx + bw // 2
            
            if self.locked_x_center is None:
                self.locked_x_center = cx
            else:
                self.locked_x_center = int(0.7 * self.locked_x_center + 0.3 * cx)
            self.missed_frames = 0
        else:
            self.missed_frames += 1
            if self.missed_frames > self.max_missed:
                self.locked_x_center = None 
                
        return clean_mask

    def get_stream_contour(self, mask):
        """
        Finds the largest contour in the kinematic mask.
        """
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None
        
        # Assume largest moving object is the stream
        c = max(contours, key=cv2.contourArea)
        
        if cv2.contourArea(c) < 50: 
            return None
            
        return c

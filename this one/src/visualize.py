import cv2
import numpy as np
import matplotlib.pyplot as plt
from .utils import draw_text

class Visualizer:
    def __init__(self, output_video_path, fps, frame_size):
        self.output_path = output_video_path
        self.fps = fps
        self.frame_size = frame_size # (width, height)
        
        # Initialize VideoWriter
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        self.writer = cv2.VideoWriter(output_video_path, fourcc, fps, frame_size)
    
    def process_frame(self, frame, contour, flow_val, velocity, area, frame_idx, flow_history_df=None):
        """
        Draws overlays on the frame and writes to video.
        """
        # 1. Create Blur Background
        # Strong blur
        blurred_bg = cv2.GaussianBlur(frame, (31, 31), 0)
        
        # 2. Masking
        # We need the mask for the contour. 
        # If contour is passed, regenerate mask or pass mask to this function?
        # Ideally pass mask. But contour is available.
        mask = np.zeros(frame.shape[:2], dtype=np.uint8)
        if contour is not None:
             cv2.drawContours(mask, [contour], -1, 255, -1)
             
        # 3. Stream Isolation and Colorization
        # Stream pixels from original frame
        stream_original = cv2.bitwise_and(frame, frame, mask=mask)
        
        # Color Overlay (e.g. Cyan/Blue tint)
        # Create solid color block
        color_block = np.zeros_like(frame)
        color_block[:] = (255, 255, 0) # Cyan in BGR
        
        # Blend original stream with color block
        stream_colored = cv2.addWeighted(stream_original, 0.7, color_block, 0.3, 0)
        
        # Mask the colored stream
        stream_colored_masked = cv2.bitwise_and(stream_colored, stream_colored, mask=mask)
        
        # 4. Composite
        # Inverse mask for background
        mask_inv = cv2.bitwise_not(mask)
        bg_masked = cv2.bitwise_and(blurred_bg, blurred_bg, mask=mask_inv)
        
        vis_frame = cv2.add(bg_masked, stream_colored_masked)
        
        # Draw contour border for sharpness
        if contour is not None:
            cv2.drawContours(vis_frame, [contour], -1, (0, 255, 255), 2)
        
        # Draw stats
        draw_text(vis_frame, f"Frame: {frame_idx}", (10, 30))
        draw_text(vis_frame, f"Flow: {flow_val:.1f} ml/s", (10, 60), color=(0, 255, 255))
        draw_text(vis_frame, f"Vel: {velocity:.1f} cm/s", (10, 90))
        draw_text(vis_frame, f"Area: {area:.2f} cm2", (10, 120))
        
        # Draw inset graph if history is available
        if flow_history_df is not None and not flow_history_df.empty:
            # We can draw lines on the image manually using cv2.line for speed
            # Normalize flow to a small ROI in bottom right
            h, w = self.frame_size[1], self.frame_size[0]
            graph_h, graph_w = 150, 250
            start_x, start_y = w - graph_w - 10, h - 10
            
            # Draw background
            cv2.rectangle(vis_frame, (start_x, start_y - graph_h), (w - 10, h - 10), (0, 0, 0), -1)
            
            # Get data
            # Last 50 points or all
            recent_data = flow_history_df.tail(100)
            if len(recent_data) > 1:
                vals = recent_data['flow_smooth'].values if 'flow_smooth' in recent_data else recent_data['flow_ml_s'].values
                times = recent_data['timestamp_s'].values
                
                max_val = vals.max() if vals.max() > 0 else 1.0
                min_val = 0
                
                # normalize to graph rect
                points = []
                for i, v in enumerate(vals):
                    px = int(start_x + (i / len(vals)) * graph_w)
                    py = int(start_y - (v / max_val) * graph_h)
                    points.append((px, py))
                
                # Draw lines
                for i in range(len(points) - 1):
                    cv2.line(vis_frame, points[i], points[i+1], (0, 255, 255), 1)
                    
        self.writer.write(vis_frame)
        
    def release(self):
        self.writer.release()

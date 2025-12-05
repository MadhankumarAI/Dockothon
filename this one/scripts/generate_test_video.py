import cv2
import numpy as np
import argparse
import os

def generate_video(output_path, duration=5, fps=30, width=640, height=480):
    print(f"Generating synthetic video at {output_path}...")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    total_frames = duration * fps
    center = (width // 2, height // 2)
    
    for i in range(total_frames):
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        
        # Background noise (slight)
        noise = np.random.randint(0, 10, (height, width, 3), dtype=np.uint8)
        frame = cv2.add(frame, noise)
        
        # Simulate stream: A circle in the center that grows and shrinks
        # Flow curve: Parabolic (starts 0, peaks, ends 0)
        norm_time = i / total_frames
        flow_intensity = 4 * norm_time * (1 - norm_time) # 0 -> 1 -> 0
        
        radius = int(20 + 50 * flow_intensity) # Radius varies 20 to 70 px
        
        if radius > 0:
            # Draw stream "body"
            cv2.circle(frame, center, radius, (200, 200, 255), -1)
            
            # Add internal texture for optical flow! 
            # Small moving particles downwards
            # We want them to move "down" or "up" or "in". 
            # Top view stream into water: water accelerates away from camera (if focusing on top).
            # But usually we just see perturbations. Let's make them move randomly or in a direction.
            # Let's say flow direction is "random wiggle" or just constant drift.
            # Optical Flow needs movement.
            
            # Add moving speckles inside the circle
            num_speckles = 20
            for _ in range(num_speckles):
                dx = np.random.randint(-radius, radius)
                dy = np.random.randint(-radius, radius)
                if dx*dx + dy*dy <= radius*radius:
                    # Make speckles move based on time to create velocity
                    # Velocity increases with flow intensity?
                    speed_factor = 5 + 10 * flow_intensity
                    offset_x = (i * speed_factor * 0.5) % 20
                    offset_y = (i * speed_factor) % 20 
                    
                    # We just draw random noise texturing that shifts every frame
                    # Actually, coherent motion is better for Optical Flow.
                    # Let's make a grid of noise that shifts.
                    pass
            
            # Better texture: Perlin-ish noise or just moving grid?
            # Let's draw another layer masked by the circle
            texture = np.zeros_like(frame)
            # Create a moving gradient or pattern
            shift_y = int(i * (5 + 10 * flow_intensity)) % height
            cv2.line(texture, (0, shift_y), (width, shift_y), (50, 50, 50), 2)
            for k in range(0, height, 20):
                 y_pos = (k + shift_y) % height
                 cv2.line(texture, (0, y_pos), (width, y_pos), (100, 100, 100), 1)
            
            # Random noise texture
            static_noise = np.random.randint(0, 50, (height, width, 3), dtype=np.uint8)
            # Shift the noise
            shift = int(i * 5)
            static_noise = np.roll(static_noise, shift, axis=0) # Move down
            
            # Mask texture to circle
            mask = np.zeros((height, width), dtype=np.uint8)
            cv2.circle(mask, center, radius, 255, -1)
            
            frame_with_texture = cv2.add(frame, static_noise)
            
            # Copy masked area
            frame_masked = cv2.bitwise_and(frame_with_texture, frame_with_texture, mask=mask)
            
            # Initial frame (background) was black/noisy. We put the stream on top.
            # Invert mask to clear background area in 'frame_masked' (already 0 outside)
            # We need to combine frame (bg) and stream.
            
            img_bg = cv2.bitwise_and(frame, frame, mask=cv2.bitwise_not(mask))
            frame = cv2.add(img_bg, frame_masked)

        out.write(frame)
        
    out.release()
    print("Video generated.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    generate_video(args.output)

import sys
import os
import argparse
import json
import cv2
import pandas as pd
import numpy as np

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.calibration import compute_pixel_to_cm_scale
from src.preprocess import read_video_frames
from src.segmentation import StreamSegmenter
from src.tracking import StreamTracker
from src.flow_estimation import FlowEstimator
from src.visualize import Visualizer
from src.utils import generate_clinical_report_plot
from src.ensemble import EnsembleAggregator

def process_single_video(video_path, calibration_path, output_dir, view_name="top", fps_override=None):
    """
    Runs the CV pipeline on a single video.
    Returns: df (flow history), metrics, visualization_path
    """
    if not video_path or not os.path.exists(video_path):
        print(f"[{view_name.upper()}] Video not found or not provided: {video_path}")
        return None, None
        
    print(f"[{view_name.upper()}] Starting Analysis: {video_path}")
    
    # Calibration
    try:
        px_to_cm = compute_pixel_to_cm_scale(calibration_path)
    except Exception as e:
        print(f"[{view_name.upper()}] Calibration error: {e}. Using fallback.")
        px_to_cm = 0.052 # Default fallback
        
    # Validation of side view calibration? 
    # Usually side view needs its own calibration or we assume similar scale if same distance.
    # PDF check: "Calibration data" is an input. We'll use top.png for scale for now, 
    # assuming same camera setup or similar distance.
    
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps_override: fps = fps_override
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()
    
    if fps <= 0: fps = 30
    
    # Resizing
    scale_factor = 1.0
    target_width = 640
    if width > target_width:
        scale_factor = width / target_width
        width = target_width
        height = int(height / scale_factor)
        px_to_cm *= scale_factor
        
    segmenter = StreamSegmenter()
    tracker = StreamTracker(px_to_cm)
    estimator = FlowEstimator()
    
    # Intermediate visualization
    out_vid_name = f"annotated_{view_name}.mp4"
    out_vid_path = os.path.join(output_dir, out_vid_name)
    visualizer = Visualizer(out_vid_path, fps, (width, height))
    
    frame_gen = read_video_frames(video_path, resize_shape=(width, height))
    
    for frame_idx, frame in frame_gen:
        mask = segmenter.process_frame(frame)
        contour = segmenter.get_stream_contour(mask)
        stats = tracker.process(frame, mask, contour, fps)
        
        timestamp = frame_idx / fps
        flow_val = estimator.update(stats['area_cm2'], stats['velocity_cm_s'], timestamp, frame_idx)
        
        # Viz (using partial results if available, usually get_results returns whole history so efficient enough for small vids)
        # For speed we passed df to visualizer, but let's pass None to skip heavy plot updates every frame
        # or pass a lightweight struct. The Visualizer.process_frame needs df only for the graph.
        visualizer.process_frame(frame, contour, flow_val, stats['velocity_cm_s'], stats['area_cm2'], frame_idx, None)
        
        if frame_idx % 60 == 0:
            print(f"[{view_name.upper()}] Frame {frame_idx}: {flow_val:.2f} ml/s")
            
    visualizer.release()
    
    # Initial Results (Raw/Smoothed internally)
    df, metrics = estimator.get_results()
    
    return {'df': df, 'metrics': metrics, 'px_to_cm': px_to_cm}

def main():
    parser = argparse.ArgumentParser(description="Uroflow Ensemble Analysis")
    parser.add_argument("--top-video", help="Path to top-view video")
    parser.add_argument("--side-video", help="Path to side-view video")
    
    # Legacy support (map --video to --top-video if top not specified)
    parser.add_argument("--video", help="Legacy argument for single video")
    
    parser.add_argument("--calibration-image", default="data/top.png", help="Path to calibration image")
    parser.add_argument("--output-dir", required=True, help="Directory to save outputs")
    parser.add_argument("--volume", type=float, help="Manual total voided volume (ml)")
    parser.add_argument("--fps-override", type=float, help="Override fps")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.output_dir):
        os.makedirs(args.output_dir)
        
    # Input handling
    top_vid = args.top_video if args.top_video else args.video
    side_vid = args.side_video
    
    if not top_vid and not side_vid:
        print("ERROR: No video input provided. Use --top-video or --side-video.")
        sys.exit(1)
        
    # 1. Process Top
    top_result = None
    if top_vid:
        top_result = process_single_video(top_vid, args.calibration_image, args.output_dir, "top", args.fps_override)
        
    # 2. Process Side
    side_result = None
    if side_vid:
        # Assuming we use the same validation image or we need a side calibration image?
        # The prompt implies one calibration image or shared logic. We use same for now.
        side_result = process_single_video(side_vid, args.calibration_image, args.output_dir, "side", args.fps_override)
        
    # 3. Ensemble
    print(">>> Running Ensemble Aggregation")
    aggregator = EnsembleAggregator()
    
    final_df, final_metrics = aggregator.process(top_result, side_result, args.volume)
    
    # 4. Final Outputs
    final_csv_path = os.path.join(args.output_dir, "flow_timeseries.csv")
    final_df.to_csv(final_csv_path, index=False)
    
    final_report_path = os.path.join(args.output_dir, "qmax_report.json")
    
    # Meta data
    final_metrics['inputs'] = {
        'top': top_vid,
        'side': side_vid,
        'volume_manual': args.volume
    }
    
    # Convert numpy types
    for k, v in final_metrics.items():
        if isinstance(v, (np.integer, np.floating)):
            final_metrics[k] = float(v)
            
    with open(final_report_path, 'w') as f:
        json.dump(final_metrics, f, indent=4)
        
    # Plot
    plot_path = os.path.join(args.output_dir, "clinical_report.png")
    generate_clinical_report_plot(final_df, final_metrics, plot_path)
    
    print("\n=== Analysis Complete ===")
    print(f"Final Qmax: {final_metrics['Qmax']:.2f} ml/s")
    print(f"Voided Volume: {final_metrics['Voided_Volume']:.2f} ml")
    print(f"Outputs saved to {args.output_dir}")

if __name__ == "__main__":
    main()

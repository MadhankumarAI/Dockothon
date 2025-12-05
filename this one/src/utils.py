import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
import matplotlib.gridspec as gridspec

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def generate_clinical_report_plot(df, metrics, output_path):
    """
    Generates a clinical report plot similar to the reference image:
    top panel: Volume (ml) vs Time
    bottom panel: Flow (ml/s) vs Time
    """
    fig = plt.figure(figsize=(10, 10))
    gs = gridspec.GridSpec(2, 1, height_ratios=[1, 1])
    
    times = df['timestamp_s']
    volume = df['accumulated_volume_ml']
    flow = df['flow_smooth']
    
    # --- Top Panel: Volume (Vmic) ---
    ax0 = plt.subplot(gs[0])
    ax0.plot(times, volume, color='brown', label='Vmic')
    ax0.set_ylabel("ml")
    ax0.set_ylim(bottom=0, top=max(volume.max()*1.1, 500)) # Scale to match 500/1000 typical
    ax0.grid(True, which='both', linestyle='--', linewidth=0.5)
    ax0.set_title("Uroflow Results")
    ax0.text(0.02, 0.9, "Vmic", transform=ax0.transAxes, color='brown', fontweight='bold')
    
    # Add text stats on the right side if we want, or just rely on the separate text report
    # The reference image has a table on the right. We will just plot the curves here effectively.
    
    # --- Bottom Panel: Flow (Qura) ---
    ax1 = plt.subplot(gs[1], sharex=ax0)
    ax1.plot(times, flow, color='green', label='Qura')
    ax1.set_ylabel("ml/s")
    ax1.set_xlabel("Time (s)")
    ax1.set_ylim(bottom=0, top=max(flow.max()*1.1, 50))
    ax1.grid(True, which='both', linestyle='--', linewidth=0.5)
    ax1.text(0.02, 0.9, "Qura", transform=ax1.transAxes, color='green', fontweight='bold')
    
    # Plot Qmax point
    t_abs_qmax = df.loc[df['flow_smooth'].idxmax(), 'timestamp_s']
    qmax_val = metrics['Qmax']
    ax1.plot(t_abs_qmax, qmax_val, 'ro')
    ax1.annotate(f"Qmax: {qmax_val:.1f}", (t_abs_qmax, qmax_val), xytext=(5, 5), textcoords='offset points', color='red')
    
    # Align x-axis
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

def plot_flow_timeseries(times, flows_ml_per_s, qmax, t_qmax, output_path):
    # Legacy plotting function, kept for compatibility if called elsewhere, 
    # but we are moving to the clinical one.
    plt.figure(figsize=(10, 6))
    plt.plot(times, flows_ml_per_s, label='Flow Rate (ml/s)', color='blue')
    plt.axhline(y=qmax, color='red', linestyle='--', label=f'Qmax: {qmax:.2f} ml/s')
    plt.axvline(x=t_qmax, color='green', linestyle=':', label=f'Time of Qmax: {t_qmax:.2f} s')
    
    plt.title("Urine Flow Rate vs Time")
    plt.xlabel("Time (s)")
    plt.ylabel("Flow Rate (ml/s)")
    plt.legend()
    plt.grid(True)
    plt.savefig(output_path)
    plt.close()

def draw_text(img, text, pos, color=(0, 255, 0), scale=0.6, thickness=2):
    cv2.putText(img, text, pos, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thickness)

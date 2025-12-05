import numpy as np
from scipy import signal

def synchronize_signals(t1, f1, t2, f2):
    """
    Aligns signal 2 (t2, f2) to signal 1 (t1, f1).
    Assumes similar sampling rate or resamples to match.
    Uses cross-correlation to find temporal lag.
    """
    # 1. Resample to common time grid
    # Determine common duration
    max_time = max(t1.max(), t2.max())
    dt = 0.1 # 100ms grid for alignment (rough)
    common_times = np.arange(0, max_time, dt)
    
    # Interpolate
    f1_interp = np.interp(common_times, t1, f1, left=0, right=0)
    f2_interp = np.interp(common_times, t2, f2, left=0, right=0)
    
    # 2. Cross-Correlation
    correlation = signal.correlate(f1_interp, f2_interp, mode='full')
    lags = signal.correlation_lags(len(f1_interp), len(f2_interp), mode='full')
    
    # Find lag with max correlation
    lag_idx = np.argmax(correlation)
    lag_steps = lags[lag_idx]
    time_shift = lag_steps * dt # Shift for f2 to match f1
    
    # Apply shift to t2
    t2_shifted = t2 + time_shift
    
    return t1, f1, t2_shifted, f2

def fuse_signals(times_top, flow_top, conf_top, times_side, flow_side, conf_side):
    """
    Weighted fusion of top and side signals.
    Returns unified times and flow.
    """
    # Align side to top (Top is usually master reference for time)
    t_top, f_top, t_side_shifted, f_side = synchronize_signals(times_top, flow_top, times_side, flow_side)
    
    # Create unified time grid (finest resolution of top)
    final_times = times_top
    
    # Interpolate side to top grid using new shifted times
    f_side_aligned = np.interp(final_times, t_side_shifted, f_side, left=0, right=0)
    
    # Weighted Average
    # Formula: Q_final = (w_T * Q_T + w_S * Q_S) / (w_T + w_S)
    
    total_weight = conf_top + conf_side
    if total_weight == 0:
        return final_times, (f_top + f_side_aligned) / 2 # Fallback
        
    w_t = conf_top / total_weight
    w_s = conf_side / total_weight
    
    f_final = (w_t * f_top) + (w_s * f_side_aligned)
    
    return final_times, f_final

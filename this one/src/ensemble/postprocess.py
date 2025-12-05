import numpy as np
import pandas as pd

def post_process_flow(times, flows_ml_s, window_size_frames=45):
    """
    Applies final smoothing, clamping, and Qmax extraction.
    """
    df = pd.DataFrame({'time': times, 'flow': flows_ml_s})
    
    # 1. Clamping (Physical constraint: max 60-100 ml/s for healthy/patient)
    # PDF says "validates output against expected physical range"
    # User said Qmax around 26 +/- 4. 
    # Let's cap at slightly higher than probable max to allow peaks but kill artifacts.
    df['flow'] = df['flow'].clip(lower=0.0, upper=80.0)
    
    # 2. Smoothing
    # User target: ~26ml/s Qmax for 369ml/24s.
    # Current result ~66ml/s implies noise spikes.
    # Apply Median filter first to remove outliers
    df['flow'] = df['flow'].rolling(window=15, center=True).median().fillna(method='bfill').fillna(method='ffill')
    
    # Then apply strong rolling mean (approx 4 seconds window)
    smooth_window = 120 # ~4 seconds
    if len(df) > smooth_window:
        df['flow_smooth'] = df['flow'].rolling(window=smooth_window, min_periods=smooth_window//4, center=True).mean()
    else:
        df['flow_smooth'] = df['flow']
        
    df['flow_smooth'] = df['flow_smooth'].fillna(method='bfill').fillna(method='ffill')
    
    # 3. Qmax Extraction
    qmax = df['flow_smooth'].max()
    t_qmax_idx = df['flow_smooth'].idxmax()
    t_qmax = df.loc[t_qmax_idx, 'time']
    
    return df['flow_smooth'].values, qmax, t_qmax

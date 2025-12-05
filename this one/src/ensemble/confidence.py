import numpy as np

def calculate_confidence(flow_series):
    """
    Calculates a confidence score (0.0 to 1.0) for a flow time-series.
    
    Criteria:
    1. Continuity: Penalize breaks/zeros in the middle of flow.
    2. Stability: Penalize high frequency high-amplitude noise (jitter).
    3. Duration: Very short flows might be noise.
    
    Args:
        flow_series (np.array): Flow rate values (ml/s).
        
    Returns:
        float: Confidence score.
    """
    if len(flow_series) == 0:
        return 0.0
        
    score = 1.0
    
    # 1. Noise / Jitter check (High standard deviation of diffs)
    # Normalized by mean flow to be scale-invariant-ish
    mean_flow = np.mean(flow_series)
    if mean_flow < 1e-3:
        return 0.1 # Basically empty
        
    diffs = np.diff(flow_series)
    std_diff = np.std(diffs)
    
    # Heuristic: if frame-to-frame jump std is > 50% of mean flow, it's very noisy
    noise_ratio = std_diff / mean_flow
    if noise_ratio > 0.5:
        score *= 0.7
    elif noise_ratio > 0.2:
        score *= 0.9
        
    # 2. Dropouts (zeros in the middle of flow)
    # Detect start and end
    non_zeros = np.where(flow_series > 0.5)[0] # Threshold 0.5 ml/s
    if len(non_zeros) > 2:
        start, end = non_zeros[0], non_zeros[-1]
        segment = flow_series[start:end+1]
        zero_count = np.sum(segment <= 0.5)
        zero_ratio = zero_count / len(segment)
        
        # Penalize if > 10% of the active flow time is zero (dropout)
        if zero_ratio > 0.1:
            score *= (1.0 - zero_ratio)
            
    # 3. Shape Sanity (Optional - PDF might specify)
    # e.g. Max flow shouldn't be > 100 for typical usage, if we see wild values, reduce confidence
    if np.max(flow_series) > 150:
        score *= 0.5
        
    return max(0.1, min(score, 1.0))

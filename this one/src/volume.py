import numpy as np

def normalize_flow_by_volume(flow_values, time_values, manual_total_volume_ml):
    """
    Normalizes the flow rates so that the total integrated volume matches the manual input.
    
    Args:
        flow_values (list or np.array): Instantaneous flow rates (ml/s).
        time_values (list or np.array): Time stamps (s).
        manual_total_volume_ml (float): The actual total volume voided (ml).
        
    Returns:
        corrected_flow (np.array): Scaled flow rates.
        calculated_total (float): The total volume before correction.
        correction_factor (float): The factor used (k).
    """
    flows = np.array(flow_values)
    times = np.array(time_values)
    
    if len(flows) < 2:
        return flows, 0.0, 1.0
        
    # Calculate current total volume using trapezoidal rule
    calculated_total = np.trapz(flows, times)
    
    if calculated_total <= 0:
        # If CV detected 0 flow, we can't scale 0 to match manual volume safely.
        # But if manual volume > 0, this indicates a detection failure.
        # We will just return original 0s and warn (by factor=0 or 1).
        return flows, calculated_total, 1.0
    
    correction_factor = manual_total_volume_ml / calculated_total
    
    corrected_flow = flows * correction_factor
    
    return corrected_flow, calculated_total, correction_factor

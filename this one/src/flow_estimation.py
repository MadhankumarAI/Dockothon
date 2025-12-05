import numpy as np
import pandas as pd

class FlowEstimator:
    def __init__(self):
        self.flow_history = []
        
    def update(self, area_cm2, velocity_cm_s, timestamp_s, frame_id):
        """
        Calculates instantaneous flow rate Q = A * v
        Returns flow_ml_s
        """
        # Q (ml/s) = Area (cm^2) * Velocity (cm/s)
        # 1 cm^3 = 1 ml
        flow_ml_s = area_cm2 * velocity_cm_s
        
        # Heuristic: Smooth or clamp if necessary
        # e.g. if velocity is negative (upwards flow?) which shouldn't happen in gravity 
        # unless noise. We take absolute or clamp to 0.
        flow_ml_s = max(0.0, flow_ml_s)
        
        record = {
            'timestamp_s': timestamp_s,
            'frame_id': frame_id,
            'contour_area_cm2': area_cm2,
            'velocity_cm_s': velocity_cm_s,
            'flow_ml_s': flow_ml_s
        }
        self.flow_history.append(record)
        return flow_ml_s
        
    def get_results(self, flow_threshold_ml_s=1.0):
        df = pd.DataFrame(self.flow_history)
        if df.empty:
            return None, {}
            
        # 1. Smooth flow
        # Clinical standard: ~2 second moving average to remove artifacts/drops
        # Assuming ~30 fps, we want window ~60.
        # However, we'll use a dynamic window based on data length.
        
        df['flow_ml_s'] = df['flow_ml_s'].clip(upper=100.0)
        
        window_size = 90 # approx 3 seconds at 30fps
        if len(df) > window_size:
            df['flow_smooth'] = df['flow_ml_s'].rolling(window=window_size, min_periods=window_size//2, center=True).mean()
        else:
            df['flow_smooth'] = df['flow_ml_s']
            
        # Fill NaNs from rolling (edges)
        df['flow_smooth'] = df['flow_smooth'].fillna(method='bfill').fillna(method='ffill')
            
        # 2. Integrate for cumulative volume over time
        # Cumulative volume at each step
        times = df['timestamp_s'].values
        flows = df['flow_smooth'].values
        
        # Calculate dt
        dt = np.diff(times, prepend=times[0])
        # Volume increments
        vol_inc = flows * dt
        df['accumulated_volume_ml'] = np.cumsum(vol_inc)
        
        # 3. Clinical Metrics Calculation
        # Definition: Flow Start = first time flow > threshold
        # Definition: Flow End = last time flow > threshold
        
        is_flowing = df['flow_smooth'] > flow_threshold_ml_s
        flowing_indices = df.index[is_flowing]
        
        metrics = {
            "Qmax": 0.0,
            "Time_to_Qmax": 0.0,
            "Voided_Volume": 0.0,
            "Flow_Time": 0.0,
            "Voiding_Time": 0.0,
            "Hesitancy": 0.0,
            "Average_Flow_Rate": 0.0
        }
        
        if not flowing_indices.empty:
            start_idx = flowing_indices[0]
            end_idx = flowing_indices[-1]
            
            start_time = df.loc[start_idx, 'timestamp_s']
            end_time = df.loc[end_idx, 'timestamp_s']
            
            # Hesitancy: Time from t=0 (start of recording) to start of flow
            metrics["Hesitancy"] = start_time
            
            # Voiding Time: Total duration from start to finish of voiding (including interruptions)
            metrics["Voiding_Time"] = end_time - start_time
            
            # Flow Time: Sum of durations where flow > threshold
            # We approximate this by summing dt for flowing frames
            # Or simplified: count frames * avg_dt
            metrics["Flow_Time"] = np.sum(dt[is_flowing])
            
            # Qmax
            qmax = df['flow_smooth'].max()
            metrics["Qmax"] = qmax
            
            # Time to Qmax: Time from start of flow (not start of recording) to Qmax
            t_qmax_abs = df.loc[df['flow_smooth'].idxmax(), 'timestamp_s']
            metrics["Time_to_Qmax"] = t_qmax_abs - start_time
            
            # Voided Volume
            # Use total accumulated at the end
            metrics["Voided_Volume"] = df['accumulated_volume_ml'].iloc[-1]
            
            # Average Flow Rate: Voided Volume / Flow Time
            if metrics["Flow_Time"] > 0:
                metrics["Average_Flow_Rate"] = metrics["Voided_Volume"] / metrics["Flow_Time"]
        
        return df, metrics

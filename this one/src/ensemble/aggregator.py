import numpy as np
from .confidence import calculate_confidence
from .fusion import fuse_signals
from .postprocess import post_process_flow
from ..volume import normalize_flow_by_volume

class EnsembleAggregator:
    def __init__(self):
        pass
        
    def process(self, top_result, side_result, manual_volume_ml=None):
        """
        Main ensemble logic.
        
        Args:
            top_result: dict {'df': pd.DataFrame, 'metrics': dict}
            side_result: dict {'df': pd.DataFrame, 'metrics': dict} (Optional)
            manual_volume_ml: float (Optional)
            
        Returns:
            final_df, final_metrics
        """
        # Extract series
        # Top
        if top_result:
            t_top = top_result['df']['timestamp_s'].values
            q_top = top_result['df']['flow_ml_s'].values # Use raw for fusion, post-process later
            conf_top = calculate_confidence(q_top)
            # If manual volume is provided, we should ideally normalize individually or normalize the result?
            # PDF: "Normalizes both flow-rate curves" BEFORE fusion likely, to ensure they are on same scale.
            if manual_volume_ml:
                q_top, _, _ = normalize_flow_by_volume(q_top, t_top, manual_volume_ml)
        else:
            t_top, q_top, conf_top = np.array([]), np.array([]), 0.0

        # Side
        if side_result:
            t_side = side_result['df']['timestamp_s'].values
            q_side = side_result['df']['flow_ml_s'].values
            conf_side = calculate_confidence(q_side)
            if manual_volume_ml:
                 q_side, _, _ = normalize_flow_by_volume(q_side, t_side, manual_volume_ml)
        else:
            t_side, q_side, conf_side = np.array([]), np.array([]), 0.0
            
        print(f"[ENSEMBLE] Confidence Scores -- Top: {conf_top:.2f}, Side: {conf_side:.2f}")
        
        # Fusion
        if len(q_top) > 0 and len(q_side) > 0:
            final_times, final_flow_raw = fuse_signals(t_top, q_top, conf_top, t_side, q_side, conf_side)
        elif len(q_top) > 0:
            final_times, final_flow_raw = t_top, q_top
        elif len(q_side) > 0:
            final_times, final_flow_raw = t_side, q_side
        else:
            raise ValueError("No valid flow data from either view.")
            
        # Post-Process (Smoothing, Qmax, Constraints)
        final_flow_smooth, qmax, t_qmax = post_process_flow(final_times, final_flow_raw)
        
        # Re-calc clinical metrics on final curve
        # (This duplicates logic from flow_estimation slightly but operates on arrays)
        # We'll create a Result DF
        import pandas as pd
        final_df = pd.DataFrame({
            'timestamp_s': final_times,
            'flow_ml_s': final_flow_raw,    # Included for debug/reference
            'flow_smooth': final_flow_smooth
        })
        
        # Integrate volume
        dt = np.diff(final_times, prepend=final_times[0])
        final_df['accumulated_volume_ml'] = np.cumsum(final_flow_smooth * dt)
        
        # Metrics
        total_vol = final_df['accumulated_volume_ml'].iloc[-1]
        
        # Recalculate if manual volume was strictly enforced on inputs, output should match close.
        # But fusion scaling might drift slightly if time grids mismatched. 
        # Re-normalize ONE LAST TIME to be precise? 
        # "Accepts +/- 4ml/s tolerance". 
        # If we normalize exactly to volume, we ensure volume accuracy.
        if manual_volume_ml:
            scale_corr = manual_volume_ml / total_vol if total_vol > 0 else 1.0
            final_df['flow_smooth'] *= scale_corr
            final_df['accumulated_volume_ml'] *= scale_corr
            qmax *= scale_corr
            total_vol = manual_volume_ml
            
        metrics = {
            "Qmax": qmax,
            "Time_to_Qmax": t_qmax, # This is absolute time, need relative to start?
            "Voided_Volume": total_vol,
            # Recalc flow time etc
        }
        
        # Recalc relative metrics
        is_flowing = final_df['flow_smooth'] > 1.0
        if is_flowing.any():
            start_time = final_df.loc[is_flowing.idxmax(), 'timestamp_s']
            end_time = final_df.loc[is_flowing[::-1].idxmax(), 'timestamp_s']
            metrics["Hesitancy"] = start_time
            metrics["Voiding_Time"] = end_time - start_time
            metrics["Flow_Time"] = np.sum(dt[is_flowing])
            metrics["Time_to_Qmax"] = t_qmax - start_time
            if metrics["Flow_Time"] > 0:
                metrics["Average_Flow_Rate"] = metrics["Voided_Volume"] / metrics["Flow_Time"]
                
        return final_df, metrics

import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.flow_estimation import FlowEstimator

def test_flow_estimation_logic():
    estimator = FlowEstimator()
    
    # Feed some data
    # t=0, A=10, v=10 -> Q=100
    q1 = estimator.update(10.0, 10.0, 0.0, 0)
    assert q1 == 100.0
    
    # t=1, A=20, v=10 -> Q=200
    q2 = estimator.update(20.0, 10.0, 1.0, 1)
    assert q2 == 200.0
    
    # Check max
    df, qmax, t_qmax, volume = estimator.get_results()
    
    # Note: Smoothing might affect exact qmax value if implemented
    # Logic in code: smooth window is 5. We only have 2 points.
    # df['flow_smooth'] = df['flow_ml_s'] (since len < 5)
    assert qmax == 200.0
    assert volume == 150.0 # Trapz (100+200)/2 * 1 = 150

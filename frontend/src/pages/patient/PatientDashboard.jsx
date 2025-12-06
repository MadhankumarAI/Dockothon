import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import '../doctor/Dashboard.css';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await patientAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <p>Welcome back, {profile?.user?.username}</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card profile-card">
          <div className="card-header">
            <h2>Profile Overview</h2>
          </div>
          <div className="card-content">
            <div className="profile-info">
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{profile?.user?.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Age:</span>
                <span className="value">{profile?.age || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="label">Gender:</span>
                <span className="value">{profile?.gender || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{profile?.phone_number || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{profile?.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <div className="card-header">
            <h2>Health Summary</h2>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Consultations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Reports</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Prescriptions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2>Emergency Contact</h2>
          </div>
          <div className="card-content">
            <div className="profile-info">
              <div className="info-row">
                <span className="label">Contact:</span>
                <span className="value">{profile?.emergency_contact || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

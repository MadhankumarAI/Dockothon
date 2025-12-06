import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import './Dashboard.css';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await doctorAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoAccept = async () => {
    try {
      const response = await doctorAPI.toggleAutoAccept(!profile.auto_accept);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to update auto-accept setting');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <p>Welcome back, Dr. {profile?.user?.username}</p>
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
                <span className="label">Hospital:</span>
                <span className="value">{profile?.hospital}</span>
              </div>
              <div className="info-row">
                <span className="label">Specialization:</span>
                <span className="value">{profile?.specialization}</span>
              </div>
              <div className="info-row">
                <span className="label">Qualification:</span>
                <span className="value">{profile?.qualification}</span>
              </div>
              <div className="info-row">
                <span className="label">Experience:</span>
                <span className="value">{profile?.years_of_experience || 'N/A'} years</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card settings-card">
          <div className="card-header">
            <h2>Quick Settings</h2>
          </div>
          <div className="card-content">
            <div className="setting-item">
              <div className="setting-info">
                <h3>Auto Accept Patients</h3>
                <p>Automatically accept patient consultation requests</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={profile?.auto_accept || false}
                  onChange={toggleAutoAccept}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <div className="card-header">
            <h2>Statistics</h2>
          </div>
          <div className="card-content">
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Total Patients</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Consultations</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

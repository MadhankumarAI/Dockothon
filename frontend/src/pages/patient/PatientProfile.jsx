import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import '../doctor/Dashboard.css';

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await patientAPI.getProfile();
      setProfile(response.data);
      setFormData({
        age: response.data.age || '',
        gender: response.data.gender || '',
        phone_number: response.data.phone_number || '',
        address: response.data.address || '',
        emergency_contact: response.data.emergency_contact || '',
        medical_history: response.data.medical_history || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const data = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
      };
      const response = await patientAPI.updateProfile(data);
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await patientAPI.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account');
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Edit Profile</h1>
        <button onClick={() => navigate('/patient/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="profile-edit-card">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact</label>
            <input
              type="text"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Medical History</label>
            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
          <h3 style={{ color: '#c00', marginBottom: '1rem' }}>Danger Zone</h3>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-btn"
            >
              Delete Account
            </button>
          ) : (
            <div>
              <p style={{ marginBottom: '1rem', color: '#666' }}>
                Are you sure? This action cannot be undone.
              </p>
              <button onClick={handleDeleteAccount} className="delete-btn" style={{ marginRight: '1rem' }}>
                Yes, Delete My Account
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="back-btn">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;

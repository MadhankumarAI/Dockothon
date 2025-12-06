import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import '../doctor/Dashboard.css';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async (specialization = '') => {
    setLoading(true);
    try {
      const params = specialization ? { specialization } : {};
      const response = await doctorAPI.listDoctors(params);
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(searchTerm);
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Find Doctors</h1>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Search by specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.875rem 1rem',
              border: '2px solid #e1e5eb',
              borderRadius: '10px',
              fontSize: '1rem',
            }}
          />
          <button type="submit" className="save-btn" style={{ padding: '0 2rem' }}>
            Search
          </button>
        </div>
      </form>

      {doctors.length === 0 ? (
        <div className="dashboard-card">
          <div className="card-content">
            <p style={{ textAlign: 'center', color: '#666' }}>No doctors found.</p>
          </div>
        </div>
      ) : (
        <div className="doctors-list">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <h3>Dr. {doctor.user.username}</h3>
              <p className="specialization">{doctor.specialization}</p>
              <div className="details">
                <p><strong>Hospital:</strong> {doctor.hospital}</p>
                <p><strong>Qualification:</strong> {doctor.qualification}</p>
                {doctor.years_of_experience && (
                  <p><strong>Experience:</strong> {doctor.years_of_experience} years</p>
                )}
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: doctor.auto_accept ? '#0a0' : '#666' }}>
                    {doctor.auto_accept ? '✓ Accepting Patients' : 'By Appointment'}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsList;

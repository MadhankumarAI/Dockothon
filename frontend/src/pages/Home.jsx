import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, isDoctor, isPatient } = useAuth();

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Dockothon</h1>
          <p className="hero-subtitle">
            Your trusted platform for medical consultations and patient care
          </p>
          
          {!isAuthenticated ? (
            <div className="hero-buttons">
              <Link to="/signin" className="btn btn-primary">Sign In</Link>
              <Link to="/signup/doctor" className="btn btn-secondary">Join as Doctor</Link>
              <Link to="/signup/patient" className="btn btn-secondary">Join as Patient</Link>
            </div>
          ) : (
            <div className="hero-buttons">
              {isDoctor && (
                <Link to="/doctor/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              )}
              {isPatient && (
                <>
                  <Link to="/patient/dashboard" className="btn btn-primary">Go to Dashboard</Link>
                  <Link to="/doctors" className="btn btn-secondary">Find Doctors</Link>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">👨‍⚕️</div>
          <h3>Expert Doctors</h3>
          <p>Connect with qualified healthcare professionals</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Health Reports</h3>
          <p>Access and manage your medical reports easily</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Platform</h3>
          <p>Your health data is protected and private</p>
        </div>
      </section>
    </div>
  );
};

export default Home;

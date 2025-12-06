import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, isDoctor, isPatient, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏥</span>
          Dockothon
        </Link>

        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <Link to="/signin" className="nav-link">Sign In</Link>
              <div className="dropdown">
                <button className="nav-link dropdown-btn">Sign Up ▾</button>
                <div className="dropdown-content">
                  <Link to="/signup/doctor">As Doctor</Link>
                  <Link to="/signup/patient">As Patient</Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {isDoctor && (
                <>
                  <Link to="/doctor/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/doctor/profile" className="nav-link">Profile</Link>
                </>
              )}
              {isPatient && (
                <>
                  <Link to="/patient/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/patient/profile" className="nav-link">Profile</Link>
                  <Link to="/doctors" className="nav-link">Find Doctors</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, isDoctor, isPatient, logout } = useAuth();
  const navigate = useNavigate();
  const [signupOpen, setSignupOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 flex items-center justify-center shadow-md transform hover:scale-110 transition-transform duration-200">
              <span className="text-xl">🏥</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight hover:text-[rgb(193,218,216)] transition-colors duration-200">
              Dockothon
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center space-x-4 relative">
            {!isAuthenticated ? (
              <>
                {/* Signup Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSignupOpen(!signupOpen)}
                    className="px-4 py-2 text-white font-medium hover:text-[rgb(193,218,216)] transition-colors duration-200"
                  >
                    Sign Up ▾
                  </button>
                  {signupOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-50">
                      <Link
                        to="/signup/doctor"
                        className="block px-4 py-3 text-white hover:bg-[rgb(193,218,216)]/20 hover:text-gray-900 rounded-lg transition-colors duration-200"
                        onClick={() => setSignupOpen(false)}
                      >
                        As Doctor
                      </Link>
                      <Link
                        to="/signup/patient"
                        className="block px-4 py-3 text-white hover:bg-[rgb(193,218,216)]/20 hover:text-gray-900 rounded-lg transition-colors duration-200"
                        onClick={() => setSignupOpen(false)}
                      >
                        As Patient
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to="/signin"
                  className="px-6 py-2 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-xl font-medium shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <>
                {/* Doctor Links */}
                {isDoctor && (
                  <>
                    <Link
                      to="/doctor/dashboard"
                      className="px-4 py-2 text-white hover:text-[rgb(193,218,216)] font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/doctor/profile"
                      className="px-4 py-2 text-white hover:text-[rgb(193,218,216)] font-medium transition-colors duration-200"
                    >
                      Profile
                    </Link>
                  </>
                )}

                {/* Patient Links */}
                {isPatient && (
                  <>
                    <Link
                      to="/patient/dashboard"
                      className="px-4 py-2 text-white hover:text-[rgb(193,218,216)] font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/patient/create-entry"
                      className="px-4 py-2 text-white hover:text-[rgb(193,218,216)] font-medium transition-colors duration-200"
                    >
                      New Entry
                    </Link>
                    <Link
                      to="/patient/profile"
                      className="px-4 py-2 text-white hover:text-[rgb(193,218,216)] font-medium transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/doctors"
                      className="px-4 py-2 text-white hover:text-[rgb(193,218,216)] font-medium transition-colors duration-200"
                    >
                      Find Doctors
                    </Link>
                  </>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gray-800 text-white border border-gray-700 rounded-xl hover:bg-gray-700 hover:text-[rgb(193,218,216)] transition-all duration-200 font-medium shadow-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

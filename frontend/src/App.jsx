import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import urineImg from './assets/urine.png';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Signin from './pages/auth/Signin';
import DoctorSignup from './pages/auth/DoctorSignup';
import PatientSignup from './pages/auth/PatientSignup';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import DoctorsList from './pages/patient/DoctorsList';
import CreateEntry from './pages/patient/CreateEntry';

import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-50 flex items-center justify-center">
        <style>{`
          @keyframes loaderFloat {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
        `}</style>
        <div style={{ animation: 'loaderFloat 2s ease-in-out infinite' }}>
          <img
            src={urineImg}
            alt="Loading..."
            className="w-48 h-auto object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup/doctor" element={<DoctorSignup />} />
              <Route path="/signup/patient" element={<PatientSignup />} />

              {/* Doctor Routes */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor/profile"
                element={
                  <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorProfile />
                  </ProtectedRoute>
                }
              />

              {/* Patient Routes */}
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/profile"
                element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <DoctorsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/create-entry"
                element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <CreateEntry />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

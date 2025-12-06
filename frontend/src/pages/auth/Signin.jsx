// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import '../auth/Auth.css';

// const Signin = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { signin } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const result = await signin(formData.email, formData.password);
//       if (result.role === 'doctor') {
//         navigate('/doctor/dashboard');
//       } else {
//         navigate('/patient/dashboard');
//       }
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to sign in');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h1>Welcome Back</h1>
//           <p>Sign in to your account</p>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button type="submit" className="auth-btn" disabled={loading}>
//             {loading ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>Don't have an account?</p>
//           <div className="signup-links">
//             <Link to="/signup/doctor">Sign up as Doctor</Link>
//             <span>or</span>
//             <Link to="/signup/patient">Sign up as Patient</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signin;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signin(formData.email, formData.password);
      if (result.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl">⚕️</span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Docko<span className="text-[rgb(193,218,216)]">thon</span>
              </h1>
              <p className="text-gray-600 text-lg">Digital Healthcare Platform</p>
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-lg">
                Sign in to access your healthcare dashboard
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600">⚠️</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">{error}</p>
                    <p className="text-sm text-red-600 mt-1">Please check your credentials</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="doctor@hospital.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm font-medium text-[rgb(193,218,216)] hover:text-emerald-400 transition-colors duration-300"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 text-lg"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-5 h-5 text-[rgb(193,218,216)] rounded focus:ring-[rgb(193,218,216)]"
                  />
                  <label htmlFor="rememberMe" className="text-gray-700 font-medium cursor-pointer">
                    Remember me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden py-4 px-6 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign In
                    <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to Dockothon?</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  to="/signup/doctor"
                  className="group p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-[rgb(193,218,216)]/30 rounded-xl hover:border-[rgb(193,218,216)] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[rgb(193,218,216)]/20 to-emerald-200/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">👨‍⚕️</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Doctor</h3>
                      <p className="text-sm text-gray-600">Join as healthcare provider</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-[rgb(193,218,216)] transition-colors duration-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>

                <Link
                  to="/signup/patient"
                  className="group p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-emerald-200/30 rounded-xl hover:border-emerald-300 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[rgb(193,218,216)]/20 to-emerald-200/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Patient</h3>
                      <p className="text-sm text-gray-600">Create health account</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </form>

            <div className="mt-10 text-center">
              <p className="text-gray-600 text-sm">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="font-medium text-[rgb(193,218,216)] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-[rgb(193,218,216)] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <span className="text-4xl">🔐</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">Secure Access</h2>
                <p className="text-gray-300">
                  Enterprise-grade security ensures your health data remains protected at all times.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">End-to-End Encryption</h4>
                    <p className="text-sm text-gray-300 mt-1">All data encrypted in transit and at rest</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">HIPAA Compliant</h4>
                    <p className="text-sm text-gray-300 mt-1">Meets all healthcare privacy regulations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Multi-Factor Auth</h4>
                    <p className="text-sm text-gray-300 mt-1">Enhanced login security available</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-gray-400">Healthcare Professionals</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="text-sm text-gray-400">Patients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[rgb(193,218,216)]/10 to-emerald-50 rounded-3xl p-8 border border-[rgb(193,218,216)]/30">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Need Help?</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@dockothon.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-lg flex items-center justify-center">
                    <span className="text-lg">🕒</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">24/7 Available</p>
                    <p className="text-sm text-gray-600">Round-the-clock assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
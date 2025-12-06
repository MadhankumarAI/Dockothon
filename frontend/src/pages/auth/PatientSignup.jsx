// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import './Auth.css';

// const PatientSignup = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     age: '',
//     gender: '',
//     phone_number: '',
//     address: '',
//     emergency_contact: '',
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { signupPatient } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     try {
//       const data = {
//         ...formData,
//         age: formData.age ? parseInt(formData.age) : null,
//       };
//       await signupPatient(data);
//       setSuccess('Account created successfully! Redirecting to sign in...');
//       setTimeout(() => navigate('/signin'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to create account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card" style={{ maxWidth: '550px' }}>
//         <div className="auth-header">
//           <h1>Patient Registration</h1>
//           <p>Create your health account</p>
//         </div>

//         {error && <div className="error-message">{error}</div>}
//         {success && <div className="success-message">{success}</div>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="username">Username</label>
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleChange}
//                 placeholder="Choose a username"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Your email address"
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Create a password"
//               required
//             />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="age">Age</label>
//               <input
//                 type="number"
//                 id="age"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 placeholder="Your age"
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="gender">Gender</label>
//               <select
//                 id="gender"
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//               >
//                 <option value="">Select gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="phone_number">Phone Number</label>
//             <input
//               type="tel"
//               id="phone_number"
//               name="phone_number"
//               value={formData.phone_number}
//               onChange={handleChange}
//               placeholder="Your phone number"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="address">Address</label>
//             <input
//               type="text"
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               placeholder="Your address"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="emergency_contact">Emergency Contact</label>
//             <input
//               type="text"
//               id="emergency_contact"
//               name="emergency_contact"
//               value={formData.emergency_contact}
//               onChange={handleChange}
//               placeholder="Emergency contact name & number"
//             />
//           </div>

//           <button type="submit" className="auth-btn" disabled={loading}>
//             {loading ? 'Creating Account...' : 'Create Patient Account'}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>Already have an account? <Link to="/signin">Sign In</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientSignup;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    phone_number: '',
    address: '',
    emergency_contact: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signupPatient } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
      };
      await signupPatient(data);
      setSuccess('Account created successfully! Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">⚕️</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Docko<span className="text-[rgb(193,218,216)]">thon</span>
            </span>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start Your <span className="text-[rgb(193,218,216)]">Health Journey</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Create your secure health account and access premium healthcare services from certified professionals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
                <div className="flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="patient.username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="patient@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters with letters and numbers
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="25"
                    />
                    <div className="absolute right-3 top-3 text-gray-400 text-sm">years</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 appearance-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-500">+1</div>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                  placeholder="123 Main St, City, State ZIP"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  name="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                  placeholder="Name & Phone Number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This information is kept secure and only used for emergencies
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-[rgb(193,218,216)]/10 to-emerald-50 rounded-xl border border-[rgb(193,218,216)]/30">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-gray-900">🔒</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      Your health data is protected
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      We use bank-level encryption and are HIPAA compliant. Your information is never shared without your consent.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Your Account...
                  </span>
                ) : (
                  'Create Patient Account'
                )}
              </button>

              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/signin" className="font-semibold text-[rgb(193,218,216)] hover:text-emerald-400 transition-colors duration-300">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Patient Benefits</h2>
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Access to board-certified doctors</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">24/7 virtual consultations</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Secure health record storage</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Prescription management</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Appointment scheduling</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Medication reminders</span>
              </li>
            </ul>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-bold mb-2">Security First</h3>
              <p className="text-sm text-gray-300">
                Your health information is encrypted end-to-end and protected by enterprise-grade security.
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <span className="text-xs px-2 py-1 bg-white/20 rounded">HIPAA</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded">GDPR</span>
                <span className="text-xs px-2 py-1 bg-white/20 rounded">SOC 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;
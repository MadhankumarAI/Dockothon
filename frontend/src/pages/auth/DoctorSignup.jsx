// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import './Auth.css';

// const DoctorSignup = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     hospital: '',
//     specialization: '',
//     qualification: '',
//     age: '',
//     license_number: '',
//     years_of_experience: '',
//     auto_accept: false,
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { signupDoctor } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
//     setFormData({ ...formData, [e.target.name]: value });
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
//         years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
//       };
//       await signupDoctor(data);
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
//       <div className="auth-card" style={{ maxWidth: '600px' }}>
//         <div className="auth-header">
//           <h1>Doctor Registration</h1>
//           <p>Create your professional account</p>
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
//               <label htmlFor="hospital">Hospital</label>
//               <input
//                 type="text"
//                 id="hospital"
//                 name="hospital"
//                 value={formData.hospital}
//                 onChange={handleChange}
//                 placeholder="Hospital name"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="specialization">Specialization</label>
//               <input
//                 type="text"
//                 id="specialization"
//                 name="specialization"
//                 value={formData.specialization}
//                 onChange={handleChange}
//                 placeholder="Your specialization"
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="qualification">Qualification</label>
//             <input
//               type="text"
//               id="qualification"
//               name="qualification"
//               value={formData.qualification}
//               onChange={handleChange}
//               placeholder="e.g., MBBS, MD"
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
//               <label htmlFor="years_of_experience">Years of Experience</label>
//               <input
//                 type="number"
//                 id="years_of_experience"
//                 name="years_of_experience"
//                 value={formData.years_of_experience}
//                 onChange={handleChange}
//                 placeholder="Experience"
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label htmlFor="license_number">License Number</label>
//             <input
//               type="text"
//               id="license_number"
//               name="license_number"
//               value={formData.license_number}
//               onChange={handleChange}
//               placeholder="Medical license number"
//             />
//           </div>

//           <div className="form-checkbox">
//             <input
//               type="checkbox"
//               id="auto_accept"
//               name="auto_accept"
//               checked={formData.auto_accept}
//               onChange={handleChange}
//             />
//             <label htmlFor="auto_accept">Auto-accept patient requests</label>
//           </div>

//           <button type="submit" className="auth-btn" disabled={loading}>
//             {loading ? 'Creating Account...' : 'Create Doctor Account'}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>Already have an account? <Link to="/signin">Sign In</Link></p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorSignup;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    hospital: '',
    specialization: '',
    qualification: '',
    age: '',
    license_number: '',
    years_of_experience: '',
    auto_accept: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signupDoctor } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
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
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
      };
      await signupDoctor(data);
      setSuccess('Account created successfully! Redirecting to sign in...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics',
    'Psychiatry', 'Radiology', 'Surgery', 'Urology',
    'Anesthesiology', 'Ophthalmology', 'ENT', 'General Medicine'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
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
            Join Our <span className="text-[rgb(193,218,216)]">Medical Network</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Register as a healthcare professional and connect with patients in a secure, efficient platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-2xl">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <h2 className="text-2xl font-bold mb-4">Doctor Benefits</h2>
            </div>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Access to verified patient network</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Secure medical record management</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">HIPAA compliant platform</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Real-time patient communication</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">✓</span>
                </div>
                <span className="text-gray-200">Automated appointment scheduling</span>
              </li>
            </ul>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="font-bold mb-2">Requirements</h3>
              <p className="text-sm text-gray-300">
                Valid medical license and hospital affiliation required for account verification.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
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
                    placeholder="doctor.username"
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
                    placeholder="doctor@example.com"
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
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hospital/Clinic *
                  </label>
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="Hospital name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Specialization *
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                  placeholder="MBBS, MD, PhD, etc."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Medical License Number
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                  placeholder="MED-12345"
                />
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="auto_accept"
                  name="auto_accept"
                  checked={formData.auto_accept}
                  onChange={handleChange}
                  className="w-5 h-5 text-[rgb(193,218,216)] rounded focus:ring-[rgb(193,218,216)]"
                />
                <label htmlFor="auto_accept" className="text-gray-700 font-medium">
                  Auto-accept patient requests
                  <span className="block text-sm text-gray-500 font-normal mt-1">
                    Enable to automatically accept consultation requests from patients
                  </span>
                </label>
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
                  'Register as Doctor'
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
        </div>
      </div>
    </div>
  );
};

export default DoctorSignup;
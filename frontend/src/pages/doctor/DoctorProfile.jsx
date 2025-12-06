// import { useState, useEffect } from 'react';
// import { doctorAPI } from '../../services/api';
// import { useNavigate } from 'react-router-dom';
// import './Dashboard.css';

// const DoctorProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const response = await doctorAPI.getProfile();
//       setProfile(response.data);
//       setFormData({
//         hospital: response.data.hospital,
//         specialization: response.data.specialization,
//         qualification: response.data.qualification,
//         age: response.data.age || '',
//         license_number: response.data.license_number || '',
//         years_of_experience: response.data.years_of_experience || '',
//       });
//     } catch (err) {
//       setError('Failed to load profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setSaving(true);

//     try {
//       const data = {
//         ...formData,
//         age: formData.age ? parseInt(formData.age) : null,
//         years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
//       };
//       const response = await doctorAPI.updateProfile(data);
//       setProfile(response.data);
//       setSuccess('Profile updated successfully!');
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="dashboard-loading">Loading...</div>;

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Edit Profile</h1>
//         <button onClick={() => navigate('/doctor/dashboard')} className="back-btn">
//           ← Back to Dashboard
//         </button>
//       </div>

//       <div className="profile-edit-card">
//         {error && <div className="error-message">{error}</div>}
//         {success && <div className="success-message">{success}</div>}

//         <form onSubmit={handleSubmit} className="profile-form">
//           <div className="form-row">
//             <div className="form-group">
//               <label>Hospital</label>
//               <input
//                 type="text"
//                 name="hospital"
//                 value={formData.hospital}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Specialization</label>
//               <input
//                 type="text"
//                 name="specialization"
//                 value={formData.specialization}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>Qualification</label>
//             <input
//               type="text"
//               name="qualification"
//               value={formData.qualification}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label>Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 value={formData.age}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="form-group">
//               <label>Years of Experience</label>
//               <input
//                 type="number"
//                 name="years_of_experience"
//                 value={formData.years_of_experience}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-group">
//             <label>License Number</label>
//             <input
//               type="text"
//               name="license_number"
//               value={formData.license_number}
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit" className="save-btn" disabled={saving}>
//             {saving ? 'Saving...' : 'Save Changes'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DoctorProfile;
import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await doctorAPI.getProfile();
      setProfile(response.data);
      setFormData({
        hospital: response.data.hospital,
        specialization: response.data.specialization,
        qualification: response.data.qualification,
        age: response.data.age || '',
        license_number: response.data.license_number || '',
        years_of_experience: response.data.years_of_experience || '',
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
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
      };
      const response = await doctorAPI.updateProfile(data);
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[rgb(193,218,216)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
              <p className="text-gray-300">Update your professional information</p>
            </div>
            <button
              onClick={() => navigate('/doctor/dashboard')}
              className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-colors duration-300 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        <div className="mb-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-500">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-emerald-500">✅</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-emerald-800">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Dr. {profile?.user?.username}</h2>
                <p className="text-gray-500">{profile?.user?.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                    <span className="font-medium text-gray-900">Active</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Auto Analysis</div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${profile?.auto_accept ? 'bg-emerald-400' : 'bg-gray-400'}`}></div>
                    <span className="font-medium text-gray-900">
                      {profile?.auto_accept ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Professional Information</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital/Clinic *
                    </label>
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="Hospital name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization *
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="Cardiology, Neurology, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications *
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="MBBS, MD, PhD, etc."
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                        placeholder="30"
                      />
                      <div className="absolute right-3 top-3 text-gray-400 text-sm">years</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="years_of_experience"
                        value={formData.years_of_experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                        placeholder="5"
                      />
                      <div className="absolute right-3 top-3 text-gray-400 text-sm">years</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                
                <div className="pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Changes...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mt-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Account Information</h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                    <p className="font-medium text-gray-900">{profile?.user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="font-medium text-gray-900">{profile?.user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                    <p className="font-medium text-gray-900">
                      {profile?.user?.created_at ? new Date(profile.user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Member ID</label>
                    <p className="font-medium text-gray-900">DR-{profile?.user?.id?.toString().padStart(6, '0') || '000000'}</p>
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

export default DoctorProfile;
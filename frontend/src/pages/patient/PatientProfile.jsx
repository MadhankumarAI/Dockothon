import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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
      setTimeout(() => setSuccess(''), 3000);
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
              <p className="text-gray-300">Update your personal and health information</p>
            </div>
            <button
              onClick={() => navigate('/patient/dashboard')}
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
                <div className="w-24 h-24 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">👤</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{profile?.user?.username}</h2>
                <p className="text-gray-500">{profile?.user?.email}</p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Member Since</div>
                  <p className="font-medium text-gray-900">
                    {profile?.user?.created_at ? new Date(profile.user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm text-gray-500 mb-1">Patient ID</div>
                  <p className="font-medium text-gray-900">
                    PT-{profile?.user?.id?.toString().padStart(6, '0') || '000000'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                        placeholder="25"
                      />
                      <div className="absolute right-3 top-3 text-gray-400 text-sm">years</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 min-h-[80px] resize-none"
                    placeholder="Your complete address"
                    rows="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="Name and phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    name="medical_history"
                    value={formData.medical_history}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 min-h-[100px] resize-none"
                    placeholder="Any relevant medical history, allergies, or conditions..."
                    rows="3"
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
            
            {/* Danger Zone */}
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 mt-8">
              <div className="p-6 border-b border-red-100">
                <h2 className="text-xl font-bold text-red-600 flex items-center">
                  <span className="mr-2">⚠️</span> Danger Zone
                </h2>
              </div>
              <div className="p-6">
                {!showDeleteConfirm ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors duration-300 font-medium"
                    >
                      Delete Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3 text-red-600 mb-3">
                        <span className="text-xl">⚠️</span>
                        <h3 className="font-bold">Are you absolutely sure?</h3>
                      </div>
                      <p className="text-sm text-red-700">
                        This action cannot be undone. All your data, including medical entries and reports, will be permanently deleted.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300 font-medium"
                      >
                        Yes, delete my account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
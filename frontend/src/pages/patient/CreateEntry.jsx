import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, entryAPI } from '../../services/api';

const CreateEntry = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState({
    top_view_url: '',
    bottom_view_url: '',
    amount_voided: '',
    diameter_of_commode: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = doctors.filter(
        (doc) =>
          doc.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.listDoctors({});
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch {
      setError('Failed to load doctors');
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSearchTerm(`Dr. ${doctor.user.username} - ${doctor.specialization}`);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedDoctor) {
      setError('Please select a doctor');
      return;
    }

    setLoading(true);

    try {
      const data = {
        doctor_id: selectedDoctor.id,
        top_view_url: formData.top_view_url || null,
        bottom_view_url: formData.bottom_view_url || null,
        amount_voided: formData.amount_voided ? parseFloat(formData.amount_voided) : null,
        diameter_of_commode: formData.diameter_of_commode ? parseFloat(formData.diameter_of_commode) : null,
        notes: formData.notes || null,
      };

      await entryAPI.create(data);
      setSuccess('Entry created successfully! The doctor has been notified.');
      setTimeout(() => navigate('/patient/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Create New Entry</h1>
              <p className="text-gray-300">Submit your health data to a doctor for analysis</p>
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

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">New Health Entry</h2>
              <p className="text-gray-600">Fill in your health data to share with your doctor</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Doctor Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-lg font-semibold text-gray-900">
                    Select Your Doctor *
                  </label>
                  <span className="text-sm text-gray-500">
                    {filteredDoctors.length} doctors available
                  </span>
                </div>
                
                <div className="relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by doctor name, specialization, or hospital..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                        if (!e.target.value) setSelectedDoctor(null);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 text-lg"
                    />
                  </div>
                  
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
                      {filteredDoctors.length > 0 ? (
                        <div className="py-2">
                          {filteredDoctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                                selectedDoctor?.id === doctor.id ? 'bg-[rgb(193,218,216)]/10' : ''
                              }`}
                              onClick={() => handleSelectDoctor(doctor)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-[rgb(193,218,216)]/20 to-emerald-200/20 rounded-lg flex items-center justify-center">
                                    <span className="text-lg">👨‍⚕️</span>
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900">Dr. {doctor.user.username}</h3>
                                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                                  </div>
                                </div>
                                {doctor.auto_accept && (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    Auto Accept
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 pl-13">
                                {doctor.hospital} • {doctor.years_of_experience || '0'} years experience
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <span className="text-2xl mb-2 block">🔍</span>
                          No doctors found matching your search
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {selectedDoctor && (
                  <div className="bg-gradient-to-r from-[rgb(193,218,216)]/10 to-emerald-50 rounded-xl p-4 border border-[rgb(193,218,216)]/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-lg flex items-center justify-center">
                          <span className="text-xl">👨‍⚕️</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Dr. {selectedDoctor.user.username}</h3>
                          <p className="text-gray-600">{selectedDoctor.specialization}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDoctor(null);
                          setSearchTerm('');
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Hospital:</span>{' '}
                        <span className="font-medium">{selectedDoctor.hospital}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Experience:</span>{' '}
                        <span className="font-medium">{selectedDoctor.years_of_experience || '0'} years</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video URLs */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Video Uploads (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Top View Video URL
                    </label>
                    <input
                      type="url"
                      name="top_view_url"
                      value={formData.top_view_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="https://example.com/top-view"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bottom View Video URL
                    </label>
                    <input
                      type="url"
                      name="bottom_view_url"
                      value={formData.bottom_view_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="https://example.com/bottom-view"
                    />
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Measurements</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Voided (ml)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="amount_voided"
                        value={formData.amount_voided}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                        placeholder="250"
                        step="0.1"
                      />
                      <div className="absolute right-3 top-3 text-gray-400">ml</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commode Diameter (cm)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="diameter_of_commode"
                        value={formData.diameter_of_commode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                        placeholder="30"
                        step="0.1"
                      />
                      <div className="absolute right-3 top-3 text-gray-400">cm</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 min-h-[120px] resize-none"
                  placeholder="Any additional observations, symptoms, or information for the doctor..."
                  rows="4"
                />
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-r from-[rgb(193,218,216)]/10 to-emerald-50 rounded-xl p-4 border border-[rgb(193,218,216)]/30">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-gray-900">🔒</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">
                      Your data is secure and encrypted
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      All information is protected by HIPAA compliance and end-to-end encryption.
                      Only your selected doctor can access this data.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedDoctor}
                className="w-full py-4 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Entry...
                  </span>
                ) : (
                  'Submit to Doctor'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default CreateEntry;
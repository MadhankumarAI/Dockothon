import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    fetchDoctors();
    extractSpecializations();
  }, []);

  const fetchDoctors = async (specialization = '') => {
    setLoading(true);
    try {
      const params = specialization ? { specialization } : {};
      const response = await doctorAPI.listDoctors(params);
      setDoctors(response.data);
    } catch (err) {
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const extractSpecializations = () => {
    const specs = [...new Set(doctors.map(doc => doc.specialization))];
    setSpecializations(specs);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(searchTerm);
  };

  const handleSpecializationFilter = (spec) => {
    setSelectedSpecialization(spec);
    fetchDoctors(spec);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[rgb(193,218,216)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading doctors...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
        <div className="flex items-center space-x-3 text-red-600 mb-3">
          <span className="text-2xl">⚠️</span>
          <h3 className="font-bold text-lg">Failed to Load</h3>
        </div>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={() => fetchDoctors()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">Find Doctors</h1>
          <p className="text-gray-300">Connect with certified healthcare professionals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by specialization, name, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 text-lg shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-lg hover:shadow-md transition-all duration-300 font-medium"
              >
                Search
              </button>
            </div>
          </form>

          {/* Specialization Filters */}
          {specializations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Filter by Specialization</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedSpecialization('');
                    fetchDoctors();
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedSpecialization === ''
                      ? 'bg-[rgb(193,218,216)] text-gray-900'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Specialties
                </button>
                {specializations.slice(0, 8).map((spec) => (
                  <button
                    key={spec}
                    onClick={() => handleSpecializationFilter(spec)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedSpecialization === spec
                        ? 'bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-gray-400">👨‍⚕️</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">No doctors found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || selectedSpecialization
                ? 'Try adjusting your search criteria'
                : 'No doctors are currently available in the system'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Doctors <span className="text-gray-500">({doctors.length})</span>
              </h2>
              <div className="text-sm text-gray-500">
                Click to select for consultation
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                          Dr. {doctor.user.username}
                        </h3>
                        <span className="px-3 py-1 bg-[rgb(193,218,216)]/10 text-[rgb(193,218,216)] rounded-full text-sm font-medium">
                          {doctor.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="truncate">{doctor.hospital}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{doctor.years_of_experience || '0'} years experience</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{doctor.qualification}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className={`flex items-center ${doctor.auto_accept ? 'text-emerald-600' : 'text-gray-500'}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${doctor.auto_accept ? 'bg-emerald-400' : 'bg-gray-400'}`}></div>
                          <span className="text-sm font-medium">
                            {doctor.auto_accept ? 'Auto Accepting' : 'By Appointment'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
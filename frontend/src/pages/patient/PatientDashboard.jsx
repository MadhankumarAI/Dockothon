import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientAPI, entryAPI, reportAPI } from '../../services/api';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, entriesRes] = await Promise.all([
        patientAPI.getProfile(),
        entryAPI.getMyEntries()
      ]);
      setProfile(profileRes.data);
      setEntries(entriesRes.data);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEntry = async (entry) => {
    setSelectedEntry(entry);
    try {
      const response = await reportAPI.getForEntry(entry.id);
      setReports(response.data);
    } catch {
      setReports([]);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[rgb(193,218,216)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error && !profile) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
        <div className="flex items-center space-x-3 text-red-600 mb-3">
          <span className="text-2xl">⚠️</span>
          <h3 className="font-bold text-lg">Failed to Load</h3>
        </div>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={fetchData} 
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
              <p className="text-gray-300">
                Welcome back, <span className="font-semibold text-[rgb(193,218,216)]">{profile?.user?.username}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Health Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/patient/create-entry')}
            className="bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 rounded-2xl p-6 text-left hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">➕</span>
              </div>
              <span className="text-gray-400 group-hover:text-gray-600">→</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">New Entry</h3>
            <p className="text-gray-600 text-sm">Submit health data to a doctor</p>
          </button>

          <button
            onClick={() => navigate('/doctors')}
            className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 text-left hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <span className="text-gray-400 group-hover:text-blue-600">→</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Find Doctors</h3>
            <p className="text-gray-600 text-sm">Connect with specialists</p>
          </button>

          <button
            onClick={() => navigate('/patient/profile')}
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-left hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <span className="text-gray-400 group-hover:text-purple-600">→</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Edit Profile</h3>
            <p className="text-gray-600 text-sm">Update your information</p>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Profile Overview</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="font-medium text-gray-900">{profile?.user?.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                      <p className="font-medium text-gray-900">{profile?.age || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                      <p className="font-medium text-gray-900">{profile?.gender || 'N/A'}</p>
                    </div>
                  </div>
                  {profile?.phone_number && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                      <p className="font-medium text-gray-900">{profile.phone_number}</p>
                    </div>
                  )}
                  {profile?.emergency_contact && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                      <label className="block text-sm font-medium text-red-600 mb-1">Emergency Contact</label>
                      <p className="font-medium text-gray-900">{profile.emergency_contact}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Health Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Health Stats</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{entries.length}</div>
                    <div className="text-sm text-gray-600">Total Entries</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {entries.filter(e => reports.some(r => r.entry_id === e.id)).length}
                    </div>
                    <div className="text-sm text-gray-600">Reviewed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Columns - Entries & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Entries List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    My Entries <span className="text-gray-500">({entries.length})</span>
                  </h2>
                  <div className="text-sm text-gray-500">
                    Select an entry to view details
                  </div>
                </div>
              </div>
              <div className="p-6">
                {entries.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl text-gray-400">📝</span>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">No entries yet</h3>
                    <p className="text-gray-500 mb-4">Create your first entry to get started</p>
                    <button
                      onClick={() => navigate('/patient/create-entry')}
                      className="px-6 py-3 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-lg hover:shadow-md transition-all duration-300 font-medium"
                    >
                      Create First Entry
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                          selectedEntry?.id === entry.id
                            ? 'border-[rgb(193,218,216)] bg-[rgb(193,218,216)]/5'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectEntry(entry)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Dr. {entry.doctor_name || 'Unknown Doctor'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{formatDate(entry.time)}</p>
                          </div>
                          {entry.amount_voided && (
                            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              {entry.amount_voided}ml
                            </div>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Entry Details & Reports */}
            {selectedEntry ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Entry Details</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Entry Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date & Time</label>
                        <p className="font-medium text-gray-900">{formatDate(selectedEntry.time)}</p>
                      </div>
                      {selectedEntry.amount_voided && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Amount Voided</label>
                          <p className="font-medium text-gray-900">{selectedEntry.amount_voided}ml</p>
                        </div>
                      )}
                    </div>

                    {selectedEntry.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedEntry.notes}</p>
                      </div>
                    )}

                    {/* Video Links */}
                    {(selectedEntry.top_view_url || selectedEntry.bottom_view_url) && (
                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="font-medium text-gray-900 mb-3">Video Recordings</h3>
                        <div className="space-y-2">
                          {selectedEntry.top_view_url && (
                            <a
                              href={selectedEntry.top_view_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600">📹</span>
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-blue-700">
                                  Top View Video
                                </span>
                              </div>
                              <span className="text-gray-400 group-hover:text-blue-600">→</span>
                            </a>
                          )}
                          {selectedEntry.bottom_view_url && (
                            <a
                              href={selectedEntry.bottom_view_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600">📹</span>
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-blue-700">
                                  Bottom View Video
                                </span>
                              </div>
                              <span className="text-gray-400 group-hover:text-blue-600">→</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Doctor Reports */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">
                          Doctor Reports <span className="text-gray-500">({reports.length})</span>
                        </h3>
                      </div>
                      
                      {reports.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-gray-400">📄</span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2">No Reports Yet</h3>
                          <p className="text-gray-500">Your doctor will add reports here</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {reports.map((report) => (
                            <div key={report.id} className="border border-gray-200 rounded-xl p-4 hover:border-[rgb(193,218,216)] transition-colors duration-300">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    report.report_type === 'diagnosis' ? 'bg-blue-100 text-blue-700' :
                                    report.report_type === 'prescription' ? 'bg-green-100 text-green-700' :
                                    report.report_type === 'lab_results' ? 'bg-purple-100 text-purple-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {report.report_type}
                                  </span>
                                  <h4 className="font-bold text-gray-900 mt-2">{report.title}</h4>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(report.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {report.description && (
                                <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                              )}
                              {report.report_url && (
                                <a
                                  href={report.report_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-sm text-[rgb(193,218,216)] hover:text-emerald-400 font-medium"
                                >
                                  View Document →
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-gray-400">👈</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Select an Entry</h3>
                <p className="text-gray-600">Choose an entry from the list to view details and reports</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
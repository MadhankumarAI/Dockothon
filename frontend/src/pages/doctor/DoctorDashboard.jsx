// import { useState, useEffect } from 'react';
// import { entryAPI, reportAPI, doctorAPI, analysisAPI } from '../../services/api';
// import './Dashboard.css';

// const DoctorDashboard = () => {
//   const [profile, setProfile] = useState(null);
//   const [entries, setEntries] = useState([]);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [analysis, setAnalysis] = useState(null);
//   const [analysisLoading, setAnalysisLoading] = useState(false);
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportForm, setReportForm] = useState({
//     report_type: 'diagnosis',
//     title: '',
//     description: '',
//     report_url: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const [profileRes, entriesRes] = await Promise.all([
//         doctorAPI.getProfile(),
//         entryAPI.getMyEntries()
//       ]);
//       setProfile(profileRes.data);
//       setEntries(entriesRes.data);
//     } catch {
//       setError('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelectEntry = async (entry) => {
//     setSelectedEntry(entry);
//     setAnalysis(null);
//     try {
//       const [reportsRes] = await Promise.all([
//         reportAPI.getForEntry(entry.id)
//       ]);
//       setReports(reportsRes.data);
      
//       // Try to get analysis (may not exist)
//       try {
//         const analysisRes = await analysisAPI.getForEntry(entry.id);
//         setAnalysis(analysisRes.data);
//       } catch {
//         setAnalysis(null);
//       }
//     } catch {
//       setReports([]);
//     }
//   };

//   const toggleAutoAccept = async () => {
//     try {
//       const response = await doctorAPI.toggleAutoAccept(!profile.auto_accept);
//       setProfile(response.data);
//     } catch {
//       setError('Failed to update auto-accept setting');
//     }
//   };

//   const handleRunAnalysis = async () => {
//     if (!selectedEntry) return;
    
//     setAnalysisLoading(true);
//     setError('');
    
//     try {
//       const response = await analysisAPI.runAnalysis(selectedEntry.id);
//       setAnalysis(response.data);
//       setSuccess('Analysis completed successfully!');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to run analysis');
//     } finally {
//       setAnalysisLoading(false);
//     }
//   };

//   const handleReportSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedEntry) return;

//     try {
//       await reportAPI.create({
//         entry_id: selectedEntry.id,
//         ...reportForm
//       });
//       setSuccess('Report added successfully!');
//       setShowReportModal(false);
//       setReportForm({ report_type: 'diagnosis', title: '', description: '', report_url: '' });
//       const response = await reportAPI.getForEntry(selectedEntry.id);
//       setReports(response.data);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Failed to add report');
//     }
//   };

//   const handleDeleteReport = async (reportId) => {
//     if (!confirm('Are you sure you want to delete this report?')) return;
    
//     try {
//       await reportAPI.delete(reportId);
//       setReports(reports.filter(r => r.id !== reportId));
//       setSuccess('Report deleted');
//       setTimeout(() => setSuccess(''), 3000);
//     } catch {
//       setError('Failed to delete report');
//     }
//   };

//   const formatDate = (dateStr) => {
//     return new Date(dateStr).toLocaleString();
//   };

//   const parseQmaxReport = (jsonStr) => {
//     try {
//       return JSON.parse(jsonStr);
//     } catch {
//       return null;
//     }
//   };

//   if (loading) return <div className="dashboard-loading">Loading...</div>;
//   if (error && !profile) return <div className="dashboard-error">{error}</div>;

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Doctor Dashboard</h1>
//         <p>Welcome back, Dr. {profile?.user?.username}</p>
//       </div>

//       {error && <div className="error-message">{error}</div>}
//       {success && <div className="success-message">{success}</div>}

//       <div className="dashboard-grid">
//         {/* Profile Card */}
//         <div className="dashboard-card profile-card">
//           <div className="card-header">
//             <h2>Profile Overview</h2>
//           </div>
//           <div className="card-content">
//             <div className="profile-info">
//               <div className="info-row">
//                 <span className="label">Hospital:</span>
//                 <span className="value">{profile?.hospital}</span>
//               </div>
//               <div className="info-row">
//                 <span className="label">Specialization:</span>
//                 <span className="value">{profile?.specialization}</span>
//               </div>
//             </div>
//             <div className="setting-item" style={{ marginTop: '1rem' }}>
//               <div className="setting-info">
//                 <h3>Auto Accept & Auto Analysis</h3>
//                 <p style={{ fontSize: '0.8rem', color: '#666' }}>When enabled, analysis runs automatically on new entries</p>
//               </div>
//               <label className="toggle-switch">
//                 <input
//                   type="checkbox"
//                   checked={profile?.auto_accept || false}
//                   onChange={toggleAutoAccept}
//                 />
//                 <span className="toggle-slider"></span>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Entries List */}
//         <div className="dashboard-card entries-card">
//           <div className="card-header">
//             <h2>Patient Entries ({entries.length})</h2>
//           </div>
//           <div className="card-content">
//             {entries.length === 0 ? (
//               <p className="no-data">No entries yet</p>
//             ) : (
//               <div className="entries-list">
//                 {entries.map((entry) => (
//                   <div
//                     key={entry.id}
//                     className={`entry-item ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
//                     onClick={() => handleSelectEntry(entry)}
//                   >
//                     <div className="entry-header">
//                       <span className="entry-patient">Patient: {entry.patient_name || 'Unknown'}</span>
//                       <span className="entry-time">{formatDate(entry.time)}</span>
//                     </div>
//                     <div className="entry-details">
//                       {entry.notes && <p className="entry-notes">{entry.notes.substring(0, 50)}...</p>}
//                       {entry.amount_voided && <span>Amount: {entry.amount_voided}ml</span>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Entry Details & Analysis */}
//         {selectedEntry && (
//           <div className="dashboard-card reports-card">
//             <div className="card-header">
//               <h2>Entry Details & Analysis</h2>
//             </div>
//             <div className="card-content">
//               <div className="entry-full-details">
//                 <p><strong>Time:</strong> {formatDate(selectedEntry.time)}</p>
//                 {selectedEntry.top_view_url && (
//                   <p><strong>Top View:</strong> <a href={selectedEntry.top_view_url} target="_blank" rel="noopener noreferrer">View Video</a></p>
//                 )}
//                 {selectedEntry.bottom_view_url && (
//                   <p><strong>Bottom View:</strong> <a href={selectedEntry.bottom_view_url} target="_blank" rel="noopener noreferrer">View Video</a></p>
//                 )}
//                 {selectedEntry.amount_voided && <p><strong>Amount Voided:</strong> {selectedEntry.amount_voided}ml</p>}
//                 {selectedEntry.diameter_of_commode && <p><strong>Diameter:</strong> {selectedEntry.diameter_of_commode}cm</p>}
//                 {selectedEntry.notes && <p><strong>Notes:</strong> {selectedEntry.notes}</p>}
//               </div>

//               {/* Analysis Section - Only visible to doctors */}
//               <div className="analysis-section">
//                 <div className="reports-header">
//                   <h3>📊 AI Analysis</h3>
//                   {(selectedEntry.top_view_url || selectedEntry.bottom_view_url) && (
//                     <button 
//                       className="add-report-btn" 
//                       onClick={handleRunAnalysis}
//                       disabled={analysisLoading}
//                     >
//                       {analysisLoading ? 'Running...' : (analysis ? '🔄 Re-run Analysis' : '🔬 Run Analysis')}
//                     </button>
//                   )}
//                 </div>
                
//                 {analysisLoading && (
//                   <div className="analysis-loading">
//                     <p>🔄 Running CNN analysis on video... This may take a few minutes.</p>
//                   </div>
//                 )}
                
//                 {analysis ? (
//                   <div className="analysis-results">
//                     {analysis.qmax_report_json && (() => {
//                       const qmax = parseQmaxReport(analysis.qmax_report_json);
//                       return qmax ? (
//                         <div className="qmax-summary">
//                           <div className="qmax-item highlight">
//                             <span className="qmax-label">Qmax</span>
//                             <span className="qmax-value">{qmax.Qmax?.toFixed(2) || 'N/A'} ml/s</span>
//                           </div>
//                           <div className="qmax-item highlight">
//                             <span className="qmax-label">Voided Volume</span>
//                             <span className="qmax-value">{qmax.Voided_Volume?.toFixed(2) || 'N/A'} ml</span>
//                           </div>
//                           <div className="qmax-item">
//                             <span className="qmax-label">Time to Qmax</span>
//                             <span className="qmax-value">{qmax.Time_to_Qmax?.toFixed(2) || 'N/A'} s</span>
//                           </div>
//                           <div className="qmax-item">
//                             <span className="qmax-label">Hesitancy</span>
//                             <span className="qmax-value">{qmax.Hesitancy?.toFixed(2) || 'N/A'} s</span>
//                           </div>
//                           <div className="qmax-item">
//                             <span className="qmax-label">Voiding Time</span>
//                             <span className="qmax-value">{qmax.Voiding_Time?.toFixed(2) || 'N/A'} s</span>
//                           </div>
//                           <div className="qmax-item">
//                             <span className="qmax-label">Flow Time</span>
//                             <span className="qmax-value">{qmax.Flow_Time?.toFixed(2) || 'N/A'} s</span>
//                           </div>
//                           <div className="qmax-item">
//                             <span className="qmax-label">Average Flow Rate</span>
//                             <span className="qmax-value">{qmax.Average_Flow_Rate?.toFixed(2) || 'N/A'} ml/s</span>
//                           </div>
//                         </div>
//                       ) : null;
//                     })()}
                    
//                     <div className="analysis-links">
//                       {analysis.annotated_video_url && (
//                         <a href={analysis.annotated_video_url} target="_blank" rel="noopener noreferrer" className="analysis-link">
//                           🎬 Annotated Video
//                         </a>
//                       )}
//                       {analysis.clinical_report_url && (
//                         <a href={analysis.clinical_report_url} target="_blank" rel="noopener noreferrer" className="analysis-link">
//                           📈 Clinical Report
//                         </a>
//                       )}
//                       {analysis.flow_timeseries_url && (
//                         <a href={analysis.flow_timeseries_url} target="_blank" rel="noopener noreferrer" className="analysis-link">
//                           📊 Flow Data (CSV)
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 ) : (
//                   !analysisLoading && <p className="no-data">No analysis yet. Click "Run Analysis" to start.</p>
//                 )}
//               </div>

//               {/* Reports Section */}
//               <div className="reports-section">
//                 <div className="reports-header">
//                   <h3>Reports ({reports.length})</h3>
//                   <button className="add-report-btn" onClick={() => setShowReportModal(true)}>
//                     + Add Report
//                   </button>
//                 </div>
                
//                 {reports.length === 0 ? (
//                   <p className="no-data">No reports yet</p>
//                 ) : (
//                   <div className="reports-list">
//                     {reports.map((report) => (
//                       <div key={report.id} className="report-item">
//                         <div className="report-header">
//                           <span className="report-type">{report.report_type}</span>
//                           <button className="delete-btn-small" onClick={() => handleDeleteReport(report.id)}>×</button>
//                         </div>
//                         <h4>{report.title}</h4>
//                         {report.description && <p>{report.description}</p>}
//                         {report.report_url && (
//                           <a href={report.report_url} target="_blank" rel="noopener noreferrer">View Document</a>
//                         )}
//                         <span className="report-date">{formatDate(report.created_at)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add Report Modal */}
//       {showReportModal && (
//         <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Add Report</h2>
//               <button className="close-btn" onClick={() => setShowReportModal(false)}>×</button>
//             </div>
//             <form onSubmit={handleReportSubmit} className="report-form">
//               <div className="form-group">
//                 <label>Report Type</label>
//                 <select
//                   value={reportForm.report_type}
//                   onChange={(e) => setReportForm({ ...reportForm, report_type: e.target.value })}
//                 >
//                   <option value="diagnosis">Diagnosis</option>
//                   <option value="prescription">Prescription</option>
//                   <option value="lab_results">Lab Results</option>
//                   <option value="notes">Clinical Notes</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Title *</label>
//                 <input
//                   type="text"
//                   value={reportForm.title}
//                   onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
//                   required
//                   placeholder="Report title"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Description</label>
//                 <textarea
//                   value={reportForm.description}
//                   onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
//                   rows="3"
//                   placeholder="Report description"
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Document URL (optional)</label>
//                 <input
//                   type="url"
//                   value={reportForm.report_url}
//                   onChange={(e) => setReportForm({ ...reportForm, report_url: e.target.value })}
//                   placeholder="https://..."
//                 />
//               </div>
//               <button type="submit" className="save-btn">Add Report</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DoctorDashboard;
import { useState, useEffect } from 'react';
import { entryAPI, reportAPI, doctorAPI, analysisAPI } from '../../services/api';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [reports, setReports] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({
    report_type: 'diagnosis',
    title: '',
    description: '',
    report_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, entriesRes] = await Promise.all([
        doctorAPI.getProfile(),
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
    setAnalysis(null);
    try {
      const [reportsRes] = await Promise.all([
        reportAPI.getForEntry(entry.id)
      ]);
      setReports(reportsRes.data);
      
      try {
        const analysisRes = await analysisAPI.getForEntry(entry.id);
        setAnalysis(analysisRes.data);
      } catch {
        setAnalysis(null);
      }
    } catch {
      setReports([]);
    }
  };

  const toggleAutoAccept = async () => {
    try {
      const response = await doctorAPI.toggleAutoAccept(!profile.auto_accept);
      setProfile(response.data);
    } catch {
      setError('Failed to update auto-accept setting');
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedEntry) return;
    
    setAnalysisLoading(true);
    setError('');
    
    try {
      const response = await analysisAPI.runAnalysis(selectedEntry.id);
      setAnalysis(response.data);
      setSuccess('Analysis completed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to run analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEntry) return;

    try {
      await reportAPI.create({
        entry_id: selectedEntry.id,
        ...reportForm
      });
      setSuccess('Report added successfully!');
      setShowReportModal(false);
      setReportForm({ report_type: 'diagnosis', title: '', description: '', report_url: '' });
      const response = await reportAPI.getForEntry(selectedEntry.id);
      setReports(response.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add report');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await reportAPI.delete(reportId);
      setReports(reports.filter(r => r.id !== reportId));
      setSuccess('Report deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to delete report');
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

  const parseQmaxReport = (jsonStr) => {
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
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
              <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
              <p className="text-gray-300">
                Welcome back, <span className="font-semibold text-[rgb(193,218,216)]">Dr. {profile?.user?.username}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Entries */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Profile Overview</h2>
                  <div className="px-3 py-1 bg-[rgb(193,218,216)]/10 text-[rgb(193,218,216)] rounded-full text-sm font-medium">
                    {profile?.specialization}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Hospital</label>
                      <p className="font-medium text-gray-900">{profile?.hospital}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Qualifications</label>
                      <p className="font-medium text-gray-900">{profile?.qualification}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Experience</label>
                      <p className="font-medium text-gray-900">
                        {profile?.years_of_experience || '0'} years
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">License</label>
                      <p className="font-medium text-gray-900">{profile?.license_number || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Auto-Accept Toggle */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Auto Analysis System</h3>
                      <p className="text-sm text-gray-600">
                        Automatically run AI analysis on new patient entries
                      </p>
                    </div>
                    <button
                      onClick={toggleAutoAccept}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[rgb(193,218,216)] focus:ring-offset-2 ${profile?.auto_accept ? 'bg-[rgb(193,218,216)]' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${profile?.auto_accept ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Entries List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Patient Entries <span className="text-gray-500">({entries.length})</span>
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
                    <p className="text-gray-500">Patient entries will appear here</p>
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
                              Patient: {entry.patient_name || 'Anonymous'}
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
          </div>

          {/* Right Column - Selected Entry Details */}
          <div className="space-y-8">
            {selectedEntry ? (
              <>
                {/* Entry Details Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Entry Details</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Time</label>
                        <p className="font-medium text-gray-900">{formatDate(selectedEntry.time)}</p>
                      </div>
                      {selectedEntry.amount_voided && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
                          <p className="font-medium text-gray-900">{selectedEntry.amount_voided}ml</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedEntry.notes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
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
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600">📹</span>
                                </div>
                                <span className="font-medium text-gray-900">Top View</span>
                              </div>
                              <span className="text-gray-400 group-hover:text-blue-600">→</span>
                            </a>
                          )}
                          {selectedEntry.bottom_view_url && (
                            <a
                              href={selectedEntry.bottom_view_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600">📹</span>
                                </div>
                                <span className="font-medium text-gray-900">Bottom View</span>
                              </div>
                              <span className="text-gray-400 group-hover:text-blue-600">→</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900">AI Analysis</h2>
                      {(selectedEntry.top_view_url || selectedEntry.bottom_view_url) && (
                        <button
                          onClick={handleRunAnalysis}
                          disabled={analysisLoading}
                          className="px-4 py-2 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-lg hover:shadow-md transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {analysisLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Running...
                            </span>
                          ) : analysis ? (
                            '🔄 Re-run'
                          ) : (
                            '🔬 Run Analysis'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    {analysisLoading ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 border-4 border-[rgb(193,218,216)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Running CNN analysis on video...</p>
                        <p className="text-sm text-gray-500 mt-1">This may take a few minutes</p>
                      </div>
                    ) : analysis ? (
                      <div className="space-y-6">
                        {analysis.qmax_report_json && (() => {
                          const qmax = parseQmaxReport(analysis.qmax_report_json);
                          return qmax ? (
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
                              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                <span className="mr-2">📊</span> Flow Analysis Results
                              </h3>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-3 rounded-lg border border-gray-100">
                                  <div className="text-sm text-gray-500">Qmax</div>
                                  <div className="text-2xl font-bold text-gray-900">
                                    {qmax.Qmax?.toFixed(2) || 'N/A'} <span className="text-sm text-gray-500">ml/s</span>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-100">
                                  <div className="text-sm text-gray-500">Voided Volume</div>
                                  <div className="text-2xl font-bold text-gray-900">
                                    {qmax.Voided_Volume?.toFixed(2) || 'N/A'} <span className="text-sm text-gray-500">ml</span>
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-100">
                                  <div className="text-sm text-gray-500">Time to Qmax</div>
                                  <div className="text-lg font-semibold text-gray-900">
                                    {qmax.Time_to_Qmax?.toFixed(2) || 'N/A'}s
                                  </div>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-100">
                                  <div className="text-sm text-gray-500">Voiding Time</div>
                                  <div className="text-lg font-semibold text-gray-900">
                                    {qmax.Voiding_Time?.toFixed(2) || 'N/A'}s
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* Analysis Links */}
                        <div className="space-y-2">
                          {analysis.annotated_video_url && (
                            <a
                              href={analysis.annotated_video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-blue-600">🎬</span>
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-blue-700">
                                  Annotated Video
                                </span>
                              </div>
                              <span className="text-gray-400 group-hover:text-blue-600">→</span>
                            </a>
                          )}
                          
                          {analysis.clinical_report_url && (
                            <a
                              href={analysis.clinical_report_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-green-50 rounded-lg border border-gray-200 hover:border-green-200 transition-all duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <span className="text-green-600">📈</span>
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-green-700">
                                  Clinical Report
                                </span>
                              </div>
                              <span className="text-gray-400 group-hover:text-green-600">→</span>
                            </a>
                          )}
                          
                          {analysis.flow_timeseries_url && (
                            <a
                              href={analysis.flow_timeseries_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-all duration-300 group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <span className="text-purple-600">📊</span>
                                </div>
                                <span className="font-medium text-gray-900 group-hover:text-purple-700">
                                  Flow Data (CSV)
                                </span>
                              </div>
                              <span className="text-gray-400 group-hover:text-purple-600">→</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl text-gray-400">🔬</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">No Analysis Yet</h3>
                        <p className="text-gray-500">Run analysis to get detailed insights</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reports Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-gray-900">
                        Medical Reports <span className="text-gray-500">({reports.length})</span>
                      </h2>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="px-4 py-2 bg-[rgb(193,218,216)] text-gray-900 rounded-lg hover:bg-[rgb(175,205,203)] transition-colors duration-300 font-medium"
                      >
                        + Add Report
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {reports.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl text-gray-400">📄</span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">No Reports Yet</h3>
                        <p className="text-gray-500">Add reports to document findings</p>
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
                                <h3 className="font-bold text-gray-900 mt-2">{report.title}</h3>
                              </div>
                              <button
                                onClick={() => handleDeleteReport(report.id)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-300"
                              >
                                ×
                              </button>
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
                            <div className="text-xs text-gray-500 mt-3">
                              {new Date(report.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl text-gray-400">👈</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Select an Entry</h3>
                <p className="text-gray-600">Choose a patient entry from the list to view details and analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Add Medical Report</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  ×
                </button>
              </div>
            </div>
            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportForm.report_type}
                  onChange={(e) => setReportForm({ ...reportForm, report_type: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                >
                  <option value="diagnosis">Diagnosis</option>
                  <option value="prescription">Prescription</option>
                  <option value="lab_results">Lab Results</option>
                  <option value="notes">Clinical Notes</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                  placeholder="Report title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Report description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document URL (optional)
                </label>
                <input
                  type="url"
                  value={reportForm.report_url}
                  onChange={(e) => setReportForm({ ...reportForm, report_url: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                  placeholder="https://..."
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-xl hover:shadow-md transition-all duration-300 font-medium"
                >
                  Add Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
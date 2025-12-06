import { useState, useEffect } from 'react';
import { entryAPI, reportAPI, doctorAPI, analysisAPI } from '../../services/api';

const GROQ_API_KEY = import.meta.env.VITE_GROQAPI;

const groqAPI = {
  generateReport: async (patientData, flowData, clinicalObservations) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are a medical report specialist. Generate a detailed Video Uroflowmetry report in the exact format of the provided template. Fill in all sections based on the provided data. Use checkbox notation like ☐✓ for checked and ☐_ for unchecked.`
            },
            {
              role: 'user',
              content: `Generate a Video Uroflowmetry report with the following data:
              
              PATIENT DETAILS:
              - Name: ${patientData.name || 'Not provided'}
              - Age/Sex: ${patientData.age || ''}/${patientData.sex || ''}
              - Date: ${patientData.date || new Date().toLocaleDateString()}
              - UHID: ${patientData.uhid || 'Not provided'}
              
              FLOW PARAMETERS:
              - Voided Volume: ${flowData.voidedVolume || ''} mL
              - Qmax: ${flowData.qmax || ''} mL/s
              - Qavg: ${flowData.qavg || ''} mL/s
              - Flow Time: ${flowData.flowTime || ''} s
              - Time to Qmax: ${flowData.timeToQmax || ''} s
              
              CLINICAL OBSERVATIONS:
              - Flow Curve Pattern: ${clinicalObservations.flowPattern || ''}
              - Stream Pattern: ${clinicalObservations.streamPattern || ''}
              - Initiation: ${clinicalObservations.initiation || ''}
              - Straining: ${clinicalObservations.straining ? 'Yes' : 'No'}
              - Meatal Abnormality: ${clinicalObservations.meatalAbnormality || 'Not seen'}
              - Combined Interpretation: ${clinicalObservations.interpretation || ''}
              - Impression: ${clinicalObservations.impression || ''}
              - Indication: ${clinicalObservations.indication || ''}
              - Recommendations: ${clinicalObservations.recommendations || ''}
              
              Generate the report exactly in the template format with checkboxes marked appropriately.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }
};

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [reports, setReports] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUroflowModal, setShowUroflowModal] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [reportFileName, setReportFileName] = useState('');
  
  const [uroflowForm, setUroflowForm] = useState({
    // Patient Details
    patientName: '',
    patientAge: '',
    patientSex: '',
    patientDate: new Date().toLocaleDateString('en-CA'),
    patientUHID: '',
    
    // Indication
    indication: [],
    otherIndication: '',
    
    // Flow Parameters (from model analysis)
    voidedVolume: '',
    qmax: '',
    qavg: '',
    flowTime: '',
    timeToQmax: '',
    
    // Flow Curve Pattern (single selection)
    flowPattern: '',
    
    // Video Stream Assessment
    streamPattern: '',
    initiation: '',
    straining: false,
    meatalAbnormality: '',
    
    // Combined Interpretation
    interpretation: '',
    
    // Impression (multiple selection allowed)
    impression: [],
    
    // Recommendations
    recommendations: '',
  });

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
        // Auto-fill flow parameters from analysis if available
        if (analysisRes.data.qmax_report_json) {
          try {
            const qmaxData = JSON.parse(analysisRes.data.qmax_report_json);
            setUroflowForm(prev => ({
              ...prev,
              voidedVolume: qmaxData.Voided_Volume?.toFixed(2) || '',
              qmax: qmaxData.Qmax?.toFixed(2) || '',
              qavg: qmaxData.Qavg?.toFixed(2) || '',
              flowTime: qmaxData.Voiding_Time?.toFixed(2) || '',
              timeToQmax: qmaxData.Time_to_Qmax?.toFixed(2) || '',
              patientName: entry.patient_name || '',
            }));
          } catch (e) {
            console.error('Error parsing Qmax data:', e);
          }
        }
      } catch {
        setAnalysis(null);
      }
    } catch {
      setReports([]);
    }
  };

  const handleUroflowFormChange = (field, value) => {
    setUroflowForm(prev => ({ ...prev, [field]: value }));
  };

  const handleIndicationChange = (value) => {
    setUroflowForm(prev => {
      const newIndications = prev.indication.includes(value)
        ? prev.indication.filter(item => item !== value)
        : [...prev.indication, value];
      return { ...prev, indication: newIndications };
    });
  };

  const handleImpressionChange = (value) => {
    setUroflowForm(prev => {
      const newImpressions = prev.impression.includes(value)
        ? prev.impression.filter(item => item !== value)
        : [...prev.impression, value];
      return { ...prev, impression: newImpressions };
    });
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
      
      // Auto-fill flow parameters from new analysis
      if (response.data.qmax_report_json) {
        try {
          const qmaxData = JSON.parse(response.data.qmax_report_json);
          setUroflowForm(prev => ({
            ...prev,
            voidedVolume: qmaxData.Voided_Volume?.toFixed(2) || '',
            qmax: qmaxData.Qmax?.toFixed(2) || '',
            qavg: qmaxData.Qavg?.toFixed(2) || '',
            flowTime: qmaxData.Voiding_Time?.toFixed(2) || '',
            timeToQmax: qmaxData.Time_to_Qmax?.toFixed(2) || '',
          }));
        } catch (e) {
          console.error('Error parsing Qmax data:', e);
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to run analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedEntry) {
      setError('Please select a patient entry first');
      return;
    }

    setReportGenerating(true);
    setError('');
    setSuccess('');

    try {
      // Prepare data for Groq API
      const patientData = {
        name: uroflowForm.patientName || selectedEntry.patient_name || 'Not provided',
        age: uroflowForm.patientAge,
        sex: uroflowForm.patientSex,
        date: uroflowForm.patientDate,
        uhid: uroflowForm.patientUHID,
      };

      const flowData = {
        voidedVolume: uroflowForm.voidedVolume,
        qmax: uroflowForm.qmax,
        qavg: uroflowForm.qavg,
        flowTime: uroflowForm.flowTime,
        timeToQmax: uroflowForm.timeToQmax,
      };

      const clinicalObservations = {
        flowPattern: uroflowForm.flowPattern,
        streamPattern: uroflowForm.streamPattern,
        initiation: uroflowForm.initiation,
        straining: uroflowForm.straining,
        meatalAbnormality: uroflowForm.meatalAbnormality,
        interpretation: uroflowForm.interpretation,
        impression: uroflowForm.impression.join(', '),
        indication: [...uroflowForm.indication, uroflowForm.otherIndication ? `Other: ${uroflowForm.otherIndication}` : ''].filter(Boolean).join(', '),
        recommendations: uroflowForm.recommendations,
      };

      // Call Groq API
      const reportText = await groqAPI.generateReport(patientData, flowData, clinicalObservations);
      setReportContent(reportText);
      
      // Generate filename
      const fileName = `Uroflowmetry_Report_${patientData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
      setReportFileName(fileName);
      
      setSuccess('Report generated successfully!');
    } catch (err) {
      setError('Failed to generate report with AI. Using fallback template...');
      generateFallbackReport();
    } finally {
      setReportGenerating(false);
    }
  };

  const generateFallbackReport = () => {
    // Fallback template generation
    const report = `# VIDEO UROFLOWMETRY 

## Patient Details

Name: ${uroflowForm.patientName || selectedEntry.patient_name || '________________'} Age/Sex: ${uroflowForm.patientAge || '__'}/${uroflowForm.patientSex || '__'} Date: ${uroflowForm.patientDate}

UHID / Hospital No.: ${uroflowForm.patientUHID || '________________'}

## Indication

${['LUTS', 'Suspected obstruction', 'Dysfunctional voiding', 'Follow‑up'].map(item => 
  `${uroflowForm.indication.includes(item) ? '☐✓' : '☐_'} ${item}`
).join(' ')}
${uroflowForm.otherIndication ? `☐ Other: ${uroflowForm.otherIndication}` : '☐ Other: ________'}

## Method

Video uroflowmetry performed with synchronized flow curve + stream video in natural voiding position.

## Flow Parameters

Voided Volume: ${uroflowForm.voidedVolume || '______'} mL Qmax: ${uroflowForm.qmax || '______'} mL/s Qavg: ${uroflowForm.qavg || '______'} mL/s

Flow Time: ${uroflowForm.flowTime || '______'} s Time to Qmax: ${uroflowForm.timeToQmax || '______'} s

## Flow Curve Pattern

${['Normal bell‑shaped', 'Plateau', 'Staccato', 'Interrupted', 'Tower', 'Low amplitude'].map(item =>
  `${uroflowForm.flowPattern === item ? '☐✓' : '☐_'} ${item}`
).join(' ')}

## Video Stream Assessment

Stream: ${['Normal', 'Thin', 'Splayed', 'Intermittent', 'Dribbling', 'Spraying'].map(item =>
  `${uroflowForm.streamPattern === item ? '☐✓' : '☐_'} ${item}`
).join(' ')}

Initiation: ${['Smooth', 'Hesitant'].map(item =>
  `${uroflowForm.initiation === item ? '☐✓' : '☐_'} ${item}`
).join(' ')} Straining: ${uroflowForm.straining ? '☐✓ Yes ☐_ No' : '☐_ Yes ☐✓ No'}

Meatal abnormality: ${['Suspected', 'Not seen'].map(item =>
  `${uroflowForm.meatalAbnormality === item ? '☐✓' : '☐_'} ${item}`
).join(' ')}

## Combined Interpretation(visual + video analysis)

${uroflowForm.interpretation || 'Flow pattern correlates with visual stream pattern'}

## Impression

${['Normal voiding', 'Bladder outlet obstruction', 'Dysfunctional voiding', 'Meatal stenosis', 'Detrusor underactivity', 'Inconclusive (VV < 50 mL)'].map(item =>
  `${uroflowForm.impression.includes(item) ? '☐✓' : '☐_'} ${item}`
).join(' ')}

## Recommendations

${uroflowForm.recommendations || '________________________________________________________________'}

Generated on: ${new Date().toLocaleDateString()}
Doctor: Dr. ${profile?.user?.username || ''}
`;

    setReportContent(report);
    const fileName = `Uroflowmetry_Report_${uroflowForm.patientName || 'Patient'}_${new Date().toISOString().split('T')[0]}.docx`;
    setReportFileName(fileName);
    setSuccess('Report generated successfully!');
  };

  const downloadReport = () => {
    if (!reportContent) {
      setError('No report content to download');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([reportContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = reportFileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setSuccess('Report downloaded!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const saveReportToServer = async () => {
    if (!reportContent || !selectedEntry) {
      setError('No report content to save');
      return;
    }

    try {
      // Convert report to base64 for storage
      const reportBase64 = btoa(unescape(encodeURIComponent(reportContent)));
      
      await reportAPI.create({
        entry_id: selectedEntry.id,
        report_type: 'uroflowmetry',
        title: `Video Uroflowmetry Report - ${uroflowForm.patientName || 'Patient'}`,
        description: `Video uroflowmetry analysis with Qmax: ${uroflowForm.qmax} mL/s, Voided Volume: ${uroflowForm.voidedVolume} mL`,
        report_url: `data:text/plain;base64,${reportBase64}`,
      });
      
      setSuccess('Report saved to server!');
      setShowUroflowModal(false);
      
      // Refresh reports list
      const response = await reportAPI.getForEntry(selectedEntry.id);
      setReports(response.data);
      
      // Reset form
      setUroflowForm({
        patientName: '',
        patientAge: '',
        patientSex: '',
        patientDate: new Date().toLocaleDateString('en-CA'),
        patientUHID: '',
        indication: [],
        otherIndication: '',
        voidedVolume: '',
        qmax: '',
        qavg: '',
        flowTime: '',
        timeToQmax: '',
        flowPattern: '',
        streamPattern: '',
        initiation: '',
        straining: false,
        meatalAbnormality: '',
        interpretation: '',
        impression: [],
        recommendations: '',
      });
      
      setReportContent('');
      setReportFileName('');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save report to server');
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
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowUroflowModal(true)}
                          className="px-4 py-2 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-lg hover:shadow-md transition-all duration-300 font-medium"
                        >
                          📊 Generate Uroflowmetry Report
                        </button>
                        <button
                          onClick={() => setShowReportModal(true)}
                          className="px-4 py-2 bg-[rgb(193,218,216)] text-gray-900 rounded-lg hover:bg-[rgb(175,205,203)] transition-colors duration-300 font-medium"
                        >
                          + Add Report
                        </button>
                      </div>
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
                                  report.report_type === 'uroflowmetry' ? 'bg-blue-100 text-blue-700' :
                                  report.report_type === 'diagnosis' ? 'bg-blue-100 text-blue-700' :
                                  report.report_type === 'prescription' ? 'bg-green-100 text-green-700' :
                                  report.report_type === 'lab_results' ? 'bg-purple-100 text-purple-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {report.report_type === 'uroflowmetry' ? 'Video Uroflowmetry' : report.report_type}
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

      {/* Video Uroflowmetry Report Modal */}
      {showUroflowModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Video Uroflowmetry Report</h2>
                <button
                  onClick={() => {
                    setShowUroflowModal(false);
                    setReportContent('');
                    setReportFileName('');
                  }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-300"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">Fill in the details below to generate a comprehensive uroflowmetry report</p>
            </div>
            
            <form className="p-6 space-y-8">
              {/* Patient Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Patient Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={uroflowForm.patientName}
                      onChange={(e) => handleUroflowFormChange('patientName', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age / Sex *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={uroflowForm.patientAge}
                        onChange={(e) => handleUroflowFormChange('patientAge', e.target.value)}
                        required
                        className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                        placeholder="Age"
                      />
                      <select
                        value={uroflowForm.patientSex}
                        onChange={(e) => handleUroflowFormChange('patientSex', e.target.value)}
                        required
                        className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="date"
                        value={uroflowForm.patientDate}
                        onChange={(e) => handleUroflowFormChange('patientDate', e.target.value)}
                        className="w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UHID / Hospital Number
                    </label>
                    <input
                      type="text"
                      value={uroflowForm.patientUHID}
                      onChange={(e) => handleUroflowFormChange('patientUHID', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="Enter UHID or Hospital Number"
                    />
                  </div>
                </div>
              </div>

              {/* Indication Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Indication</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['LUTS', 'Suspected obstruction', 'Dysfunctional voiding', 'Follow‑up'].map((item) => (
                    <label key={item} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uroflowForm.indication.includes(item)}
                        onChange={() => handleIndicationChange(item)}
                        className="w-4 h-4 text-[rgb(193,218,216)] rounded focus:ring-[rgb(193,218,216)]"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Indication
                  </label>
                  <input
                    type="text"
                    value={uroflowForm.otherIndication}
                    onChange={(e) => handleUroflowFormChange('otherIndication', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                    placeholder="Specify other indication"
                  />
                </div>
              </div>

              {/* Flow Parameters Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Flow Parameters</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voided Volume (mL)
                    </label>
                    <input
                      type="number"
                      value={uroflowForm.voidedVolume}
                      onChange={(e) => handleUroflowFormChange('voidedVolume', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="mL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qmax (mL/s)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={uroflowForm.qmax}
                      onChange={(e) => handleUroflowFormChange('qmax', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="mL/s"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Qavg (mL/s)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={uroflowForm.qavg}
                      onChange={(e) => handleUroflowFormChange('qavg', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="mL/s"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flow Time (s)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={uroflowForm.flowTime}
                      onChange={(e) => handleUroflowFormChange('flowTime', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="seconds"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time to Qmax (s)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={uroflowForm.timeToQmax}
                      onChange={(e) => handleUroflowFormChange('timeToQmax', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300"
                      placeholder="seconds"
                    />
                  </div>
                </div>
              </div>

              {/* Flow Curve Pattern */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Flow Curve Pattern</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Normal bell‑shaped', 'Plateau', 'Staccato', 'Interrupted', 'Tower', 'Low amplitude'].map((pattern) => (
                    <label key={pattern} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input
                        type="radio"
                        name="flowPattern"
                        checked={uroflowForm.flowPattern === pattern}
                        onChange={() => handleUroflowFormChange('flowPattern', pattern)}
                        className="w-4 h-4 text-[rgb(193,218,216)]"
                      />
                      <span className="text-sm text-gray-700">{pattern}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Video Stream Assessment */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Video Stream Assessment</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Stream Pattern</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Normal', 'Thin', 'Splayed', 'Intermittent', 'Dribbling', 'Spraying'].map((pattern) => (
                      <label key={pattern} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <input
                          type="radio"
                          name="streamPattern"
                          checked={uroflowForm.streamPattern === pattern}
                          onChange={() => handleUroflowFormChange('streamPattern', pattern)}
                          className="w-4 h-4 text-[rgb(193,218,216)]"
                        />
                        <span className="text-sm text-gray-700">{pattern}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Initiation</label>
                    <div className="space-y-2">
                      {['Smooth', 'Hesitant'].map((item) => (
                        <label key={item} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="initiation"
                            checked={uroflowForm.initiation === item}
                            onChange={() => handleUroflowFormChange('initiation', item)}
                            className="w-4 h-4 text-[rgb(193,218,216)]"
                          />
                          <span className="text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Straining</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={uroflowForm.straining}
                          onChange={(e) => handleUroflowFormChange('straining', e.target.checked)}
                          className="w-4 h-4 text-[rgb(193,218,216)] rounded"
                        />
                        <span className="text-sm text-gray-700">Yes</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Meatal Abnormality</label>
                    <div className="space-y-2">
                      {['Suspected', 'Not seen'].map((item) => (
                        <label key={item} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="meatalAbnormality"
                            checked={uroflowForm.meatalAbnormality === item}
                            onChange={() => handleUroflowFormChange('meatalAbnormality', item)}
                            className="w-4 h-4 text-[rgb(193,218,216)]"
                          />
                          <span className="text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Combined Interpretation */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Combined Interpretation</h3>
                <textarea
                  value={uroflowForm.interpretation}
                  onChange={(e) => handleUroflowFormChange('interpretation', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Enter your interpretation based on visual + video analysis..."
                />
              </div>

              {/* Impression */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Impression</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Normal voiding', 'Bladder outlet obstruction', 'Dysfunctional voiding', 'Meatal stenosis', 'Detrusor underactivity', 'Inconclusive (VV < 50 mL)'].map((item) => (
                    <label key={item} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uroflowForm.impression.includes(item)}
                        onChange={() => handleImpressionChange(item)}
                        className="w-4 h-4 text-[rgb(193,218,216)] rounded focus:ring-[rgb(193,218,216)]"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Recommendations</h3>
                <textarea
                  value={uroflowForm.recommendations}
                  onChange={(e) => handleUroflowFormChange('recommendations', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[rgb(193,218,216)] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Enter your recommendations..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUroflowModal(false);
                    setReportContent('');
                    setReportFileName('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={generateReport}
                  disabled={reportGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-md transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reportGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Report'
                  )}
                </button>
                
                {reportContent && (
                  <>
                    <button
                      type="button"
                      onClick={downloadReport}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-md transition-all duration-300 font-medium"
                    >
                      Download Report
                    </button>
                    
                    <button
                      type="button"
                      onClick={saveReportToServer}
                      className="px-6 py-3 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 text-gray-900 rounded-xl hover:shadow-md transition-all duration-300 font-medium"
                    >
                      Save to Patient Record
                    </button>
                  </>
                )}
              </div>
              
              {/* Preview Section */}
              {reportContent && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Report Preview</h3>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {reportContent}
                    </pre>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

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
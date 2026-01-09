import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import urineImg from '../assets/urine.png';


const Home = () => {
  const { isAuthenticated, isDoctor, isPatient } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [stats, setStats] = useState({ doctors: 0, patients: 0, uptime: 0, support: 24 });
  const [textIndex, setTextIndex] = useState(0);
  const fullText = "Precision Care, Digital Excellence";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setImageLoaded(true), 100);

    // Typer effect
    if (textIndex < fullText.length) {
      const typeTimer = setTimeout(() => {
        setTypedText((prev) => prev + fullText.charAt(textIndex));
        setTextIndex((prev) => prev + 1);
      }, 50);
      return () => {
        clearTimeout(timer);
        clearTimeout(typeTimer);
      };
    }

    // Stats counter animation
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        doctors: prev.doctors < 500 ? prev.doctors + 10 : 500,
        patients: prev.patients < 10000 ? prev.patients + 200 : 10000,
        uptime: prev.uptime < 99.9 ? Number((prev.uptime + 2.5).toFixed(1)) : 99.9,
        support: 24
      }));
    }, 20);

    return () => {
      clearTimeout(timer);
      clearInterval(statsInterval);
    };
  }, [textIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-x-hidden">
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        .animate-scan {
          animation: scan 3s linear infinite;
          background: linear-gradient(to bottom, transparent, rgba(52, 211, 153, 0.5), transparent);
          box-shadow: 0 0 15px rgba(52, 211, 153, 0.5);
        }

        .cursor-blink {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Hero Section with Medical Background */}
      <section className="relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-8 animate-fade-in-up">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium tracking-wide">AI-POWERED DIAGNOSTICS</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                <span className="block mb-2">Uroflow Computer</span>
                <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  Vision Analysis System
                </span>
              </h1>

              <div className="h-8 mb-8">
                <p className="text-xl text-gray-400 font-mono">
                  {typedText}<span className="cursor-blink">|</span>
                </p>
              </div>

              <p className="text-lg text-gray-400 mb-10 leading-relaxed font-light max-w-xl">
                Advanced multi-view stream segmentation with ROI locking and geometric filtering for precise urinary flow assessment.
              </p>

              {!isAuthenticated ? (
                <div className="flex flex-col gap-3 mt-8">
                  <Link
                    to="/signin"
                    className="group relative w-fit px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 rounded-lg transition-all duration-300 font-bold text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out skew-x-12"></div>
                    <span className="relative flex items-center justify-center gap-2">
                      Professional Sign In
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/signup/doctor"
                      className="px-6 py-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:border-emerald-500/50 hover:text-white transition-all duration-300 text-center"
                    >
                      For Doctors
                    </Link>

                    <Link
                      to="/signup/patient"
                      className="px-6 py-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg hover:border-emerald-500/50 hover:text-white transition-all duration-300 text-center"
                    >
                      For Patients
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6 mt-8">
                  {isDoctor && (
                    <Link
                      to="/doctor/dashboard"
                      className="group relative w-fit px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 rounded-lg transition-all duration-300 font-bold text-lg"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        <span>📊</span> View Clinical Dashboard
                      </span>
                    </Link>
                  )}
                  {isPatient && (
                    <Link
                      to="/patient/dashboard"
                      className="group relative w-fit px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-900 rounded-lg transition-all duration-300 font-bold text-lg"
                    >
                      <span className="relative flex items-center justify-center gap-2">
                        <span>🏥</span> Access Patient Portal
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Image - CV Demo */}
            <div className="relative lg:block hidden">
              <div className="relative group">
                {/* Tech Frame */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>

                <div className="relative bg-black rounded-2xl p-2 border border-emerald-500/30 shadow-2xl animate-float">
                  {/* CV Overlay UI */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-2 py-1 bg-red-500/80 text-white text-xs font-mono rounded">REC</span>
                    <span className="px-2 py-1 bg-black/50 text-emerald-400 text-xs font-mono border border-emerald-500/30 rounded">FPS: 60</span>
                  </div>

                  {/* ROI Box Overlay */}
                  <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] border-2 border-emerald-500/30 z-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-emerald-500"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-emerald-500"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-emerald-500"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-emerald-500"></div>

                    {/* Scanning Line */}
                    <div className="absolute left-0 right-0 h-1 bg-emerald-400/50 animate-scan"></div>
                  </div>

                  <img
                    src={urineImg}
                    alt="CV Analysis"
                    className={`w-[500px] h-auto rounded-xl opacity-80 ${imageLoaded ? 'transition-opacity duration-1000' : 'opacity-0'}`}
                    style={{ filter: 'contrast(1.2) brightness(0.8)' }}
                  />

                  {/* Data Overlay */}
                  <div className="absolute bottom-4 right-4 z-20 text-right font-mono text-xs text-emerald-400 bg-black/70 p-2 rounded border border-emerald-500/30">
                    <div>CONFIDENCE: 98.4%</div>
                    <div>SEGMENT: LOCKED</div>
                    <div>FLOW: ANALYZING</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-emerald-900/30 bg-black/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Clinical Accuracy', value: '99.9%', icon: '🎯' },
                { label: 'Patients Analyzed', value: `${stats.patients.toLocaleString()}+`, icon: '👥' },
                { label: 'Uptime SLA', value: `${stats.uptime}%`, icon: '⚡' },
                { label: 'Processing Time', value: '<50ms', icon: '⏱️' }
              ].map((stat, i) => (
                <div key={i} className="text-center group hover:bg-emerald-900/10 p-4 rounded-xl transition-colors">
                  <div className="text-3xl font-bold text-white mb-1 font-mono group-hover:text-emerald-400 transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Next-Gen <span className="text-emerald-400">Diagnostics</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powered by state-of-the-art computer vision algorithms for non-invasive urological assessment.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "Advanced CV Engine",
                desc: "Multi-view stream segmentation with ROI locking and geometric filters.",
                icon: "🎥"
              },
              {
                title: "Real-time Visualization",
                desc: "Instant processing of video feeds with live metric extraction and overlays.",
                icon: "⚡"
              },
              {
                title: "Clinical Reporting",
                desc: "Automated generation of medical-grade reports with trend analysis.",
                icon: "📊"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 bg-black/50 border border-emerald-900/30 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all duration-300">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Computer Vision Engine Details */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🎥</span>
                <h3 className="text-3xl font-bold text-white">Computer Vision Engine</h3>
                <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">OpenCV + NumPy</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/40 p-6 rounded-xl border border-emerald-900/30">
                  <h4 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <span>📐</span> Calibration & Preprocessing
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Auto-detects physical reference (26cm blue line)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Frame extraction and ROI detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Background subtraction (MOG2 algorithm)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-xl border border-emerald-900/30">
                  <h4 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <span>🔍</span> Segmentation Pipeline
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>ROI locking and tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Width-based gating (removes hands/body)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Geometric filtering (aspect ratio)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Vertical dilation (connects fragments)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-xl border border-emerald-900/30">
                  <h4 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <span>🎯</span> Ensemble Analysis
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Multi-view fusion with confidence weighting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Flow estimation and velocity tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Volume normalization algorithms</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-xl border border-emerald-900/30">
                  <h4 className="text-lg font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <span>📹</span> Visualization Output
                  </h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Annotated video generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Real-time stream overlay rendering</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">▸</span>
                      <span>Frame-by-frame analysis export</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Stream Segmentation */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-teal-900/20 to-cyan-900/20 border border-teal-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🎯</span>
                <h3 className="text-3xl font-bold text-white">Advanced Stream Segmentation</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "ROI Locking", desc: "Automatically locks onto the urine stream position and tracks it throughout the video", icon: "🔒" },
                  { title: "Width-Based Gating", desc: "Removes thick objects (hands, body parts) while preserving the thin stream", icon: "📏" },
                  { title: "Geometric Filtering", desc: "Uses aspect ratio analysis to distinguish stream from background artifacts", icon: "📐" },
                  { title: "Vertical Dilation", desc: "Connects broken stream fragments for continuous detection", icon: "🔗" },
                  { title: "Multi-View Support", desc: "Combines top and side camera views with confidence weighting", icon: "📹" },
                  { title: "Adaptive Thresholding", desc: "Dynamically adjusts sensitivity based on lighting conditions", icon: "💡" }
                ].map((item, i) => (
                  <div key={i} className="bg-black/40 p-5 rounded-xl border border-teal-900/30 hover:border-teal-500/50 transition-all group">
                    <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="text-lg font-bold text-teal-400 mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clinical Metrics */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📊</span>
                <h3 className="text-3xl font-bold text-white">Clinical Metrics</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { metric: "Qmax", desc: "Peak flow rate measurement", unit: "ml/s", icon: "📈" },
                  { metric: "Average Flow", desc: "Mean flow throughout voiding", unit: "ml/s", icon: "📊" },
                  { metric: "Flow Time", desc: "Duration of actual urine flow", unit: "seconds", icon: "⏱️" },
                  { metric: "Voiding Time", desc: "Total time from start to finish", unit: "seconds", icon: "⏰" },
                  { metric: "Time to Qmax", desc: "Time taken to reach peak flow", unit: "seconds", icon: "⚡" },
                  { metric: "Hesitancy", desc: "Identifies delayed stream initiation", unit: "boolean", icon: "🔍" },
                  { metric: "Volume", desc: "Adjusts flow curve to match measured volume", unit: "ml", icon: "💧" },
                  { metric: "Confidence", desc: "Detection accuracy score", unit: "%", icon: "✓" }
                ].map((item, i) => (
                  <div key={i} className="bg-black/40 p-5 rounded-xl border border-blue-900/30 hover:border-blue-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30">{item.unit}</span>
                    </div>
                    <h4 className="text-lg font-bold text-blue-400 mb-2">{item.metric}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reporting & Visualization */}
          <div>
            <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📈</span>
                <h3 className="text-3xl font-bold text-white">Reporting & Visualization</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/40 p-6 rounded-xl border border-purple-900/30">
                  <h4 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span>📄</span> Clinical Reports
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Clinical-grade dual-panel reports</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Interactive flow curve visualization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>JSON-formatted metric summaries</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black/40 p-6 rounded-xl border border-purple-900/30">
                  <h4 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <span>📊</span> Data Export
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Frame-by-frame analysis data (CSV export)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Annotated video playback with stream overlay</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-purple-500 mt-1">✓</span>
                      <span>Trend analysis and historical comparisons</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
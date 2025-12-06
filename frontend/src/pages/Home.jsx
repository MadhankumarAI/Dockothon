import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, isDoctor, isPatient } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section with Medical Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Subtle medical pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '300px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            {/* Medical Badge Logo */}
            <div className="relative inline-block mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 rounded-full blur-2xl opacity-70"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-2xl border-8 border-white">
                <div className="w-24 h-24 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-200 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-4xl">⚕️</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
              <span className="block">Precision Care,</span>
              <span className="block bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 bg-clip-text text-transparent">
                Digital Excellence
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              A certified healthcare platform connecting patients with elite medical professionals. 
              Secure, efficient, and patient-centered digital healthcare solutions.
            </p>
            
            {/* Status Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-10 border border-white/20">
              <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-white font-medium">24/7 Medical Support Available</span>
            </div>
            
            {!isAuthenticated ? (
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <Link 
                  to="/signin" 
                  className="group relative px-10 py-4 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-400 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <span className="relative">Professional Sign In</span>
                </Link>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/signup/doctor" 
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-[rgb(193,218,216)]/50 rounded-xl hover:bg-white/20 hover:border-[rgb(193,218,216)] transform hover:-translate-y-1 transition-all duration-300 font-semibold text-lg group"
                  >
                    <span className="flex items-center justify-center">
                      👨‍⚕️ 
                      <span className="ml-2">For Doctors</span>
                    </span>
                    <div className="text-xs font-normal mt-1 text-gray-300">Join our elite network</div>
                  </Link>
                  
                  <Link 
                    to="/signup/patient" 
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-emerald-400/50 rounded-xl hover:bg-white/20 hover:border-emerald-400 transform hover:-translate-y-1 transition-all duration-300 font-semibold text-lg group"
                  >
                    <span className="flex items-center justify-center">
                      👤
                      <span className="ml-2">For Patients</span>
                    </span>
                    <div className="text-xs font-normal mt-1 text-gray-300">Begin your health journey</div>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                {isDoctor && (
                  <Link 
                    to="/doctor/dashboard" 
                    className="group relative px-10 py-4 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-400 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      <span className="mr-2">📊</span>
                      Medical Dashboard
                    </span>
                  </Link>
                )}
                {isPatient && (
                  <>
                    <Link 
                      to="/patient/dashboard" 
                      className="group relative px-10 py-4 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-400 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center">
                        <span className="mr-2">🏥</span>
                        Patient Portal
                      </span>
                    </Link>
                    <Link 
                      to="/doctors" 
                      className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-[rgb(193,218,216)]/50 rounded-xl hover:bg-white/20 hover:border-[rgb(193,218,216)] transform hover:-translate-y-1 transition-all duration-300 font-semibold text-lg"
                    >
                      <span className="flex items-center justify-center">
                        🔍
                        <span className="ml-2">Find Specialists</span>
                      </span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-gray-400 text-sm">Certified Doctors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-gray-400 text-sm">Patients Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime SLA</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400 text-sm">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-[rgb(193,218,216)]/20 text-[rgb(193,218,216)] rounded-full text-sm font-semibold mb-4">
              PLATFORM FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Enterprise-Grade <span className="text-[rgb(193,218,216)]">Healthcare</span> Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with security, precision, and patient care at its core
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {/* Feature Card 1 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-[rgb(193,218,216)]/50">
              <div className="absolute -top-6 left-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Board-Certified Network</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access to verified medical specialists across 50+ specialties. 
                All practitioners are vetted and continuously monitored for quality assurance.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  Verified credentials & licenses
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  Peer-reviewed specialists
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  Continuous education tracking
                </li>
              </ul>
            </div>
            
            {/* Feature Card 2 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-[rgb(193,218,216)]/50">
              <div className="absolute -top-6 left-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Military-Grade Security</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                HIPAA, GDPR, and SOC 2 compliant infrastructure with end-to-end encryption 
                and multi-factor authentication for ultimate data protection.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  AES-256 bit encryption
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  Zero-knowledge architecture
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  Regular security audits
                </li>
              </ul>
            </div>
            
            {/* Feature Card 3 */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-100 hover:border-[rgb(193,218,216)]/50">
              <div className="absolute -top-6 left-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[rgb(193,218,216)] to-emerald-300 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Real-time Collaboration</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Seamless doctor-patient communication with instant messaging, 
                video consultations, and shared medical record access.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  HD video consultations
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  Secure file sharing
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[rgb(193,218,216)] rounded-full mr-3"></div>
                  Appointment scheduling
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-gradient-to-r from-[rgb(193,218,216)]/10 to-emerald-50 rounded-2xl p-8 border border-[rgb(193,218,216)]/30">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Certified & Compliant</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['HIPAA', 'GDPR', 'SOC 2', 'ISO 27001'].map((cert) => (
                <div key={cert} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-bold text-gray-900">{cert}</div>
                  <div className="text-sm text-gray-600 mt-1">Compliant</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-300 rounded-full mb-6 shadow-lg">
            <span className="text-gray-900 font-bold">READY TO TRANSFORM CARE?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Join the Future of <span className="text-[rgb(193,218,216)]">Digital Healthcare</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Thousands of medical professionals trust Dockothon for secure, efficient, 
            and compliant healthcare delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to={isAuthenticated ? (isDoctor ? "/doctor/dashboard" : "/patient/dashboard") : "/signup/patient"}
              className="group relative px-12 py-5 bg-gradient-to-r from-[rgb(193,218,216)] to-emerald-400 text-gray-900 rounded-xl hover:rounded-2xl transform hover:-translate-y-1 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative">Get Started Now →</span>
            </Link>
            
            <Link 
              to="/doctors"
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl hover:bg-white/20 hover:border-white transform hover:-translate-y-1 transition-all duration-300 font-semibold text-xl"
            >
              Meet Our Doctors
            </Link>
          </div>
          
          <div className="mt-12 text-gray-400 text-sm">
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
              No credit card required • Free 14-day trial for professionals
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
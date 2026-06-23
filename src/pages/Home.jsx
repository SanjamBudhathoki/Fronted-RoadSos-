import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

const Home = () => {
  const [activeEmergencies, setActiveEmergencies] = useState(0);
  const [nearbyProviders, setNearbyProviders] = useState(0);
  const [liveStats, setLiveStats] = useState({
    resolved: 534,
    responseTime: 4.2,
    activeUsers: 0,
    successRate: 99.8
  });

  // Simulate live counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveEmergencies(Math.floor(Math.random() * 5) + 1);
      setNearbyProviders(Math.floor(Math.random() * 20) + 10);
      setLiveStats(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 100) + 50,
        resolved: prev.resolved + Math.floor(Math.random() * 3)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* EMERGENCY BANNER */}
      <div className="bg-gradient-to-r from-red-900/50 via-red-800/30 to-gray-950 border-b border-red-500/20">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-300">{activeEmergencies} Active Emergencies</span>
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-green-400">🟢 {nearbyProviders} Providers Online</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-gray-400">
              <span>🚨 Emergency Hotline: 911</span>
              <span className="text-gray-600">|</span>
              <span>📱 SMS SOS: Send HELP to 911</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="container mx-auto px-6 py-24 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center relative">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-8 backdrop-blur-sm">
            <span className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
              <span className="text-yellow-400">★</span>
            </span>
            Trusted by 10,000+ Users | AI-Powered Response
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-red-100 to-white bg-clip-text text-transparent">
            AI-Powered Emergency
            <span className="block text-red-500 mt-2">When Every Second Counts</span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            RoadSOS leverages <span className="text-white font-semibold">artificial intelligence</span> to 
            instantly assess emergencies, dispatch the nearest responders, and provide 
            <span className="text-red-400"> real-time tracking</span> — even offline.
          </p>

          {/* Emergency Type Quick Select */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              🚗 Accident
            </span>
            <span className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm">
              🏥 Medical
            </span>
            <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
              🔥 Fire
            </span>
            <span className="px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm">
              🔧 Breakdown
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
              👮 Security
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link to="/user/dashbord">
              <Button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-semibold text-lg group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🚨</span>
                  Report Emergency
                  <span className="text-2xl animate-bounce">🚨</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Button>
            </Link>

            <Link to="/provider/dashbord">
              <Button className="bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                <span className="flex items-center gap-2">
                  🏥 Provider Portal
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>

          {/* Voice Command Hint */}
          <p className="mt-6 text-gray-500 text-sm">
            💡 Pro tip: Say <span className="text-red-400 font-mono">"Hey RoadSOS, emergency"</span> for hands-free activation
          </p>
        </div>
      </section>

      {/* LIVE STATS COUNTER */}
      <section className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-3xl font-bold text-red-500 group-hover:scale-110 transition-transform">
                {liveStats.responseTime}s
              </h3>
              <span className="text-green-400 text-sm animate-pulse">● LIVE</span>
            </div>
            <p className="text-gray-400">AI Response Time</p>
            <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-green-500 w-[95%] animate-pulse"></div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-500/30 transition-all duration-300 group">
            <h3 className="text-3xl font-bold text-red-500 group-hover:scale-110 transition-transform">
              {liveStats.resolved.toLocaleString()}+
            </h3>
            <p className="text-gray-400 mt-2">Emergencies Resolved</p>
            <p className="text-xs text-green-400 mt-1">↑ 12 this week</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-500/30 transition-all duration-300 group">
            <h3 className="text-3xl font-bold text-red-500 group-hover:scale-110 transition-transform">
              {liveStats.successRate}%
            </h3>
            <p className="text-gray-400 mt-2">Success Rate</p>
            <div className="mt-2 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-1 flex-1 bg-green-500 rounded-full"></div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-red-500/30 transition-all duration-300 group">
            <h3 className="text-3xl font-bold text-red-500 group-hover:scale-110 transition-transform">
              {liveStats.activeUsers}
            </h3>
            <p className="text-gray-400 mt-2">Active Users Now</p>
            <p className="text-xs text-blue-400 mt-1">📍 Across your area</p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS - ENHANCED */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <span className="text-red-400 text-sm font-semibold uppercase tracking-wider">Process</span>
          <h2 className="text-4xl font-bold mt-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI-Powered Emergency Response
          </h2>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            From detection to resolution in under 5 minutes with our intelligent dispatch system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500/50 via-red-500/20 to-red-500/50 -translate-y-1/2"></div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-red-500/30 transition-all duration-300 group relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-red-500/20">
              1
            </div>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
            <h3 className="font-semibold text-xl mb-2">AI Detection</h3>
            <p className="text-gray-400 mb-4">
              Voice, text, or automatic crash detection triggers instant AI assessment
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Voice command activation</li>
              <li>✓ Severity auto-assessment</li>
              <li>✓ Smart categorization</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-red-500/30 transition-all duration-300 group relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-red-500/20">
              2
            </div>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="font-semibold text-xl mb-2">Smart Dispatch</h3>
            <p className="text-gray-400 mb-4">
              AI matches emergency with nearest equipped providers in real-time
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Distance optimization</li>
              <li>✓ Equipment matching</li>
              <li>✓ Multi-provider coordination</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-red-500/30 transition-all duration-300 group relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-red-500/20">
              3
            </div>
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🛰️</div>
            <h3 className="font-semibold text-xl mb-2">Live Resolution</h3>
            <p className="text-gray-400 mb-4">
              Track response in AR view with real-time updates and ETA
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ AR navigation for responders</li>
              <li>✓ Real-time ETA updates</li>
              <li>✓ Automatic documentation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold text-white">End-to-End Encrypted</h4>
              <p className="text-gray-400 text-sm mt-1">Your data is secure</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📡</div>
              <h4 className="font-semibold text-white">Works Offline</h4>
              <p className="text-gray-400 text-sm mt-1">SMS fallback system</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌐</div>
              <h4 className="font-semibold text-white">Multi-Language</h4>
              <p className="text-gray-400 text-sm mt-1">10+ languages supported</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - ENHANCED */}
      <section className="container mx-auto px-6 pb-24">
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-3xl p-12 text-center relative overflow-hidden group">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
          </div>
          
          <div className="relative">
            <div className="text-6xl mb-6 animate-bounce">🆘</div>
            <h2 className="text-4xl font-bold mb-4">
              Emergency? Don't Wait.
            </h2>
            <p className="text-xl text-red-100 mb-3">
              AI-powered help arrives in under 5 minutes
            </p>
            <p className="text-red-200 mb-8">
              Our intelligent system has already saved {liveStats.resolved.toLocaleString()} lives
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/user/dashbord">
                <Button className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  🚨 SOS Emergency
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-red-800/50 text-white hover:bg-red-800 px-10 py-4 rounded-xl font-semibold border border-red-400/30 backdrop-blur-sm">
                  Create Account
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-red-200 text-sm">
              ⚡ Also available: Voice-activated SOS • Offline SMS alerts • AR navigation
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS GRID */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎙️</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Voice-Activated SOS</h3>
                <p className="text-gray-400">Just say "Hey RoadSOS" to trigger emergency response hands-free. Perfect for accident scenarios.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🧠</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AI Severity Assessment</h3>
                <p className="text-gray-400">Our AI analyzes your emergency description to prioritize critical cases and dispatch appropriate help.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📡</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Offline Emergency Mode</h3>
                <p className="text-gray-400">No internet? No problem. Automatic SMS fallback ensures help reaches you anywhere.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-start gap-4">
              <div className="text-4xl">👁️</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">AR Responder Navigation</h3>
                <p className="text-gray-400">Providers see augmented reality directions to reach you faster, even in complex locations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
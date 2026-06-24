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
    <div className="min-h-screen bg-white">
      
      {/* EMERGENCY BANNER - Clean light version */}
      <div className="bg-linear-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-gray-700 font-medium">
                  <span className="text-red-600 font-bold">{activeEmergencies}</span> Active
                </span>
              </span>
              <span className="w-px h-4 bg-gray-200"></span>
              <span className="text-gray-600 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="font-medium">{nearbyProviders}</span> Online
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Nepal Police : 100
              </span>
              <span className="w-px h-4 bg-gray-200"></span>
              <span>SMS: HELP to 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO - Sophisticated light theme */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-gray-50/50 to-white pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              AI-Powered Emergency
              <span className="block mt-3 bg-linear-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                When Every Second Counts
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              RoadSOS leverages <span className="text-gray-900 font-semibold">artificial intelligence</span> to 
              instantly assess emergencies, dispatch the nearest responders, and provide 
              <span className="text-red-600 font-medium"> real-time tracking</span> — even offline.
            </p>

            {/* Emergency Type Quick Select - Using Button variants */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button variant="ghost" size="sm" className="rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Accident
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full border border-gray-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Medical
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full border border-gray-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                Fire
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full border border-gray-200 hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Breakdown
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full border border-gray-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Security
              </Button>
            </div>

            {/* CTA Buttons - Using SOS variant for emergency */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 mb-10">
              <Link to="/user/dashbord">
                <Button 
                  variant="sos" 
                  size="xl" 
                  className="rounded-2xl shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  }
                >
                  Report Emergency
                </Button>
              </Link>

              <Link to="/provider/dashbord">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="rounded-2xl"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  }
                >
                  Provider Portal
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE STATS - Floating cards design */}
      <section className="relative -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                  {liveStats.responseTime}
                  <span className="text-lg text-gray-400 font-normal ml-0.5">s</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  LIVE
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Response Time</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-red-500 to-emerald-500 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {liveStats.resolved.toLocaleString()}
                <span className="text-lg text-gray-400 font-normal">+</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Resolved</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +12 this week
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {liveStats.successRate}
                <span className="text-lg text-gray-400 font-normal">%</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Success Rate</p>
              <div className="mt-3 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-2 flex-1 bg-emerald-500 rounded-full opacity-80"></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {liveStats.activeUsers}
              </div>
              <p className="text-sm text-gray-500 font-medium">Active Now</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                In your area
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Refined steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-16 lg:mb-20">
          <span className="text-sm font-bold text-red-600 uppercase tracking-widest">Process</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 tracking-tight">
            Emergency Response in
            <span className="text-red-600"> Seconds</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            From detection to resolution in under 5 minutes with intelligent dispatch
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          
          <div className="group">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-linear-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Step 1</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">AI Detection</h3>
              <p className="text-gray-600 mb-5 leading-relaxed">
                Voice, text, or automatic crash detection triggers instant AI assessment and categorization.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['Voice command activation', 'Severity assessment', 'Smart categorization'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-linear-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Step 2</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">Smart Dispatch</h3>
              <p className="text-gray-600 mb-5 leading-relaxed">
                AI matches your emergency with the nearest available and equipped providers.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['Distance optimization', 'Equipment matching', 'Multi-unit coordination'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="group">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-linear-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Step 3</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">Live Resolution</h3>
              <p className="text-gray-600 mb-5 leading-relaxed">
                Track response in real-time with AR navigation and automatic documentation.
              </p>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {['AR navigation', 'Real-time ETA', 'Auto documentation'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS - Clean bar */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "End-to-End Encrypted",
                description: "Enterprise-grade security for all your data"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                  </svg>
                ),
                title: "Works Offline",
                description: "SMS fallback ensures help anywhere, anytime"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "English Language",
                description: "Supports Universal language"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mx-auto mb-5 hover:shadow-md transition-shadow duration-300">
                  <div className="text-gray-700">{item.icon}</div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Dark section for contrast */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="bg-gray-900 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{backgroundImage: 'radial-linear(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
          </div>
          
          <div className="relative text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Emergency? Don't Wait.
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              AI-powered help arrives in under 5 minutes. We've already saved{' '}
              <span className="text-white font-bold">{liveStats.resolved.toLocaleString()}</span> lives.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/user/dashbord">
                <Button 
                  variant="sos" 
                  size="xl" 
                  className="rounded-2xl"
                  fullWidth
                >
                  SOS Emergency
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="glass" 
                  size="xl" 
                  className="rounded-2xl"
                  fullWidth
                >
                  Create Account
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Voice-activated SOS • Offline SMS • AR navigation
            </p>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS - Clean grid */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                ),
                title: "Voice-Activated SOS",
                description: "Trigger emergency response hands-free. Just say 'Hey RoadSOS' — perfect for accident scenarios."
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "AI Severity Assessment",
                description: "Our AI instantly analyzes emergencies to prioritize critical cases and dispatch appropriate help."
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
                  </svg>
                ),
                title: "Offline Emergency Mode",
                description: "No internet? Automatic SMS fallback ensures help reaches you anywhere, anytime."
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                title: "AR Responder Navigation",
                description: "Providers get augmented reality directions to reach you faster in complex locations."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-linear-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
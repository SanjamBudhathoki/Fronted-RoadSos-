import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";

const Home = () => {
  const [liveStats, setLiveStats] = useState({
    resolved: 534,
    responseTime: 4.2,
    activeUsers: 0,
    successRate: 99.8
  });

  // Simulate live counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 100) + 50,
        resolved: prev.resolved + Math.floor(Math.random() * 3)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              AI-Powered Emergency
              <span className="block mt-3 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Response System
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              RoadSOS leverages <span className="text-gray-900 font-semibold">artificial intelligence</span> to 
              instantly assess emergencies, dispatch the nearest responders, and provide 
              <span className="text-red-600 font-medium"> real-time tracking</span> — even offline.
            </p>

            {/* Emergency Type Quick Select */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: '⚡', label: 'Accident', color: 'red' },
                { icon: '❤️', label: 'Medical', color: 'orange' },
                { icon: '🔥', label: 'Fire', color: 'blue' },
                { icon: '🔧', label: 'Breakdown', color: 'yellow' },
                { icon: '🛡️', label: 'Security', color: 'purple' }
              ].map((type, idx) => (
                <Button 
                  key={idx}
                  variant="ghost" 
                  size="sm" 
                  className={`rounded-full border border-gray-200 hover:border-${type.color}-200 hover:bg-${type.color}-50 hover:text-${type.color}-600 transition-all`}
                >
                  <span className="text-lg">{type.icon}</span>
                  {type.label}
                </Button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
              <Link to="/user/dashbord">
                <Button 
                  variant="sos" 
                  size="xl" 
                  className="rounded-2xl shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300 transition-all"
                >
                  🚨 Report Emergency
                </Button>
              </Link>

              <Link to="/provider/dashbord">
                <Button 
                  variant="secondary" 
                  size="xl" 
                  className="rounded-2xl transition-all"
                >
                  Provider Portal →
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE STATS SECTION */}
      <section className="relative -mt-8 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            
            <Card className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
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
                <div className="h-full bg-gradient-to-r from-red-500 to-emerald-500 rounded-full" style={{width: '94%'}}></div>
              </div>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {liveStats.resolved.toLocaleString()}
                <span className="text-lg text-gray-400 font-normal">+</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Emergencies Resolved</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                +12 this week
              </div>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
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
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                {liveStats.activeUsers}
              </div>
              <p className="text-sm text-gray-500 font-medium">Active Now</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                In your area
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
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
          
          {[
            {
              step: 1,
              title: "AI Detection",
              description: "Voice, text, or automatic crash detection triggers instant assessment.",
              features: ['Voice command activation', 'Severity assessment', 'Smart categorization']
            },
            {
              step: 2,
              title: "Smart Dispatch",
              description: "AI matches your emergency with the nearest available and equipped providers.",
              features: ['Distance optimization', 'Equipment matching', 'Multi-unit coordination']
            },
            {
              step: 3,
              title: "Live Resolution",
              description: "Track response in real-time with AR navigation and automatic documentation.",
              features: ['AR navigation', 'Real-time ETA', 'Auto documentation']
            }
          ].map((item, idx) => (
            <Card key={idx} className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-red-600">{item.step}</span>
              </div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Step {item.step}</span>
              <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-5 leading-relaxed">{item.description}</p>
              <ul className="space-y-2.5 text-sm text-gray-500">
                {item.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* TRUST INDICATORS SECTION */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: '🔒',
                title: "End-to-End Encrypted",
                description: "Enterprise-grade security for all your data"
              },
              {
                icon: '📡',
                title: "Works Offline",
                description: "SMS fallback ensures help anywhere, anytime"
              },
              {
                icon: '🌍',
                title: "Universal Support",
                description: "Supports multiple languages and regions"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <Card className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mx-auto mb-5 hover:shadow-md transition-shadow duration-300">
                  <div className="text-3xl">{item.icon}</div>
                </Card>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {[
            {
              icon: '🎤',
              title: "Voice-Activated SOS",
              description: "Trigger emergency response hands-free. Just say 'Hey RoadSOS' — perfect for accident scenarios."
            },
            {
              icon: '🤖',
              title: "AI Severity Assessment",
              description: "Our AI instantly analyzes emergencies to prioritize critical cases and dispatch appropriate help."
            },
            {
              icon: '📡',
              title: "Offline Emergency Mode",
              description: "No internet? Automatic SMS fallback ensures help reaches you anywhere, anytime."
            },
            {
              icon: '🗺️',
              title: "AR Responder Navigation",
              description: "Providers get augmented reality directions to reach you faster in complex locations."
            }
          ].map((feature, index) => (
            <Card key={index} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center shrink-0 text-2xl">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden border border-gray-700">
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
          </div>
          
          <div className="relative text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-600/20 text-3xl">
              🚨
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Emergency? Don't Wait.
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              AI-powered help arrives in under 5 minutes. We've already saved{' '}
              <span className="text-white font-bold">{liveStats.resolved.toLocaleString()}</span> lives.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/user/dashbord">
                <Button 
                  variant="sos" 
                  size="xl" 
                  className="rounded-2xl transition-all"
                >
                  SOS Emergency
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="glass" 
                  size="xl" 
                  className="rounded-2xl transition-all"
                >
                  Create Account
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-400 flex items-center justify-center gap-2">
              <span>🎤</span>
              Voice-activated SOS • Offline SMS • AR navigation
            </p>
          </div>
        </Card>
      </section>

    </div>
  );
};

export default Home;

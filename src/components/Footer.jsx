import React from "react";
import Card from "./Card";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-black border-t border-slate-800">

  {/* Background Glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-175 bg-red-600/10 blur-[120px] pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-6 py-16">

    {/* Brand Section */}
    <div className="text-center mb-14">

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-6">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        Emergency Response Platform
      </div>

      <h2 className="text-4xl font-extrabold tracking-tight">
        <span className="text-white">Road</span>
        <span className="text-red-500">SOS</span>
      </h2>

      <p className="mt-4 text-slate-400 max-w-2xl mx-auto leading-relaxed">
        AI-powered emergency response system connecting victims,
        responders, hospitals, towing services, and authorities
        through real-time intelligent coordination.
      </p>

    </div>

    <div className="border-t border-white/10 pt-8">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} RoadSOS. All rights reserved.
        </p>

        <div className="flex items-center gap-2 text-sm text-emerald-400">

          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>

          System Operational

        </div>

      </div>

    </div>

  </div>

</footer>
  );
};

export default Footer;
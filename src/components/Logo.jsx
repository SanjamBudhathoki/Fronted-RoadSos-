import { ShieldAlert } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const Logo = () => (
  <Link
    to="/"
    className="group flex items-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
  >
    <div className="relative shrink-0">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-2xl bg-red-500 opacity-25 blur-lg transition-opacity duration-300 group-hover:opacity-40"
      />

      <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-red-500 via-red-600 to-red-700 shadow-md shadow-red-900/20 ring-1 ring-inset ring-white/15 transition-transform duration-300 group-hover:-translate-y-0.5">
        <ShieldAlert className="h-5.5  w-5.5 text-white" strokeWidth={2} aria-hidden="true" />
      </div>

      {/* live beacon */}
      <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
      </span>
    </div>

    <div className="flex flex-col">
      <span className="text-xl font-bold leading-none tracking-tight mb-0.5 text-slate-900">
        Road
        <span className="bg-linear-to-r from-red-500 to-red-700 bg-clip-text text-transparent tracking-wide">
          SOS
        </span>
      </span>
      <div className="-mt-0.5 flex items-center gap-1.5">
        <span className="h-2.5 w-px bg-slate-300" />
        <p className="text-[10px] font-medium uppercase leading-tight tracking-[0.12em] text-slate-400">
        Emergency Response
        </p>
      </div>
    </div>
  </Link>
);

export default Logo
import { ShieldAlert } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group">
    <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors duration-200">
      <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
    </div>
    <div>
      <span className="text-xl font-bold text-gray-900">
        Road<span className="text-red-600">SOS</span>
      </span>
      <p className="text-[10px] text-gray-500 leading-tight -mt-0.5">Emergency Response</p>
    </div>
  </Link>
);

export default Logo

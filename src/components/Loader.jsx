import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Main spinner with gradient */}
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-[3px] border-gray-100"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-[3px] border-transparent border-t-red-500 border-r-red-500 animate-spin"></div>
      </div>
      
      {/* Loading text with subtle animation */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-semibold text-gray-700">Loading</p>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-10">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
};

export default Loader;
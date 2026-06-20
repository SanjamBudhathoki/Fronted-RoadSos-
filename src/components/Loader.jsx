import React from 'react';

const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="py-8">{content}</div>;
};

export default Loader;

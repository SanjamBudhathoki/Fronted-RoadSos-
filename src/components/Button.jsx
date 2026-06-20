import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClass = "font-semibold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm focus:ring-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-600",
    outline: "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500"
  };

  return (
    <button 
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

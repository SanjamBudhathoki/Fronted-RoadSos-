import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  loading = false,
  icon = null,
  fullWidth = false,
  ...props 
}) => {
  const baseClass = "font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
    xl: "px-10 py-4 text-lg"
  };
  
  const variants = {
    primary: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm hover:shadow-md focus:ring-gray-400",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-600 animate-pulse",
    outline: "bg-transparent border-2 border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:ring-gray-400",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg focus:ring-green-500",
    warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg focus:ring-amber-500",
    info: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500",
    dark: "bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg focus:ring-gray-700",
    light: "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 focus:ring-gray-300",
    sos: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-2xl hover:shadow-red-500/30 focus:ring-red-500 font-bold uppercase tracking-wider",
    ai: "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/20 focus:ring-purple-500",
    glass: "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 focus:ring-white/50"
  };

  return (
    <button 
      className={`
        ${baseClass} 
        ${variants[variant]} 
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
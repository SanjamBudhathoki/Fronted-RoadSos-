import React from 'react'

const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div>
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        className={`w-full px-4 py-2 border rounded-lg
        focus:ring-2 focus:ring-blue-400
        focus:border-transparent outline-none
        transition duration-200 mb-1
        ${error ? "border-red-500" : "border-gray-300"}
        ${className}`}
        {...props}
      />

      {error && (
        <span className="text-red-500 text-sm ">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
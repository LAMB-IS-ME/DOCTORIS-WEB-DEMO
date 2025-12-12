import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-medical-200 rounded-full opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-medical-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-medical-700 font-medium animate-pulse">Đang phân tích dữ liệu y khoa...</p>
    </div>
  );
};

export default LoadingSpinner;
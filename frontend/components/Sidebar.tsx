import React from 'react';
import { SearchHistoryItem, SearchType } from '../types';

interface SidebarProps {
  history: SearchHistoryItem[];
  onSelect: (item: SearchHistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelect, onClear, isOpen, onClose }) => {
  // Helper to get icon based on type
  const getIcon = (type: SearchType) => {
    switch (type) {
      case SearchType.DRUG:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case SearchType.DISEASE:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case SearchType.PATIENT:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      default: // SYMPTOM
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 z-40 transition-transform duration-300 ease-in-out transform flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Lịch sử tra cứu
          </h3>
          {history.length > 0 && (
            <button 
              onClick={onClear}
              className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50"
            >
              Xóa
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm px-4">
              Chưa có lịch sử tra cứu nào.
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full text-left p-3 rounded-lg hover:bg-medical-50 hover:text-medical-700 transition-colors group border border-transparent hover:border-medical-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`p-1 rounded text-white ${
                    item.type === SearchType.DRUG ? 'bg-emerald-500' :
                    item.type === SearchType.DISEASE ? 'bg-blue-500' :
                    item.type === SearchType.PATIENT ? 'bg-purple-500' :
                    'bg-amber-500'
                  }`}>
                    {getIcon(item.type)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {item.type === SearchType.DRUG ? 'Thuốc' :
                     item.type === SearchType.DISEASE ? 'Bệnh' :
                     item.type === SearchType.PATIENT ? 'Bệnh nhân' :
                     'Triệu chứng'}
                  </span>
                </div>
                <div className="font-medium text-slate-700 truncate group-hover:text-medical-800">
                  {item.query}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} 
                  {' · '}
                  {new Date(item.timestamp).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
          Doctoris v1.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
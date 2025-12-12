import React from 'react';
import { MedicalData } from '../types';

interface ResultCardProps {
  data: MedicalData;
}

// Icon helper components
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-800 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block px-2 py-1 bg-white/20 rounded text-xs font-semibold mb-2 uppercase tracking-wide">
              {data.category}
            </span>
            <h1 className="text-3xl font-bold mb-1">{data.title}</h1>
          </div>
          <div className="p-2 bg-white/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        </div>
        <p className="mt-4 text-medical-50 text-lg leading-relaxed opacity-95">
          {data.summary}
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Warnings Section - If exists */}
        {data.warnings && data.warnings.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <div className="flex items-center mb-2">
              <AlertIcon />
              <h3 className="ml-2 font-bold text-red-800 text-lg">Cảnh báo quan trọng</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 ml-1 text-red-700">
              {data.warnings.map((warning, idx) => (
                <li key={idx} className="leading-relaxed">{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {data.sections.map((section, index) => (
            <div key={index} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
              <div className="flex items-center mb-3">
                <div className="bg-medical-100 p-1.5 rounded-lg mr-3">
                  <InfoIcon />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{section.heading}</h3>
              </div>
              <div className="text-slate-600 leading-relaxed whitespace-pre-wrap pl-11">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* References Section */}
        {data.references && data.references.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/50 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Nguồn tham khảo & Trích dẫn</h3>
            <ul className="space-y-2">
              {data.references.map((ref, idx) => (
                <li key={idx}>
                  <a 
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-start gap-2 text-medical-600 hover:text-medical-800 transition-colors"
                  >
                    <span className="mt-1 flex-shrink-0 opacity-70 group-hover:opacity-100">
                      <LinkIcon />
                    </span>
                    <span className="text-sm underline decoration-transparent group-hover:decoration-medical-600 transition-all">
                      {ref.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-4 text-center text-sm text-slate-400 italic">
          Nội dung do AI Doctoris tạo ra nhằm mục đích tham khảo. Bác sĩ vui lòng kiểm chứng lại với các hướng dẫn chuyên môn hiện hành.
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up">
      {/* Simple Header */}
      <div className="bg-gradient-to-r from-medical-600 to-medical-700 px-8 py-5 text-white border-b border-medical-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-medical-100 opacity-90">{data.category}</span>
            <h1 className="text-2xl font-bold">{data.title}</h1>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Main Content - Hiển thị nguyên văn */}
        <div className="prose prose-slate prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Headings
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-3 border-b pb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mt-5 mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-base font-semibold text-slate-700 mt-3 mb-2" {...props} />,
              
              // Paragraphs
              p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-slate-700" {...props} />,
              
              // Lists
              ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1.5" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1.5" {...props} />,
              li: ({node, ...props}) => <li className="leading-relaxed text-slate-700" {...props} />,
              
              // Emphasis
              strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
              em: ({node, ...props}) => <em className="italic text-slate-600" {...props} />,
              
              // Code
              code: ({node, inline, ...props}) => 
                inline 
                  ? <code className="bg-slate-100 text-medical-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                  : <code className="block bg-slate-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-3" {...props} />,
              
              // Blockquote
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-medical-400 pl-4 italic text-slate-600 my-4 bg-slate-50 py-2" {...props} />
              ),
              
              // Horizontal rule
              hr: ({node, ...props}) => <hr className="my-6 border-slate-200" {...props} />,
              
              // Links
              a: ({node, ...props}) => (
                <a className="text-medical-600 hover:text-medical-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
              ),

              // Tables
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border border-slate-300" {...props} />
                </div>
              ),
              th: ({node, ...props}) => <th className="border border-slate-300 bg-slate-100 px-4 py-2 text-left font-semibold" {...props} />,
              td: ({node, ...props}) => <td className="border border-slate-300 px-4 py-2" {...props} />,
            }}
          >
            {data.sections[0].content}
          </ReactMarkdown>
        </div>

        {/* References Section - Hiển thị cuối */}
        {data.references && data.references.length > 0 && (
          <div className="mt-8 pt-6 border-t-2 border-slate-200">
            <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Nguồn tham khảo & Trích dẫn
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              {data.references.map((ref: { title: string; url: string }, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-sm mt-0.5">[{idx + 1}]</span>
                  <a 
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex-1 flex items-start gap-2 text-medical-600 hover:text-medical-800 transition-colors"
                  >
                    <span className="text-sm leading-relaxed group-hover:underline">
                      {ref.title}
                    </span>
                    <span className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                      <LinkIcon />
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 italic">
          ⚠️ Nội dung do AI Doctoris tạo ra nhằm mục đích tham khảo. Bác sĩ vui lòng kiểm chứng lại với các hướng dẫn chuyên môn hiện hành.
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
import React, { useRef } from 'react';
import { SearchType } from '../types';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
  image: string | null;
  setImage: (image: string | null) => void;
  onSearch: (e?: React.FormEvent) => void;
  onClear: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  searchType,
  setSearchType,
  image,
  setImage,
  onSearch,
  onClear,
  isLoading
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearClick = () => {
    onClear();
    setImage(null);
    inputRef.current?.focus();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-2 border border-slate-100">
      {/* Type Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl mb-3">
        {[
          { 
            label: 'Triệu chứng', 
            value: SearchType.SYMPTOM,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          },
          { 
            label: 'Bệnh', 
            value: SearchType.DISEASE,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            )
          },
          { 
            label: 'Thuốc', 
            value: SearchType.DRUG,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            )
          },
          { 
            label: 'Bệnh nhân', 
            value: SearchType.PATIENT,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )
          }
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setSearchType(tab.value)}
            className={`flex-1 min-w-[100px] py-2.5 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              searchType === tab.value
                ? 'bg-white text-medical-700 shadow-md ring-1 ring-slate-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className={`h-6 w-6 transition-colors ${isLoading ? 'text-medical-500' : 'text-slate-400 group-focus-within:text-medical-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`block w-full pl-12 pr-32 py-4 text-lg text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none rounded-xl ${image ? 'pt-2 pb-10' : ''}`}
          placeholder={
            searchType === SearchType.DRUG ? "Nhập tên thuốc, hoạt chất..." : 
            searchType === SearchType.DISEASE ? "Nhập tên bệnh..." : 
            searchType === SearchType.PATIENT ? "Nhập mã hoặc tên bệnh nhân..." :
            "Mô tả triệu chứng bệnh nhân..."
          }
        />

        {/* Image Preview inside Input */}
        {image && (
          <div className="absolute left-12 bottom-2 flex items-center gap-2 bg-slate-100 px-2 py-1 rounded-md z-10 animate-fade-in">
            <div className="w-8 h-8 rounded overflow-hidden border border-slate-300">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-slate-600 font-medium">Đã chọn ảnh</span>
            <button type="button" onClick={removeImage} className="text-slate-400 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-2">
          {/* File Upload Input (Hidden) */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          
          {/* Image Button */}
          <button 
            type="button" 
            onClick={triggerFileUpload}
            title="Tải ảnh lên (Toa thuốc, tổn thương da...)"
            className={`p-2 rounded-full transition-colors ${image ? 'text-medical-600 bg-medical-50' : 'text-slate-400 hover:text-medical-600 hover:bg-slate-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {query && (
            <button type="button" onClick={handleClearClick} className="p-2 text-slate-300 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || (!query.trim() && !image)}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-md ${
              isLoading || (!query.trim() && !image)
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-medical-600 hover:bg-medical-700 hover:shadow-lg active:scale-95'
            }`}
          >
            {isLoading ? '...' : 'Tra cứu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
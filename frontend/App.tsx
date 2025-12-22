import React, { useState, useRef } from 'react';
import { fetchMedicalInfo } from './services/geminiService';
import { MedicalData, SearchType, SearchHistoryItem } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import ResultCard from './components/ResultCard';
import SearchBar from './components/SearchBar';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>(SearchType.SYMPTOM);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MedicalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() && !image) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    if (query.trim()) {
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: query.trim(),
        type: searchType,
        timestamp: Date.now()
      };
      
      setHistory(prev => {
        const filtered = prev.filter(item => item.query.toLowerCase() !== newItem.query.toLowerCase());
        return [newItem, ...filtered].slice(0, 50);
      });
    }

    try {
      const data = await fetchMedicalInfo(query, searchType, image || undefined);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (result || error) {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleClear = () => {
    setQuery('');
    setImage(null);
    setResult(null);
    setError(null);
  };

  const handleHistorySelect = (item: SearchHistoryItem) => {
    setQuery(item.query);
    setSearchType(item.type);
    setImage(null);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-slate-200 z-50 flex-none h-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-medical-600 hover:bg-slate-100 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center gap-2 cursor-pointer" onClick={handleClear}>
              <div className="bg-medical-600 rounded-lg p-1.5 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-medical-700 to-medical-500 hidden sm:block">
                Doctoris
              </span>
            </div>
          </div>
          
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span className="px-2 py-1 bg-medical-50 text-medical-700 rounded text-xs font-semibold uppercase border border-medical-100">Beta v1.0</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          history={history}
          onSelect={handleHistorySelect}
          onClear={() => setHistory([])}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 w-full relative scroll-smooth">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            <div className={`transition-all duration-500 ease-in-out ${result ? '' : 'mt-[5vh] lg:mt-[10vh]'}`}>
              {!result && !isLoading && (
                <div className="text-center mb-8 animate-fade-in">
                   <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">
                     Doctoris - Trợ lý Y khoa
                   </h2>
                   <p className="text-slate-500">
                     Nhập thông tin lâm sàng hoặc tải ảnh để bắt đầu
                   </p>
                </div>
              )}

              <SearchBar 
                query={query}
                setQuery={setQuery}
                searchType={searchType}
                setSearchType={setSearchType}
                image={image}
                setImage={setImage}
                onSearch={handleSearch}
                onClear={handleClear}
                isLoading={isLoading}
              />
            </div>

            <div ref={scrollRef} className="pb-10 min-h-[400px]">
              {isLoading && <LoadingSpinner />}
              
              {error && (
                <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fade-in mt-8">
                   <div className="inline-flex bg-red-100 p-3 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                   </div>
                   <h3 className="text-xl font-bold text-red-800 mb-2">Đã xảy ra lỗi</h3>
                   <p className="text-red-600 mb-4">{error}</p>
                   <button onClick={handleSearch} className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium">
                     Thử lại
                   </button>
                </div>
              )}

              {result && !isLoading && <ResultCard data={result} />}
            </div>
            
            {!result && !isLoading && (
              <footer className="py-6 text-center text-slate-400 text-sm mt-auto">
                <p>© 2024 Doctoris. Hỗ trợ chuyên môn cho bác sĩ.</p>
              </footer>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

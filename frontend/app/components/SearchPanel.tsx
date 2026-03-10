import React, { useState } from 'react';

interface SearchPanelProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const presetQueries = [
    "Projenin yöntemi nedir?",
    "Bütçe ne kadar?",
    "Riskler nelerdir?"
  ];

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Semantic Search Test
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Query the Vector Database using natural language to retrieve the most semantically relevant chunks.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something about the proposal..."
          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-base rounded-xl py-4 pl-5 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={`absolute right-2.5 top-2.5 bottom-2.5 px-6 rounded-lg font-medium tracking-wide transition-all duration-200 
            ${!query.trim() || isLoading 
              ? 'bg-gray-200 dark:bg-[#252525] text-gray-400 dark:text-gray-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow active:scale-95'
            }`}
        >
          {isLoading ? (
            <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             "Search"
          )}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">Examples:</span>
        {presetQueries.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(q);
              if (!isLoading) onSearch(q);
            }}
            disabled={isLoading}
            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252525] text-gray-600 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            "{q}"
          </button>
        ))}
      </div>
    </div>
  );
}

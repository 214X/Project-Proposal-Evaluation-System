import React from 'react';

export interface SearchResultItem {
  id: string;
  chunk_index: number;
  section: string;
  subsection?: string;
  similarity: number;
  text: string;
  length?: number;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="bg-transparent space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
          Top Matches for <span className="text-gray-800 dark:text-gray-200 font-bold bg-white dark:bg-[#1a1a1a] px-2 py-0.5 rounded border border-gray-200 dark:border-gray-800 lowercase">"{query}"</span>
        </h3>
        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
          {results.length} results
        </span>
      </div>

      <div className="grid gap-4">
        {results.map((res, idx) => (
          <div key={res.id || idx} className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden group hover:shadow-md transition-shadow">
            
            {/* Card Header & Metrics */}
            <div className="p-4 sm:p-5 border-b border-gray-50 dark:border-gray-800/60 bg-gray-50/50 dark:bg-[#1a1a1a] flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              
              <div className="flex items-start gap-3">
                <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                  #{res.chunk_index}
                </div>
                <div>
                  <h4 className="text-base font-medium text-gray-900 dark:text-white leading-none mb-1.5 flex items-center gap-2">
                    {res.section}
                  </h4>
                  {res.subsection && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">↳ {res.subsection}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 w-full sm:w-48 shrink-0">
                <div className="flex justify-between w-full text-xs font-medium">
                  <span className="text-gray-500">Similarity</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{(res.similarity * 100).toFixed(1)}%</span>
                </div>
                {/* Horizontal Bar Chart */}
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 dark:bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${res.similarity * 100}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Chunk Content Preview */}
            <div className="p-4 sm:p-5">
              <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto w-full custom-scrollbar">
                {res.text}
              </pre>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

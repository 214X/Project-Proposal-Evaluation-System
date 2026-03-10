import React, { useState } from 'react';

export interface Chunk {
  chunk_index: number;
  section: string;
  subsection?: string;
  length: number;
  is_table?: boolean;
  text: string;
  embedding?: number[];
}

interface ChunkCardProps {
  chunks: Chunk[];
}

export default function ChunkCard({ chunks }: ChunkCardProps) {
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(chunks.length > 0 ? chunks[0].chunk_index : null);
  
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row h-[600px] overflow-hidden">
      {/* Sidebar (Menu) */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a] flex flex-col h-[300px] md:h-full">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-[#222] z-10 sticky top-0">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generated Chunks</span>
          <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">{chunks.length}</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chunks.map((chunk) => {
            let lengthColor = "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10";
            if (chunk.length > 1000) lengthColor = "text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10";
            else if (chunk.length > 850) lengthColor = "text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/10";

            const isSelected = selectedChunkIndex === chunk.chunk_index;

            return (
              <button
                key={chunk.chunk_index}
                onClick={() => setSelectedChunkIndex(chunk.chunk_index)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-start gap-3 border ${isSelected
                    ? "bg-white dark:bg-[#252525] border-indigo-200 dark:border-indigo-800 shadow-sm"
                    : "border-transparent hover:bg-white/80 dark:hover:bg-[#222] hover:border-gray-200 dark:hover:border-gray-700"
                  }`}
              >
                <span className={`shrink-0 flex items-center justify-center text-[10px] font-bold rounded-full w-5 h-5 
                  ${isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                  {chunk.chunk_index}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate flex items-center gap-1.5 ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                    {chunk.section}
                    {chunk.is_table && (
                      <span className="inline-flex items-center rounded-sm bg-blue-50 dark:bg-blue-900/30 px-1 py-0.5 text-[8px] font-bold text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/10">TABLE</span>
                    )}
                  </p>
                  {chunk.subsection && (
                    <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-500'}`}>
                      ↳ {chunk.subsection}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ring-1 ${lengthColor}`}>
                      {chunk.length} chars
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#1f1f1f] h-full w-0 min-w-0">
        {(() => {
          const activeChunk = chunks.find(c => c.chunk_index === selectedChunkIndex);
          if (!activeChunk) return (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Select a chunk to view details</div>
          );

          let headerColor = "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300";
          if (activeChunk.length > 1000) headerColor = "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300";
          else if (activeChunk.length > 850) headerColor = "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-300";

          return (
            <>
              <div className="flex-none p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white leading-tight flex items-center gap-2">
                    Chunk #{activeChunk.chunk_index}
                    {activeChunk.is_table && (
                      <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/20 px-2 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20">
                        TABLE
                      </span>
                    )}
                  </h2>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-2">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{activeChunk.section}</span>
                    {activeChunk.subsection && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">/</span>
                        <span>{activeChunk.subsection}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`text-xs font-mono font-medium px-2.5 py-1 rounded-md border ${headerColor}`}>
                    Length: {activeChunk.length} characters
                  </span>
                  <button
                    onClick={() => copyText(activeChunk.text)}
                    className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-[#151515] p-5 sm:p-8">
                <pre className={`text-[13px] sm:text-sm font-mono text-gray-800 dark:text-gray-300 leading-relaxed select-text font-serif ${activeChunk.is_table ? 'whitespace-pre min-w-max' : 'whitespace-pre-wrap'}`}>
                  {activeChunk.text}
                </pre>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}

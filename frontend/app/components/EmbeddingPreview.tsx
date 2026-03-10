import React from 'react';
import { Chunk } from './ChunkCard';

interface EmbeddingPreviewProps {
  chunks: Chunk[];
  dimension: number;
}

export default function EmbeddingPreview({ chunks, dimension }: EmbeddingPreviewProps) {
  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mt-8">
      <div className="border-b border-gray-100 dark:border-gray-800 p-5 sm:px-6 bg-gray-50/50 dark:bg-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            Vector Embeddings
          </h3>
          <p className="text-sm text-gray-500 mt-1">Generated continuous vector space representations.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-full">
            Dim: {dimension}
          </span>
          <span className="text-xs font-mono font-medium bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300">
            {chunks.length} vectors
          </span>
        </div>
      </div>
      
      <div className="p-5 sm:p-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {chunks.map((chunk) => (
          <div key={chunk.chunk_index} className="bg-gray-50 dark:bg-[#151515] rounded-xl p-4 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate w-32">
                Chunk #{chunk.chunk_index}
              </span>
              <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                Vector
              </span>
            </div>
            {chunk.embedding ? (
              <div className="font-mono text-[11px] leading-relaxed text-gray-500 dark:text-gray-400 tracking-tight break-all">
                <span className="text-gray-400">[</span>
                <span className="text-blue-600 dark:text-blue-400">{chunk.embedding.slice(0, 8).map(v => v.toFixed(4)).join(", ")}</span>
                <span className="text-gray-400">, ... ]</span>
              </div>
            ) : (
              <span className="text-xs text-red-500 font-medium">No embedding generated.</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

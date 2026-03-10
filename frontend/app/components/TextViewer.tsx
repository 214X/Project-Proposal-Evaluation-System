import React from 'react';

interface TextViewerProps {
  title: string;
  subtitle?: string;
  text: string;
  length: number;
}

export default function TextViewer({ title, subtitle, text, length }: TextViewerProps) {
  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-[500px]">
      <div className="border-b border-gray-100 dark:border-gray-800 p-5 sm:px-6 bg-gray-50/50 dark:bg-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center">
          <span className="text-xs font-mono font-medium bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300">
            {length.toLocaleString()} chars
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto bg-gray-50/30 dark:bg-[#151515] p-5 sm:p-6">
        <pre className="text-[13px] sm:text-sm font-mono text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap select-text font-serif">
          {text}
        </pre>
      </div>
    </div>
  );
}

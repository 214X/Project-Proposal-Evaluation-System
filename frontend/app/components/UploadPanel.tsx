import React, { useRef } from 'react';

interface UploadPanelProps {
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  onClear: () => void;
  selectedFile: File | null;
  loading: boolean;
  error: string | null;
}

export default function UploadPanel({
  onFileSelect,
  onUpload,
  onClear,
  selectedFile,
  loading,
  error
}: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        onFileSelect(droppedFile);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-10 transition-all duration-300">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">Upload Proposal</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          Upload a research proposal PDF to evaluate the parsing pipeline.
        </p>
      </div>

      <div
        className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors cursor-pointer group"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        <div className="bg-white dark:bg-[#2d2d2d] p-4 rounded-full shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-base font-medium text-gray-700 dark:text-gray-200">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500 mt-2">Only PDF files are supported</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {selectedFile ? (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Clear Selection
          </button>
        ) : <div />}

        <button
          onClick={onUpload}
          disabled={loading || !selectedFile}
          className={`relative overflow-hidden w-full sm:w-auto px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-sm
            ${loading || !selectedFile
              ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed shadow-none border border-transparent'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 border border-blue-600'
            }
          `}
        >
          <span className={`flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            Process Document
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700 dark:text-red-400 leading-relaxed font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setResult(null);
        setError(null);
      } else {
        setError("Please drop a valid PDF file.");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/proposals/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to upload file");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Upload Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-10 transition-all">
        
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-medium text-gray-800 dark:text-gray-100 font-sans tracking-tight">
            Upload your proposal
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            PDF documents only. Make sure your file is readable.
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
            accept=".pdf"
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
              <p className="text-base font-medium text-blue-600 dark:text-blue-400">Click to browse</p>
              <p className="text-sm text-gray-500 mt-1">or drag and drop your file here</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {selectedFile ? (
             <button
              onClick={(e) => { e.stopPropagation(); clearSelection(); }}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Clear selection
            </button>
          ) : <div />}
          
          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center min-w-[140px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : "Upload & Extract"}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 border border-red-100 dark:border-red-900/30">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="border-b border-gray-100 dark:border-gray-800 p-6 sm:px-8 bg-gray-50/50 dark:bg-[#1a1a1a] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Extraction Complete
              </h3>
              <p className="text-sm text-gray-500 mt-1">Processed {result.text_length.toLocaleString()} characters.</p>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Extracted Text</span>
              <button 
                onClick={() => navigator.clipboard.writeText(result.text)}
                className="text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Text
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-gray-800 rounded-xl max-h-[500px] overflow-y-auto">
              <pre className="p-6 text-sm text-gray-700 dark:text-gray-300 font-sans whitespace-pre-wrap leading-relaxed select-text">
                {result.text || "No text could be extracted from this document."}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

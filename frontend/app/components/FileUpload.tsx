"use client";

import { useState, useRef } from "react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(null);

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
      if (data.chunks && data.chunks.length > 0) {
        setSelectedChunkIndex(data.chunks[0].chunk_index);
      } else {
        setSelectedChunkIndex(null);
      }
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

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Upload Card */}
      <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 sm:p-10 transition-all max-w-3xl mx-auto">
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

      {/* Results View - Main Output Container */}
      {result && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

          {/* Top Panel - Extracted Text Comparison */}
          <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-800 p-6 sm:px-8 bg-gray-50/50 dark:bg-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Extraction & Cleaning Complete
                </h3>
                <p className="text-sm text-gray-500 mt-1">Processed {result.text_length.toLocaleString()} raw characters.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">
              {/* Raw Text View */}
              <div className="flex flex-col h-full bg-gray-50/30 dark:bg-[#1a1a1a]">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Raw Text</span>
                  <button onClick={() => copyText(result.raw_text)} className="text-xs font-medium text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Copy</button>
                </div>
                <div className="h-[400px] overflow-y-auto p-6">
                  <pre className="text-xs text-gray-500 dark:text-gray-400 font-mono whitespace-pre-wrap leading-relaxed select-text">
                    {result.raw_text || "No text"}
                  </pre>
                </div>
              </div>

              {/* Cleaned Text View */}
              <div className="flex flex-col h-full bg-white dark:bg-[#1f1f1f]">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    Cleaned Text
                  </span>
                  <button onClick={() => copyText(result.cleaned_text)} className="text-xs font-medium text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors">Copy</button>
                </div>
                <div className="h-[400px] overflow-y-auto p-6 shadow-inner bg-gray-50/10 dark:bg-black/10">
                  <pre className="text-xs text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap leading-relaxed select-text">
                    {result.cleaned_text || "No text"}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel - Chunk Viewer (Master-Detail) */}
          {result.chunks && result.chunks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Generated Chunks ({result.chunks.length})
                </h3>
                <span className="text-sm text-gray-500">Ready for Embedding</span>
              </div>

              <div className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row h-[600px] overflow-hidden">
                {/* Sidebar (Menu) */}
                <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a] flex flex-col h-[300px] md:h-full">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-[#1f1f1f]/50 backdrop-blur-sm sticky top-0 z-10">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Chunk Hierarchy</h4>
                  </div>
                  <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {result.chunks.map((chunk: any) => {
                      // Determine color classes based on length limits (target: 900, soft: 1000, hard: 1100)
                      let lengthColor = "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 ring-green-200 dark:ring-green-800/30";
                      if (chunk.length > 1000) {
                        lengthColor = "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 ring-red-200 dark:ring-red-800/30";
                      } else if (chunk.length > 850) {
                        lengthColor = "text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 ring-yellow-200 dark:ring-yellow-800/30";
                      }

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
                            <p className={`text-xs font-medium truncate ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                              {chunk.section}
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
                <div className="flex-1 flex flex-col bg-white dark:bg-[#1f1f1f] h-full">
                  {(() => {
                    const activeChunk = result.chunks.find((c: any) => c.chunk_index === selectedChunkIndex);
                    if (!activeChunk) return (
                      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">Select a chunk to view details</div>
                    );

                    let headerColor = "bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300";
                    if (activeChunk.length > 1000) headerColor = "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-800 dark:text-red-300";
                    else if (activeChunk.length > 850) headerColor = "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30 text-yellow-800 dark:text-yellow-300";

                    return (
                      <>
                        <div className="flex-none p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-xl font-medium text-gray-900 dark:text-white leading-tight">
                              Chunk #{activeChunk.chunk_index}
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

                        <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-[#151515] p-5 sm:p-8">
                          <pre className="text-[13px] sm:text-sm font-mono text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed select-text font-serif">
                            {activeChunk.text}
                          </pre>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

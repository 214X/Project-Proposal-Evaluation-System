"use client";

import { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import TextViewer from "./components/TextViewer";
import ChunkCard, { Chunk } from "./components/ChunkCard";
import EmbeddingPreview from "./components/EmbeddingPreview";
import SearchPanel from "./components/SearchPanel";
import SearchResults, { SearchResultItem } from "./components/SearchResults";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setSearchResults(null);
    setSearchQuery("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/proposals/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    setSearchError(null);
    setSearchResults(null);

    try {
      const response = await fetch("http://localhost:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query, top_k: 5 }),
      });

      if (!response.ok) {
        throw new Error("Semantic Search failed");
      }

      const data = await response.json();
      setSearchResults(data.results);
    } catch (err: any) {
      setSearchError(err.message || "An error occurred while searching");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] font-sans px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <main className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 group hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 outline-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Proposal <span className="text-blue-600 dark:text-blue-500">Pipeline</span> Test
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload document PDFs and visually inspect the extraction, semantic cleaning, and vector mapping process down the pipeline.
          </p>
        </header>

        {/* 1. Upload Panel */}
        <UploadPanel
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          onClear={handleClear}
          selectedFile={selectedFile}
          loading={loading}
          error={error}
        />

        {/* Pipeline Output Area */}
        {result && (
          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            
            {/* Visual connector */}
            <div className="flex justify-center -my-6">
              <div className="w-px h-12 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700" />
            </div>

            {/* 2 & 3. Raw and Cleaned Text Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TextViewer
                title="RAW TEXT"
                subtitle="Unprocessed extraction sequence from PyMuPDF."
                text={result.raw_text}
                length={result.text_length}
              />
              <TextViewer
                title="CLEANED TEXT"
                subtitle="Normalized parsing with regex sanitation."
                text={result.cleaned_text}
                length={result.cleaned_text?.length || 0}
              />
            </div>

            <div className="flex justify-center -my-6">
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* 4. Sequence Chunks */}
            <div className="space-y-4">
               <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                   CHUNKS
                </h3>
                <p className="text-sm text-gray-500 mt-1">Fragmented semantic windows tailored and padded for database storage.</p>
              </div>
              <ChunkCard chunks={result.chunks} />
            </div>

            <div className="flex justify-center -my-6">
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* 5. Embeddings */}
            <EmbeddingPreview 
              chunks={result.chunks} 
              dimension={result.embedding_dimension} 
            />

            <div className="flex justify-center -my-6">
              <div className="w-px h-12 bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* 6. Semantic Search Test */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
               <SearchPanel onSearch={handleSearch} isLoading={isSearching} />
               
               {searchError && (
                 <div className="mt-4 p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
                   {searchError}
                 </div>
               )}

               {searchResults && (
                 <div className="mt-8 animate-in mt-4 fade-in duration-500">
                   <SearchResults results={searchResults} query={searchQuery} />
                 </div>
               )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

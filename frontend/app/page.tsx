import FileUpload from "@/app/components/FileUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] dark:bg-[#121212] pt-16 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-12 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-normal text-gray-900 dark:text-white tracking-tight">
              Proposal <span className="text-gray-500 font-light">Evaluator</span>
            </h1>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl text-center sm:text-left">
            Upload research proposals directly into the intelligence pipeline. Our models will extract, ingest, and process the text for vector indexing.
          </p>
        </header>

        <FileUpload />
        
        <footer className="mt-16 text-center text-sm text-gray-400 dark:text-gray-600">
          <p>Powered by FastAPI & Next.js RAG Stack</p>
        </footer>
      </div>
    </main>
  );
}

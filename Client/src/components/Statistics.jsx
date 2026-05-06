export default function Statistics({ goBackToUpload, parsingData }) {
  const { content_type, filename, file_size, ngrams, Statistics } = parsingData;
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center px-4 h-14 bg-[#F5F5F5] mx-2 my-3 text-slate-800 rounded-xl shadow-sm border border-slate-200/50 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-[#427AB5] rounded-full"></div>{" "}
          <span className="font-bold tracking-tight text-sm md:text-base">
            BASIC <span className="text-[#427AB5]">NLP</span>
          </span>
        </div>
        <button
          onClick={goBackToUpload}
          className="flex items-center gap-1.5 font-semibold bg-[#427AB5] hover:bg-[#356394] active:scale-95 transition-all text-white px-3 py-1.5 rounded-lg text-xs cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a2 2 0 002 2h12 a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          UPLOAD
        </button>
      </nav>
      {/* Statistics overall*/}
      <body>
        <div>
          <p>{filename}</p>
          <p>{content_type}</p>
          <p>{file_size}</p>
        </div>
      </body>
    </div>
  );
}

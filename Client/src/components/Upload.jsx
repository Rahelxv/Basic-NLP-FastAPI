export default function Upload({ handleUpload }) {
  return (
    <div className="flex flex-col items-center pt-20 h-screen gap-22">
      {/* title and logo */}
      <div className="flex flex-col items-center ">
        <div className="flex flex-row items-center gap-8">
          <img className="w-20" src="nlp.png" alt="logo nlp" />
          <h1 className="text-[#FFE8BE] text-5xl font-bold">
            Basic NLP Evaluator
          </h1>
        </div>
        <div>
          <p className="text-[#F7DD7D] text-xl">
            Data analysis with statistical visualization
          </p>
        </div>
      </div>
      {/* upload file csv */}
      <label
        className="flex flex-col items-center justify-center bg-white/25 border-2 border-[#FFE8BE] border-dashed rounded-md p-6 cursor-pointer hover:bg-white/30 transition-all
        /* Ukuran Mobile: Lebar hampir penuh */
        w-[90%] h-[40%] 
        /* Ukuran Tablet ke Atas (Medium): Lebar 50% */
        md:w-[50%] 
        /* Ukuran Desktop (Large): Ukuran 38% Anda */
        lg:w-[38%] lg:h-[35%]"
      >
        <img
          className="w-24 md:w-32 object-contain"
          src="upload.png"
          alt="upload icon"
        />

        <div className="flex flex-col items-center gap-4 text-center mt-4">
          <h3 className="text-lg md:text-2xl text-[#FFE8BE] px-4">
            Drop or click here to evaluate your table
          </h3>
          <span className="flex items-center justify-center w-32 h-10 bg-[#FFE8BE] rounded-2xl text-gray-900 font-semibold">
            Upload
          </span>
        </div>
        <form>
          <input
            onChange={handleUpload}
            type="file"
            className="hidden"
            id="filesub"
            accept=".csv, .xlsx"
          />
        </form>
      </label>
    </div>
  );
}

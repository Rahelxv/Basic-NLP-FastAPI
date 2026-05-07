import { useState, useEffect } from "react";
import Upload from "./components/Upload";
import Statistics from "./components/Statistics";
import Loading from "./components/Loading";

function App() {
  const [dataAvail, setDataAvail] = useState(false);
  const [data, setData] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("nlp_visitor_status");
    if (!hasVisited) {
      setShowModal(true);
    }
  }, []);

  const closeWelcomeModal = () => {
    setShowModal(false);
    localStorage.setItem("nlp_visitor_status", "returning");
  };

  const handelFile = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result && Object.keys(result).length > 0) {
          setDataAvail(true);
          setData(result);
        } else {
          alert(
            "Gagal memproses file. Pastikan format CSV dan ukuran maksimal 100MB.",
          );
        }
      } else {
        alert(
          "Gagal memproses file. Pastikan format CSV dan ukuran maksimal 100MB.",
        );
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <Loading /> : null}

      {/* --- INFO BUTTON (Top Left) --- */}
      {/* Tombol hanya muncul jika dataAvail false (sedang di halaman Upload) */}
      {!dataAvail ? (
        <button
          onClick={() => setShowModal(true)}
          className="fixed top-6 left-8 z-100 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium shadow-lg"
        >
          <span className="flex items-center justify-center w-5 h-5 border border-current rounded-full text-[10px] font-serif italic">
            i
          </span>
          How to use
        </button>
      ) : null}

      {/* --- ONBOARDING MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-6 backdrop-blur-md bg-black/40 transition-all">
          <div className="bg-slate-900/90 border border-white/20 p-8 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Decorative blur */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>

            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to NLP Evaluator
            </h2>

            <p className="text-slate-300 mb-6 leading-relaxed text-sm">
              Analyze sentiment, word statistics, and named entities (NER) by
              simply uploading your data file.
            </p>

            {/* Section: How to Use */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">
                  ?
                </span>
                How to use
              </h3>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-xs text-slate-400 mb-3">
                  Best practice: Use a <strong>single column</strong> table.
                </p>
                <img
                  src="only_one_column.png"
                  alt="Instruction: only one column"
                  className="w-full rounded-xl border border-white/10 grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-xs text-slate-300">
                  <span className="text-blue-500 mt-1">✔</span>
                  <span>
                    We currently only support <strong>English</strong>. Please
                    translate your text before uploading.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-xs text-slate-300">
                  <span className="text-blue-500 mt-1">✔</span>
                  <span>
                    File limits: Maximum <strong>100MB</strong> and must be in{" "}
                    <strong>.CSV</strong> format.
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={closeWelcomeModal}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 sticky bottom-0"
            >
              Start Analyzing
            </button>
          </div>
        </div>
      )}

      {/* --- CONDITIONAL RENDERING --- */}
      {dataAvail ? (
        <Statistics
          goBackToUpload={() => setDataAvail(false)}
          parsingData={data}
        />
      ) : (
        <Upload handleUpload={handelFile} />
      )}
    </>
  );
}

export default App;

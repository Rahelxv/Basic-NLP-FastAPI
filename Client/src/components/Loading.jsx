import React from "react";

const Loading = () => {
  return (
    /* fixed inset-0 membuat modal ini menutupi seluruh layar browser */
    /* z-50 memastikan dia berada di atas komponen Upload atau Statistics */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
      {/* Kotak Loading di Tengah */}
      <div className="w-[90%] max-w-sm p-10 bg-[#1a1c22]/80 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col items-center">
        {/* Spinner dengan aksen hijau */}
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 border-4 border-green-400/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-green-400 rounded-full animate-spin"></div>
        </div>

        {/* Teks Minimalis */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2 font-mono uppercase">
            Processing
          </h2>
          <p className="text-gray-400 text-sm font-light">
            Wait a second, we're crunching your data...
          </p>
        </div>

        {/* Garis Progress Animatif */}
        <div className="w-full h-[2px] bg-white/5 mt-10 overflow-hidden rounded-full">
          <div className="h-full bg-[#80D8C3] animate-[loadingMove_1.5s_infinite_ease-in-out]"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

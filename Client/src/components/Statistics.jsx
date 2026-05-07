import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Statistics({ goBackToUpload, parsingData }) {
  const { filename, file_size, statistics, ngrams, sentiment_analysis, spacy } =
    parsingData;

  // Prepare pie chart data
  const pieData = sentiment_analysis.summary.map((item) => ({
    name: item.label.charAt(0).toUpperCase() + item.label.slice(1),
    value: item.count,
    label: item.label,
  }));

  const COLORS = {
    positive: "#34d399", // emerald-400
    negative: "#f87171", // red-400
    neutral: "#9ca3af", // gray-400
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 font-sans text-slate-100">
      {/* Navigation Bar - Glass Effect */}
      <nav className="flex justify-between items-center px-10 h-20 bg-white/10 backdrop-blur-md mx-8 my-6 rounded-2xl shadow-lg border border-white/20 sticky top-6 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-blue-400/30">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">
                NLP Analytics Dashboard
              </h1>
              <p className="text-xs text-slate-300">
                Advanced Text Analysis Platform
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right border-r border-white/20 pr-6">
            <p className="text-xs text-slate-400">Currently Analyzing</p>
            <p className="text-sm font-semibold text-white">
              {filename}{" "}
              <span className="text-slate-400 font-normal">({file_size})</span>
            </p>
          </div>
          <button
            onClick={goBackToUpload}
            className="flex items-center gap-2 font-semibold bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-sm shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload New File
          </button>
        </div>
      </nav>

      <div className="px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* GENERAL METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Characters"
              value={statistics.total_karakter}
            />
            <StatCard title="Total Words" value={statistics.total_kata} />
            <StatCard
              title="Total Sentences"
              value={statistics.total_kalimat}
            />
            <StatCard
              title="Avg Word Length"
              value={statistics.avg_word_length}
            />
            <StatCard
              title="Avg Sentence Length"
              value={statistics.avg_sentence_length}
            />
            <StatCard
              title="Most Frequent Word"
              value={statistics.kata_terbanyak}
              isHighlight
            />
          </div>

          {/* SENTIMENT OVERVIEW WITH PIE CHART */}
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/20">
              Sentiment Distribution Overview
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[entry.label]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderColor: "rgba(255, 255, 255, 0.1)",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Statistics */}
              <div className="flex flex-col justify-center space-y-4">
                {sentiment_analysis.summary.map((item, i) => {
                  const total = sentiment_analysis.summary.reduce(
                    (acc, curr) => acc + curr.count,
                    0,
                  );
                  const pct = ((item.count / total) * 100).toFixed(1);

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: COLORS[item.label] }}
                        ></div>
                        <span className="font-semibold text-white capitalize">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-white">
                          {item.count}
                        </p>
                        <p className="text-xs text-slate-400">{pct}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TOP SENTIMENT KEYWORDS */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Positive Keywords */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/20">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white">
                  Top 10 Positive Keywords
                </h3>
              </div>
              <div className="space-y-2">
                {sentiment_analysis.keywords.positive
                  .slice(0, 10)
                  .map((kw, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-slate-200 capitalize">
                          {kw.text}
                        </span>
                      </div>
                      <span className="font-bold text-green-400">
                        {kw.count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Negative Keywords */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/20">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
                  <svg
                    className="w-5 h-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white">
                  Top 10 Negative Keywords
                </h3>
              </div>
              <div className="space-y-2">
                {sentiment_analysis.keywords.negative
                  .slice(0, 10)
                  .map((kw, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-sm">
                          {i + 1}
                        </span>
                        <span className="font-semibold text-slate-200 capitalize">
                          {kw.text}
                        </span>
                      </div>
                      <span className="font-bold text-red-400">{kw.count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* TOP 10 POSITIVE REVIEWS */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/20">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white">
                Top 3 Most Positive Reviews
              </h3>
            </div>
            <div className="space-y-3">
              {sentiment_analysis.extremes.positive_samples
                .slice(0, 10)
                .map((sample, i) => (
                  <div
                    key={i}
                    className="p-4 bg-green-500/10 rounded-xl border border-green-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "{sample}"
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* TOP 10 NEGATIVE REVIEWS */}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/20">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-white">
                Top 3 Most Negative Reviews
              </h3>
            </div>
            <div className="space-y-3">
              {sentiment_analysis.extremes.negative_samples
                .slice(0, 10)
                .map((sample, i) => (
                  <div
                    key={i}
                    className="p-4 bg-red-500/10 rounded-xl border border-red-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-red-500 text-white rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "{sample}"
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* NGrams SECTION */}
          <div className="grid md:grid-cols-3 gap-4">
            <NGramList title="Unigrams" data={ngrams.unigrams} />
            <NGramList title="Bigrams" data={ngrams.bigrams} />
            <NGramList title="Trigrams" data={ngrams.trigrams} />
          </div>
        </div>

        {/* --- RIGHT COLUMN: SPACY --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 h-full shadow-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">SpaCy NLP Analysis</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  EN_CORE_WEB_SM Model
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* POS Tagging Groups */}
              <SpacyGroup
                title="Most Frequent Nouns"
                data={spacy.top_nouns}
                color="blue"
              />
              <SpacyGroup
                title="Common Verbs"
                data={spacy.top_verbs}
                color="green"
              />
              <SpacyGroup
                title="Descriptive Adjectives"
                data={spacy.top_adjectives}
                color="purple"
              />

              {/* NER Groups */}
              <div className="pt-6 border-t border-white/20">
                <h4 className="text-sm font-bold text-white mb-4">
                  Named Entity Recognition
                </h4>

                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <span>👤</span> People
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {spacy.top_people.length > 0 ? (
                        spacy.top_people.map((p, i) => (
                          <span
                            key={i}
                            className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg border border-blue-500/30 font-medium shadow-sm"
                          >
                            {p.token}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          No entities detected
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                      <span>📍</span> Places & Locations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {spacy.top_places.length > 0 ? (
                        spacy.top_places.map((p, i) => (
                          <span
                            key={i}
                            className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 font-medium shadow-sm"
                          >
                            {p.token}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 italic">
                          No locations detected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, isHighlight }) {
  return (
    <div
      className={`p-5 rounded-xl border backdrop-blur-md transition-all shadow-lg ${
        isHighlight
          ? "bg-blue-500/20 border-blue-400/40"
          : "bg-white/10 border-white/20"
      }`}
    >
      <p className="text-xs font-semibold text-slate-300 mb-2">{title}</p>
      <p className="text-2xl font-bold text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function NGramList({ title, data }) {
  const colors = {
    Unigrams: "text-purple-400",
    Bigrams: "text-blue-400",
    Trigrams: "text-pink-400",
  };

  const colorClass = colors[title] || "text-slate-200";

  return (
    <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 shadow-lg">
      <h4
        className={`text-sm font-bold ${colorClass} mb-4 pb-3 border-b border-white/20`}
      >
        {title}
      </h4>
      <div className="space-y-2">
        {data.slice(0, 8).map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-2 hover:bg-white/10 rounded-lg transition-colors cursor-default"
          >
            <span className="text-sm text-slate-200 capitalize truncate">
              {item.text}
            </span>
            <span className="text-xs font-semibold text-slate-300 bg-white/10 px-2 py-1 rounded border border-white/5">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpacyGroup({ title, data, color }) {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    green: "bg-green-500/10 text-green-300 border-green-500/20",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-3">{title}</h4>
      <div className="space-y-2">
        {data.slice(0, 4).map((item, i) => (
          <div
            key={i}
            className={`flex justify-between items-center p-3 rounded-lg border ${colorMap[color]}`}
          >
            <span className="font-medium text-sm">{item.token}</span>
            <span className="text-xs font-semibold opacity-70 bg-black/20 px-2 py-1 rounded-md">
              {item.counts}×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

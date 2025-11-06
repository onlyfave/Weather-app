import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    if (typeof onSearch === "function") {
      onSearch(query);
    }
    setQ("");
  };

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-3xl mx-auto flex gap-3 items-center"
    >
      <div className="flex items-center flex-1 bg-[rgba(255,255,255,0.03)] rounded-full px-4 py-3">
        <svg
          className="w-5 h-5 text-neutral200 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
          ></path>
        </svg>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="bg-transparent outline-none flex-1 text-neutral0 placeholder-neutral300"
          placeholder="Search for a place..."
          aria-label="Search city"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition text-white font-semibold"
      >
        Search
      </button>
    </form>
  );
}

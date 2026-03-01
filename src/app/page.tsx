"use client";

import { SearchBar } from "@/components/SearchBar";
import { TagCloud } from "@/components/TagCloud";
import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSearch = (term: string) => {
    if (term.trim()) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <main className="home-container">
      {/* Background decoration handled in CSS or simplified */}
      <div className="bg-decoration"></div>

      <div className="hero-section">
        <div className="hero-content">
          <div className="icon-wrapper">
            <BookOpen className="hero-icon" size={32} />
          </div>
          <h1>
            Quran <span className="text-emerald">Topics</span>
          </h1>
          <p className="subtitle">
            Find guidance, comfort, and answers from the Quran for every emotion and situation in life.
          </p>
        </div>

        <div className="search-section">
          <SearchBar onSearch={handleSearch} autoFocus />

          <div className="topics-section">
            <p className="section-label">Explore Topics</p>
            <TagCloud />
          </div>
        </div>
      </div>

      <footer>
        <p>Built with Next.js & Vanilla CSS</p>
      </footer>
    </main>
  );
}

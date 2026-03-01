"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { AyatCard } from "@/components/AyatCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { searchAyats, TieredSearchResults } from "@/lib/search";
import { searchQuranFromApi } from "@/lib/api";
import { Ayat, tags } from "@/data/quran-data";

// Check if a query is an exact tag name (case-insensitive)
function isExactTag(query: string): boolean {
    return tags.some((t) => t.toLowerCase() === query.trim().toLowerCase());
}

function mergeResults(local: Ayat[], fromApi: Ayat[]): Ayat[] {
    const seen = new Set<string>(local.map((a) => a.id));
    const merged = [...local];
    for (const ayat of fromApi) {
        if (!seen.has(ayat.id)) {
            seen.add(ayat.id);
            merged.push(ayat);
        }
    }
    return merged;
}

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-header">
                <div>
                    <div className="skeleton-line skeleton-title" />
                    <div className="skeleton-line skeleton-subtitle" />
                </div>
                <div className="skeleton-icons">
                    <div className="skeleton-line skeleton-icon" />
                    <div className="skeleton-line skeleton-icon" />
                </div>
            </div>
            <div className="skeleton-line skeleton-arabic" />
            <div className="skeleton-line skeleton-text-1" />
            <div className="skeleton-line skeleton-text-2" />
            <div className="skeleton-line skeleton-text-3" />
            <div className="skeleton-footer">
                <div className="skeleton-line skeleton-badge" />
                <div className="skeleton-line skeleton-badge" />
            </div>
        </div>
    );
}

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const router = useRouter();

    const [results, setResults] = React.useState<TieredSearchResults>({ highlyRelevant: [], allRelated: [] });
    const [activeTab, setActiveTab] = React.useState<"highly" | "all">("highly");
    const [apiLoading, setApiLoading] = React.useState(false);
    const [initialLoad, setInitialLoad] = React.useState(false);

    React.useEffect(() => {
        if (!query) {
            setResults({ highlyRelevant: [], allRelated: [] });
            return;
        }

        // --- Layer 1: Instant local synonym-expanded search ---
        const tiered = searchAyats(query);
        setResults(tiered);
        setInitialLoad(true);

        // --- Layer 2: Live full-Quran API search (Optional/Fallback) ---
        if (isExactTag(query)) {
            return;
        }

        setApiLoading(true);
        searchQuranFromApi(query)
            .then((apiResults) => {
                setResults(prev => ({
                    ...prev,
                    allRelated: mergeResults(prev.allRelated, apiResults)
                }));
            })
            .catch((err) => {
                console.error("API search failed:", err);
            })
            .finally(() => {
                setApiLoading(false);
            });
    }, [query]);

    const handleSearch = (term: string) => {
        if (term.trim()) {
            router.push(`/search?q=${encodeURIComponent(term)}`);
        }
    };

    const currentResults = activeTab === "highly" ? results.highlyRelevant : results.allRelated;
    const totalCount = results.allRelated.length;

    return (
        <div className="search-page">
            <div className="search-container-inner">
                <header className="search-header">
                    <Link href="/" className="back-link">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <div className="search-wrapper-header">
                        <SearchBar onSearch={handleSearch} defaultValue={query} />
                    </div>
                </header>

                <div className="results-summary">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                            <h2>
                                {!initialLoad
                                    ? "Searching..."
                                    : `${totalCount} result${totalCount !== 1 ? "s" : ""} for `}
                                {initialLoad && (
                                    <span className="text-emerald">&quot;{query}&quot;</span>
                                )}
                            </h2>
                            <p className="text-slate-500">
                                {apiLoading ? "Scanning full Quran..." : `Showing results for your quest.`}
                            </p>
                        </div>

                        {initialLoad && totalCount > 0 && (
                            <div className="tab-container" style={{
                                display: "flex",
                                background: "var(--slate-100, #f1f5f9)",
                                padding: "0.25rem",
                                borderRadius: "0.75rem",
                                border: "1px solid var(--slate-200, #e2e8f0)"
                            }}>
                                <button
                                    onClick={() => setActiveTab("highly")}
                                    className={`tab-btn ${activeTab === "highly" ? "active" : ""}`}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.5rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s",
                                        background: activeTab === "highly" ? "white" : "transparent",
                                        color: activeTab === "highly" ? "var(--slate-900, #0f172a)" : "var(--slate-500, #64748b)",
                                        boxShadow: activeTab === "highly" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    Highly Relevant ({results.highlyRelevant.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                                    style={{
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.5rem",
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        transition: "all 0.2s",
                                        background: activeTab === "all" ? "white" : "transparent",
                                        color: activeTab === "all" ? "var(--slate-900, #0f172a)" : "var(--slate-500, #64748b)",
                                        boxShadow: activeTab === "all" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    All Related ({results.allRelated.length})
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="results-grid">
                    {!initialLoad ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : currentResults.length > 0 ? (
                        currentResults.map((ayat) => (
                            <AyatCard key={ayat.id} ayat={ayat} />
                        ))
                    ) : (
                        <div className="no-results">
                            <p className="text-slate-400" style={{ fontSize: "1.25rem" }}>
                                {activeTab === "highly"
                                    ? `No "Highly Relevant" ayats found. Try the "All Related" tab.`
                                    : `No ayats found matching "${query}"`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}

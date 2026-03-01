"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { AyatCard } from "@/components/AyatCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { searchAyats } from "@/lib/search";
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

    const [allResults, setAllResults] = React.useState<Ayat[]>([]);
    const [apiLoading, setApiLoading] = React.useState(false);
    const [initialLoad, setInitialLoad] = React.useState(false);

    React.useEffect(() => {
        if (!query) {
            setAllResults([]);
            return;
        }

        // --- Layer 1: Instant local synonym-expanded search ---
        const local = searchAyats(query);
        setAllResults(local);
        setInitialLoad(true);

        // --- Layer 2: Live full-Quran API search ---
        // Skip API search for exact tag names so the count matches
        // the tag card count shown on the home page.
        if (isExactTag(query)) {
            return;
        }

        setApiLoading(true);
        searchQuranFromApi(query)
            .then((apiResults) => {
                setAllResults((prev) => mergeResults(prev, apiResults));
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

    const totalResults = allResults.length;

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
                    <h2>
                        {!initialLoad
                            ? "Searching..."
                            : `${totalResults} result${totalResults !== 1 ? "s" : ""} for `}
                        {initialLoad && (
                            <span className="text-emerald">&quot;{query}&quot;</span>
                        )}
                    </h2>
                    {initialLoad && (
                        <p className="text-slate-500" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {apiLoading ? (
                                <>
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "50%",
                                            background: "var(--emerald-500, #10b981)",
                                            animation: "pulse 1.2s infinite",
                                        }}
                                    />
                                    Searching full Quran for more results…
                                </>
                            ) : (
                                `Found ${totalResults} ayat${totalResults !== 1 ? "s" : ""} matching your search.`
                            )}
                        </p>
                    )}
                </div>

                <div className="results-grid">
                    {!initialLoad ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : allResults.length > 0 ? (
                        allResults.map((ayat) => (
                            <AyatCard key={ayat.id} ayat={ayat} />
                        ))
                    ) : (
                        <div className="no-results">
                            <p className="text-slate-400" style={{ fontSize: "1.25rem" }}>
                                No ayats found matching &quot;{query}&quot;
                            </p>
                            <p className="text-slate-400" style={{ marginTop: "0.5rem" }}>
                                Try different keywords — for example: &quot;patience&quot;, &quot;fear&quot;, &quot;forgiveness&quot;, &quot;wealth&quot;.
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

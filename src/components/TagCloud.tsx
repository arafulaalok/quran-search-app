/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { tags } from "@/data/quran-data";
import { getSearchResultCount } from "@/lib/search";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

export function TagCloud() {
    const [randomTags, setRandomTags] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        // Pick 5 random tags on client-side to avoid hydration mismatch
        const shuffled = [...tags].sort(() => 0.5 - Math.random());
        setRandomTags(shuffled.slice(0, 5));
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="tag-cloud">
                <div className="skeleton-badge" />
                <div className="skeleton-badge" />
                <div className="skeleton-badge" />
                <div className="skeleton-badge" />
                <div className="skeleton-badge" />
            </div>
        );
    }

    const sortedAllTags = [...tags].sort((a, b) => a.localeCompare(b));

    return (
        <div className="topics-explorer w-full">
            {/* 1. Quick Access (5 Random Tags) */}
            <div className="tag-cloud mb-6">
                {randomTags.map((tag) => (
                    <Link key={tag} href={`/search?q=${encodeURIComponent(tag)}`} className="tag-link">
                        <Badge variant="secondary" className="tag-item">
                            #{tag}
                        </Badge>
                    </Link>
                ))}
            </div>

            {/* 2. Toggle Button */}
            <div className="flex justify-center mb-8">
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="explore-more-btn group"
                >
                    {showAll ? (
                        <>
                            Hide All Topics
                            <ChevronUp size={16} />
                        </>
                    ) : (
                        <>
                            Explore All Topics
                            <ChevronDown size={16} />
                        </>
                    )}
                </button>
            </div>

            {/* 3. Full List (Accurate Count Cards) */}
            {showAll && (
                <div className="topics-dropdown-container animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {sortedAllTags.map((tag) => {
                            const count = getSearchResultCount(tag);
                            return (
                                <Link
                                    key={tag}
                                    href={`/search?q=${encodeURIComponent(tag)}`}
                                    className="topic-card-compact group"
                                >
                                    <span className="topic-name-small">{tag}</span>
                                    <span className="topic-count-small">{count} {count === 1 ? 'Ayat' : 'Ayats'}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

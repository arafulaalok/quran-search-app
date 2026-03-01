"use client";

import * as React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch?: (term: string) => void;
    defaultValue?: string;
    autoFocus?: boolean;
    className?: string;
}

export function SearchBar({ onSearch, defaultValue = "", autoFocus, className }: SearchBarProps) {
    const [term, setTerm] = React.useState(defaultValue);

    // Sync with defaultValue when the URL query changes (e.g. navigating between searches)
    React.useEffect(() => {
        setTerm(defaultValue);
    }, [defaultValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(term);
    };

    return (
        <form onSubmit={handleSubmit} className={`search-bar-container ${className || ""}`}>
            <div className="input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search by topic, emotion, or keyword..."
                    className="search-input"
                    autoFocus={autoFocus}
                />
                <button type="submit" className="search-btn btn btn-primary">
                    Search
                </button>
            </div>
        </form>
    );
}

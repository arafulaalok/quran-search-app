"use client";

import * as React from "react";
import { BookOpen, Sparkles, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export function AISidebar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [input, setInput] = React.useState("");
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const router = useRouter();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Reset input when opening
            setInput("");
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    const analyzeInput = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setIsAnalyzing(true);

        try {
            // Dynamically import NLP to keep initial load small
            const { extractTopics } = await import('@/lib/nlp');
            const detectedTags = extractTopics(input);

            // Close sidebar
            setIsOpen(false);

            // Redirect logic: combine all detected tags with a '+' for a stacked search.
            const searchQuery = detectedTags.length > 0 ? detectedTags.join('+') : input;

            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        } catch (error) {
            console.error("Failed to analyze input:", error);
            // Fallback to raw search
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(input)}`);
        } finally {
            setIsAnalyzing(false);
            setInput("");
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                className={`ai-floating-btn ${isOpen ? 'hidden' : ''}`}
                onClick={toggleSidebar}
                aria-label="Open AI Guide"
            >
                <div className="icon-wrapper-relative">
                    <BookOpen size={28} />
                    <div className="ai-bubble">
                        <Sparkles size={14} />
                    </div>
                </div>
            </button>

            {/* Backdrop Overlay */}
            {isOpen && (
                <div className="sidebar-overlay" onClick={handleBackdropClick} />
            )}

            {/* Sidebar Panel */}
            <div className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        <Sparkles className="text-emerald" size={20} />
                        <h3>AI Guidance</h3>
                    </div>
                    <button className="close-btn" onClick={toggleSidebar} aria-label="Close AI Guide">
                        <X size={24} />
                    </button>
                </div>

                <div className="sidebar-content">
                    <p className="sidebar-description">
                        Describe what you are feeling or facing right now. We will find relevant verses from the Quran for you.
                    </p>

                    <form onSubmit={analyzeInput} className="sidebar-form">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="E.g., I feel lost and anxious about my future..."
                            className="sidebar-input"
                            autoFocus={isOpen}
                        />
                        <button
                            type="submit"
                            disabled={isAnalyzing || !input.trim()}
                            className="btn btn-primary sidebar-submit-btn w-full"
                        >
                            {isAnalyzing ? (
                                <div className="spinner-small" />
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Find Guidance</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

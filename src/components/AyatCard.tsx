"use client";

import { Ayat } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Check } from "lucide-react";
import * as React from "react";

interface AyatCardProps {
    ayat: Ayat;
}

export function AyatCard({ ayat }: AyatCardProps) {
    const [copied, setCopied] = React.useState(false);

    const getShareText = () =>
        `${ayat.arabic ? ayat.arabic + "\n\n" : ""}${ayat.translation}\n\n— ${ayat.surahName} ${ayat.surahNumber}:${ayat.ayahNumber} (${ayat.source})`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getShareText());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const el = document.createElement("textarea");
            el.value = getShareText();
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = async () => {
        const text = getShareText();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${ayat.surahName} ${ayat.surahNumber}:${ayat.ayahNumber}`,
                    text,
                });
                return;
            } catch {
                // User cancelled share or not supported — fall through to clipboard
            }
        }
        // Fallback: copy to clipboard
        await handleCopy();
    };

    return (
        <div className="ayat-card">
            <div className="ayat-header">
                <div className="surah-info">
                    <span className="surah-name">{ayat.surahName}</span>
                    <span className="ayah-number">Verse {ayat.surahNumber}:{ayat.ayahNumber}</span>
                </div>
                <div className="card-actions">
                    <button
                        className="action-btn"
                        title={copied ? "Copied!" : "Copy Text"}
                        onClick={handleCopy}
                        style={{ color: copied ? "var(--emerald-500, #10b981)" : undefined, transition: "color 0.2s" }}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button className="action-btn" title="Share" onClick={handleShare}>
                        <Share2 size={16} />
                    </button>
                </div>
            </div>

            <div className="ayat-content">
                {ayat.arabic && (
                    <p className="arabic-text">{ayat.arabic}</p>
                )}
                <p className="translation-text">{ayat.translation}</p>
            </div>

            <div className="ayat-footer">
                <div className="tags-list">
                    {ayat.tags && ayat.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="mr-2">#{tag}</Badge>
                    ))}
                </div>
                <span className="source-badge">{ayat.source}</span>
            </div>
        </div>
    );
}

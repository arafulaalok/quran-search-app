import { Ayat } from "@/data/quran-data";
import { expandQuery } from "./search";
export type { Ayat };

interface ApiMatch {
    number: number;
    text: string;
    edition: { identifier: string; englishName: string; };
    surah: { number: number; englishName: string; };
    numberInSurah: number;
}

interface ApiResponse {
    code: number;
    status: string;
    data: {
        count: number;
        matches: ApiMatch[];
    };
}

export async function searchQuranFromApi(query: string): Promise<Ayat[]> {
    if (!query || query.trim().length < 2) return [];

    let concepts = [query.trim()];
    if (query.includes('+') || query.includes(',')) {
        concepts = query.split(/[+,]+/).map(q => q.trim()).filter(q => q.length > 0);
    }
    if (concepts.length === 0) return [];

    // 1. Search in English using the first concept and its top synonyms
    const baseQuery = concepts[0];
    const expandedTerms = expandQuery(baseQuery).slice(0, 3); // Top 3 terms (original + 2 synonyms)

    try {
        // Fetch all 3 terms in parallel to scan the full Quran broadly
        const searchPromises = expandedTerms.map(async (term) => {
            try {
                const res = await fetch(`http://api.alquran.cloud/v1/search/${encodeURIComponent(term)}/all/en.sahih`);
                if (!res.ok) return [];
                const data: ApiResponse = await res.json();
                return data.data.matches || [];
            } catch {
                return [];
            }
        });

        const resultsArray = await Promise.all(searchPromises);

        // Flatten and deduplicate matches by Ayat ID
        const uniqueMatchesMap = new Map<string, ApiMatch>();
        for (const list of resultsArray) {
            for (const match of list) {
                const id = `${match.surah.number}:${match.numberInSurah}`;
                if (!uniqueMatchesMap.has(id)) {
                    uniqueMatchesMap.set(id, match);
                }
            }
        }

        let matches = Array.from(uniqueMatchesMap.values());

        // Limit to top 20 for performance and fetching Arabic
        matches = matches.slice(0, 20);

        if (matches.length === 0) return [];

        // 2. Fetch Arabic text for these specific matches (Parallel)
        // We use a Promise.all to fetch them concurrently.
        const arabicPromises = matches.map(async (match) => {
            try {
                const arabicRes = await fetch(`http://api.alquran.cloud/v1/ayah/${match.surah.number}:${match.numberInSurah}/ar.alafasy`);
                const arabicData = await arabicRes.json();
                return arabicData.data.text;
            } catch {
                return ""; // Fallback if arabic fetch fails
            }
        });

        const arabicTexts = await Promise.all(arabicPromises);

        // 3. Combine results
        let finalResults = matches.map((match, index) => ({
            id: `${match.surah.number}:${match.numberInSurah}`,
            surahName: match.surah.englishName,
            surahNumber: match.surah.number,
            ayahNumber: match.numberInSurah,
            arabic: arabicTexts[index] || match.text, // Fallback to English if Arabic missing (shouldn't happen often)
            translation: match.text,
            source: "Sahih International",
            tags: [] // API doesn't provide tags
        }));

        // 4. Filter remaining concepts if stacked
        if (concepts.length > 1) {
            const extraExpanded = concepts.slice(1).map(c => expandQuery(c));
            finalResults = finalResults.filter(ayat => {
                const textLower = ayat.translation.toLowerCase();
                return extraExpanded.every(expandedList =>
                    expandedList.some(kw => textLower.includes(kw))
                );
            });
        }

        return finalResults;

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}

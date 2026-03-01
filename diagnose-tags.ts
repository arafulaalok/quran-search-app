// Diagnostic script: identifies tags with no directly-tagged ayats and tags where
// searchAyats would return irrelevant results

import { quranData, tags } from "./src/data/quran-data";
import { searchAyats, expandQuery, getAyatsByTag } from "./src/lib/search";

console.log("=== TAG RELEVANCE DIAGNOSTIC REPORT ===\n");

// 1. Tags with zero directly-tagged ayats
console.log("--- Tags with ZERO directly-tagged ayats ---");
const untaggedTags: string[] = [];
for (const tag of tags) {
    const directlyTagged = quranData.filter((ayat) =>
        ayat.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
    if (directlyTagged.length === 0) {
        untaggedTags.push(tag);
        console.log(`  ❌ "${tag}" → 0 ayats directly tagged`);
    }
}
console.log(`\nTotal tags with no direct ayats: ${untaggedTags.length} / ${tags.length}\n`);

// 2. For each tag, show what searchAyats returns and check relevance
console.log("--- Search results per tag (via searchAyats) ---");
for (const tag of tags) {
    const results = searchAyats(tag);
    const directlyTagged = quranData.filter((ayat) =>
        ayat.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );

    const expanded = expandQuery(tag);

    // Flag if search returns results but none are directly tagged
    const hasDirectTag = directlyTagged.length > 0;
    const hasSearchResults = results.length > 0;

    if (!hasDirectTag || !hasSearchResults) {
        const flag = !hasDirectTag && hasSearchResults
            ? "⚠️  NO DIRECT TAG - results via synonyms only"
            : !hasSearchResults
                ? "🔴 NO RESULTS AT ALL"
                : "";
        console.log(`  "${tag}": ${results.length} search results, ${directlyTagged.length} directly tagged ${flag}`);
        console.log(`    expanded keywords: [${expanded.slice(0, 10).join(", ")}${expanded.length > 10 ? '...' : ''}]`);
        if (hasSearchResults && !hasDirectTag) {
            // Show first 3 results to check relevance
            console.log(`    Top results (check relevance):`);
            for (const r of results.slice(0, 3)) {
                console.log(`      ${r.id}: ${r.translation.substring(0, 80)}... tags: [${r.tags.join(", ")}]`);
            }
        }
        console.log();
    }
}

// 3. Check expandQuery for tag names that expand to unrelated terms
console.log("\n--- Synonym expansion issues for tag names ---");
for (const tag of tags) {
    const expanded = expandQuery(tag);
    // Remove the tag itself from expanded
    const extras = expanded.filter(e => e !== tag.toLowerCase());
    if (extras.length > 3) {
        console.log(`  "${tag}" expands to ${expanded.length} terms: [${expanded.join(", ")}]`);
    }
}

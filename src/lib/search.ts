import { Ayat, quranData, tags } from "@/data/quran-data";

// ---------------------------------------------------------------------------
// Synonym / keyword expansion map
// Keys = common everyday words a user might type.
// Values = Quranic topic words / words likely appearing in translations/tags.
// ---------------------------------------------------------------------------
const SYNONYM_MAP: Record<string, string[]> = {
    // Emotions – negative
    sad: ["sadness", "sorrow", "grief", "depression", "grieve", "weaken", "weep"],
    unhappy: ["sadness", "sorrow", "grief", "depression"],
    miserable: ["sadness", "depression", "hardship"],
    despair: ["despair", "mercy", "hope", "repentance", "do not despair"],
    hopeless: ["hope", "despair", "mercy", "patience"],
    grief: ["sorrow", "sadness", "grief", "grieve"],
    cry: ["grief", "sadness", "sorrow", "weep"],
    depressed: ["depression", "sadness", "hardship", "anxiety", "weakness"],
    lonely: ["closeness", "allah", "remembrance", "peace", "near", "prayer"],
    alone: ["closeness", "allah", "near", "prayer", "remembrance"],
    isolated: ["closeness", "allah", "remembrance", "peace"],

    // Emotions – fear/anxiety
    fear: ["fear", "anxiety", "afraid", "scared", "dread"],
    scared: ["fear", "anxiety", "afraid"],
    afraid: ["fear", "anxiety", "afraid"],
    worried: ["anxiety", "fear", "trust", "patience"],
    nervous: ["anxiety", "fear", "trust"],
    panic: ["anxiety", "fear", "trust", "patience"],
    anxious: ["anxiety", "fear", "trust"],
    anxiousness: ["anxiety", "fear", "trust"],
    stress: ["anxiety", "hardship", "patience", "trust"],
    stressed: ["anxiety", "hardship", "patience"],
    overwhelmed: ["anxiety", "hardship", "patience", "burden", "bear"],

    // Emotions – positive
    grateful: ["gratitude", "thankful", "gratitude", "blessings"],
    thankful: ["gratitude", "thankful", "blessings"],
    happy: ["peace", "joy", "tranquillity", "gratitude"],
    joyful: ["joy", "peace", "tranquillity"],
    content: ["peace", "tranquillity", "gratitude", "trust"],
    calm: ["peace", "tranquillity", "remembrance", "hearts"],
    hopeful: ["hope", "patience", "mercy", "trust"],

    // Anger
    angry: ["anger", "anger", "restrain", "pardon", "patience"],
    rage: ["anger", "restrain", "patience"],
    furious: ["anger", "restrain", "pardon"],

    // Hardship / difficulty
    difficulty: ["hardship", "ease", "patience", "tests"],
    struggle: ["hardship", "patience", "tests", "hardship"],
    pain: ["hardship", "patience", "sickness", "ease", "healing"],
    suffering: ["hardship", "patience", "mercy", "ease"],
    hurt: ["hardship", "sickness", "patience", "forgiveness"],
    tired: ["hardship", "patience", "weakness", "sleep", "peace", "healing", "exhaustion"],
    exhausted: ["hardship", "weakness", "patience", "sleep", "peace"],
    broken: ["hardship", "sadness", "mercy", "hope"],
    failed: ["failure", "hardship", "patience", "trust"],
    failure: ["failure", "hardship", "patience"],
    loss: ["hardship", "patience", "death", "tests", "grief"],
    losing: ["hardship", "patience", "tests"],

    // Success / achievement
    success: ["success", "provision", "gratitude", "trust"],
    succeed: ["success", "provision", "trust"],
    achievement: ["success", "gratitude", "provision"],
    winning: ["success", "faith", "strength"],
    goal: ["success", "provision", "trust", "guidance"],
    ambition: ["success", "provision", "trust"],

    // Money / wealth / provision
    money: ["money", "wealth", "provision", "charity", "business"],
    wealth: ["money", "provision", "charity", "business", "interest", "tests", "gratitude", "arrogance"],
    rich: ["wealth", "provision", "gratitude", "charity", "money", "tests"],
    poor: ["charity", "provision", "orphans", "hardship", "money", "patience"],
    debt: ["debt", "hardship", "charity", "money"],
    finance: ["money", "business", "charity", "interest"],
    spending: ["charity", "money", "provision", "business"],
    earn: ["provision", "money", "business", "gratitude"],
    income: ["provision", "money", "business"],
    interest: ["interest", "riba", "business", "money", "interest (riba)"],
    loan: ["debt", "money", "charity"],

    // Forgiveness / sin / repentance
    forgive: ["forgiveness", "mercy", "repentance", "sin"],
    forgiveness: ["forgiveness", "mercy", "repentance"],
    guilt: ["sin", "repentance", "forgiveness", "mercy"],
    sin: ["sin", "repentance", "forgiveness", "mercy"],
    sinning: ["sin", "repentance", "forgiveness"],
    mistake: ["sin", "repentance", "forgiveness", "mercy"],
    regret: ["repentance", "forgiveness", "sin", "mercy"],
    repent: ["repentance", "forgiveness", "mercy", "sin"],
    shame: ["sin", "repentance", "forgiveness", "mercy"],
    wrongdoing: ["sin", "justice", "repentance", "forgiveness"],

    // Relationships
    marriage: ["marriage", "spouse", "love", "mercy", "family"],
    wife: ["spouse", "marriage", "love", "mercy", "family"],
    husband: ["spouse", "marriage", "love", "mercy", "family"],
    love: ["love", "mercy", "marriage", "affection", "kindness"],
    relationship: ["marriage", "family", "love", "kindness"],
    divorce: ["marriage", "spouse", "family", "justice", "heartbreak", "patience"],
    family: ["family", "parents", "kindness", "duty"],
    mother: ["parents", "family", "kindness", "duty"],
    father: ["parents", "family", "duty", "kindness"],
    parents: ["parents", "family", "duty", "kindness"],
    children: ["family", "parents", "duty", "kindness"],
    orphan: ["orphans", "charity", "kindness"],

    // Health / sickness
    sick: ["sickness", "health", "healing", "cure", "trust"],
    illness: ["sickness", "health", "healing", "trust"],
    disease: ["sickness", "health", "healing"],
    heal: ["sickness", "healing", "health", "trust"],
    healing: ["sickness", "health", "trust", "cure"],
    cure: ["healing", "sickness", "health", "trust"],
    hospital: ["sickness", "health", "healing"],
    death: ["death", "hereafter", "life", "jannah", "day of judgement"],
    dying: ["death", "hereafter", "life", "jannah"],
    dead: ["death", "hereafter", "day of judgement"],
    afterlife: ["hereafter", "jannah", "hellfire", "day of judgement", "death"],
    heaven: ["jannah", "hereafter", "day of judgement"],
    hell: ["hellfire", "hereafter", "day of judgement"],
    judgement: ["day of judgement", "hereafter", "jannah", "hellfire"],
    akhirah: ["hereafter", "jannah", "day of judgement"],

    // Faith / worship
    prayer: ["prayer", "remembrance", "closeness to allah", "worship"],
    salah: ["prayer", "remembrance", "closeness to allah"],
    dua: ["prayer", "closeness to allah", "hope", "remembrance"],
    worship: ["prayer", "closeness to allah", "remembrance", "duty"],
    faith: ["faith", "belief", "guidance", "trust", "prayer"],
    belief: ["faith", "guidance", "trust"],
    iman: ["faith", "guidance", "trust", "belief"],
    tawakkul: ["trust", "faith", "future", "provision"],
    trust: ["trust", "faith", "provision", "future"],
    guidance: ["guidance", "faith", "knowledge", "wisdom"],
    islam: ["faith", "guidance", "prayer", "duty"],
    quran: ["guidance", "knowledge", "wisdom", "faith"],
    dhikr: ["remembrance", "peace", "closeness to allah"],
    remembrance: ["remembrance", "peace", "closeness to allah"],

    // Knowledge / wisdom
    knowledge: ["knowledge", "wisdom", "guidance"],
    wisdom: ["wisdom", "knowledge", "guidance"],
    learn: ["knowledge", "wisdom", "guidance"],
    education: ["knowledge", "wisdom", "guidance"],
    ignorance: ["knowledge", "wisdom", "guidance"],
    smart: ["knowledge", "wisdom"],

    // Justice / honesty / social
    justice: ["justice", "honesty", "duty", "oppression"],
    fair: ["justice", "honesty", "duty"],
    honest: ["honesty", "justice", "speech", "duty"],
    lie: ["honesty", "sin", "hypocrisy", "speech"],
    lying: ["honesty", "sin", "hypocrisy", "speech"],
    cheat: ["honesty", "sin", "hypocrisy"],
    cheating: ["honesty", "hypocrisy", "sin", "speech", "betrayal", "heartbreak", "forgiveness", "justice", "zina"],
    deceive: ["honesty", "hypocrisy", "sin"],
    hypocrite: ["hypocrisy", "sin", "honesty", "faith", "character"],
    oppression: ["oppression", "justice", "duty"],
    oppressed: ["oppression", "justice", "help"],
    gossip: ["speech", "honesty", "sin", "backbite", "rumors", "backbiting"],
    backbiting: ["sin", "speech", "honesty"],
    boundaries: ["boundaries", "limits", "laws", "hudud", "protection"],

    // Friends / social
    friends: ["friends", "kindness", "speech", "enemies"],
    friendship: ["friends", "kindness", "love"],
    breakup: ["heartbreak", "grief", "patience", "healing", "future"],
    affair: ["betrayal", "heartbreak", "forgiveness", "zina", "marriage"],
    jealousy: ["jealousy", "patience", "gratitude", "focus"],
    envy: ["jealousy", "patience", "gratitude"],
    betrayal: ["betrayal", "heartbreak", "forgiveness", "patience", "trust"],
    heartbreak: ["heartbreak", "grief", "sadness", "patience", "healing"],
    enemy: ["enemies", "patience", "forgiveness"],
    enemies: ["enemies", "patience", "forgiveness"],
    community: ["friends", "charity", "kindness"],

    // Future / destiny
    future: ["future", "trust", "provision", "destiny"],
    destiny: ["trust", "future", "wisdom"],
    fate: ["trust", "future", "destiny", "wisdom"],
    plan: ["trust", "future", "wisdom", "provision"],

    // Nature / creation
    nature: ["nature", "creation", "animals", "water"],
    creation: ["creation", "nature", "animals"],
    animals: ["animals", "creation", "nature"],
    water: ["water", "creation", "nature"],

    // Miscellaneous
    travel: ["travel", "provision", "trust"],
    sleep: ["sleep", "peace", "trust"],
    food: ["food", "provision", "gratitude"],
    clothes: ["clothing", "provision", "gratitude"],
    clothing: ["clothing", "provision", "gratitude"],
    business: ["business", "money", "provision", "honesty"],
    work: ["provision", "business", "money", "duty"],
    job: ["provision", "business", "duty"],
    charity: ["charity", "money", "kindness", "provision"],
    donation: ["charity", "money", "kindness"],
    sadaqah: ["charity", "provision", "kindness"],
    zakat: ["charity", "money", "provision"],

    // Intimacy / Desires / Purity
    sexual: ["temptation", "desires (nafs)", "lust", "purity", "modesty", "intimacy"],
    lust: ["temptation", "desires (nafs)", "purity", "intimacy", "modesty"],
    desire: ["desires (nafs)", "temptation", "lust"],
    horny: ["lust", "temptation", "desires (nafs)", "purity", "modesty"],
    addiction: ["addiction", "desires (nafs)", "temptation", "healing", "weakness"],
    addicted: ["addiction", "weakness", "healing", "repentance"],
    porn: ["purity", "modesty", "lust", "temptation", "desires (nafs)", "addiction"],
    masturbation: ["purity", "lust", "temptation", "desires (nafs)", "addiction", "modesty"],
    zina: ["purity", "modesty", "lust", "temptation", "desires (nafs)", "sin"],
    intimacy: ["intimacy", "marriage", "spouse", "love", "purity", "modesty"],
    modesty: ["modesty", "purity", "character"],
    purity: ["purity", "modesty", "healing", "forgiveness"],

    // Mental Health / Self-Worth / Neurodivergence
    suicide: ["hope", "life", "healing", "mercy", "self-worth"],
    suicidal: ["hope", "life", "healing", "mercy", "self-worth", "grief"],
    worthless: ["self-worth", "mercy", "creation", "hope"],
    ugly: ["self-worth", "creation", "gratitude", "vanity"],
    empty: ["healing", "remembrance", "closeness to allah", "prayer", "peace"],
    numb: ["healing", "prayer", "peace", "focus", "trauma"],
    loneliness: ["loneliness", "closeness to allah", "remembrance"],
    overthinking: ["overthinking", "anxiety", "peace", "trust", "future"],
    adhd: ["focus", "patience", "hardship", "weakness"],
    trauma: ["trauma", "healing", "hardship", "patience", "mercy"],
    ptsd: ["trauma", "healing", "hardship", "anxiety", "peace"],
    burnout: ["exhaustion", "weakness", "hardship", "patience", "sleep"],
    exhaustion: ["exhaustion", "weakness", "hardship", "patience", "sleep"],
    bipolar: ["hardship", "healing", "patience", "weakness"],
    "self-harm": ["healing", "mercy", "hope", "self-worth", "trauma"],

    // Modern Sins & Struggles
    alcohol: ["intoxicants", "addiction", "sin", "repentance"],
    drinking: ["intoxicants", "addiction", "sin", "repentance"],
    drunk: ["intoxicants", "addiction", "sin", "repentance"],
    drugs: ["intoxicants", "addiction", "sin", "weakness", "healing"],
    weed: ["intoxicants", "addiction", "sin", "weakness"],
    smoking: ["addiction", "weakness", "health"],
    vaping: ["addiction", "weakness", "health"],
    gambling: ["intoxicants", "money", "addiction", "sin", "loss"],
    betting: ["intoxicants", "money", "addiction", "loss", "sin"],
    casino: ["intoxicants", "money", "addiction", "loss"],

    // Social Media & Vanity
    tiktok: ["vanity", "time", "focus", "arrogance", "modesty"],
    instagram: ["vanity", "jealousy", "arrogance", "modesty"],
    "showing off": ["vanity", "arrogance", "character", "humility"],
    vanity: ["vanity", "arrogance", "character", "humility"],
    arrogance: ["arrogance", "vanity", "character", "humility"],
    fame: ["vanity", "arrogance", "humility", "success"],
    attention: ["vanity", "arrogance", "love", "loneliness"],
    narcissist: ["arrogance", "abuse", "oppression", "character"],

    // Relationship Difficulties
    fighting: ["anger", "speech", "pardon", "forgiveness", "patience"],
    nafs: ["desires", "desires (nafs)", "temptation", "purity"],

    // Faith & Knowledge Struggles
    atheist: ["faith", "doubt", "guidance", "wisdom", "creation"],
    doubt: ["doubt", "faith", "guidance", "overthinking", "knowledge"],
    "losing faith": ["faith", "doubt", "guidance", "weakness"],
    shirk: ["sin", "faith", "repentance", "forgiveness"],

    // Gossip & Society
    rumors: ["rumors", "speech", "honesty", "sin"],
    lies: ["honesty", "speech", "sin", "hypocrisy"],

    toxic: ["friends", "enemies", "patience", "boundaries", "abuse"],
    fake: ["hypocrisy", "honesty", "friends", "enemies"],
    hate: ["forgiveness", "patience", "anger", "peace"],

    // Motivation
    lazy: ["focus", "hardship", "success", "duty"],
    procrastinate: ["focus", "success", "duty", "time"],
    unmotivated: ["focus", "success", "purpose", "wisdom"],
    lost: ["guidance", "focus", "purpose", "prayer"],

    // Mundane / Everyday Life (Maximum Coverage)
    school: ["knowledge", "wisdom", "tests", "focus", "success"],
    college: ["knowledge", "wisdom", "tests", "focus", "success", "future"],
    university: ["knowledge", "wisdom", "tests", "focus", "success", "future"],
    exam: ["tests", "knowledge", "hardship", "patience", "success"],
    test: ["tests", "knowledge", "hardship", "patience", "success"],
    studying: ["knowledge", "wisdom", "focus", "duty", "success"],
    homework: ["knowledge", "focus", "duty", "time"],
    driving: ["travel", "patience", "protection", "duty"],
    traffic: ["travel", "patience", "hardship", "time", "anger"],
    car: ["travel", "provision", "protection", "gratitude"],
    flight: ["travel", "protection", "creation", "nature"],
    traveling: ["travel", "protection", "duty", "nature"],
    moving: ["travel", "future", "provision", "trust"],
    journey: ["travel", "future", "tests", "life"],
    cooking: ["provision", "family", "food", "gratitude", "time"],
    cleaning: ["purity", "duty", "family", "home", "time"],
    house: ["family", "provision", "protection", "peace"],
    home: ["family", "provision", "protection", "peace"],
    eating: ["food", "provision", "gratitude", "health"],
    hungry: ["food", "provision", "gratitude", "hardship"],
    starving: ["food", "provision", "hardship", "patience"],
    diet: ["food", "health", "patience", "strength"],
    sleepy: ["sleep", "peace", "healing", "exhaustion", "time"],
    bed: ["sleep", "peace", "healing", "protection"],
    insomnia: ["sleep", "hardship", "prayer", "remembrance", "healing"],
    dream: ["sleep", "future", "wisdom", "hope"],
    nightmare: ["sleep", "protection", "fear", "prayer"],
    rain: ["water", "nature", "creation", "provision", "mercy"],
    sun: ["nature", "creation", "time", "provision"],
    hot: ["nature", "hardship", "patience", "hellfire"],
    cold: ["nature", "hardship", "patience", "protection"],
    weather: ["nature", "creation", "water", "time"],
    storm: ["nature", "fear", "protection", "prayer"],
    rent: ["money", "provision", "trust", "hardship", "debt"],
    bills: ["money", "provision", "trust", "hardship", "debt"],
    taxes: ["money", "provision", "duty", "hardship"],
    salary: ["money", "provision", "duty", "gratitude"],
    movie: ["time", "life", "focus", "delusion"],
    game: ["time", "life", "focus", "delusion", "test"],
    gaming: ["time", "focus", "delusion", "addiction"],
    music: ["time", "focus", "heart", "peace"],
    party: ["time", "social", "friends", "delusion"]
};

/**
 * Expand a raw query into a list of keywords to search against.
 * Returns original words + any synonym expansions (lowercased).
 */
export function expandQuery(query: string): string[] {
    const words = query.toLowerCase().trim().split(/\s+/);
    const expanded = new Set<string>(words);

    for (const word of words) {
        // Direct synonym lookup
        const synonyms = SYNONYM_MAP[word];
        if (synonyms) {
            synonyms.forEach((s) => expanded.add(s.toLowerCase()));
        }
        // Partial synonym lookup: only match if the word is very close to the key
        // Skip short words (< 3 chars) to avoid "to", "of", etc. triggering broad matches
        if (word.length >= 3) {
            for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
                if (key === word) continue; // already handled above
                const lenDiff = Math.abs(key.length - word.length);
                if (lenDiff <= 3 && (key.startsWith(word) || word.startsWith(key))) {
                    synonyms.forEach((s) => expanded.add(s.toLowerCase()));
                    expanded.add(key);
                }
            }
        }
    }

    return Array.from(expanded);
}

/**
 * Score an ayat against a list of expanded keywords.
 * Higher = more relevant.
 */
function scoreAyat(ayat: Ayat, keywords: string[]): number {
    let score = 0;
    const translationLower = ayat.translation.toLowerCase();
    const tagsLower = ayat.tags.map((t) => t.toLowerCase());
    const surahLower = ayat.surahName.toLowerCase();

    for (const kw of keywords) {
        // Exact tag match is the strongest signal
        if (tagsLower.some((t) => t === kw)) score += 10;
        // Tag contains keyword (partial) is a weaker signal
        else if (tagsLower.some((t) => t.includes(kw))) score += 3;

        if (translationLower.includes(kw)) score += 3;
        if (surahLower.includes(kw)) score += 2;

        // Partial word matching for recall
        if (translationLower.split(/\s+/).some(word => word.startsWith(kw) || kw.startsWith(word))) {
            score += 1;
        }
    }
    return score;
}

/**
 * Check if a query matches an exact tag name (case-insensitive)
 */
function isTagName(query: string): string | null {
    const q = query.trim().toLowerCase();
    for (const tag of tags) {
        if (tag.toLowerCase() === q) return tag;
    }
    return null;
}

export function searchAyats(query: string): Ayat[] {
    if (!query || query.trim().length < 1) return [];

    const normalizedQuery = query.trim().toLowerCase();

    // --- Special handling: if searching for an exact tag ---
    const exactTag = isTagName(normalizedQuery);
    if (exactTag) {
        return getAyatsByTag(exactTag)
            .map(ayat => ({ ayat, score: scoreAyat(ayat, [exactTag.toLowerCase()]) }))
            .sort((a, b) => b.score - a.score)
            .map(({ ayat }) => ayat);
    }

    // --- General search: Split concepts and expand ---
    const concepts = normalizedQuery.split(/[+,]+/).map(q => q.trim()).filter(q => q.length > 0);
    const expandedKeywords = concepts.length > 0 ? concepts.flatMap(c => expandQuery(c)) : expandQuery(normalizedQuery);

    const scored = quranData
        .map((ayat) => {
            const score = scoreAyat(ayat, expandedKeywords);

            // Boost score if it matches multiple distinct concepts (if multiple were provided)
            let conceptMatchCount = 0;
            if (concepts.length > 1) {
                for (const concept of concepts) {
                    const conceptKeywords = expandQuery(concept);
                    if (scoreAyat(ayat, conceptKeywords) > 0) {
                        conceptMatchCount++;
                    }
                }
            }

            // Weighting: verses matching ALL concepts get a massive boost
            const finalScore = score * (conceptMatchCount === concepts.length && concepts.length > 1 ? 5 : 1);

            return { ayat, score: finalScore };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);

    return scored.map(({ ayat }) => ayat);
}

export function getAyatsByTag(tag: string): Ayat[] {
    return quranData.filter((ayat) =>
        ayat.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
}

export function getAllAyats(): Ayat[] {
    return quranData;
}

/**
 * Returns the exact number of results a query would return.
 * Used for displaying accurate counts on topic cards.
 */
export function getSearchResultCount(query: string): number {
    return searchAyats(query).length;
}

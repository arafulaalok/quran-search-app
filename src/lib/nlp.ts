import nlp from "compromise";
import { tags, Tag } from "@/data/quran-data";

// This dictionary maps common English words (roots, verbs, emotions, situations)
// to our highly specific Quranic Topics (tags).
const topicDictionary: Record<string, Tag[]> = {
    // Negative Emotions & Hardships
    anxious: ["Anxiety", "Peace", "Trust"],
    anxiousness: ["Anxiety", "Peace", "Trust"],
    anxiety: ["Anxiety", "Peace", "Trust"],
    worry: ["Anxiety", "Trust", "Future"],
    scared: ["Fear", "Trust", "Closeness to Allah"],
    fear: ["Fear", "Trust"],
    afraid: ["Fear", "Trust", "Closeness to Allah"],
    sad: ["Sadness", "Depression", "Hope", "Patience"],
    depressed: ["Depression", "Hope", "Patience", "Life"],
    unhappy: ["Sadness", "Gratitude"],
    cry: ["Sadness", "Patience", "Prayer"],
    angry: ["Anger", "Patience", "Forgiveness"],
    mad: ["Anger", "Forgiveness"],
    frustrated: ["Anger", "Patience", "Tests"],
    tired: ["Hardship", "Patience", "Sleep"],
    exhausted: ["Hardship", "Weakness", "Patience"],
    weak: ["Weakness", "Strength", "Closeness to Allah"],
    fail: ["Failure", "Tests", "Hope", "Success"],
    failure: ["Failure", "Hope", "Tests"],
    lost: ["Guidance", "Hope", "Prayer"],
    confused: ["Guidance", "Wisdom", "Knowledge"],
    guilty: ["Sin", "Repentance", "Forgiveness", "Mercy"],
    sin: ["Sin", "Repentance", "Forgiveness", "Mercy"],
    regret: ["Repentance", "Forgiveness", "Mercy"],
    hard: ["Hardship", "Patience", "Tests"],
    difficult: ["Hardship", "Tests"],
    pain: ["Hardship", "Patience", "Sickness"],
    hurt: ["Sadness", "Forgiveness", "Patience"],
    heartbreak: ["Sadness", "Patience", "Trust"],
    lonely: ["Closeness to Allah", "Friends", "Family"],
    alone: ["Closeness to Allah", "Prayer"],

    // Needs & Worldly Situations
    money: ["Provision", "Money", "Trust", "Charity"],
    poor: ["Provision", "Charity", "Tests"],
    job: ["Provision", "Business", "Success"],
    work: ["Business", "Success", "Duty"],
    debt: ["Debt", "Provision", "Charity"],
    sick: ["Sickness", "Health", "Patience"],
    ill: ["Sickness", "Health"],
    disease: ["Sickness", "Health", "Tests"],
    exam: ["Tests", "Success", "Knowledge", "Patience", "Hardship"],
    test: ["Tests", "Patience", "Success", "Knowledge", "Hardship"],
    study: ["Knowledge", "Wisdom", "Success"],
    marry: ["Marriage", "Spouse", "Love"],
    marriage: ["Marriage", "Spouse", "Love", "Family"],
    divorce: ["Marriage", "Hardship", "Justice"],
    parent: ["Parents", "Family", "Duty", "Kindness"],
    mother: ["Parents", "Family", "Kindness"],
    father: ["Parents", "Family", "Kindness"],
    child: ["Family", "Parents", "Tests"],
    friend: ["Friends", "Peace"],
    enemy: ["Enemies", "Justice"],

    // Positive Goals & Actions
    peace: ["Peace", "Remembrance"],
    happy: ["Gratitude", "Success", "Jannah"],
    success: ["Success", "Gratitude", "Trust"],
    win: ["Success", "Gratitude"],
    forgive: ["Forgiveness", "Mercy", "Repentance"],
    pray: ["Prayer", "Closeness to Allah", "Guidance"],
    dua: ["Prayer", "Hope", "Closeness to Allah"],
    thank: ["Gratitude", "Peace"],
    grateful: ["Gratitude", "Peace"],
    patient: ["Patience", "Hardship"],
    love: ["Love", "Mercy", "Marriage"],

    // Big Concepts
    life: ["Life", "Tests", "Wisdom"],
    death: ["Death", "Day of Judgement"],
    die: ["Death", "Day of Judgement", "Repentance"],
    jannah: ["Jannah", "Day of Judgement"],
    hell: ["Hellfire", "Day of Judgement"],
    heaven: ["Jannah", "Day of Judgement"],

    // Intimacy / Desires / Purity
    sexual: ["Temptation", "Desires (Nafs)", "Lust", "Purity", "Modesty", "Intimacy"],
    lust: ["Temptation", "Desires (Nafs)", "Purity", "Intimacy", "Modesty"],
    desire: ["Desires (Nafs)", "Temptation", "Lust"],
    horny: ["Lust", "Temptation", "Desires (Nafs)", "Purity", "Modesty"],
    addiction: ["Addiction", "Desires (Nafs)", "Temptation", "Healing", "Weakness"],
    addicted: ["Addiction", "Weakness", "Healing", "Repentance"],
    porn: ["Purity", "Modesty", "Lust", "Temptation", "Desires (Nafs)", "Addiction"],
    masturbation: ["Purity", "Lust", "Temptation", "Desires (Nafs)", "Addiction", "Modesty"],
    intimacy: ["Intimacy", "Marriage", "Spouse", "Love", "Purity", "Modesty"],
    modesty: ["Modesty", "Purity"],
    purity: ["Purity", "Modesty", "Healing", "Forgiveness"],

    // Mental Health / Self-Worth / Neurodivergence
    suicide: ["Hope", "Life", "Healing", "Mercy", "Self-Worth"],
    suicidal: ["Hope", "Life", "Healing", "Mercy", "Self-Worth", "Grief"],
    worthless: ["Self-Worth", "Mercy", "Creation", "Hope"],
    ugly: ["Self-Worth", "Creation", "Gratitude", "Vanity"],
    empty: ["Healing", "Remembrance", "Closeness to Allah", "Prayer", "Peace"],
    numb: ["Healing", "Prayer", "Peace", "Focus", "Trauma"],
    loneliness: ["Loneliness", "Closeness to Allah", "Remembrance"],
    overthinking: ["Overthinking", "Anxiety", "Peace", "Trust", "Future"],
    adhd: ["Focus", "Patience", "Hardship", "Weakness"],
    trauma: ["Trauma", "Healing", "Hardship", "Patience", "Mercy"],
    ptsd: ["Trauma", "Healing", "Hardship", "Anxiety", "Peace"],
    burnout: ["Exhaustion", "Weakness", "Hardship", "Patience", "Sleep"],
    exhaustion: ["Exhaustion", "Weakness", "Hardship", "Patience", "Sleep"],
    bipolar: ["Hardship", "Healing", "Patience", "Weakness"],
    "self-harm": ["Healing", "Mercy", "Hope", "Self-Worth", "Trauma"],

    // Modern Sins & Struggles
    alcohol: ["Intoxicants", "Addiction", "Sin", "Repentance"],
    drinking: ["Intoxicants", "Addiction", "Sin", "Repentance"],
    drunk: ["Intoxicants", "Addiction", "Sin", "Repentance"],
    drugs: ["Intoxicants", "Addiction", "Sin", "Weakness", "Healing"],
    weed: ["Intoxicants", "Addiction", "Sin", "Weakness"],
    smoking: ["Addiction", "Weakness", "Health"],
    vaping: ["Addiction", "Weakness", "Health"],
    gambling: ["Intoxicants", "Money", "Addiction", "Sin", "Loss"],
    betting: ["Intoxicants", "Money", "Addiction", "Loss", "Sin"],
    casino: ["Intoxicants", "Money", "Addiction", "Loss"],

    // Social Media & Vanity
    tiktok: ["Vanity", "Time", "Focus", "Arrogance", "Modesty"],
    instagram: ["Vanity", "Jealousy", "Arrogance", "Modesty"],
    "showing off": ["Vanity", "Arrogance", "Character", "Humility"],
    vanity: ["Vanity", "Arrogance", "Character", "Humility"],
    arrogance: ["Arrogance", "Vanity", "Character", "Humility"],
    fame: ["Vanity", "Arrogance", "Humility", "Success"],
    attention: ["Vanity", "Arrogance", "Love", "Loneliness"],
    narcissist: ["Arrogance", "Abuse", "Oppression", "Character"],

    // Relationship Difficulties
    breakup: ["Heartbreak", "Grief", "Patience", "Healing", "Future"],
    abuse: ["Abuse", "Oppression", "Justice", "Trauma", "Patience", "Healing"],
    abusive: ["Abuse", "Oppression", "Justice", "Trauma", "Patience"],
    cheating: ["Betrayal", "Heartbreak", "Forgiveness", "Justice", "Sin", "Zina"],
    affair: ["Betrayal", "Heartbreak", "Forgiveness", "Zina", "Marriage"],
    fighting: ["Anger", "Speech", "Pardon", "Forgiveness", "Patience"],
    gossip: ["Rumors", "Speech", "Honesty", "Sin", "Backbiting"],
    lies: ["Honesty", "Speech", "Sin", "Hypocrisy"],

    // Social / Jealousy
    jealous: ["Jealousy", "Patience", "Gratitude", "Focus"],
    envy: ["Jealousy", "Patience", "Gratitude"],
    betrayal: ["Betrayal", "Heartbreak", "Forgiveness", "Patience", "Trust"],
    betrayed: ["Betrayal", "Heartbreak", "Forgiveness", "Patience", "Trust"],
    toxic: ["Friends", "Enemies", "Patience", "Boundaries", "Abuse"],
    fake: ["Hypocrisy", "Honesty", "Friends", "Enemies"],
    hate: ["Forgiveness", "Patience", "Anger", "Peace"],

    // Motivation
    lazy: ["Focus", "Hardship", "Success", "Duty"],
    procrastinate: ["Focus", "Success", "Duty", "Time"],
    unmotivated: ["Focus", "Success", "Purpose", "Wisdom"],

    // Mundane / Everyday Life
    school: ["Knowledge", "Wisdom", "Tests", "Focus", "Success"],
    college: ["Knowledge", "Wisdom", "Tests", "Focus", "Success", "Future"],
    university: ["Knowledge", "Wisdom", "Tests", "Focus", "Success", "Future"],

    studying: ["Knowledge", "Wisdom", "Focus", "Duty", "Success"],
    homework: ["Knowledge", "Focus", "Duty", "Time"],
    driving: ["Travel", "Patience", "Protection", "Duty"],
    traffic: ["Travel", "Patience", "Hardship", "Time", "Anger"],
    car: ["Travel", "Provision", "Protection", "Gratitude"],
    flight: ["Travel", "Protection", "Creation", "Nature"],
    traveling: ["Travel", "Protection", "Duty", "Nature"],
    moving: ["Travel", "Future", "Provision", "Trust"],
    journey: ["Travel", "Future", "Tests", "Life"],
    cooking: ["Provision", "Family", "Food", "Gratitude", "Time"],
    cleaning: ["Purity", "Duty", "Family"],
    house: ["Family", "Provision", "Protection", "Peace"],
    home: ["Family", "Provision", "Protection", "Peace"],
    eating: ["Food", "Provision", "Gratitude", "Health"],
    hungry: ["Food", "Provision", "Gratitude", "Hardship"],
    starving: ["Food", "Provision", "Hardship", "Patience"],
    diet: ["Food", "Health", "Patience", "Strength"],
    sleepy: ["Sleep", "Peace", "Healing", "Exhaustion", "Time"],
    bed: ["Sleep", "Peace", "Healing", "Protection"],
    insomnia: ["Sleep", "Hardship", "Prayer", "Remembrance", "Healing"],
    dream: ["Sleep", "Future", "Wisdom", "Hope"],
    nightmare: ["Sleep", "Protection", "Fear", "Prayer"],
    rain: ["Water", "Nature", "Creation", "Provision", "Mercy"],
    sun: ["Nature", "Creation", "Time", "Provision"],
    hot: ["Nature", "Hardship", "Patience", "Hellfire"],
    cold: ["Nature", "Hardship", "Patience", "Protection"],
    weather: ["Nature", "Creation", "Water", "Time"],
    storm: ["Nature", "Fear", "Protection", "Prayer"],
    rent: ["Money", "Provision", "Trust", "Hardship", "Debt"],
    bills: ["Money", "Provision", "Trust", "Hardship", "Debt"],
    taxes: ["Money", "Provision", "Duty", "Hardship"],
    salary: ["Money", "Provision", "Duty", "Gratitude"],
    movie: ["Life"],
    game: ["Life"],
    gaming: ["Addiction"],
    music: ["Peace"],
    party: ["Life"]
};

// Aliases for fallback mapping
const emotionCategories = {
    negative: ["Patience" as Tag, "Hope" as Tag, "Tests" as Tag, "Hardship" as Tag, "Prayer" as Tag],
    positive: ["Gratitude" as Tag, "Success" as Tag, "Remembrance" as Tag, "Life" as Tag],
    need: ["Provision" as Tag, "Prayer" as Tag, "Trust" as Tag],
};

export function extractTopics(input: string): string[] {
    if (!input || input.trim() === "") return [];

    const matchedTags = new Set<string>();

    // 1. Process text with compromise
    const doc = nlp(input.toLowerCase());
    doc.normalize();

    // 2. Extract key types of words
    const nouns = doc.nouns().out('array');
    const verbs = doc.verbs().toInfinitive().out('array');
    const adjectives = doc.adjectives().out('array');

    const rootWords = [...nouns, ...verbs, ...adjectives];

    // 3. Match against our dictionary
    for (const term of rootWords) {
        const cleanedTerm = term.replace(/[.,!?]/g, "").trim();
        const rawTerms = cleanedTerm.split(" ");

        for (const word of [cleanedTerm, ...rawTerms]) {
            const variations = [
                word,
                word.replace(/ing$/, ""),
                word.replace(/ed$/, ""),
                word.replace(/s$/, ""),
            ];

            for (const v of variations) {
                if (topicDictionary[v]) {
                    topicDictionary[v].forEach(tag => matchedTags.add(tag));
                }
            }
        }
    }

    // 4. Exact matching against existing tags
    tags.forEach(tag => {
        if (doc.has(tag.toLowerCase())) {
            matchedTags.add(tag);
        }
    });

    // 5. Broad Categorical Fallbacks
    if (matchedTags.size === 0) {
        if (doc.match('not (good|great|happy|ok|okay|fine)').found || doc.match('(bad|terrible|awful|horrible)').found) {
            emotionCategories.negative.forEach(t => matchedTags.add(t));
        } else if (doc.match('(need|want|help|save)').found) {
            emotionCategories.need.forEach(t => matchedTags.add(t));
        }
    }

    return Array.from(matchedTags);
}

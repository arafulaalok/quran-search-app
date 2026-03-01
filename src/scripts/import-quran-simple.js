const fs = require('fs');
const path = require('path');
const axios = require('axios');

// We'll manually implement a simple tag matching logic or import the logic if possible
// But to be safe and standalone, I'll copy the dictionary-based tagging here
const tags = [
    "Anxiety", "Patience", "Depression", "Forgiveness", "Mercy", "Guidance", "Family", "Hardship", "Gratitude", "Life", "Death", "Hope", "Sin", "Prayer", "Charity", "Parents", "Tests", "Peace", "Remembrance", "Closeness to Allah", "Duty", "Kindness", "Provision", "Trust", "Future", "Weakness", "Strength", "Faith", "Sadness", "Fear", "Anger", "Marriage", "Spouse", "Love", "Debt", "Sickness", "Health", "Success", "Failure", "Justice", "Oppression", "Orphans", "Travel", "Sleep", "Knowledge", "Wisdom", "Speech", "Friends", "Enemies", "Hypocrisy", "Repentance", "Jannah", "Hellfire", "Day of Judgement", "Creation", "Nature", "Animals", "Water", "Food", "Clothing", "Money", "Business", "Interest (Riba)", "Honesty", "Intimacy", "Temptation", "Desires (Nafs)", "Addiction", "Grief", "Heartbreak", "Betrayal", "Focus", "Self-Worth", "Loneliness", "Healing", "Lust", "Jealousy", "Purity", "Modesty", "Trauma", "Overthinking", "Doubt", "Arrogance", "Vanity", "Abuse", "Pardon", "Rumors", "Intoxicants", "Purpose", "Exhaustion", "Loss", "Time", "Character", "Humility", "Zina", "Backbiting", "Boundaries", "Protection", "Weather"
];

const topicDictionary = {
    anxious: ["Anxiety", "Peace", "Trust"],
    worry: ["Anxiety", "Trust", "Future"],
    scared: ["Fear", "Trust", "Closeness to Allah"],
    fear: ["Fear", "Trust"],
    sad: ["Sadness", "Depression", "Hope", "Patience"],
    depressed: ["Depression", "Hope", "Patience", "Life"],
    angry: ["Anger", "Patience", "Forgiveness"],
    weak: ["Weakness", "Strength", "Closeness to Allah"],
    fail: ["Failure", "Tests", "Hope", "Success"],
    lost: ["Guidance", "Hope", "Prayer"],
    money: ["Provision", "Money", "Trust", "Charity"],
    sick: ["Sickness", "Health", "Patience"],
    love: ["Love", "Mercy", "Marriage"],
    death: ["Death", "Day of Judgement"],
    patience: ["Patience"],
    forgive: ["Forgiveness"],
    mercy: ["Mercy", "Forgiveness"],
    guide: ["Guidance"],
    family: ["Family"],
    hardship: ["Hardship"],
    grateful: ["Gratitude"],
    gratitude: ["Gratitude"],
    sin: ["Sin", "Forgiveness"],
    prayer: ["Prayer"],
    charity: ["Charity", "Provision"],
    parent: ["Parents", "Family"],
    test: ["Tests", "Patience"],
    peace: ["Peace"],
    remember: ["Remembrance"],
    kind: ["Kindness", "Mercy"],
    provide: ["Provision"],
    trust: ["Trust"],
    strength: ["Strength"],
    faith: ["Faith", "Believers"],
    marry: ["Marriage"],
    spouse: ["Spouse", "Family"],
    debt: ["Debt"],
    success: ["Success"],
    justice: ["Justice"],
    oppress: ["Oppression"],
    orphan: ["Orphans", "Kindness"],
    travel: ["Travel"],
    sleep: ["Sleep"],
    know: ["Knowledge"],
    wise: ["Wisdom"],
    wisdom: ["Wisdom"],
    friend: ["Friends"],
    enemy: ["Enemies"],
    repent: ["Repentance", "Forgiveness"],
    jannah: ["Jannah", "Success"],
    hell: ["Hellfire"],
    judgement: ["Day of Judgement"],
    create: ["Creation"],
    nature: ["Nature"],
    animal: ["Animals"],
    water: ["Water", "Provision"],
    food: ["Food", "Provision"],
    cloth: ["Clothing"],
    business: ["Business", "Money"],
    honest: ["Honesty"],
    tempt: ["Temptation"],
    health: ["Health"],
    allah: ["Faith", "Trust", "Guidance"],
    lord: ["Faith", "Guidance", "Trust"],
    believe: ["Faith", "Believers"],
    believer: ["Believers", "Faith"],
    disbelieve: ["Forgiveness"],
    messenger: ["Guidance", "Knowledge"],
    prophet: ["Guidance", "Knowledge"],
    sign: ["Knowledge", "Creation", "Guidance"],
    verse: ["Knowledge", "Guidance"],
    book: ["Knowledge", "Guidance"],
    truth: ["Justice", "Knowledge"],
    wrong: ["Forgiveness", "Justice"],
    evil: ["Forgiveness", "Protection"],
    good: ["Success", "Gratitude"],
    righteous: ["Success", "Faith"],
    paradise: ["Jannah", "Success"],
    fire: ["Hellfire"],
    day: ["Day of Judgement", "Time"],
    world: ["Life", "Creation"],
    hereafter: ["Day of Judgement", "Future"],
    heaven: ["Creation", "Jannah"],
    earth: ["Creation", "Nature"],
    man: ["Creation", "Life"],
    people: ["Guidance", "Family"],
    heart: ["Peace", "Faith", "Healing"],
    soul: ["Life", "Death"]
};

function simpleExtractTopics(text) {
    const matchedTags = new Set();
    const words = text.toLowerCase().split(/\W+/);

    for (const word of words) {
        if (word.length < 3) continue;

        // Exact tag match
        for (const tag of tags) {
            if (tag.toLowerCase() === word) matchedTags.add(tag);
        }

        // Dictionary match
        for (const [key, tgs] of Object.entries(topicDictionary)) {
            if (word.startsWith(key) || key.startsWith(word)) {
                tgs.forEach(t => matchedTags.add(t));
            }
        }
    }
    return Array.from(matchedTags);
}

const QURAN_JSON_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json';
const OUTPUT_FILE = path.join(__dirname, '../data/quran-data-full.json');

async function run() {
    console.log('Fetching...');
    const res = await axios.get(QURAN_JSON_URL);
    const surahs = res.data;
    const all = [];

    for (const s of surahs) {
        for (const v of s.verses) {
            all.push({
                id: `${s.id}:${v.id}`,
                surahName: s.transliteration,
                surahNumber: s.id,
                ayahNumber: v.id,
                arabic: v.text,
                translation: v.translation,
                source: "Sahih International",
                tags: simpleExtractTopics(v.translation)
            });
        }
    }
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2));
    console.log(`Done! Saved ${all.length} ayats.`);
}

run();

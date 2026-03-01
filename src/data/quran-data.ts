import fullQuranData from './quran-data-full.json';

export interface Ayat {
    id: string;
    surahName: string;
    surahNumber: number;
    ayahNumber: number;
    arabic: string;
    translation: string;
    source: string; // e.g., "Sahih International"
    tags: string[];
}

export const tags = [
    "Anxiety",
    "Patience",
    "Depression",
    "Forgiveness",
    "Mercy",
    "Guidance",
    "Family",
    "Hardship",
    "Gratitude",
    "Life",
    "Death",
    "Hope",
    "Sin",
    "Prayer",
    "Charity",
    "Parents",
    "Tests",
    "Peace",
    "Remembrance",
    "Closeness to Allah",
    "Duty",
    "Kindness",
    "Provision",
    "Trust",
    "Future",
    "Weakness",
    "Strength",
    "Faith",
    "Sadness",
    "Fear",
    "Anger",
    "Marriage",
    "Spouse",
    "Love",
    "Debt",
    "Sickness",
    "Health",
    "Success",
    "Failure",
    "Justice",
    "Oppression",
    "Orphans",
    "Travel",
    "Sleep",
    "Knowledge",
    "Wisdom",
    "Speech",
    "Friends",
    "Enemies",
    "Hypocrisy",
    "Repentance",
    "Jannah", "Hellfire", "Day of Judgement", "Creation", "Nature", "Animals", "Water", "Food", "Clothing", "Money", "Business", "Interest (Riba)", "Honesty", "Intimacy", "Temptation", "Desires (Nafs)", "Addiction", "Grief", "Heartbreak", "Betrayal", "Focus", "Self-Worth", "Loneliness", "Healing", "Lust", "Jealousy", "Purity", "Modesty", "Trauma", "Overthinking", "Doubt", "Arrogance", "Vanity", "Abuse", "Pardon", "Rumors", "Intoxicants", "Purpose", "Exhaustion", "Loss", "Time", "Character", "Humility", "Zina", "Backbiting", "Boundaries", "Protection", "Weather"
] as const;

export type Tag = typeof tags[number];

export const quranData: Ayat[] = fullQuranData as Ayat[];

import { extractTopics } from "./src/lib/nlp";

const tests = [
    "I'm feeling completely lost and I don't know what to do.",
    "I lost my job and I'm scared about money.",
    "Why is life so hard right now?",
    "I am struggling with my exams and failing badly.",
    "I feel sad and alone, waiting for help.",
];

console.log("--- Testing NLP Topic Extraction ---\n");

tests.forEach(testQuery => {
    console.log(`Input: "${testQuery}"`);
    console.log(`Extracted Tags:`, extractTopics(testQuery));
    console.log("----------------------");
});

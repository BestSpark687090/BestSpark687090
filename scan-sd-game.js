#!/usr/bin/env node
// Text scan of an SD game through the local proxy using the Smoothwall blocklist.
// Usage: node scan-sd-game.js <rot13-encoded-subpath>
// Example: node scan-sd-game.js ugzy/syncclcynar/tnzr/vaqrk.ugzy

import http from "http";
import { readFileSync } from "fs";

const BASE = "http://localhost:6870/games/sd/";
const subPath = process.argv[2];

if (!subPath) {
    console.error("Usage: node scan-sd-game.js <rot13-subpath>");
    process.exit(1);
}

const blocklist = JSON.parse(readFileSync("/home/www/linewize-checker/commands/links/smoothwall_phrases.json", "utf8"));

const CATEGORY_LABELS = {
    porn: "Inappropriate",
    adultmixedcontent: "Inappropriate",
    videogames: "Video Games",
    webproxies: "Web Proxies",
};
function stripPrefix(str) {
    const name = str.replace(/sph?irewall\.[a-z]+\./g, "");
    return CATEGORY_LABELS[name] ?? name;
}

function calculateScore(textContent) {
    const textLower = textContent.toLowerCase();
    const categoryTotals = {};
    const topMatches = [];

    for (const [mainWord, details] of Object.entries(blocklist)) {
        const target = mainWord.toLowerCase();
        if (!textLower.includes(target)) continue;

        for (const item of details.catsAndScores ?? []) {
            const score = parseInt(item.score, 10) || 0;
            if (score === 0) continue;
            const cat = stripPrefix(item.category ?? "unknown");
            categoryTotals[cat] = (categoryTotals[cat] ?? 0) + score;
            topMatches.push({ word: mainWord.trim(), cat, score });
        }

        for (const child of details.children ?? []) {
            const phrases = child.phrases ?? [];
            if (!phrases.every(p => textLower.includes(p.toLowerCase()))) continue;
            const catInfo = child.catsAndScores ?? {};
            const score = parseInt(catInfo.score, 10) || 0;
            if (score === 0) continue;
            const cat = stripPrefix(catInfo.category ?? "unknown");
            categoryTotals[cat] = (categoryTotals[cat] ?? 0) + score;
            topMatches.push({ word: mainWord.trim(), cat, score, condition: phrases });
        }
    }

    const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    return { total, categoryTotals, topMatches };
}

function fetchPage(url) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 8000 }, (res) => {
            const chunks = [];
            res.on("data", c => chunks.push(c));
            res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
            res.on("error", reject);
        });
        req.on("error", reject);
        req.on("timeout", () => { req.destroy(); reject(new Error("Timed out")); });
    });
}

const url = BASE + subPath;
console.log(`Fetching: ${url}\n`);

const { status, body } = await fetchPage(url);
console.log(`Status: ${status} | Length: ${body.length} chars\n`);

const { total, categoryTotals, topMatches } = calculateScore(body);

const riskLevel =
    total > 300 ? "🔴 High" :
    total > 100 ? "🟠 Medium" :
    total > 20  ? "🟡 Low" :
                  "🟢 Clean";

console.log(`Total Score: ${total} — ${riskLevel}\n`);

console.log("=== Category Breakdown ===");
const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
if (sorted.length) sorted.forEach(([cat, score]) => console.log(`  ${cat}: ${score > 0 ? "+" : ""}${score}`));
else console.log("  No matches.");

console.log("\n=== Top Matching Phrases ===");
const topWords = [...topMatches].sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 10);
if (topWords.length) topWords.forEach(m => console.log(`  ${m.score > 0 ? "+" : ""}${m.score} "${m.word}" → ${m.cat}`));
else console.log("  None.");

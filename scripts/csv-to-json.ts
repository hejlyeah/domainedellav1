import fs from "node:fs";
import path from "node:path";
import { parse as csvParse } from "csv-parse/sync";

interface RawRow {
  Vintage: string;
  Wine: string;
  Score: string;
  "Reviewer/Publication": string;
  "Reviewed by"?: string;
  "Honorable Mentions"?: string;
  Review: string;
}

const csvPath  = path.resolve("data/critical_acclaim.csv");
const csvText  = fs.readFileSync(csvPath, "utf8");

// ---------- helpers ----------
const scoreToNumber = (score: string) => {
  const hasPlus = score.includes("+");
  const num     = parseFloat(score);
  if (isNaN(num)) return NaN;
  return hasPlus ? num + 0.5 : num;
};
// ------------------------------

const rows = csvParse(csvText, { columns: true, skip_empty_lines: true, bom: true });

type Review = {
  reviewer: string;
  scoreStr: string;
  scoreNum: number | null;
  excerpt: string;
  vintage: number | null;
  reviewedBy?: string;
  honorableMentions?: string;
};

type WineReviews = Record<string, Review[]>;   // keyed by wine name

const wines: WineReviews = {};

rows.forEach((r: RawRow) => {
  const originalScore = (r.Score ?? '').trim();
  const scoreNumRaw = scoreToNumber(originalScore);
  const scoreNum = isNaN(scoreNumRaw) ? null : scoreNumRaw;

  let scoreStr: string;
  if (scoreNum === null) {
    scoreStr = originalScore;
  } else if (scoreNum % 1 !== 0) {
    scoreStr = Math.floor(scoreNum) + '+';
  } else {
    scoreStr = String(scoreNum);
  }

  const originalVintage = (r.Vintage ?? '').trim();
  let vintageNum: number | null = null;
  if (originalVintage) {
      const parsedVintage = Number(originalVintage);
      if (!isNaN(parsedVintage)) {
          vintageNum = parsedVintage;
      }
  }

  const reviewedBy = (r["Reviewed by"] ?? '').trim();
  const honorableMentions = (r["Honorable Mentions"] ?? '').trim();

  const review: Review = {
    reviewer:            (r["Reviewer/Publication"] ?? '').trim(),
    scoreStr:            scoreStr,
    scoreNum:            scoreNum,
    excerpt:             (r.Review ?? '').trim(),
    vintage:             vintageNum,
    ...(reviewedBy && { reviewedBy }),
    ...(honorableMentions && { honorableMentions }),
  };

  const wineName = (r.Wine ?? 'UNKNOWN_WINE').trim();
  wines[wineName] ??= [];
  wines[wineName].push(review);
});

// sort each wine's reviews: highest score → newest vintage
// Handle potential nulls in sorting comparison
Object.values(wines).forEach(list =>
  list.sort((a, b) =>
    // Treat null scores as lowest (-Infinity)
    (b.scoreNum ?? -Infinity) - (a.scoreNum ?? -Infinity) ||
    // Treat null vintages as oldest (0 or -Infinity)
    (b.vintage ?? 0) - (a.vintage ?? 0)
  )
);

fs.writeFileSync(
  path.resolve("data/reviews.json"),
  JSON.stringify(wines, null, 2)
);
console.log("✅  data/reviews.json written."); 
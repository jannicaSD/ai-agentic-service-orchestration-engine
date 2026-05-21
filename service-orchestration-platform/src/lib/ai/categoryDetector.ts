import { AgentTrace, Provider } from "../types";

export type Category = Provider["category"];

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  plumber: ["plumber", "pipe", "leak", "water", "tap", "washbasin", "basin", "sink", "nal", "tanki", "pani", "leakage", "نل", "پائپ", "پلمبر", "پانی"],
  electrician: ["electrician", "wire", "wiring", "switch", "bulb", "fan", "light", "pankha", "shock", "short", "circuit", "bijli", "meter", "بجلی", "پنکھا", "لائٹ", "شارٹ", "تار"],
  "ac-tech": ["ac", "aircon", "air conditioner", "cooling", "filter", "gas refill", "split", "compressor", "ہیٹر", "اے سی", "کولنگ", "فلٹر"],
  mechanic: ["mechanic", "car", "auto", "gari", "bike", "motorcycle", "engine", "tyre", "brake", "tuning", "punchar", "punc", "گاڑی", "انجن", "بریک", "مکینک", "ٹائر"],
  tutor: ["tutor", "teacher", "math", "science", "chemistry", "physics", "study", "parhna", "tuition", "academy", "school", "exam", "ٹیوٹر", "پڑھنا", "ٹیچر", "ٹیوشن"],
  cleaner: ["cleaner", "cleaning", "sweep", "wash", "safai", "saaf", "kachra", "dirt", "dust", "maid", "home clean", "صفائی", "دھونا", "صاف", "کچرا"],
  beautician: ["beauty", "beautician", "salon", "parlor", "parlour", "makeup", "mehndi", "haircut", "wax", "facial", "threading", "بیوٹی", "مہندی", "ویکس", "فیشل", "میک اپ"]
};

export function detectCategory(text: string): { result: Category | null; confidence: number; traces: Omit<AgentTrace, "traceId" | "timestamp">[] } {
  const lowerText = text.toLowerCase().trim();
  const traces: Omit<AgentTrace, "traceId" | "timestamp">[] = [];
  
  traces.push({
    type: "thought",
    component: "CategoryDetector",
    content: "Scanning input for service-related keywords in English, Urdu, and Roman Urdu.",
    status: "success"
  });

  const categoryScores: Record<Category, number> = {
    plumber: 0,
    electrician: 0,
    "ac-tech": 0,
    mechanic: 0,
    tutor: 0,
    cleaner: 0,
    beautician: 0
  };

  let maxScore = 0;
  let detectedCategory: Category | null = null;
  const matchedTerms: string[] = [];

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    const cat = category as Category;
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        categoryScores[cat] += 1;
        matchedTerms.push(keyword);
      }
    });
    
    if (categoryScores[cat] > maxScore) {
      maxScore = categoryScores[cat];
      detectedCategory = cat;
    }
  });

  let confidence = 0;
  if (detectedCategory) {
    confidence = Math.min(0.98, 0.5 + maxScore * 0.15);
    traces.push({
      type: "result",
      component: "CategoryDetector",
      content: `Detected category: "${detectedCategory}" (matched terms: ${Array.from(new Set(matchedTerms)).join(", ")}) with confidence ${(confidence * 100).toFixed(0)}%.`,
      status: "success",
      metadata: { category: detectedCategory, confidence }
    });
  } else {
    traces.push({
      type: "result",
      component: "CategoryDetector",
      content: "No matching service category detected from text. Defaulting to query-based response.",
      status: "fallback"
    });
  }

  return {
    result: detectedCategory,
    confidence,
    traces
  };
}

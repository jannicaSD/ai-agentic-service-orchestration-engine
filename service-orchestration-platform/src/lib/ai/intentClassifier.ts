import { AgentTrace } from "../types";

export interface IntentResult {
  intent: "booking_request" | "search_providers" | "cancel_booking" | "greeting" | "general_query";
  confidence: number;
  detectedLanguage: "english" | "urdu" | "roman_urdu";
}

const URDU_SCRIPT_REGEX = /[\u0600-\u06FF]/;

const GREETING_KEYWORDS = ["hi", "hello", "hey", "salaam", "helo", "assalam", "aao", "سلام", "ہیلؤ"];
const CANCEL_KEYWORDS = ["cancel", "stop", "khatam", "rok", "revert", "remove", "delet", "منسوخ", "کینسل"];
const BOOKING_KEYWORDS = ["book", "need", "hire", "want", "pakro", "chahye", "chaiye", "bulana", "mangwana", "booking", "order", "پانی", "چاہیے", "بک", "ارڈر"];
const SEARCH_KEYWORDS = ["show", "list", "find", "search", "dikhao", "dhundo", "dhoondo", "kaun hai", "kon hai", "talaash", "providers", "electricians", "plumbers", "tutors", "mechanics", "دکھائیں", "ڈھونڈو", "تلاش"];

export function classifyIntent(text: string): { result: IntentResult; traces: Omit<AgentTrace, "traceId" | "timestamp">[] } {
  const lowerText = text.toLowerCase().trim();
  const traces: Omit<AgentTrace, "traceId" | "timestamp">[] = [];
  
  // Detect language
  let detectedLanguage: "english" | "urdu" | "roman_urdu" = "english";
  if (URDU_SCRIPT_REGEX.test(text)) {
    detectedLanguage = "urdu";
  } else {
    const romanUrduIndicators = ["mujhe", "chahye", "chaiye", "karna", "krna", "gari", "pani", "bijli", "kon", "dikhao", "karain", "safai", "helo", "salaam"];
    if (romanUrduIndicators.some(word => lowerText.includes(word))) {
      detectedLanguage = "roman_urdu";
    }
  }

  traces.push({
    type: "thought",
    component: "IntentClassifier",
    content: `Analyzing user input language. Detected: ${detectedLanguage}`,
    status: "success"
  });

  let intent: IntentResult["intent"] = "general_query";
  let confidence = 0.5;

  // Simple keyword matching for demo purposes
  const matchesGreeting = GREETING_KEYWORDS.some(k => lowerText.includes(k));
  const matchesCancel = CANCEL_KEYWORDS.some(k => lowerText.includes(k));
  const matchesBooking = BOOKING_KEYWORDS.some(k => lowerText.includes(k));
  const matchesSearch = SEARCH_KEYWORDS.some(k => lowerText.includes(k));

  if (matchesCancel) {
    intent = "cancel_booking";
    confidence = 0.9;
  } else if (matchesBooking) {
    intent = "booking_request";
    confidence = 0.85;
  } else if (matchesSearch) {
    intent = "search_providers";
    confidence = 0.8;
  } else if (matchesGreeting) {
    intent = "greeting";
    confidence = 0.95;
  }

  traces.push({
    type: "result",
    component: "IntentClassifier",
    content: `Classified user intent as "${intent}" with confidence ${(confidence * 100).toFixed(0)}%.`,
    status: "success",
    metadata: { intent, confidence, detectedLanguage }
  });

  return {
    result: { intent, confidence, detectedLanguage },
    traces
  };
}

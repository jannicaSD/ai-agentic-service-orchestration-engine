import { AgentTrace, ExtractionResult, Coordinates } from "../types";

const CITIES = [
  { name: "Lahore", keys: ["lahore", "laur", "لاہور"], coordinates: { lat: 31.5204, lng: 74.3587 } },
  { name: "Karachi", keys: ["karachi", "krchi", "کراچی"], coordinates: { lat: 24.8607, lng: 67.0011 } },
  { name: "Islamabad", keys: ["islamabad", "isb", "اسلام آباد"], coordinates: { lat: 33.6844, lng: 73.0479 } }
];

export function extractParameters(text: string): { result: ExtractionResult; traces: Omit<AgentTrace, "traceId" | "timestamp">[] } {
  const lowerText = text.toLowerCase().trim();
  const traces: Omit<AgentTrace, "traceId" | "timestamp">[] = [];
  
  traces.push({
    type: "thought",
    component: "ParameterExtractor",
    content: "Extracting booking parameters (location, budget, date, time slot, urgency) from user query.",
    status: "success"
  });

  // 1. Extract Location
  let location: string | null = null;
  let coordinates: Coordinates | null = null;
  for (const city of CITIES) {
    if (city.keys.some(key => lowerText.includes(key))) {
      location = city.name;
      coordinates = city.coordinates;
      break;
    }
  }
  if (location) {
    traces.push({
      type: "action",
      component: "ParameterExtractor",
      content: `Extracted Location: ${location} (lat: ${coordinates?.lat}, lng: ${coordinates?.lng})`,
      status: "success"
    });
  } else {
    // Default fallback
    location = "Lahore";
    coordinates = { lat: 31.5204, lng: 74.3587 };
    traces.push({
      type: "action",
      component: "ParameterExtractor",
      content: "No location detected. Using default: Lahore.",
      status: "warning"
    });
  }

  // 2. Extract Budget
  let budget: number | null = null;
  // Match "under 3000", "below 2500", "pkr 3000", "3000 pkr", "budget 4000", "3000/-"
  const budgetMatch = lowerText.match(/(?:under|below|max|budget|pkr|rs\.?)\s*(\d+)/i) || 
                      lowerText.match(/(\d+)\s*(?:pkr|rs|rupees|under|budget)/i) ||
                      lowerText.match(/(\d+)\s*\/\-/);
  if (budgetMatch) {
    budget = parseInt(budgetMatch[1], 10);
    traces.push({
      type: "action",
      component: "ParameterExtractor",
      content: `Extracted Budget limit: PKR ${budget}`,
      status: "success"
    });
  } else {
    // Look for any number larger than 500
    const genericNumberMatches = lowerText.match(/\b([1-9]\d{2,4})\b/g);
    if (genericNumberMatches) {
      // Pick the first one as budget if it's not a year
      const firstNum = parseInt(genericNumberMatches[0], 10);
      if (firstNum !== 2026 && firstNum !== 2025 && firstNum > 500) {
        budget = firstNum;
        traces.push({
          type: "action",
          component: "ParameterExtractor",
          content: `Inferred budget from number: PKR ${budget}`,
          status: "success"
        });
      }
    }
  }

  // 3. Extract Urgency
  let urgency: "normal" | "urgent" = "normal";
  if (["urgent", "emergency", "jaldi", "asap", "fauri", "fari", "abbi", "abhi", "emergency", "فوری", "جلدی"].some(k => lowerText.includes(k))) {
    urgency = "urgent";
    traces.push({
      type: "action",
      component: "ParameterExtractor",
      content: "Detected urgency: URGENT booking request.",
      status: "success"
    });
  }

  // 4. Extract Date
  let date: string | null = null;
  const today = new Date();
  if (lowerText.includes("tomorrow") || lowerText.includes("kal") || lowerText.includes("کل")) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    date = tomorrow.toISOString().split("T")[0];
  } else if (lowerText.includes("today") || lowerText.includes("aaj") || lowerText.includes("آج")) {
    date = today.toISOString().split("T")[0];
  } else {
    // Scan for weekdays
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (let i = 0; i < weekdays.length; i++) {
      if (lowerText.includes(weekdays[i])) {
        const targetDay = i;
        const currentDay = today.getDay();
        let daysAhead = targetDay - currentDay;
        if (daysAhead <= 0) daysAhead += 7; // Next week's day
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysAhead);
        date = targetDate.toISOString().split("T")[0];
        break;
      }
    }
    // Default tomorrow if not specified
    if (!date) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      date = tomorrow.toISOString().split("T")[0];
    }
  }
  traces.push({
    type: "action",
    component: "ParameterExtractor",
    content: `Target date selected: ${date}`,
    status: "success"
  });

  // 5. Extract Time Slot
  let timeSlot: ExtractionResult["timeSlot"] = "morning";
  if (lowerText.includes("afternoon") || lowerText.includes("doper") || lowerText.includes("dopahar") || lowerText.includes("دوپہر")) {
    timeSlot = "afternoon";
  } else if (lowerText.includes("evening") || lowerText.includes("shaam") || lowerText.includes("شام")) {
    timeSlot = "evening";
  } else if (lowerText.includes("night") || lowerText.includes("raat") || lowerText.includes("رات")) {
    timeSlot = "night";
  } else if (lowerText.includes("morning") || lowerText.includes("subah") || lowerText.includes("صبح")) {
    timeSlot = "morning";
  }
  
  traces.push({
    type: "action",
    component: "ParameterExtractor",
    content: `Target time slot: ${timeSlot}`,
    status: "success"
  });

  const extractionConfidence = Math.min(0.95, 0.6 + (budget ? 0.15 : 0) + (location ? 0.15 : 0) + (urgency === "urgent" ? 0.05 : 0));

  traces.push({
    type: "result",
    component: "ParameterExtractor",
    content: `Parameters extracted successfully (Confidence ${(extractionConfidence * 100).toFixed(0)}%).`,
    status: "success",
    metadata: { location, budget, urgency, date, timeSlot, confidence: extractionConfidence }
  });

  return {
    result: {
      category: null, // to be populated by categoryDetector
      location,
      coordinates,
      budget,
      date,
      timeSlot,
      urgency,
      confidence: extractionConfidence
    },
    traces
  };
}

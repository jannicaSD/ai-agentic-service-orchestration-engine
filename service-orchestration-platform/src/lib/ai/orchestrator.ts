import { AgentTrace, Provider, Booking, Message } from "../types";
import { classifyIntent } from "./intentClassifier";
import { detectCategory } from "./categoryDetector";
import { extractParameters } from "./parameterExtractor";
import { filterProviders } from "./providerFilter";
import { rankProviders } from "./providerRanker";
import { generateBooking } from "./bookingGenerator";

export interface OrchestrationResult {
  message: Message;
  traces: AgentTrace[];
  booking: Booking | null;
  topProviders: Provider[];
}

export function orchestrateQuery(
  userInput: string,
  providers: Provider[]
): OrchestrationResult {
  const allTraces: AgentTrace[] = [];
  
  const addTraces = (traces: Omit<AgentTrace, "traceId" | "timestamp">[]) => {
    traces.forEach(t => {
      allTraces.push({
        ...t,
        traceId: `trc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: new Date().toISOString()
      });
    });
  };

  // 1. Classify Intent
  const intentResult = classifyIntent(userInput);
  addTraces(intentResult.traces);
  const { intent, detectedLanguage } = intentResult.result;

  // Handle greetings / general queries / cancellations directly
  if (intent === "greeting") {
    let content = "Hello! I am the AntiGravity AI Service Orchestrator. How can I assist you with plumber, electrician, tutor, mechanic, or other services today?";
    if (detectedLanguage === "urdu") {
      content = "السلام علیکم! میں اینٹی گریویٹی سروس آرکیسٹریٹر ہوں۔ آج میں پلمبر، الیکٹریشن، ٹیوٹر، مکینک یا دیگر خدمات حاصل کرنے میں آپ کی کیا مدد کر سکتا ہوں؟";
    } else if (detectedLanguage === "roman_urdu") {
      content = "Salaam! Main AntiGravity Service Orchestrator hoon. Aaj main plumber, electrician, tutor, mechanic, ya kisi aur service ke liye aapki kya madad kar sakta hoon?";
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: new Date().toISOString()
      },
      traces: allTraces,
      booking: null,
      topProviders: []
    };
  }

  if (intent === "cancel_booking") {
    let content = "I have initiated the cancellation of your pending service booking request. The provider has been notified.";
    if (detectedLanguage === "urdu") {
      content = "میں نے آپ کی سروس بکنگ کی منسوخی کا عمل شروع کر دیا ہے۔ سروس فراہم کنندہ کو مطلع کر دیا گیا ہے۔";
    } else if (detectedLanguage === "roman_urdu") {
      content = "Maine aapki booking cancellation process shuru kar di hai. Provider ko notify kar diya gaya hai.";
    }

    return {
      message: {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: new Date().toISOString()
      },
      traces: allTraces,
      booking: null,
      topProviders: []
    };
  }

  // 2. Detect Category
  const categoryResult = detectCategory(userInput);
  addTraces(categoryResult.traces);
  const category = categoryResult.result;

  // 3. Extract Parameters
  const paramResult = extractParameters(userInput);
  // Merge category into parameter extraction result
  paramResult.result.category = category;
  addTraces(paramResult.traces);
  const parameters = paramResult.result;

  // 4. Filter Providers
  const filterResult = filterProviders(providers, parameters);
  addTraces(filterResult.traces);
  const filtered = filterResult.result;

  // 5. Rank Providers
  const rankResult = rankProviders(filtered, parameters);
  addTraces(rankResult.traces);
  const ranked = rankResult.result;

  // 6. Generate Booking
  const topRanked = ranked.length > 0 ? ranked[0].provider : null;
  const bookingResult = generateBooking(topRanked, parameters, detectedLanguage);
  addTraces(bookingResult.traces);

  // Return final response message details
  const topProvidersList = ranked.slice(0, 3).map(item => item.provider);
  
  return {
    message: {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: bookingResult.messageText,
      timestamp: new Date().toISOString(),
      isActionable: bookingResult.booking !== null,
      providers: topProvidersList
    },
    traces: allTraces,
    booking: bookingResult.booking,
    topProviders: topProvidersList
  };
}

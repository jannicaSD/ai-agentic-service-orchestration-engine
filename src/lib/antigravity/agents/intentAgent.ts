export async function extractIntentAndSlots(text: string, langResult: any) {
  // Mocked extraction — in Real Mode this should call Gemini + Zod validation
  // Very simple heuristic extraction for demo purposes
  const lowered = text.toLowerCase();
  const intent = lowered.includes('book') || lowered.includes('booking') || lowered.includes('service') ? 'booking_request' : 'price_check';
  const category = lowered.includes('plumb') ? 'plumber' : lowered.includes('electric') ? 'electrician' : 'general';
  // try to capture numbers as budget
  const budgetMatch = lowered.match(/(rs|pk?r)?\s?(\d{3,6})/i);
  const budgetPKR = budgetMatch ? Number(budgetMatch[2]) : null;

  const slots = { serviceCategory: category, budgetPKR };

  // If core fields confidence low, ask clarification (mocked)
  const clarifyingQuestion = null;

  return { intent, slots, confidence: 0.85, clarifyingQuestion };
}

export async function languageNormalize(text: string) {
  // Minimal mocked language detection / normalization
  const lowered = text.toLowerCase();
  const isUrdu = /[\u0600-\u06FF]/.test(text);
  const romanUrduHints = /bhai|kya|nahi|hai|please|yar|acha/.test(lowered);
  const language = isUrdu ? 'urdu' : romanUrduHints ? 'roman_ur' : 'english';
  const normalized = text.replace(/\s+/g, ' ').trim();
  return { language, normalized, confidence: 0.9 };
}

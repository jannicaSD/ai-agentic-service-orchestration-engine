import { mockProviders as providers } from '../../../services/mockData';

export async function discoverProviders(slots: any) {
  // In Real Mode: query Supabase and optionally Maps APIs.
  // Mock Mode: filter local providers.json by category/city
  const cat = slots.serviceCategory || null;
  const city = slots.city || null;
  let results = providers as any[];
  if (cat) results = results.filter(p => p.categories && p.categories.includes(cat));
  if (city) results = results.filter(p => p.city && p.city.toLowerCase() === city.toLowerCase());

  // Add mock scoring fields
  results = results.map((p, i) => ({ ...p, score: 1 - (i % 10) * 0.01 }));
  return results;
}

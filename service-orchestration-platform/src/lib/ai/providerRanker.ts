import { AgentTrace, Provider, ExtractionResult, Coordinates } from "../types";

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface RankedProvider {
  provider: Provider & { distance: number };
  score: number;
}

export function rankProviders(
  filteredProviders: Provider[],
  params: ExtractionResult
): { result: RankedProvider[]; traces: Omit<AgentTrace, "traceId" | "timestamp">[] } {
  const traces: Omit<AgentTrace, "traceId" | "timestamp">[] = [];
  
  traces.push({
    type: "thought",
    component: "ProviderRanker",
    content: `Ranking ${filteredProviders.length} providers using multi-factor scoring (rating: 30%, distance: 30%, experience: 20%, budget fit: 20%).`,
    status: "success"
  });

  const targetCoords = params.coordinates || { lat: 31.5204, lng: 74.3587 }; // Default Lahore center

  const ranked: RankedProvider[] = filteredProviders.map(provider => {
    // 1. Calculate distance
    const dist = getDistanceKm(
      targetCoords.lat,
      targetCoords.lng,
      provider.coordinates.lat,
      provider.coordinates.lng
    );

    // Score components (0 to 1)
    const distanceScore = Math.max(0, 1 - dist / 15); // Max 15km range
    const ratingScore = provider.rating / 5;
    const experienceScore = Math.min(1, provider.experience / 20); // Max 20 years
    
    // Budget score
    let budgetScore = 1.0;
    if (params.budget) {
      if (provider.hourlyPrice <= params.budget) {
        budgetScore = 1.0;
      } else {
        // Penalty for exceeding budget
        budgetScore = Math.max(0, 1 - (provider.hourlyPrice - params.budget) / params.budget);
      }
    }

    // Weighted average
    const finalScore = (ratingScore * 0.3) + (distanceScore * 0.3) + (experienceScore * 0.2) + (budgetScore * 0.2);

    return {
      provider: {
        ...provider,
        distance: parseFloat(dist.toFixed(1))
      },
      score: finalScore
    };
  });

  // Sort by score descending
  ranked.sort((a, b) => b.score - a.score);

  traces.push({
    type: "result",
    component: "ProviderRanker",
    content: "Provider ranking complete. Top options sorted by multi-factor relevance.",
    status: "success",
    metadata: ranked.slice(0, 3).map(item => ({
      providerId: item.provider.id,
      name: item.provider.name,
      rating: item.provider.rating,
      distanceKm: item.provider.distance,
      score: parseFloat(item.score.toFixed(2))
    }))
  });

  return {
    result: ranked,
    traces
  };
}

import { AgentTrace, Provider, ExtractionResult } from "../types";

export function filterProviders(
  providers: Provider[],
  params: ExtractionResult
): { result: Provider[]; traces: Omit<AgentTrace, "traceId" | "timestamp">[] } {
  const traces: Omit<AgentTrace, "traceId" | "timestamp">[] = [];
  
  traces.push({
    type: "thought",
    component: "ProviderFilter",
    content: `Filtering list of ${providers.length} total providers based on extracted parameters.`,
    status: "success"
  });

  let filtered = [...providers];

  // 1. Filter by category
  if (params.category) {
    filtered = filtered.filter(p => p.category === params.category);
    traces.push({
      type: "action",
      component: "ProviderFilter",
      content: `Filtered by category "${params.category}": ${filtered.length} remaining.`,
      status: "success"
    });
  }

  // 2. Filter by location / city
  if (params.location) {
    filtered = filtered.filter(p => p.city.toLowerCase() === params.location?.toLowerCase());
    traces.push({
      type: "action",
      component: "ProviderFilter",
      content: `Filtered by city "${params.location}": ${filtered.length} remaining.`,
      status: "success"
    });
  }

  // 3. Filter by budget (hourlyPrice)
  // Assuming standard job duration is 1.5 hours
  if (params.budget) {
    const maxHourlyPrice = params.budget / 1.5;
    const priceFiltered = filtered.filter(p => p.hourlyPrice <= params.budget!);
    
    if (priceFiltered.length > 0) {
      filtered = priceFiltered;
      traces.push({
        type: "action",
        component: "ProviderFilter",
        content: `Filtered by budget (max PKR ${params.budget}): ${filtered.length} remaining.`,
        status: "success"
      });
    } else {
      // If none match budget, keep all but add a warning trace
      traces.push({
        type: "action",
        component: "ProviderFilter",
        content: `No providers found within budget PKR ${params.budget}. Retaining closest price matches as fallback.`,
        status: "warning"
      });
    }
  }

  // 4. Filter by availability (day of week)
  if (params.date) {
    const targetDate = new Date(params.date);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDayName = daysOfWeek[targetDate.getDay()];
    
    const availableFiltered = filtered.filter(p => 
      p.availability.some(slot => slot.day === targetDayName)
    );

    if (availableFiltered.length > 0) {
      filtered = availableFiltered;
      traces.push({
        type: "action",
        component: "ProviderFilter",
        content: `Filtered by weekday availability (${targetDayName}): ${filtered.length} remaining.`,
        status: "success"
      });
    } else {
      traces.push({
        type: "action",
        component: "ProviderFilter",
        content: `No providers show availability schedules for ${targetDayName}. Disregarding calendar lock to allow on-demand booking.`,
        status: "warning"
      });
    }
  }

  traces.push({
    type: "result",
    component: "ProviderFilter",
    content: `Provider filtering complete. Found ${filtered.length} matching candidates.`,
    status: "success",
    metadata: { count: filtered.length }
  });

  return {
    result: filtered,
    traces
  };
}

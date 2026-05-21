import type { Provider, ServiceCategoryFilter, ServiceCategoryOption } from '../types';

export const SERVICE_CATEGORY_OPTIONS: ServiceCategoryOption[] = [
  { key: 'all', label: 'All', aliases: [] },
  { key: 'plumber', label: 'Plumber', aliases: ['Plumbing', 'plumber'] },
  { key: 'electrician', label: 'Electrician', aliases: ['Electrical', 'electrician'] },
  { key: 'ac_technician', label: 'AC Technician', aliases: ['AC Technician', 'HVAC', 'ac_technician'] },
  { key: 'mechanic', label: 'Mechanic', aliases: ['Auto Mechanic', 'Mechanic', 'mechanic'] },
  { key: 'tutor', label: 'Tutor', aliases: ['Tutoring', 'Tutor', 'tutor'] },
  { key: 'cleaner', label: 'Cleaner', aliases: ['Cleaning', 'Cleaner', 'cleaner'] },
  { key: 'beautician', label: 'Beautician', aliases: ['Beautician', 'beautician'] },
  { key: 'painter_handyman', label: 'Painter/Handyman', aliases: ['Painting', 'Handyman', 'Painter', 'painter_handyman', 'Appliance Repair'] },
];

const normalize = (value: string) => value.trim().toLowerCase();

export function getServiceCategoryOption(category: ServiceCategoryFilter) {
  return SERVICE_CATEGORY_OPTIONS.find(option => option.key === category) ?? SERVICE_CATEGORY_OPTIONS[0];
}

export function getCategoryDisplayLabel(category: ServiceCategoryFilter) {
  return getServiceCategoryOption(category).label;
}

export function matchesServiceCategory(providerCategory: string, selectedCategory: ServiceCategoryFilter) {
  if (selectedCategory === 'all') {
    return true;
  }

  const option = getServiceCategoryOption(selectedCategory);
  const normalizedProviderCategory = normalize(providerCategory);
  return option.aliases.some(alias => normalize(alias) === normalizedProviderCategory);
}

export function filterProvidersByCategory<T extends { serviceCategory: string }>(providers: T[], selectedCategory: ServiceCategoryFilter) {
  return providers.filter(provider => matchesServiceCategory(provider.serviceCategory, selectedCategory));
}

export function buildProviderCountByCategory(providers: Pick<Provider, 'serviceCategory'>[]) {
  return SERVICE_CATEGORY_OPTIONS.reduce<Record<ServiceCategoryFilter, number>>((acc, option) => {
    if (option.key === 'all') {
      acc.all = providers.length;
      return acc;
    }

    acc[option.key] = providers.filter(provider => matchesServiceCategory(provider.serviceCategory, option.key)).length;
    return acc;
  }, {
    all: providers.length,
    plumber: 0,
    electrician: 0,
    ac_technician: 0,
    mechanic: 0,
    tutor: 0,
    cleaner: 0,
    beautician: 0,
    painter_handyman: 0,
  });
}

export function inferCategoryFromText(text: string): ServiceCategoryFilter | null {
  const value = text.toLowerCase();

  const has = (pattern: RegExp) => pattern.test(value);

  // AC/setup should map to AC technicians first
  if (has(/\bac\b|air\s*conditioner|hvac|split\s*ac|window\s*ac|ac\s*(install|installation|setup|service|repair)/i)) {
    return 'ac_technician';
  }

  // Pipeline and water-leak style requests should map to plumbers
  if (has(/plumb|pipe\s*line|pipeline|pipe|leak|drain|sink|tap|nal|tanki|pani|\bنل\b|\bپائپ\b|\bپانی\b/i)) {
    return 'plumber';
  }

  // Amazon/device setup and technical installation often need electrical/installation skills
  if (has(/amazon\s*(setup|installation|install)|technical\s*(setup|installation)|device\s*install|router\s*setup|camera\s*setup|wifi\s*setup|alexa|fire\s*tv|echo\s*dot/i)) {
    return 'electrician';
  }

  if (has(/electric|bijli|wire|short\s*circuit|switch|socket|wiring/i)) return 'electrician';
  if (has(/mechanic|gari|car|bike|engine|tyre|punchar/i)) return 'mechanic';
  if (has(/tutor|tuition|academy|teacher|math|science/i)) return 'tutor';
  if (has(/clean|safai|saaf|deep\s*clean/i)) return 'cleaner';
  if (has(/beaut|salon|makeup|mehndi|parlor/i)) return 'beautician';

  // Generic install/setup for appliances/home tasks routes to handyman bucket
  if (has(/install|installation|setup|handyman|painter|paint|mount/i)) return 'painter_handyman';

  return null;
}

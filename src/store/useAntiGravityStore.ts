import { create } from 'zustand';
import { mockProviders } from '../services/mockData';
import { AntiGravityTrace, Booking, Provider, ServiceCategoryFilter } from '../types';
import { buildProviderCountByCategory, getServiceCategoryOption, inferCategoryFromText, matchesServiceCategory } from '../utils/serviceCategories';
import { useBookingStore } from './useBookingStore';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isActionable?: boolean;
  providers?: Provider[];
}

interface ProcessUserRequestResult {
  assistantMessage: string;
  topProviders: Provider[];
  bookingId: string | null;
  activeCategory: ServiceCategoryFilter;
  locationName: string;
  scheduleLabel: string;
}

interface AntiGravityState {
  isTyping: boolean;
  selectedCategory: ServiceCategoryFilter;
  providerCountByCategory: Record<ServiceCategoryFilter, number>;
  messages: Message[];
  traces: AntiGravityTrace[];
  
  // Actions
  setTyping: (isTyping: boolean) => void;
  setSelectedCategory: (category: ServiceCategoryFilter) => void;
  addMessage: (message: Message) => void;
  addTrace: (trace: Omit<AntiGravityTrace, 'timestamp' | 'traceId'>) => void;
  clearChat: () => void;
  processUserRequest: (text: string, options?: { preferredCategory?: ServiceCategoryFilter | null; uiFilters?: { category: ServiceCategoryFilter } }) => Promise<ProcessUserRequestResult>;
}

const DEFAULT_LOCATION = {
  name: 'Islamabad G-14',
  latitude: 33.6491,
  longitude: 72.9750,
};

const INTENT_DICTIONARY: Record<string, string[]> = {
  Plumbing: ['pipe', 'pipeline', 'pipe line', 'leak', 'pani', 'motor', 'basan', 'sink', 'plumber', 'water', 'nal', 'tanki', 'drain', 'tap', 'پانی', 'نل', 'پائپ'],
  Electrical: ['bijli', 'wire', 'current', 'switch', 'light', 'electrician', 'short', 'bulb', 'fan', 'pankha', 'router setup', 'camera setup', 'technical installation', 'wifi setup', 'alexa', 'fire tv', 'بجلی', 'سوئچ', 'لائٹ', 'پنکھا'],
  'Appliance Repair': ['washing machine', 'machine', 'fridge', 'haier', 'install', 'installation', 'setup', 'cooling', 'dawlance', 'pel', 'orient', 'amazon setup', 'واشنگ مشین', 'مشین', 'فرج'],
  'AC Technician': ['ac', 'air conditioner', 'ac install', 'ac installation', 'ac repair', 'ac service', 'ایئر کنڈیشنر', 'اے سی'],
  'Auto Mechanic': ['gari', 'car', 'start nahi', 'tyre', 'mechanic', 'engine', 'bike', 'motorcycle', 'punchar', 'گاڑی', 'ٹائر', 'مکینک'],
  Cleaning: ['saaf', 'clean', 'kachra', 'gand', 'safai', 'wash', 'cleaning', 'صفائی', 'گندا'],
  Tutoring: ['parhna', 'tutor', 'math', 'science', 'english', 'academy', 'school', 'tuition', 'ٹیوٹر', 'پڑھنا'],
  Beautician: ['beauty', 'salon', 'parlor', 'makeup', 'mehndi', 'beautician', 'بیوٹی', 'مہندی', 'سالن'],
};

const LOCATION_KEYWORDS = [
  { keys: ['g-14', 'g14', 'جی-14', 'جی ۱۴'], name: 'Islamabad G-14', latitude: 33.6491, longitude: 72.9750 },
  { keys: ['islamabad', 'اسلام آباد'], name: 'Islamabad', latitude: 33.6844, longitude: 73.0479 },
  { keys: ['rawalpindi', 'راولپنڈی'], name: 'Rawalpindi', latitude: 33.5651, longitude: 73.0169 },
  { keys: ['lahore', 'لاہور'], name: 'Lahore', latitude: 31.5204, longitude: 74.3587 },
  { keys: ['karachi', 'کراچی'], name: 'Karachi', latitude: 24.8607, longitude: 67.0011 },
];

const BRAND_KEYWORDS = ['haier', 'dawlance', 'pel', 'orient', 'honda', 'toyota'];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const detectLanguage = (text: string) => {
  if (/\p{Script=Arabic}/u.test(text)) return 'urdu';
  const romanSignals = ['mujhe', 'mujha', 'aap', 'krna', 'karna', 'krwani', 'pani', 'bijli', 'gari', 'safai'];
  if (romanSignals.some(term => text.toLowerCase().includes(term))) return 'roman_urdu';
  return 'english';
};

const extractIntent = (text: string) => {
  const lowerText = text.toLowerCase();
  const detectedCategories = new Set<string>();
  const matchedKeywords: string[] = [];

  Object.entries(INTENT_DICTIONARY).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        detectedCategories.add(category);
        matchedKeywords.push(keyword);
      }
    });
  });

  if (lowerText.includes('washing machine') && (lowerText.includes('install') || lowerText.includes('connect'))) {
    detectedCategories.add('Appliance Repair');
    detectedCategories.add('Plumbing');
  }

  if (detectedCategories.size === 0) {
    detectedCategories.add('Handyman');
  }

  return {
    categories: Array.from(detectedCategories),
    matchedKeywords,
    confidence: Math.min(0.95, 0.45 + matchedKeywords.length * 0.08),
    recognizedBrands: BRAND_KEYWORDS.filter(brand => lowerText.includes(brand)),
  };
};

const extractLocation = (text: string) => {
  const lowerText = text.toLowerCase();
  const match = LOCATION_KEYWORDS.find(loc => loc.keys.some(key => lowerText.includes(key.toLowerCase())));

  if (match) {
    return { name: match.name, latitude: match.latitude, longitude: match.longitude, confidence: 0.9 };
  }

  return { ...DEFAULT_LOCATION, confidence: 0.5 };
};

const extractScheduleTime = (text: string) => {
  const lowerText = text.toLowerCase();
  const now = new Date();
  const schedule = new Date(now);

  if (/(tomorrow|kal|کل)/i.test(lowerText)) {
    schedule.setDate(schedule.getDate() + 1);
  }

  if (/(evening|shaam|شام)/i.test(lowerText)) {
    schedule.setHours(18, 0, 0, 0);
  } else if (/(morning|subah|صبح)/i.test(lowerText)) {
    schedule.setHours(9, 0, 0, 0);
  } else if (/(night|raat|رات)/i.test(lowerText)) {
    schedule.setHours(20, 0, 0, 0);
  }

  const timeMatch = lowerText.match(/(\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);
  if (timeMatch) {
    let hours = Number(timeMatch[1]);
    const minutes = timeMatch[2] ? Number(timeMatch[2]) : 0;
    const meridian = timeMatch[3]?.toLowerCase();
    if (meridian === 'pm' && hours < 12) hours += 12;
    if (meridian === 'am' && hours === 12) hours = 0;
    schedule.setHours(hours, minutes, 0, 0);
  }

  if (schedule.getTime() - now.getTime() < 30 * 60 * 1000) {
    schedule.setHours(now.getHours() + 2, 0, 0, 0);
  }

  return { timeISO: schedule.toISOString(), label: schedule.toLocaleString(), confidence: 0.7 };
};

const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const scoreProviders = (providers: Provider[], location: { latitude: number; longitude: number }, categories: string[]) => {
  return providers.map(provider => {
    const distanceKm = getDistanceKm(location.latitude, location.longitude, provider.location.latitude, provider.location.longitude);
    const distanceScore = Math.max(0, 1 - distanceKm / 15);
    const ratingScore = provider.rating / 5;
    const availabilityScore = provider.isAvailable ? 1 : 0;
    const categoryScore = categories.includes(provider.serviceCategory) ? 1 : 0.3;

    const totalScore = (ratingScore * 0.45) + (distanceScore * 0.35) + (availabilityScore * 0.15) + (categoryScore * 0.05);
    return { provider: { ...provider, distance: Number(distanceKm.toFixed(1)) }, totalScore };
  }).sort((a, b) => b.totalScore - a.totalScore);
};

const buildResponse = (language: string, categories: string[], brand?: string) => {
  const serviceLabel = categories.join(', ');
  if (language === 'urdu') {
    return `میں نے آپ کی درخواست سمجھ لی ہے۔ میں ${brand ? brand + ' ' : ''}${serviceLabel} کے لیے قریب ترین ماہرین کو تلاش کر رہا ہوں، اور ریٹنگ، دستیابی اور فاصلے کی بنیاد پر بہترین آپشنز تجویز کروں گا۔`;
  }
  if (language === 'roman_urdu') {
    return `Samajh gaya. Main ${brand ? brand + ' ' : ''}${serviceLabel} ke liye qareeb tarteen professionals dhoond raha hoon aur rating, availability aur distance ki bunyaad par best options recommend karoon ga.`;
  }
  return `I understand your request for ${brand ? brand + ' ' : ''}${serviceLabel}. I will recommend the best providers based on distance, availability, and ratings.`;
};

const scheduleBookingLifecycle = (bookingId: string, addTrace: AntiGravityState['addTrace']) => {
  const { updateBookingStatus } = useBookingStore.getState();

  setTimeout(() => {
    updateBookingStatus(bookingId, 'confirmed');
    addTrace({ type: 'result', content: '[Booking Agent] Provider confirmed the request.', component: 'BookingAgent', status: 'success' });
  }, 1500);

  setTimeout(() => {
    updateBookingStatus(bookingId, 'en_route');
    addTrace({ type: 'action', content: '[Follow-Up Agent] Provider is en route. ETA shared with user.', component: 'FollowUpAgent', status: 'success' });
  }, 3500);

  setTimeout(() => {
    updateBookingStatus(bookingId, 'in_progress');
    addTrace({ type: 'action', content: '[Booking Agent] Service has started. Monitoring progress.', component: 'BookingAgent', status: 'success' });
  }, 5500);

  setTimeout(() => {
    updateBookingStatus(bookingId, 'completed');
    addTrace({ type: 'result', content: '[Follow-Up Agent] Service completed. Feedback request queued.', component: 'FollowUpAgent', status: 'success' });
  }, 8000);
};

export const useAntiGravityStore = create<AntiGravityState>((set, get) => ({
  isTyping: false,
  selectedCategory: 'all',
  providerCountByCategory: buildProviderCountByCategory(mockProviders),
  messages: [
    {
      id: 'msg-init-1',
      role: 'assistant',
      content: 'Hello. I am AntiGravity. Tell me what service you need in English, Urdu, or Roman Urdu, and I will orchestrate the best provider for you instantly.',
      timestamp: new Date().toISOString(),
    }
  ],
  traces: [],

  setTyping: (isTyping) => set({ isTyping }),

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  addTrace: (tracePayload) => set((state) => ({
    traces: [...state.traces, {
      ...tracePayload,
      traceId: `trc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    }]
  })),

  clearChat: () => set((state) => ({
    messages: [{
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: 'Hello again. How can I assist you today?',
      timestamp: new Date().toISOString(),
    }],
    traces: [],
    selectedCategory: state.selectedCategory,
    providerCountByCategory: state.providerCountByCategory,
  })),

  processUserRequest: (text: string, options) => {
    const { addMessage, addTrace, setTyping } = get();
    const preferredCategory = options?.preferredCategory ?? get().selectedCategory;

    addMessage({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    });

    setTyping(true);

    const runPipeline = async (): Promise<ProcessUserRequestResult> => {
      addTrace({ type: 'thought', content: '[Intent Agent] Starting multi-agent orchestration pipeline.', component: 'IntentAgent', status: 'success' });

      await sleep(400);
      const language = detectLanguage(text);
      addTrace({
        type: 'action',
        content: `[Language Agent] Detected language: ${language}.`,
        component: 'LanguageAgent',
        status: 'success',
      });

      await sleep(500);
      const intent = extractIntent(text);
      const inferredCategory = inferCategoryFromText(text);
      const selectedIsStrongPreference = preferredCategory && preferredCategory !== 'all';
      const preferenceOverridden = Boolean(selectedIsStrongPreference && inferredCategory && inferredCategory !== preferredCategory);
      const activeCategory = preferenceOverridden ? inferredCategory : (inferredCategory ?? preferredCategory ?? 'all');
      const categoriesForScoring = activeCategory && activeCategory !== 'all'
        ? getServiceCategoryOption(activeCategory).aliases
        : intent.categories;

      addTrace({
        type: 'action',
        content: `[Intent Agent] Detected services: ${intent.categories.join(' + ')} (confidence ${intent.confidence.toFixed(2)}).`,
        component: 'IntentAgent',
        status: 'success',
        metadata: {
          matchedKeywords: intent.matchedKeywords,
          preferredCategory,
          inferredCategory,
          reasoning: preferenceOverridden
            ? {
                note: `User selected category ${preferredCategory} but text indicates ${activeCategory}; using ${activeCategory}`,
              }
            : { note: 'Preference preserved or no stronger category signal detected.' },
        },
      });

      await sleep(500);
      const location = extractLocation(text);
      addTrace({
        type: 'action',
        content: `[Location Agent] Using location: ${location.name}.`,
        component: 'LocationAgent',
        status: 'success',
        metadata: { latitude: location.latitude, longitude: location.longitude },
      });

      await sleep(450);
      const schedule = extractScheduleTime(text);
      addTrace({
        type: 'action',
        content: `[Scheduling Agent] Proposed time: ${schedule.label}.`,
        component: 'SchedulingAgent',
        status: 'success',
      });

      await sleep(600);
      const filteredProviders = mockProviders.filter(provider => matchesServiceCategory(provider.serviceCategory, activeCategory as ServiceCategoryFilter));

      addTrace({
        type: 'action',
        content: `[Provider Search Agent] Found ${filteredProviders.length} relevant providers.`,
        component: 'ProviderSearchAgent',
        status: filteredProviders.length ? 'success' : 'fallback',
        metadata: { activeCategory, preferredCategory },
      });

      await sleep(600);
      const ranked = scoreProviders(filteredProviders, location, categoriesForScoring);
      const topProviders = ranked.slice(0, 3).map(item => item.provider);
      addTrace({
        type: 'action',
        content: `[Ranking Agent] Ranked providers by distance, availability, and ratings.`,
        component: 'RankingAgent',
        status: 'success',
        metadata: ranked.slice(0, 3).map(item => ({
          id: item.provider.id,
          score: Number(item.totalScore.toFixed(2)),
          distanceKm: item.provider.distance,
          rating: item.provider.rating,
        })),
      });

      await sleep(700);
      let bookingId: string | null = null;
      if (topProviders.length > 0) {
        const primaryProvider = topProviders[0];
        bookingId = `b-${Date.now()}`;
        const booking: Booking = {
          id: bookingId,
          providerId: primaryProvider.id,
          userId: 'u-1',
          status: 'pending',
          scheduledTime: schedule.timeISO,
          estimatedCost: Math.round(primaryProvider.hourlyRate * 1.8),
          serviceDetails: `${categoriesForScoring.join(' + ')} service request`,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.name,
          },
        };

        const bookingStore = useBookingStore.getState();
        bookingStore.addBooking(booking);
        bookingStore.setActiveBooking(bookingId);

        addTrace({
          type: 'result',
          content: `[Booking Agent] Booking created and provider assigned (${primaryProvider.name}).`,
          component: 'BookingAgent',
          status: 'success',
          metadata: { preferredCategory, activeCategory },
        });

        scheduleBookingLifecycle(bookingId, addTrace);
      } else {
        addTrace({
          type: 'result',
          content: '[Booking Agent] No providers available. Escalating for manual follow-up.',
          component: 'BookingAgent',
          status: 'fallback',
          metadata: { preferredCategory, activeCategory },
        });
      }

      const response = buildResponse(language, categoriesForScoring, intent.recognizedBrands[0]);
      setTyping(false);
      addMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        isActionable: topProviders.length > 0,
        providers: topProviders,
      });

      return {
        assistantMessage: response,
        topProviders,
        bookingId,
        activeCategory: activeCategory as ServiceCategoryFilter,
        locationName: location.name,
        scheduleLabel: schedule.label,
      };
    };

    return runPipeline();
  }
}));

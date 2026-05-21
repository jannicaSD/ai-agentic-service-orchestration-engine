import { create } from 'zustand';
import { mockProviderThreads, mockProviders } from '../services/mockData';
import { ProviderMessage, ProviderThread } from '../types';
import { inferCategoryFromText } from '../utils/serviceCategories';

interface ProviderChatState {
  threads: Record<string, ProviderThread & { isTyping?: boolean; conversationContext?: ConversationContext }>;
  getThread: (providerId: string) => ProviderThread;
  sendMessage: (providerId: string, text: string) => void;
  setTyping: (providerId: string, isTyping: boolean) => void;
  seedThreads: (mockThreads: Record<string, ProviderThread>) => void;
}

interface ConversationContext {
  detectedIntent: string | null;
  detectedLocation: string | null;
  detectedTiming: string | null;
  hasAskedForLocation: boolean;
  hasAskedForTiming: boolean;
  customerServiceCategory: string | null;
  conversationStage: 'initial' | 'location_requested' | 'timing_requested' | 'confirmed' | 'completed';
}

const CATEGORY_LABELS: Record<string, string> = {
  plumber: 'پلمبر',
  electrician: 'الیکٹریشن',
  ac_technician: 'ایئر کنڈیشنر ٹیکنیشن',
  mechanic: 'مکینک',
  tutor: 'ٹیوٹر',
  cleaner: 'صفائی والا',
  beautician: 'بیوٹیشن',
  painter_handyman: 'ہینڈی مین',
};

// Helper functions for agentic analysis
const detectLocation = (text: string): string | null => {
  const locationPatterns = [
    /g-?14|g14/i,
    /islamabad|اسلام آباد/i,
    /rawalpindi|راولپنڈی/i,
    /lahore|لاہور/i,
    /karachi|کراچی/i,
  ];
  
  for (const pattern of locationPatterns) {
    if (pattern.test(text)) {
      return text.match(pattern)?.[0] || null;
    }
  }
  return null;
};

const detectTiming = (text: string): string | null => {
  if (/(today|now|abhi|فوری|آج)/i.test(text)) return 'immediately';
  if (/(tomorrow|kal|کل)/i.test(text)) return 'tomorrow';
  if (/(evening|shaam|شام)/i.test(text)) return 'evening';
  if (/(morning|subah|صبح)/i.test(text)) return 'morning';
  if (/(night|raat|رات)/i.test(text)) return 'night';
  if (/\d{1,2}:\d{2}|(\d{1,2})\s*(am|pm)/i.test(text)) return 'specific time';
  return null;
};

const analyzeConversationContext = (
  customerMessage: string,
  thread: ProviderThread,
  providerId: string
): ConversationContext => {
  const lowerText = customerMessage.toLowerCase();
  
  // Update detected information from this message
  const detectedLocation = detectLocation(customerMessage);
  const detectedTiming = detectTiming(customerMessage);
  const customerServiceCategory = inferCategoryFromText(customerMessage);
  
  // Check conversation history
  const hasAskedForLocation = thread.messages.some(
    msg => msg.role === 'provider' && /location|address|jagah|bhej/i.test(msg.text)
  );
  const hasAskedForTiming = thread.messages.some(
    msg => msg.role === 'provider' && /time|timing|kab|when|ghante/i.test(msg.text)
  );
  
  // Determine conversation stage
  let conversationStage: ConversationContext['conversationStage'] = 'initial';
  if (hasAskedForLocation && !detectedLocation) {
    conversationStage = 'location_requested';
  } else if (detectedLocation && hasAskedForTiming && !detectedTiming) {
    conversationStage = 'timing_requested';
  } else if (detectedLocation && detectedTiming) {
    conversationStage = 'confirmed';
  } else if (hasAskedForLocation && detectedLocation && hasAskedForTiming && detectedTiming) {
    conversationStage = 'completed';
  }
  
  return {
    detectedIntent: customerServiceCategory,
    detectedLocation,
    detectedTiming,
    hasAskedForLocation,
    hasAskedForTiming,
    customerServiceCategory,
    conversationStage,
  };
};

// Generate contextual provider response based on conversation state
const generateProviderResponse = (
  context: ConversationContext,
  customerMessage: string,
  provider: any
): string => {
  const { conversationStage, customerServiceCategory, detectedLocation, detectedTiming } = context;
  
  // Determine appropriate response based on conversation flow
  if (conversationStage === 'initial' || conversationStage === 'location_requested') {
    // Customer needs to provide location
    const categoryLabel = customerServiceCategory ? CATEGORY_LABELS[customerServiceCategory] || customerServiceCategory : 'خدمات';
    return `جی بھائی، آپ کے ${categoryLabel} کی درخواست سمجھ گیا۔ براہ کرم اپنی موجودہ جگہ/لوکیشن بھیج دیں تاکہ میں آپ سے ملنے کا موقع معلوم کر سکوں۔`;
  }
  
  if (conversationStage === 'timing_requested') {
    // Customer provided location, now need timing
    if (detectedLocation) {
      return `شکریہ۔ ${detectedLocation} میں سرِ دستِ دستیابی ہے۔ براہ کرم بتائیں کہ میں کب آپ کے پاس آ سکتا ہوں؟`;
    }
    return `شکریہ۔ براہ کرم بتائیں کہ میں کب آپ کے پاس آ سکتا ہوں؟`;
  }
  
  if (conversationStage === 'confirmed') {
    // Both location and timing confirmed
    const timeLabel = detectedTiming || 'جلد';
    return `بہترین! میں ${detectedLocation} میں ${timeLabel} آپ کے پاس پہنچ جاؤں گا۔ آپ سے ملنے سے پہلے فون کروں گا۔ کیا کوئی اور تفصیل بتانی ہے؟`;
  }
  
  // Default fallback
  return `جی بھائی، آپ کی خدمت میں حاضری کے لیے تیار ہوں۔ براہ کرم اپنی جگہ اور موقع بتائیں۔`;
};

export const useProviderChatStore = create<ProviderChatState>((set, get) => ({
  threads: mockProviderThreads,
  
  getThread: (providerId) => {
    return get().threads[providerId] || { providerId, messages: [] };
  },

  setTyping: (providerId, isTyping) => {
    set((state) => {
      const thread = state.threads[providerId] || { providerId, messages: [] };
      return {
        threads: {
          ...state.threads,
          [providerId]: {
            ...thread,
            isTyping,
          },
        },
      };
    });
  },

  sendMessage: (providerId, text) => {
    const newMessage: ProviderMessage = {
      id: `msg-${Date.now()}`,
      providerId,
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const thread = state.threads[providerId] || { providerId, messages: [] };
      const updatedThread = {
        ...thread,
        messages: [...thread.messages, newMessage],
        isTyping: false,
      };
      
      // Analyze and update context
      const context = analyzeConversationContext(text, thread, providerId);
      
      return {
        threads: {
          ...state.threads,
          [providerId]: {
            ...updatedThread,
            conversationContext: context,
          },
        },
      };
    });

    const threadSnapshot = get().threads[providerId] || { providerId, messages: [] };
    const provider = mockProviders.find(p => p.id === providerId);
    
    // Analyze this turn
    const context = analyzeConversationContext(text, threadSnapshot, providerId);
    
    // Show typing indicator
    setTimeout(() => {
      set((state) => {
        const thread = state.threads[providerId];
        if (!thread) return state;
        return {
          threads: {
            ...state.threads,
            [providerId]: {
              ...thread,
              isTyping: true,
            },
          },
        };
      });
    }, 300);

    // Generate AI response based on conversation context
    setTimeout(() => {
      const replyText = generateProviderResponse(context, text, provider);
      
      const replyMessage: ProviderMessage = {
        id: `msg-reply-${Date.now()}`,
        providerId,
        role: 'provider',
        text: replyText,
        createdAt: new Date().toISOString(),
      };
      
      set((state) => {
        const thread = state.threads[providerId];
        if (!thread) return state;
        return {
          threads: {
            ...state.threads,
            [providerId]: {
              ...thread,
              messages: [...thread.messages, replyMessage],
              isTyping: false,
              conversationContext: context,
            },
          },
        };
      });
    }, Math.floor(Math.random() * 1000) + 700);
  },

  seedThreads: (mockThreads) => {
    set({ threads: mockThreads });
  },
}));

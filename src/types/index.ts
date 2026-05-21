import { z } from 'zod';

export type ServiceCategoryFilter =
  | 'all'
  | 'plumber'
  | 'electrician'
  | 'ac_technician'
  | 'mechanic'
  | 'tutor'
  | 'cleaner'
  | 'beautician'
  | 'painter_handyman';

export type ServiceCategoryOption = {
  key: ServiceCategoryFilter;
  label: string;
  aliases: string[];
};

// Provider Schema
export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  serviceCategory: z.string(),
  rating: z.number().min(0).max(5),
  jobsCompleted: z.number().min(0),
  hourlyRate: z.number().min(0),
  isAvailable: z.boolean(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  distance: z.number().optional(), // In miles or km
  phone: z.string().optional(),
  responseTimeMins: z.number().optional(),
  preferredContact: z.enum(['call', 'chat', 'whatsapp']).optional(),
  reliabilityScore: z.number().min(0).max(1),
  cancellationRate: z.number().min(0).max(1),
  onTimeScore: z.number().min(0).max(1),
  disputeIndex: z.number().min(0).max(1),
  specializationLevel: z.enum(['BASIC', 'INTERMEDIATE', 'COMPLEX']),
  availabilitySlots: z.array(z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  })),
});

export type Provider = z.infer<typeof ProviderSchema>;

// Provider Chat Schemas
export const ProviderMessageSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  role: z.enum(['user', 'provider']),
  text: z.string(),
  createdAt: z.string().datetime(),
});

export type ProviderMessage = z.infer<typeof ProviderMessageSchema>;

export const ProviderThreadSchema = z.object({
  providerId: z.string(),
  messages: z.array(ProviderMessageSchema),
});

export type ProviderThread = z.infer<typeof ProviderThreadSchema>;

// Booking Schema
export const BookingSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  userId: z.string(),
  status: z.enum(['pending', 'confirmed', 'en_route', 'in_progress', 'completed', 'cancelled']),
  scheduledTime: z.string().datetime(), // ISO Date string
  estimatedCost: z.number(),
  serviceDetails: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
  }),
});

export type Booking = z.infer<typeof BookingSchema>;

// Chat Intent Schema
export const ChatIntentSchema = z.object({
  type: z.enum(['greeting', 'service_request', 'status_check', 'support', 'unknown']),
  confidence: z.number().min(0).max(1),
  extractedEntities: z.record(z.string(), z.any()).optional(),
  originalMessage: z.string(),
});

export type ChatIntent = z.infer<typeof ChatIntentSchema>;

// AntiGravity Trace Schema (for logging AI Orchestrator latency/errors)
export const AntiGravityTraceSchema = z.object({
  traceId: z.string(),
  timestamp: z.string().datetime(),
  type: z.enum(['thought', 'action', 'result']),
  content: z.string(),
  component: z.string().optional(),
  latencyMs: z.number().optional(),
  status: z.enum(['success', 'error', 'fallback']).optional(),
  errorMessage: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type AntiGravityTrace = z.infer<typeof AntiGravityTraceSchema>;

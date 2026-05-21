export interface Availability {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Provider {
  id: string;
  name: string;
  category: "plumber" | "electrician" | "ac-tech" | "mechanic" | "tutor" | "cleaner" | "beautician";
  city: string;
  rating: number;
  hourlyPrice: number;
  availability: Availability[];
  phoneNumber: string;
  coordinates: Coordinates;
  experience: number;
  reviews: number;
  profileImage: string;
}

export interface BookingLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Booking {
  id: string;
  providerId: string;
  userId: string;
  status: "requested" | "pending" | "accepted" | "en_route" | "arrived" | "in_progress" | "completed" | "cancelled" | "flagged" | "archived";
  scheduledTime: string;
  estimatedCost: number;
  serviceDetails: string;
  location: BookingLocation;
  rating?: number;
  review?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  isActionable?: boolean;
  providers?: Provider[];
  traceId?: string;
}

export interface AgentTrace {
  traceId: string;
  timestamp: string;
  type: "thought" | "action" | "result";
  content: string;
  component: string;
  status: "success" | "fallback" | "warning";
  metadata?: Record<string, any>;
}

export interface ExtractionResult {
  category: Provider["category"] | null;
  location: string | null;
  coordinates: Coordinates | null;
  budget: number | null;
  date: string | null;
  timeSlot: "morning" | "afternoon" | "evening" | "night" | null;
  urgency: "normal" | "urgent" | null;
  confidence: number;
}

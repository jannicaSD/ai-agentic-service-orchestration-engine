import { Provider, Booking, Coordinates } from "../types";
import providersData from "../../data/providers.json";

export type AntigravityStatus =
  | "requested"
  | "pending"
  | "accepted"
  | "en_route"
  | "arrived"
  | "in_progress"
  | "completed"
  | "flagged"
  | "archived";

export interface AntigravityResponse {
  booking_id: string;
  current_status: AntigravityStatus;
  timestamp: string;
  action_taken: string;
  payload: Record<string, any>;
}

// Distance helper (Haversine formula)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper to load/save custom provider states to localStorage to simulate ratings updating globally
function getProvidersList(): Provider[] {
  if (typeof window !== "undefined") {
    const customProviders = localStorage.getItem("antigravity_custom_providers");
    if (customProviders) {
      return JSON.parse(customProviders);
    }
  }
  return providersData as Provider[];
}

function saveProvidersList(providers: Provider[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("antigravity_custom_providers", JSON.stringify(providers));
  }
}

// Phase 2: Service Request Validation & Enrichment
export function validateRequest(
  bookingId: string,
  input: {
    text: string;
    category: string | null;
    locationName: string | null;
    coordinates: Coordinates | null;
    urgency: "normal" | "urgent";
    budget: number | null;
    timeSlot: string | null;
  }
): AntigravityResponse {
  const timestamp = new Date().toISOString();
  
  // Validation checks
  const missingFields: string[] = [];
  if (!input.category) missingFields.push("service type/category");
  if (!input.locationName || !input.coordinates) missingFields.push("location coordinates/address");
  if (!input.timeSlot) missingFields.push("desired time slot");

  if (missingFields.length > 0) {
    return {
      booking_id: bookingId,
      current_status: "requested",
      timestamp,
      action_taken: `Antigravity input validation FAILED. Missing: ${missingFields.join(", ")}.`,
      payload: {
        success: false,
        validation_errors: missingFields,
        raw_text: input.text
      }
    };
  }

  // Enrichment
  const normalizedAddress = `${input.locationName} Central Zone, Pakistan`;
  const technicalMetadata = {
    geo_quadrant: input.coordinates!.lat > 30 ? "NORTH" : "SOUTH",
    extracted_urgency: input.urgency,
    budget_constraints: input.budget ? `Max PKR ${input.budget}` : "No constraint",
    linguistic_model: "urdu-roman-hybrid-v2",
    routing_priority: input.urgency === "urgent" ? "HIGH" : "NORMAL"
  };

  return {
    booking_id: bookingId,
    current_status: "requested",
    timestamp,
    action_taken: "Antigravity successfully validated user input details and enriched requested category and location parameters.",
    payload: {
      success: true,
      category: input.category,
      coordinates: input.coordinates,
      address: normalizedAddress,
      urgency: input.urgency,
      budget: input.budget,
      timeSlot: input.timeSlot,
      technical_metadata: technicalMetadata
    }
  };
}

// Phase 3: Provider Matching & Dynamic Pricing
export function matchAndPrice(
  bookingId: string,
  enrichedPayload: Record<string, any>
): AntigravityResponse {
  const timestamp = new Date().toISOString();
  const { category, coordinates, urgency, budget } = enrichedPayload;

  if (!category || !coordinates) {
    return {
      booking_id: bookingId,
      current_status: "pending",
      timestamp,
      action_taken: "Matching aborted due to invalid enrich payload.",
      payload: { success: false, error: "Missing category or coordinates" }
    };
  }

  // Scan & Filter providers matching category
  const providers = getProvidersList();
  const matchingProviders = providers.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );

  if (matchingProviders.length === 0) {
    return {
      booking_id: bookingId,
      current_status: "pending",
      timestamp,
      action_taken: `Antigravity scanned providers database but found 0 matches for category: ${category}. Escalating.`,
      payload: { success: false, ranked_providers: [], dynamic_price: 0 }
    };
  }

  // Score & Rank providers
  // Scoring formula: Rating (45%) + Distance (35%) + Experience/reviews (20%)
  const ranked = matchingProviders.map(p => {
    const dist = getDistanceKm(coordinates.lat, coordinates.lng, p.coordinates.lat, p.coordinates.lng);
    const distanceScore = Math.max(0, 1 - dist / 25); // Score out of 1 for distance up to 25km
    const ratingScore = p.rating / 5.0;
    const experienceScore = Math.min(1.0, p.experience / 15.0); // capped at 15 years

    const totalScore = (ratingScore * 0.45) + (distanceScore * 0.35) + (experienceScore * 0.2);

    return {
      provider: p,
      distanceKm: parseFloat(dist.toFixed(2)),
      score: parseFloat(totalScore.toFixed(3))
    };
  });

  // Sort descending
  ranked.sort((a, b) => b.score - a.score);

  // Dynamic Pricing Calculation
  const topMatch = ranked[0];
  const baseRate = topMatch.provider.hourlyPrice;
  const distanceOverhead = Math.round(topMatch.distanceKm * 80); // PKR 80 per km
  const demandMultiplier = urgency === "urgent" ? 1.35 : 1.0; // 35% surcharge for urgent
  
  const finalPrice = Math.round((baseRate * 1.5 + distanceOverhead) * demandMultiplier);

  return {
    booking_id: bookingId,
    current_status: "pending",
    timestamp,
    action_taken: `Antigravity scanned ${matchingProviders.length} nodes, ranked top match ${topMatch.provider.name}, and computed dynamic pricing quotes.`,
    payload: {
      success: true,
      top_provider: {
        id: topMatch.provider.id,
        name: topMatch.provider.name,
        rating: topMatch.provider.rating,
        phone: topMatch.provider.phoneNumber,
        experience: topMatch.provider.experience,
        reviews: topMatch.provider.reviews,
        distance_km: topMatch.distanceKm,
        score: topMatch.score
      },
      ranked_candidates: ranked.map(r => ({
        id: r.provider.id,
        name: r.provider.name,
        score: r.score,
        distance_km: r.distanceKm
      })),
      pricing_breakdown: {
        hourly_rate: baseRate,
        estimated_hours: 1.5,
        base_subtotal: baseRate * 1.5,
        distance_overhead: distanceOverhead,
        demand_multiplier: demandMultiplier,
        final_quote: finalPrice
      }
    }
  };
}

// Phase 4: Provider Acceptance
export function acceptBooking(
  bookingId: string,
  providerDetails: Record<string, any>,
  priceQuote: number
): AntigravityResponse {
  const timestamp = new Date().toISOString();
  
  // Create push/socket message structure
  const notificationPayload = {
    event: "booking_confirmed",
    recipient_id: "u-current-user",
    title: "Service Provider Accepted!",
    message: `${providerDetails.name} is confirmed and locked in for PKR ${priceQuote}.`,
    channel: "websocket_client_notification",
    payload: {
      booking_id: bookingId,
      provider_name: providerDetails.name,
      provider_phone: providerDetails.phone,
      final_price: priceQuote
    }
  };

  return {
    booking_id: bookingId,
    current_status: "accepted",
    timestamp,
    action_taken: `Provider node ${providerDetails.name} clicked Accept. Antigravity transitioned booking to "accepted" and fired client notifications.`,
    payload: {
      success: true,
      assigned_provider_id: providerDetails.id,
      locked_price: priceQuote,
      websocket_payload: notificationPayload
    }
  };
}

// Phase 5: Service State Machine transitions
export function transitionBooking(
  booking: Booking,
  targetStatus: AntigravityStatus,
  inputs?: Record<string, any>
): { response: AntigravityResponse; nextBookingState: Booking; error?: string } {
  const timestamp = new Date().toISOString();
  const currentStatus = booking.status as AntigravityStatus;

  // Strict sequence enforcement:
  // requested -> pending -> accepted -> en_route -> arrived -> in_progress -> completed -> archived
  // flagged can happen after completed.
  const stateOrder: AntigravityStatus[] = [
    "requested",
    "pending",
    "accepted",
    "en_route",
    "arrived",
    "in_progress",
    "completed",
    "archived"
  ];

  const currentIndex = stateOrder.indexOf(currentStatus);
  const targetIndex = stateOrder.indexOf(targetStatus);

  // Exception for flagging dispute: completed -> flagged
  if (targetStatus === "flagged") {
    if (currentStatus !== "completed" && currentStatus !== "in_progress") {
      return {
        response: {
          booking_id: booking.id,
          current_status: currentStatus,
          timestamp,
          action_taken: `State Transition REJECTED: Dispute flag requires booking status to be completed or in_progress. Current: ${currentStatus}`,
          payload: { success: false, error: "Invalid dispute starting state" }
        },
        nextBookingState: booking,
        error: "Disputes can only be raised for completed or in-progress service requests."
      };
    }
  } else if (currentStatus === "flagged" && targetStatus === "archived") {
    // Allowed from flagged to archived (dispute resolution)
  } else if (targetIndex !== currentIndex + 1) {
    // Out of order transition rejected
    return {
      response: {
        booking_id: booking.id,
        current_status: currentStatus,
        timestamp,
        action_taken: `State Transition REJECTED: Invalid transition sequence from "${currentStatus}" to "${targetStatus}". Order must be strictly followed.`,
        payload: {
          success: false,
          current_status: currentStatus,
          target_status: targetStatus,
          required_flow: "requested -> pending -> accepted -> en_route -> arrived -> in_progress -> completed -> archived"
        }
      },
      nextBookingState: booking,
      error: `Invalid transition sequence. Providers must go: ${currentStatus} -> ${stateOrder[currentIndex + 1] || 'done'}`
    };
  }

  // Handle specific status behaviors
  let actionDescription = "";
  let payloadData: Record<string, any> = { success: true };
  const nextBookingState = { ...booking, status: targetStatus as any, updatedAt: timestamp };

  switch (targetStatus) {
    case "en_route":
      actionDescription = "Provider initiated transit. Streaming coordinate feeds activated.";
      // Simulate starting coordinates (slightly offset from provider's node coordinates)
      payloadData = {
        provider_coords: {
          latitude: booking.location.latitude + 0.005,
          longitude: booking.location.longitude - 0.004
        },
        client_coords: {
          latitude: booking.location.latitude,
          longitude: booking.location.longitude
        },
        distance_remaining_meters: 620,
        estimated_arrival_mins: 8
      };
      break;

    case "arrived":
      actionDescription = "Provider reported arrival. Geofencing check: verified within 50m radius.";
      // Set provider coords very close to client
      payloadData = {
        provider_coords: {
          latitude: booking.location.latitude + 0.0002, // ~20 meters away
          longitude: booking.location.longitude - 0.0001
        },
        distance_remaining_meters: 22,
        geofence_verified: true,
        alert: "Your service provider has arrived. Please let them in."
      };
      break;

    case "in_progress":
      actionDescription = "Service initiated. Work logs opened.";
      payloadData = {
        start_time: timestamp,
        estimated_session_duration_mins: 90
      };
      break;

    case "completed":
      const proofText = inputs?.completionProof || "Task completed successfully.";
      const mediaUrls = inputs?.mediaUrls || [];
      if (!proofText && mediaUrls.length === 0) {
        return {
          response: {
            booking_id: booking.id,
            current_status: currentStatus,
            timestamp,
            action_taken: "State Transition REJECTED: Completion proof text or photos are required to mark completed.",
            payload: { success: false, error: "Missing completion proof" }
          },
          nextBookingState: booking,
          error: "Completion proof (comments and/or photo attachments) is required."
        };
      }
      actionDescription = "Service complete. Provider submitted job performance proof.";
      payloadData = {
        end_time: timestamp,
        completion_proof: {
          description: proofText,
          attachments: mediaUrls
        },
        invoice: {
          job_id: booking.id,
          final_total: booking.estimatedCost,
          tax: Math.round(booking.estimatedCost * 0.05),
          payout_provider: Math.round(booking.estimatedCost * 0.85)
        }
      };
      // Keep track of completion proof in booking state
      (nextBookingState as any).completionProof = proofText;
      (nextBookingState as any).completionMedia = mediaUrls;
      break;

    case "archived":
      actionDescription = "Booking archived and locked in ledger.";
      payloadData = {
        archived_at: timestamp,
        status: "closed"
      };
      break;

    default:
      actionDescription = `Transitioned to status: ${targetStatus}`;
      break;
  }

  return {
    response: {
      booking_id: booking.id,
      current_status: targetStatus,
      timestamp,
      action_taken: actionDescription,
      payload: payloadData
    },
    nextBookingState
  };
}

// Phase 6: Instant Review & Feedback Loops
export function submitFeedback(
  booking: Booking,
  rating: number,
  comment: string
): AntigravityResponse {
  const timestamp = new Date().toISOString();
  
  if (booking.status !== "completed") {
    return {
      booking_id: booking.id,
      current_status: booking.status as AntigravityStatus,
      timestamp,
      action_taken: "Feedback rejected: booking must be in completed status.",
      payload: { success: false, error: "Invalid feedback status context" }
    };
  }

  // Update provider rating in memory / localStorage
  const providers = getProvidersList();
  const providerIdx = providers.findIndex(p => p.id === booking.providerId);
  let updatedRating = rating;
  let updatedReviews = 1;

  if (providerIdx !== -1) {
    const p = providers[providerIdx];
    const prevReviews = p.reviews || 0;
    const prevRating = p.rating || 5.0;

    // Recalculate average rating
    updatedReviews = prevReviews + 1;
    updatedRating = parseFloat(((prevRating * prevReviews + rating) / updatedReviews).toFixed(2));

    providers[providerIdx] = {
      ...p,
      rating: updatedRating,
      reviews: updatedReviews,
      experience: p.experience // keep same
    };
    saveProvidersList(providers);
  }

  return {
    booking_id: booking.id,
    current_status: "archived",
    timestamp,
    action_taken: `Feedback processed. Recalculated provider global stats (Rating: ${updatedRating}★, Total Jobs: ${updatedReviews}). Archiving booking.`,
    payload: {
      success: true,
      feedback: {
        stars: rating,
        comment,
        submitted_at: timestamp
      },
      provider_stats: {
        id: booking.providerId,
        new_rating: updatedRating,
        total_jobs_completed: updatedReviews
      }
    }
  };
}

// Phase 7: Exception & Dispute Handling
export function raiseDispute(
  booking: Booking,
  claimText: string
): AntigravityResponse {
  const timestamp = new Date().toISOString();

  // Dispute engine analysis
  const hasProof = !!(booking as any).completionProof;
  const estimatedCost = booking.estimatedCost;
  const providerName = booking.providerId; // can fetch provider name if needed
  
  // Formulate dispute resolution rules
  let refundPercentage = 0;
  let recommendedAction = "";
  let severity: "LOW" | "MEDIUM" | "HIGH" = "LOW";

  const lowerClaim = claimText.toLowerCase();
  if (lowerClaim.includes("not show") || lowerClaim.includes("never came") || lowerClaim.includes("didn't arrive")) {
    refundPercentage = 100;
    recommendedAction = "Full refund recommended. Provider timeline indicates potential false completion. Provider flagged for manual review.";
    severity = "HIGH";
  } else if (lowerClaim.includes("broken") || lowerClaim.includes("damaged") || lowerClaim.includes("worse")) {
    refundPercentage = 75;
    recommendedAction = "75% Refund + Provider compensation claim. Raise high-priority dispute ticket. Provider suspended pending inspection.";
    severity = "HIGH";
  } else if (lowerClaim.includes("incomplete") || lowerClaim.includes("half") || lowerClaim.includes("left")) {
    refundPercentage = 50;
    recommendedAction = "50% Partial compensation recommended. Provider warning flag logged. Requesting mediation call.";
    severity = "MEDIUM";
  } else if (lowerClaim.includes("rude") || lowerClaim.includes("behavior") || lowerClaim.includes("behaved")) {
    refundPercentage = 10;
    recommendedAction = "10% Goodwill coupon compensation. Log provider behavioral warning flag. No refund required for service delivery.";
    severity = "LOW";
  } else {
    refundPercentage = 25;
    recommendedAction = "25% Goodwill compensation recommended. General customer dissatisfaction filed. Provider notified to improve service quality.";
    severity = "LOW";
  }

  const compensationAmount = Math.round(estimatedCost * (refundPercentage / 100));

  return {
    booking_id: booking.id,
    current_status: "flagged",
    timestamp,
    action_taken: `Dispute filed by client. Antigravity analysis initiated. Status transitioned to "flagged".`,
    payload: {
      success: true,
      claim_text: claimText,
      analysis: {
        provider_id: booking.providerId,
        estimated_cost: estimatedCost,
        has_completion_proof: hasProof,
        completion_proof_submitted: (booking as any).completionProof || "None found",
        escalation_severity: severity,
        calculated_refund_pct: refundPercentage
      },
      resolution_summary: {
        status: "RECOMMENDED_RESOLUTION",
        recommended_action: recommendedAction,
        compensation_pkr: compensationAmount,
        payout_adjustment: refundPercentage === 100 ? "FULL_REVERSAL" : refundPercentage > 0 ? "PARTIAL_REVERSAL" : "NONE"
      }
    }
  };
}

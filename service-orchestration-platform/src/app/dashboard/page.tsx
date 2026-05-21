"use client";

import React, { useState, useEffect } from "react";
import { Booking, Provider } from "../../lib/types";
import { GlassmorphicContainer } from "../../components/ui/GlassmorphicContainer";
import { NeonButton } from "../../components/ui/NeonButton";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  X,
  Star,
  MessageSquare,
  MapPin,
  Compass,
  FileText,
  Terminal,
  ShieldAlert,
  Sparkles,
  Plus,
  Navigation,
  Zap,
  ChevronRight,
  User,
  Activity,
  History
} from "lucide-react";
import {
  validateRequest,
  matchAndPrice,
  acceptBooking,
  transitionBooking,
  submitFeedback,
  raiseDispute,
  AntigravityResponse,
  AntigravityStatus
} from "../../lib/ai/antigravityEngine";
import providersData from "../../data/providers.json";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [latestPayload, setLatestPayload] = useState<AntigravityResponse | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);

  // Simulation Form State
  const [showSimForm, setShowSimForm] = useState(false);
  const [simCategory, setSimCategory] = useState("plumber");
  const [simCity, setSimCity] = useState("Lahore");
  const [simUrgency, setSimUrgency] = useState<"normal" | "urgent">("normal");
  const [simBudget, setSimBudget] = useState(3000);
  const [simTimeSlot, setSimTimeSlot] = useState("morning");
  const [simText, setSimText] = useState("Need a plumber in Lahore urgent under 3000 PKR");

  // GPS Simulation State
  const [isTransitSimulating, setIsTransitSimulating] = useState(false);
  const [transitDistance, setTransitDistance] = useState(620);
  const [transitTimer, setTransitTimer] = useState<NodeJS.Timeout | null>(null);

  // Completion Form State
  const [completionProof, setCompletionProof] = useState("");
  const [completionPhoto, setCompletionPhoto] = useState("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400");
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Dispute Form State
  const [disputeClaim, setDisputeClaim] = useState("");
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  // Load bookings and custom providers
  useEffect(() => {
    const fetchLocalData = () => {
      const savedBookings = localStorage.getItem("antigravity_bookings");
      if (savedBookings) {
        setBookings(JSON.parse(savedBookings));
      } else {
        // Seed default bookings for demo if empty
        const defaultBookings: Booking[] = [
          {
            id: "b-seed-1",
            providerId: "p-1",
            userId: "u-current-user",
            status: "in_progress",
            scheduledTime: new Date(Date.now() - 3600000).toISOString(),
            estimatedCost: 3750,
            serviceDetails: "PLUMBER service request in Lahore",
            location: {
              latitude: 31.5204,
              longitude: 74.3587,
              address: "Lahore Central Area"
            },
            updatedAt: new Date().toISOString()
          },
          {
            id: "b-seed-2",
            providerId: "p-8",
            userId: "u-current-user",
            status: "completed",
            scheduledTime: new Date(Date.now() - 86400000).toISOString(),
            estimatedCost: 4350,
            serviceDetails: "ELECTRICIAN service request in Islamabad",
            location: {
              latitude: 33.6844,
              longitude: 73.0479,
              address: "Islamabad Central Area"
            },
            updatedAt: new Date().toISOString()
          }
        ];
        localStorage.setItem("antigravity_bookings", JSON.stringify(defaultBookings));
        setBookings(defaultBookings);
      }

      const customProviders = localStorage.getItem("antigravity_custom_providers");
      if (customProviders) {
        setProviders(JSON.parse(customProviders));
      } else {
        localStorage.setItem("antigravity_custom_providers", JSON.stringify(providersData));
        setProviders(providersData as Provider[]);
      }
    };

    fetchLocalData();
  }, []);

  const saveBookingsList = (updated: Booking[]) => {
    localStorage.setItem("antigravity_bookings", JSON.stringify(updated));
    setBookings(updated);
  };

  const addTrace = (trace: { type: "thought" | "action" | "result"; component: string; content: string; status: "success" | "warning" | "fallback"; metadata?: any }) => {
    const existing = localStorage.getItem("antigravity_traces");
    const list = existing ? JSON.parse(existing) : [];
    list.push({
      traceId: `trc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...trace
    });
    localStorage.setItem("antigravity_traces", JSON.stringify(list));
  };

  const getProvider = (providerId: string): Provider | undefined => {
    return providers.find(p => p.id === providerId);
  };

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Phase 2 & 3: Run Validation and Matching Sim
  const handleCreateSimulatedBooking = () => {
    const bookingId = `b-sim-${Date.now()}`;
    const citiesCoords = {
      Lahore: { lat: 31.5204, lng: 74.3587 },
      Karachi: { lat: 24.8607, lng: 67.0011 },
      Islamabad: { lat: 33.6844, lng: 73.0479 }
    };

    const targetCoords = citiesCoords[simCity as keyof typeof citiesCoords];

    // Trigger Phase 2: Validate Request
    const valResult = validateRequest(bookingId, {
      text: simText,
      category: simCategory,
      locationName: simCity,
      coordinates: targetCoords,
      urgency: simUrgency,
      budget: simBudget,
      timeSlot: simTimeSlot
    });

    addTrace({
      type: "thought",
      component: "AntiGravityEngine",
      content: `[Phase 2] Service Request validation triggered for text: "${simText}"`,
      status: valResult.payload.success ? "success" : "warning",
      metadata: valResult
    });

    if (!valResult.payload.success) {
      setLatestPayload(valResult);
      alert("Validation Failed! Missing parameters in text.");
      return;
    }

    // Trigger Phase 3: Match & Dynamic Pricing
    const matchResult = matchAndPrice(bookingId, valResult.payload);
    setLatestPayload(matchResult);

    addTrace({
      type: "action",
      component: "AntiGravityEngine",
      content: `[Phase 3] Matching & dynamic pricing run. Best match: ${matchResult.payload.top_provider?.name || "None"}. Rate: PKR ${matchResult.payload.pricing_breakdown?.final_quote || 0}`,
      status: matchResult.payload.success ? "success" : "fallback",
      metadata: matchResult
    });

    if (!matchResult.payload.success) {
      alert("Matching failed! No provider available for category.");
      return;
    }

    // Create the simulated booking
    const scheduledTime = `${new Date().toISOString().split("T")[0]}T${
      simTimeSlot === "morning" ? "10:00:00" : simTimeSlot === "afternoon" ? "14:00:00" : simTimeSlot === "evening" ? "18:00:00" : "21:00:00"
    }`;

    const newBooking: Booking = {
      id: bookingId,
      providerId: matchResult.payload.top_provider.id,
      userId: "u-current-user",
      status: "pending",
      scheduledTime,
      estimatedCost: matchResult.payload.pricing_breakdown.final_quote,
      serviceDetails: `${simCategory.toUpperCase()} request in ${simCity}`,
      location: {
        latitude: targetCoords.lat,
        longitude: targetCoords.lng,
        address: valResult.payload.address
      },
      updatedAt: new Date().toISOString()
    };

    // Save
    const updatedBookings = [...bookings, newBooking];
    saveBookingsList(updatedBookings);
    setSelectedBookingId(bookingId);
    setShowSimForm(false);
  };

  // Phase 4: Provider Acceptance
  const handleAcceptBooking = () => {
    if (!selectedBooking) return;
    const provider = getProvider(selectedBooking.providerId);
    if (!provider) return;

    const result = acceptBooking(selectedBooking.id, {
      id: provider.id,
      name: provider.name,
      phone: provider.phoneNumber,
      rating: provider.rating
    }, selectedBooking.estimatedCost);

    setLatestPayload(result);

    addTrace({
      type: "result",
      component: "AntiGravityEngine",
      content: `[Phase 4] Booking offer accepted by provider ${provider.name}. Dispatching notifications.`,
      status: "success",
      metadata: result
    });

    // Update state to accepted
    const updated = bookings.map(b =>
      b.id === selectedBooking.id ? { ...b, status: "accepted" as const, updatedAt: new Date().toISOString() } : b
    );
    saveBookingsList(updated);
  };

  // Phase 5: Transit Coordination (GPS coords simulation)
  const handleStartTransit = () => {
    if (!selectedBooking) return;

    const { response, nextBookingState, error } = transitionBooking(selectedBooking, "en_route");
    if (error) {
      alert(error);
      return;
    }

    setLatestPayload(response);
    addTrace({
      type: "action",
      component: "AntiGravityEngine",
      content: `[Phase 5] Provider ${getProvider(selectedBooking.providerId)?.name} started transit. status: "en_route"`,
      status: "success",
      metadata: response
    });

    // Save next state
    const updated = bookings.map(b => (b.id === selectedBooking.id ? nextBookingState : b));
    saveBookingsList(updated);

    // Trigger coordinates streaming simulation
    setIsTransitSimulating(true);
    setTransitDistance(620); // start at 620 meters
  };

  // Coordinate streaming interval
  useEffect(() => {
    if (isTransitSimulating && selectedBooking) {
      const interval = setInterval(() => {
        setTransitDistance(prev => {
          const nextDist = prev - Math.round(Math.random() * 80 + 40);
          if (nextDist <= 45) {
            // Reached destination! (under 50 meters)
            clearInterval(interval);
            setIsTransitSimulating(false);
            
            // Auto transition to arrived
            const { response, nextBookingState } = transitionBooking(selectedBooking, "arrived");
            setLatestPayload(response);
            addTrace({
              type: "result",
              component: "AntiGravityEngine",
              content: `[Phase 5] Geofence verified: provider is ${response.payload.distance_remaining_meters}m from address. status: "arrived"`,
              status: "success",
              metadata: response
            });
            const updated = bookings.map(b => (b.id === selectedBooking.id ? nextBookingState : b));
            saveBookingsList(updated);

            return 22;
          }

          // Otherwise keep streaming
          const currentProviderCoords = {
            latitude: selectedBooking.location.latitude + (nextDist / 100000),
            longitude: selectedBooking.location.longitude - (nextDist / 120000)
          };

          const streamPayload: AntigravityResponse = {
            booking_id: selectedBooking.id,
            current_status: "en_route",
            timestamp: new Date().toISOString(),
            action_taken: `Streaming real-time coordinates. Provider is moving. Distance remaining: ${nextDist} meters.`,
            payload: {
              provider_coords: currentProviderCoords,
              client_coords: {
                latitude: selectedBooking.location.latitude,
                longitude: selectedBooking.location.longitude
              },
              distance_remaining_meters: nextDist,
              estimated_arrival_mins: Math.ceil(nextDist / 80)
            }
          };
          setLatestPayload(streamPayload);

          return nextDist;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTransitSimulating, selectedBookingId]);

  // Phase 5: Start service
  const handleStartService = () => {
    if (!selectedBooking) return;

    const { response, nextBookingState, error } = transitionBooking(selectedBooking, "in_progress");
    if (error) {
      alert(error);
      return;
    }

    setLatestPayload(response);
    addTrace({
      type: "action",
      component: "AntiGravityEngine",
      content: `[Phase 5] Service started work at client address. status: "in_progress"`,
      status: "success",
      metadata: response
    });

    const updated = bookings.map(b => (b.id === selectedBooking.id ? nextBookingState : b));
    saveBookingsList(updated);
  };

  // Phase 5: Complete service (Requires completion proof)
  const handleCompleteService = () => {
    if (!selectedBooking) return;
    if (!completionProof.trim()) {
      alert("Completion proof text is required!");
      return;
    }

    const { response, nextBookingState, error } = transitionBooking(selectedBooking, "completed", {
      completionProof,
      mediaUrls: [completionPhoto]
    });
    if (error) {
      alert(error);
      return;
    }

    setLatestPayload(response);
    addTrace({
      type: "result",
      component: "AntiGravityEngine",
      content: `[Phase 5] Provider completed service and attached work proof. status: "completed"`,
      status: "success",
      metadata: response
    });

    const updated = bookings.map(b => (b.id === selectedBooking.id ? nextBookingState : b));
    saveBookingsList(updated);
    setShowCompletionForm(false);
    setCompletionProof("");
  };

  // Phase 6: Instant Feedback
  const handleSubmitFeedback = () => {
    if (!selectedBooking) return;

    const response = submitFeedback(selectedBooking, reviewRating, reviewComment);
    setLatestPayload(response);

    addTrace({
      type: "result",
      component: "AntiGravityEngine",
      content: `[Phase 6] Client feedback submitted (${reviewRating}★). Provider stats recalculated. Booking archived.`,
      status: "success",
      metadata: response
    });

    // Update booking rating & status to archived
    const updated = bookings.map(b =>
      b.id === selectedBooking.id
        ? {
            ...b,
            status: "completed" as const, // Display completed in client UI but archived in engine
            rating: reviewRating,
            review: reviewComment,
            updatedAt: new Date().toISOString()
          }
        : b
    );
    saveBookingsList(updated);

    // Refresh provider list from localStorage to reflect recalculated ratings
    const savedProviders = localStorage.getItem("antigravity_custom_providers");
    if (savedProviders) {
      setProviders(JSON.parse(savedProviders));
    }

    setShowReviewForm(false);
    setReviewComment("");
  };

  // Phase 7: Raise Dispute
  const handleRaiseDispute = () => {
    if (!selectedBooking) return;

    const response = raiseDispute(selectedBooking, disputeClaim);
    setLatestPayload(response);

    addTrace({
      type: "result",
      component: "DisputeMediationNode",
      content: `[Phase 7] Dispute raised by client. Claim: "${disputeClaim}". Status: "flagged"`,
      status: "warning",
      metadata: response
    });

    const updated = bookings.map(b =>
      b.id === selectedBooking.id ? { ...b, status: "cancelled" as const, updatedAt: new Date().toISOString() } : b
    );
    saveBookingsList(updated);
    setShowDisputeForm(false);
    setDisputeClaim("");
  };

  const getStatusBadge = (status: Booking["status"]) => {
    const badges: Record<string, string> = {
      requested: "text-slate-400 border-slate-500/20 bg-slate-950/20",
      pending: "text-amber-400 border-amber-500/20 bg-amber-950/20",
      confirmed: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
      accepted: "text-cyan-400 border-cyan-500/20 bg-cyan-950/20",
      en_route: "text-purple-400 border-purple-500/20 bg-purple-950/20 animate-pulse",
      arrived: "text-lime-400 border-lime-500/20 bg-lime-950/20 animate-pulse",
      in_progress: "text-pink-400 border-pink-500/20 bg-pink-950/20 animate-pulse",
      completed: "text-emerald-400 border-emerald-500/20 bg-emerald-950/20",
      cancelled: "text-rose-400 border-rose-500/20 bg-rose-950/20",
      flagged: "text-rose-500 border-rose-500/30 bg-rose-950/20 font-bold",
      archived: "text-slate-500 border-slate-800 bg-slate-950/40"
    };

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${badges[status] || "text-slate-400 border-slate-800 bg-slate-900"}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> AntiGravity Agent Lifecycle Controller
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate the end-to-end service requests, validation scoring, state machine triggers, and disputes in real time.
          </p>
        </div>

        <NeonButton
          variant="cyan"
          onClick={() => {
            setShowSimForm(true);
            setSimText(`Need a ${simCategory} in ${simCity} ${simUrgency === "urgent" ? "urgent" : "tomorrow"} under ${simBudget} PKR`);
          }}
          className="text-xs uppercase py-2"
        >
          <Plus className="w-4 h-4" /> Simulate New Request
        </NeonButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Left Column: Pipelines List */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> ACTIVE LIFECYCLES ({bookings.filter(b => b.status !== "completed" && b.status !== "cancelled").length})
          </h2>

          <div className="flex flex-col gap-3">
            {bookings
              .slice()
              .reverse()
              .map(booking => {
                const provider = getProvider(booking.providerId);
                const isSelected = booking.id === selectedBookingId;
                return (
                  <div
                    key={booking.id}
                    onClick={() => {
                      setSelectedBookingId(booking.id);
                      setLatestPayload(null);
                    }}
                    className={`cursor-pointer border rounded-xl p-4 transition-all duration-300 ${
                      isSelected
                        ? "bg-slate-950/80 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        : "bg-slate-950/20 border-slate-900 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">ID: {booking.id}</span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <h3 className="font-bold text-slate-200 text-sm mt-2">{booking.serviceDetails}</h3>

                    <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                      <span>👤 {provider?.name || "Assigned Node"}</span>
                      <span className="font-mono font-bold text-cyan-400">PKR {booking.estimatedCost}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Middle Column: Agent Console / State Machine */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selectedBooking ? (
            <div className="flex flex-col gap-6">
              {/* Stepper Display */}
              <GlassmorphicContainer glowColor="cyan" className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Pipeline Execution Flow
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Provider: {getProvider(selectedBooking.providerId)?.name}
                  </span>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-between items-center relative py-4 px-2">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-900 -translate-y-1/2 z-0" />
                  {[
                    { id: "pending", label: "Pending Match" },
                    { id: "accepted", label: "Accepted" },
                    { id: "en_route", label: "En Route" },
                    { id: "arrived", label: "Arrived" },
                    { id: "in_progress", label: "In Progress" },
                    { id: "completed", label: "Completed" }
                  ].map((step, idx, arr) => {
                    const order = ["pending", "accepted", "en_route", "arrived", "in_progress", "completed"];
                    const currentIdx = order.indexOf(selectedBooking.status);
                    const isCompleted = order.indexOf(step.id) < currentIdx;
                    const isActive = selectedBooking.status === step.id;

                    return (
                      <div key={step.id} className="flex flex-col items-center z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-bold font-mono transition-all ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                              : isActive
                              ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-pulse"
                              : "bg-slate-950 border-slate-800 text-slate-500"
                          }`}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className={`text-[8px] font-mono mt-1 font-bold uppercase ${isActive ? "text-cyan-400" : isCompleted ? "text-emerald-400" : "text-slate-600"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassmorphicContainer>

              {/* Console Trigger Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassmorphicContainer glowColor="purple" className="flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Phase-specific triggers
                    </h3>
                    <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                      Manually push state machine transitions. Out-of-order calls will trigger validation errors on the Antigravity Bus.
                    </p>

                    <div className="flex flex-col gap-2">
                      {/* Step 4 Acceptance */}
                      {selectedBooking.status === "pending" && (
                        <NeonButton variant="purple" onClick={handleAcceptBooking} className="w-full text-xs uppercase">
                          Provider Clicks "Accept" (Phase 4)
                        </NeonButton>
                      )}

                      {/* Step 5 Transit */}
                      {selectedBooking.status === "accepted" && (
                        <NeonButton variant="purple" onClick={handleStartTransit} className="w-full text-xs uppercase">
                          Provider Starts Transit (en_route)
                        </NeonButton>
                      )}

                      {/* Step 5 arrived auto simulation */}
                      {selectedBooking.status === "en_route" && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={handleStartTransit} // This resets/re-logs en_route if needed
                            disabled={isTransitSimulating}
                            className="w-full py-2.5 rounded-lg font-bold border border-purple-500/20 text-purple-400 bg-purple-950/10 text-xs uppercase"
                          >
                            {isTransitSimulating ? "Streaming GPS Coordinates..." : "Start Streaming GPS (Phase 5)"}
                          </button>
                          {isTransitSimulating && (
                            <div className="p-3 bg-slate-950/60 border border-slate-900 rounded-lg flex items-center justify-between text-[11px] font-mono">
                              <span className="flex items-center gap-1.5 text-cyan-400">
                                <Navigation className="w-3.5 h-3.5 animate-spin" /> Distance remaining:
                              </span>
                              <span className="text-white font-bold">{transitDistance} meters</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 5 Start service */}
                      {selectedBooking.status === "arrived" && (
                        <NeonButton variant="purple" onClick={handleStartService} className="w-full text-xs uppercase">
                          Provider Starts Service (in_progress)
                        </NeonButton>
                      )}

                      {/* Step 5 complete */}
                      {selectedBooking.status === "in_progress" && (
                        <div>
                          {!showCompletionForm ? (
                            <NeonButton variant="purple" onClick={() => setShowCompletionForm(true)} className="w-full text-xs uppercase">
                              Complete Service (completed)
                            </NeonButton>
                          ) : (
                            <div className="flex flex-col gap-3 p-3 bg-slate-950/80 border border-purple-500/30 rounded-xl mt-2">
                              <h4 className="text-[10px] font-bold text-slate-300 font-mono uppercase">Provide Task Proof</h4>
                              <textarea
                                value={completionProof}
                                onChange={(e) => setCompletionProof(e.target.value)}
                                placeholder="Describe completed repairs..."
                                className="bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                                rows={2}
                              />
                              <input
                                type="text"
                                value={completionPhoto}
                                onChange={(e) => setCompletionPhoto(e.target.value)}
                                placeholder="Proof Photo URL"
                                className="bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-400 font-mono"
                              />
                              <div className="flex gap-2">
                                <button onClick={handleCompleteService} className="flex-grow py-1.5 rounded bg-purple-500 text-white font-bold text-xs">
                                  Submit Proof
                                </button>
                                <button onClick={() => setShowCompletionForm(false)} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 6: Review loop */}
                      {selectedBooking.status === "completed" && !selectedBooking.rating && (
                        <div>
                          {!showReviewForm ? (
                            <NeonButton variant="purple" onClick={() => setShowReviewForm(true)} className="w-full text-xs uppercase">
                              Leave Rating Feedback (Phase 6)
                            </NeonButton>
                          ) : (
                            <div className="flex flex-col gap-3 p-3 bg-slate-950/80 border border-purple-500/30 rounded-xl mt-2">
                              <h4 className="text-[10px] font-bold text-slate-300 font-mono uppercase">Review Details</h4>
                              <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button key={star} onClick={() => setReviewRating(star)}>
                                    <Star className={`w-5 h-5 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                                  </button>
                                ))}
                              </div>
                              <input
                                type="text"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                placeholder="Write comments..."
                                className="bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                              />
                              <button onClick={handleSubmitFeedback} className="w-full py-1.5 rounded bg-purple-500 text-white font-bold text-xs">
                                Submit Feedback & Recalculate
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 7: Dispute handling */}
                      {(selectedBooking.status === "completed" || selectedBooking.status === "in_progress") && (
                        <div className="mt-4 border-t border-slate-900 pt-3">
                          {!showDisputeForm ? (
                            <button
                              onClick={() => setShowDisputeForm(true)}
                              className="w-full py-2 border border-rose-500/20 text-rose-400 bg-rose-950/10 hover:bg-rose-950/30 rounded-lg text-xs font-bold uppercase transition-all"
                            >
                              Flag Exception / File Dispute (Phase 7)
                            </button>
                          ) : (
                            <div className="flex flex-col gap-3 p-3 bg-slate-950/80 border border-rose-500/30 rounded-xl mt-2">
                              <h4 className="text-[10px] font-bold text-rose-400 font-mono uppercase">File Claim</h4>
                              <textarea
                                value={disputeClaim}
                                onChange={(e) => setDisputeClaim(e.target.value)}
                                placeholder="Client claim details (e.g. provider didn't show, caused damage...)"
                                className="bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <button onClick={handleRaiseDispute} className="flex-grow py-1.5 rounded bg-rose-500 text-white font-bold text-xs">
                                  Submit Claim
                                </button>
                                <button onClick={() => setShowDisputeForm(false)} className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-400">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedBooking.status === "cancelled" && (
                        <div className="text-center text-xs text-rose-400 font-mono p-3 border border-rose-500/20 bg-rose-950/10 rounded-lg">
                          🚨 Booking Flagged for dispute. Refer to resolving engine output.
                        </div>
                      )}

                      {selectedBooking.status === "completed" && selectedBooking.rating && (
                        <div className="text-center text-xs text-emerald-400 font-mono p-3 border border-emerald-500/20 bg-emerald-950/10 rounded-lg">
                          ✅ Booking Closed. Provider profile recalculated.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Provider Info summary */}
                  <div className="border border-slate-900 rounded-xl p-4 bg-slate-950/30 flex flex-col justify-between text-xs gap-3">
                    <div>
                      <h4 className="font-bold text-slate-300 font-mono mb-2 uppercase border-b border-slate-900 pb-1.5">
                        Assigned Node Specs
                      </h4>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Name:</span>
                          <span className="font-bold text-slate-200">{getProvider(selectedBooking.providerId)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Category:</span>
                          <span className="font-bold text-slate-200 uppercase">{getProvider(selectedBooking.providerId)?.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Node Rating:</span>
                          <span className="font-bold text-amber-400 font-mono">{getProvider(selectedBooking.providerId)?.rating}★</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Reviews Count:</span>
                          <span className="font-bold text-slate-300">{getProvider(selectedBooking.providerId)?.reviews} completed</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-950 border border-slate-900 rounded-lg text-[11px] font-mono flex items-center justify-between">
                      <span className="text-slate-500">ESTIMATED PRICE:</span>
                      <span className="text-cyan-400 font-bold">PKR {selectedBooking.estimatedCost}</span>
                    </div>
                  </div>
                </GlassmorphicContainer>

                {/* System JSON Outputs */}
                <GlassmorphicContainer glowColor="cyan" className="flex flex-col h-[380px] overflow-hidden p-4">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3">
                    <span className="font-mono text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-cyan-400" /> ANTIGRAVITY ENGINE PAYLOAD
                    </span>
                    <span className="text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                      LOCKED
                    </span>
                  </div>

                  <div className="flex-grow bg-slate-950 border border-slate-900/60 p-3 rounded-lg overflow-y-auto font-mono text-[9px] text-slate-400 leading-normal">
                    {latestPayload ? (
                      <pre className="text-slate-300">{JSON.stringify(latestPayload, null, 2)}</pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-600 gap-2">
                        <Terminal className="w-6 h-6 text-slate-700 animate-pulse" />
                        <p className="max-w-[200px]">
                          Trigger any state change button on the left to intercept the structured JSON payload.
                        </p>
                      </div>
                    )}
                  </div>
                </GlassmorphicContainer>
              </div>
            </div>
          ) : (
            <div className="flex-grow border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-slate-500 min-h-[400px]">
              <Compass className="w-12 h-12 text-slate-700 mb-3 animate-spin" style={{ animationDuration: "30s" }} />
              <h3 className="font-mono font-bold text-sm text-slate-400 uppercase tracking-wider">
                No Booking Selected
              </h3>
              <p className="text-xs max-w-sm mt-2 leading-relaxed">
                Click on one of the active service lifecycles on the left panel or click "Simulate New Request" to create a fresh on-demand workflow.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Form Dialog */}
      {showSimForm && (
        <div className="fixed inset-0 z-50 bg-[#060813]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <GlassmorphicContainer glowColor="cyan" className="max-w-md w-full p-6 relative border-cyan-500/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-900 pb-3 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Create Simulated Service Request
            </h3>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Category</label>
                <select
                  value={simCategory}
                  onChange={(e) => {
                    setSimCategory(e.target.value);
                    setSimText(`Need a ${e.target.value} in ${simCity} ${simUrgency === "urgent" ? "urgent" : "tomorrow"} under ${simBudget} PKR`);
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 focus:outline-none focus:border-cyan-500/50"
                >
                  {["plumber", "electrician", "ac-tech", "mechanic", "tutor", "cleaner", "beautician"].map(c => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">City / Location</label>
                <select
                  value={simCity}
                  onChange={(e) => {
                    setSimCity(e.target.value);
                    setSimText(`Need a ${simCategory} in ${e.target.value} ${simUrgency === "urgent" ? "urgent" : "tomorrow"} under ${simBudget} PKR`);
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 focus:outline-none focus:border-cyan-500/50"
                >
                  {["Lahore", "Karachi", "Islamabad"].map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Target Budget limit (PKR)</label>
                <input
                  type="number"
                  value={simBudget}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setSimBudget(val);
                    setSimText(`Need a ${simCategory} in ${simCity} ${simUrgency === "urgent" ? "urgent" : "tomorrow"} under ${val} PKR`);
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Urgency */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Urgency</label>
                <div className="flex gap-2">
                  {["normal", "urgent"].map(u => (
                    <button
                      key={u}
                      onClick={() => {
                        setSimUrgency(u as any);
                        setSimText(`Need a ${simCategory} in ${simCity} ${u === "urgent" ? "urgent" : "tomorrow"} under ${simBudget} PKR`);
                      }}
                      className={`flex-grow p-2 border rounded cursor-pointer transition-all ${
                        simUrgency === u
                          ? "bg-cyan-500 border-cyan-400 text-slate-950 font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-400"
                      }`}
                    >
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Preferred Time Slot</label>
                <select
                  value={simTimeSlot}
                  onChange={(e) => setSimTimeSlot(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 focus:outline-none focus:border-cyan-500/50"
                >
                  {["morning", "afternoon", "evening", "night"].map(t => (
                    <option key={t} value={t}>
                      {t.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generated text preview */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Extracted Query text (Input to intent parser)</label>
                <textarea
                  value={simText}
                  onChange={(e) => setSimText(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded p-2 focus:outline-none focus:border-cyan-500/50 font-mono text-[10px] resize-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleCreateSimulatedBooking}
                  className="flex-grow py-2 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all uppercase"
                >
                  Generate Booking Request
                </button>
                <button
                  onClick={() => setShowSimForm(false)}
                  className="px-4 py-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </GlassmorphicContainer>
        </div>
      )}
    </div>
  );
}

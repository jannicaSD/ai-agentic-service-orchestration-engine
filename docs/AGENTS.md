# AntiGravity Agents

This document lists the agent roles used by AntiGravity. Some are fully scaffolded in Mock Mode, while others are workflow contracts used by the current orchestration layer and schema.

## Agent catalog

| Agent | Purpose | Inputs | Outputs | Confidence behavior | Fallback behavior | Trace fields produced |
| --- | --- | --- | --- | --- | --- | --- |
| LanguageNormalizationAgent | Detect and normalize English, Urdu, Roman Urdu, and code-switched text | Raw user message | Normalized text, detected language mix | Emits language confidence and mix score | Falls back to raw text when uncertain | `stepName`, `inputs`, `outputs`, `confidence`, `fallbacks` |
| IntentAndSlotExtractionAgent | Extract service intent, category, location, budget, date, and time window | Normalized text + context | Intent, slots, clarification question | Produces per-field confidence | Asks a single clarification question when core confidence is low | `stepName`, `inputs`, `outputs`, `confidence`, `decisions` |
| ProviderDiscoveryAgent | Find candidate providers by category, city, and availability | Slots, preferred category, location | Candidate provider list | Logs discovery confidence and source quality | Uses local provider dataset when maps / Supabase are unavailable | `stepName`, `inputs`, `outputs`, `toolCalls`, `fallbacks` |
| ComplexityClassifierAgent | Classify the request into basic / intermediate / complex | Intent and service details | Complexity class and tags | Confidence falls back to conservative classification | Defaults to `intermediate` when unclear | `stepName`, `inputs`, `outputs`, `confidence` |
| RankingAgent | Rank providers using 10+ factors and fairness rules | Candidate providers, budget, location, category preference | Top providers + rationale | Returns factor-level scores and certainty | If a signal is missing, the factor is reduced rather than guessed | `stepName`, `inputs`, `outputs`, `decisions`, `alternatives` |
| PricingAgent | Create transparent price breakdowns | Top provider, distance, urgency, complexity, budget | Total price + breakdown + budget-friendly option | Confidence reflects amount of available pricing data | Falls back to a simple base + labor estimate | `stepName`, `inputs`, `outputs`, `decisions`, `fallbacks` |
| SchedulingAgent | Propose conflict-safe slots | Provider availability, current bookings, travel buffer | Selected slot, alternates, waitlist | Confidence reflects schedule and conflict checks | If a conflict is found, it suggests alternates instead of forcing a slot | `stepName`, `inputs`, `outputs`, `toolCalls`, `decisions` |
| BookingExecutionAgent | Persist booking request, status, and system messages | Booking draft, selected provider, slot | Booking row and workflow trace | High confidence only when slot is validated | Returns requested / pending when acceptance is still needed | `stepName`, `inputs`, `outputs`, `decisions` |
| FollowUpAndQualityAgent | Simulate reminders, en-route, start, completion, and feedback events | Booking id, booking state | Timeline events and reputation signals | Confidence is deterministic in mock lifecycle | Uses simulated events when realtime updates are absent | `stepName`, `inputs`, `outputs`, `toolCalls`, `fallbacks` |
| DisputeResolutionAgent | Classify and resolve disputes | Booking id, dispute type, description | Resolution proposal, severity, escalation path | Confidence depends on dispute detail quality | Escalates when severity is high or detail is sparse | `stepName`, `inputs`, `outputs`, `decisions`, `fallbacks` |

## Trace rule

Every major agent step should create a trace record. The current app stores traces in the active state and in AsyncStorage for Mock Mode. Real Mode is designed to persist the same shape in Supabase.

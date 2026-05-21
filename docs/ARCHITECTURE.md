# Architecture

## High-level data flow

```text
Customer / Provider UI
    |
    v
AntiGravity workflow entrypoint
    |
    +--> LanguageNormalizationAgent
    +--> IntentAndSlotExtractionAgent
    +--> ProviderDiscoveryAgent
    +--> ComplexityClassifierAgent
    +--> RankingAgent
    +--> PricingAgent
    +--> SchedulingAgent
    +--> Booking / Negotiation / Dispute follow-up
    |
    v
Trace store + booking/store state
    |
    +--> AsyncStorage (Mock Mode)
    +--> Supabase Postgres + Auth + Realtime (Real Mode)
```

## Modules by folder

- `src/screens/` - customer and provider screens, traces, booking timeline, home
- `src/components/` - glass cards, provider cards, chat bubbles, category chips, composer
- `src/store/` - Zustand state for chat, booking, provider threads, app state
- `src/lib/antigravity/` - workflow scaffold, trace helpers, agent modules
- `src/services/` - mock data, storage wrappers, workflow client bridge
- `src/utils/` - responsive helpers and service category utilities
- `src/types/` - shared schema-backed type definitions

## State objects passed between steps

The workflow passes structured objects between stages instead of making UI-driven decisions.

- Input: `{ userMessage, customerProfile, context }`
- Context: `{ preferredCategory, uiFilters, locale hints }`
- Extraction output: `{ intent, slots, confidence, clarifyingQuestion }`
- Discovery output: `{ providers, distance estimates, availability signals }`
- Ranking output: `{ rankedProviders, rationale, factor weights, fairness notes }`
- Pricing output: `{ total, breakdown, alternatives }`
- Scheduling output: `{ selectedSlot, alternates, conflicts, waitlist }`
- Trace payload: `{ traceId, stepName, inputs, outputs, confidence, toolCalls, fallbacks, latencyMs }`
- Booking state transitions: `requested -> pending -> accepted -> en_route -> arrived -> in_progress -> completed`

## Mock vs Real Mode

### Mock Mode

- Default when `EXPO_PUBLIC_APP_MODE` is missing or not `real`
- Uses AsyncStorage for traces and local state
- Uses local provider datasets
- Best for demoing the flow without credentials

### Real Mode

- Requires Supabase URL and anon key
- Uses Supabase Auth and Postgres as source of truth
- Realtime can be used for negotiation and booking state updates
- Google Maps / Places can be used as optional tool integrations

## Design principle

The UI presents intent and feedback. AntiGravity owns the decision graph. That separation keeps the app auditable and makes the trace trail meaningful for judges.
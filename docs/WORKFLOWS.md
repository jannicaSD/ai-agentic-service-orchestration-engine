# Workflows

AntiGravity is the decision engine. The UI forwards user text, category preference, and context into the workflow layer, and the workflow returns the assistant response, recommendations, trace ids, and next actions.

Current implementation note: the app executes a mock orchestration pipeline in `src/store/useAntiGravityStore.ts` and traces every major step. The workflow contracts below describe the full agentic path the current scaffold is designed to support in Real Mode.

## Main workflow: `service_orchestrator`

### Step order

1. LanguageNormalizationAgent
2. IntentAndSlotExtractionAgent
3. ProviderDiscoveryAgent
4. ComplexityClassifierAgent
5. RankingAgent
6. PricingAgent
7. SchedulingAgent

### Why this order

- Language comes first so downstream logic works on normalized input.
- Intent and slot extraction must happen before discovery or ranking.
- Provider discovery happens before ranking because the ranking step needs candidates.
- Complexity, pricing, and scheduling all depend on the extracted request and the provider shortlist.
- The workflow ends by returning a user-facing assistant message plus trace metadata.

## Sub-workflows

### `booking_request`

- Validates the slot again
- Creates or updates the booking row
- Sets the booking status to `requested` or `pending` depending on whether provider acceptance is still needed
- Emits a system message such as "Request sent"
- Writes a workflow trace for auditability

### Provider acceptance sequence

1. Booking is visible to the provider
2. Provider clicks `Accept`
3. AntiGravity marks the booking `accepted`
4. Customer notification is triggered
5. The service timeline continues through `en_route`, `arrived`, `in_progress`, and `completed`

### `negotiation_orchestrator`

- Interprets chat messages as asks, offers, counters, or accepts
- Creates offer records when needed
- Updates booking status when an offer is accepted
- Logs negotiation decisions and next actions

### `followup_orchestrator`

- Simulates reminder and completion events
- Advances booking state through `en_route`, `arrived`, `in_progress`, and `completed`
- Records quality and reputation events
- Emits trace entries for each lifecycle transition

### `dispute_orchestrator`

- Classifies dispute severity
- Proposes a resolution path
- Updates dispute records and provider risk signals
- Escalates to human review when needed

## Trace excerpt example

```text
[SYS_thought] Starting multi-agent orchestration pipeline.
[SYS_action] Detected language: roman_urdu.
[SYS_action] User selected category plumber but text indicates electrician; using electrician.
[SYS_action] Ranked providers by distance, availability, and ratings.
[SYS_result] Booking created and provider assigned.
```

The excerpt shows the key decision points: normalization, preference override, ranking, and booking creation.

# Traces

Traces are the audit log for every major AntiGravity decision and fallback.

## Trace schema fields

- `traceId`
- `timestamp` / `timestampPKT`
- `workflowName`
- `stepName`
- `inputs`
- `outputs`
- `confidence`
- `toolCalls`
- `decisions`
- `alternatives`
- `fallbacks`
- `latencyMs`

## Where traces are stored

- Mock Mode: AsyncStorage key `agent_traces_v1`
- Real Mode: Supabase table `agent_traces`

## How to view traces in the app

- Open the Traces tab, which acts as the TraceViewer surface in the current UI
- Assistant and booking interactions also emit trace entries as the flow progresses

## How to export traces for submission

- The helper `exportTraces()` in `src/lib/antigravity/traceService.ts` returns a JSON string
- That JSON can be copied into the clipboard or logged for submission packaging

## What good traces should show

- Language detection confidence
- Clarification questions when confidence is low
- Ranking rationale and factor contributions
- Preference override reasoning when category preference is superseded
- Fallbacks when a tool or data source is unavailable

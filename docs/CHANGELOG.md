# Changelog

## 2026-05-20 PKT - v0.2

What changed:

- Added responsive assistant chat layout
- Added keyboard-safe chat input and bottom composer
- Added service category filter chips with provider counts
- Passed `preferredCategory` and UI filter context into AntiGravity workflow calls
- Added `docs/UI_UX.md` and refreshed the docs set for the category-driven workflow update

Why it changed:

- To satisfy the Challenge 2 UI requirements for mobile responsiveness and visible typing input
- To make the category preference part of the agentic decision flow without removing AntiGravity control

Files changed:

- [src/screens/AssistantChatScreen.tsx](../src/screens/AssistantChatScreen.tsx)
- [src/components/chat/ChatInputBar.tsx](../src/components/chat/ChatInputBar.tsx)
- [src/components/ui/CategoryChipBar.tsx](../src/components/ui/CategoryChipBar.tsx)
- [src/store/useAntiGravityStore.ts](../src/store/useAntiGravityStore.ts)
- [src/services/antigravityClient.ts](../src/services/antigravityClient.ts)
- [src/utils/responsive.ts](../src/utils/responsive.ts)
- [src/utils/serviceCategories.ts](../src/utils/serviceCategories.ts)
- [docs/UI_UX.md](docs/UI_UX.md)
- [README.md](../README.md)

Evidence:

- TraceViewer screenshot placeholder from the TraceLogs screen after sending a request in AssistantChat
- Trace metadata showing the preferred category and any override rationale

## 2026-05-20 PKT - v0.1

What changed:

- Added the initial AntiGravity workflow scaffold
- Added trace storage helpers for Mock Mode
- Added Supabase schema and seed files
- Added the first documentation set for workflows, matching, pricing, scheduling, disputes, and traces

Why it changed:

- To establish the main orchestrator structure required by the challenge
- To support auditable workflows even before Real Mode credentials are connected

Files changed:

- [src/lib/antigravity/orchestrator.ts](../src/lib/antigravity/orchestrator.ts)
- [src/lib/antigravity/traceService.ts](../src/lib/antigravity/traceService.ts)
- [docs/supabase-schema.sql](supabase-schema.sql)
- [docs/seed.sql](seed.sql)
- [docs/AGENTS.md](AGENTS.md)
- [docs/WORKFLOWS.md](WORKFLOWS.md)
- [docs/MATCHING.md](MATCHING.md)
- [docs/PRICING.md](PRICING.md)
- [docs/SCHEDULING.md](SCHEDULING.md)
- [docs/DISPUTES.md](DISPUTES.md)
- [docs/TRACES.md](TRACES.md)

Evidence:

- TraceViewer screenshot placeholder from the TraceLogs screen after running the demo assistant flow
- `exportTraces()` JSON output from the trace helper

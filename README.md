# 🌌 AntiGravity: AI-Agentic Service Orchestration Platform

> **The Invisible Brain Behind Instant Service Delivery**

AntiGravity is a **mobile-first, AI-driven service orchestration platform** designed for the informal gig economy. Unlike generic marketplaces that handle transactions reactively, **AntiGravity serves as the intelligent orchestrator for the entire service lifecycle**.

The platform features:
- ✅ **Customer-side AI**: Understands service requests in English, Urdu, and Roman Urdu
- ✅ **Provider-side AI**: Context-aware conversation with real-time booking coordination  
- ✅ **Multi-agent Pipeline**: Language detection → Intent extraction → Provider ranking → Dynamic pricing → Dispute resolution
- ✅ **State Machine Enforcement**: Immutable transaction lifecycle with 9 sequential states
- ✅ **Real-time Coordination**: GPS tracking, geofencing, and live provider-customer sync
- ✅ **Complete Audit Trail**: Every agent decision is traced and logged for verification

---

## 🏗️ Architectural Overview

<img width="935" height="812" alt="image" src="https://github.com/user-attachments/assets/37ddb9af-603e-4751-9e12-e84331753f56" />


## 🤖 Agents Developed

The engine utilizes a **multi-agent pipeline** where specialized agents collaborate sequentially:

1. **Language Normalization Agent (`LanguageAgent`)**
   - **Role**: Automatically detects input languages including standard English, Urdu script, and Roman Urdu (e.g., *"AC kharab ho gaya hai, jaldi kisi electrician ko bhejien"*).
   - **Output**: Standardized text, detected locale, and extraction confidence score.

2. **Intent & Slot Extraction Agent (`IntentAgent`)**
   - **Role**: Extracts semantic slots from noisy multilingual descriptions including service category, target budget limits, scheduling times, and urgency flags.
   - **Output**: Typed intent payloads (e.g., `category: "ac-tech"`, `urgency: "urgent"`).

3. **Provider Discovery & Ranking Agent (`RankingAgent`)**
   - **Role**: Scans active provider nodes and scores them using a multi-factor weight formula:
     $$\text{Score} = (\text{Rating} \times 0.45) + (\text{Distance Score} \times 0.35) + (\text{Experience Score} \times 0.20)$$
   - **Output**: Ranked array of top matching local service providers.

4. **Dynamic Pricing Agent (`PricingAgent`)**
   - **Role**: Protects transaction fairness by locking price quotes before acceptance:
     $$\text{Price} = (\text{Base Price} \times 1.5 + \text{Distance Overrides}) \times \text{Demand Multiplier}$$
   - *A 35% surge multiplier is automatically applied if high urgency is flagged.*

5. **Dispute Mediation Agent (`DisputeAgent`)**
   - **Role**: Programmatically reviews client claims against timeline logs and completion reports.
   - **Output**: Assigns severity levels (`LOW`, `MEDIUM`, `HIGH`) and generates recommended partial or total refunds (e.g., 50% refund for incomplete tasks).

---

## 🔄 E2E State Machine Engine (9 Target States)

AntiGravity strictly enforces a sequential, non-bypassable transaction state machine. Any out-of-order state mutations are instantly rejected with detailed error payloads:

```
[requested] ──> [pending] ──> [accepted] ──> [en_route] ──> [arrived] ──> [in_progress] ──> [completed] ──> [flagged] ──> [archived]
```

- **`requested`**: Validates request details (address normalization, category matches).
- **`pending`**: Holds ranked providers and locks in the dynamic pricing quote.
- **`accepted`**: Lock provider node and fire real-time WebSocket notifications to the client.
- **`en_route`**: Streams GPS location coordinates dynamically as the provider travels.
- **`arrived`**: Triggers a geofence verification algorithm (<50m distance radius) to auto-arrive.
- **`in_progress`**: Opens active service logs and blocks other state changes.
- **`completed`**: Requires completion proof description before generating final invoices.
- **`flagged`**: Initiated if client raises a dispute post-completion; runs the AI mediation recommended settlement.
- **`archived`**: Submits user feedback (1-5★ review) and recalculates the provider's global aggregate rating.

---

## 🔌 API & Integration Layer

The platform is designed to transition seamlessly between offline demo modes and active cloud networks:

### 1. Mock Mode (Default)
- **Local Storage Ledger**: Emulates offline database transactions using React Native `AsyncStorage` and browser `localStorage`.
- **Intake Pipelines**: Fully simulated multi-agent NLP pipelines with standard latency delays for responsive UI feedback.
- **Coordinate Simulators**: Live coordinates streaming and distance controllers verifying geofencing boundaries locally.

### 2. Real Mode (Supabase + Google Maps)
- **Database Schema**: Leverages Supabase relational tables (`profiles`, `bookings`, `agent_traces`, `reviews`). Detailed seed configurations reside in [docs/seed.sql](docs/seed.sql).
- **Real-Time Subscriptions**: Listens to real-time provider state updates and coordinates streaming using Supabase Realtime channels.
- **Location Enrichment**: Uses Google Maps and Places API boundaries to resolve normalized location coordinates and travel eta.

---

## 📱 UI/UX & Keyboard Safety Design

Special attention was paid to the mobile React Native interface to maintain responsiveness on both standard mobile viewports and large tablets:

- **Soft Keyboard Viewports**: `AssistantChatScreen.tsx` utilizes dynamic `KeyboardAvoidingView` offsets combined with screen safe areas (`useSafeAreaInsets`) to ensure keyboard inputs never overlay or hide the chat composer.
- **Touch Target Dimensions**: Tap actions like category chips (`CategoryChipBar.tsx`) are constrained to a minimum height of `44px` with generous `hitSlop` bounding boxes, ensuring full accessibility.
- **Visual Grid Systems**: Glassmorphic designs are supported by scalable pixel ratios in `src/utils/responsive.ts` to adjust layout grid densities proportionally.

---

## 🚀 Quick Start & E2E Auditing

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the complete programmatical E2E Quality Assurance and state machine audit:
   ```bash
   node verify_e2e.js
   ```
3. To view the administrative telemetry simulator, open the Next.js platform:
   ```bash
   cd service-orchestration-platform
   npm install
   npm run dev
   ```
4. Open the generated audit artifacts:
   - Interactive Report: [e2e_verification_report.md](file:///home/kali/.gemini/antigravity/brain/1061ffc4-57f6-4472-8dc5-11c2a1d2edb2/e2e_verification_report.md)
   - Diagnostic Timeline: `docs/e2e_verification_audit_traces.json`

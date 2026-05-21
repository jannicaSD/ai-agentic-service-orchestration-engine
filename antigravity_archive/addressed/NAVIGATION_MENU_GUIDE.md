# Antigravity — Navigation Menu & Workflow Guide

## **Overview**

The Antigravity app uses a **Bottom Tab Navigation** with 4 primary screens plus 3 modal overlays. This document explains what users will do in each tab and the navigation flow.

---

## **Part 1: Navigation Architecture**

### **Visual Map**

```
┌──────────────────────────────────────────────────────────────┐
│               ANTIGRAVITY APP STRUCTURE                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  BOTTOM TAB NAVIGATION (Always visible)             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ 🏠 Home | 📅 Bookings | 📊 Traces | 🎛️ Nexus      │   │
│  └─────────────────────────────────────────────────────┘   │
│           │            │             │         │            │
│           ↓            ↓             ↓         ↓            │
│      ┌────────┐ ┌─────────┐ ┌──────────┐ ┌────────┐        │
│      │HomeScr │ │BookingTL│ │TraceLogsS│ │Nexus   │        │
│      └────────┘ └─────────┘ └──────────┘ └────────┘        │
│                       ▲                                      │
│  ┌────────────────────┼────────────────────┐               │
│  │ MODAL STACK (Overlays tabs)             │               │
│  ├────────────────────┼────────────────────┤               │
│  │ Chat | ProviderProf| ProviderChat       │               │
│  └────────────────────┼────────────────────┘               │
│                       │ (Can only push from Home)           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## **Part 2: Primary Tabs (Bottom Navigation)**

### **1. 🏠 HOME SCREEN (Landing Hub)**

**Purpose:** Browse providers, discover services, initiate AI chat

**What Users Do:**
1. **View map** of available providers (pins showing location, rating, category)
2. **Filter by service category** (AC Tech, Plumber, Electrician, etc.) — horizontal scroll bar
3. **Use "Ask Antigravity" button** to open chat and describe their problem
4. **Tap provider card** to view quick preview (name, rating, distance)
5. **Search bar** (optional) for direct provider name lookup

**Screen Layout:**
```
┌─────────────────────────────────────┐
│ ☰ Menu  |  Antigravity  |  👤 Profile│  ← Header
├─────────────────────────────────────┤
│  🔍 Search providers...             │  ← Search bar
├─────────────────────────────────────┤
│  [AC Tech] [Plumber] [Electrician]  │  ← Category filter
│  [Painter]  [Carpenter]  [More...]  │
├─────────────────────────────────────┤
│                                     │
│          🗺️  MAP VIEW               │
│                                     │  ← Providers as pins
│   📍 Farhan (⭐5.0)                 │
│   📍 Ahmed (⭐4.8)                  │
│   📍 Bilal (⭐4.6)                  │
│                                     │
├─────────────────────────────────────┤
│  💬 ASK ANTIGRAVITY                 │  ← Primary CTA
│  "Describe your problem..."         │
└─────────────────────────────────────┘
```

**Navigation Actions:**
- Tap category chip → filter map to that service type
- Tap provider pin → show quick preview popup
- Tap "Ask Antigravity" → **push Chat modal**
- Tap search bar → simple provider name search

**Integration Points:**
- Connects to `AssistantChatScreen` (modal push)
- Reads from `useAntiGravityStore` (selected category, provider counts)
- Reads from `useAppStore` (user location)

---

### **2. 📅 BOOKINGS SCREEN (Timeline & History)**

**Purpose:** Track active bookings, view history, manage reservations

**What Users Do:**
1. **View active booking** (big focus on current status)
2. **Scroll to see booking history** (past completed bookings)
3. **Tap active booking** → navigate to detailed **BookingTimelineScreen**
4. **View payment summary** for active booking
5. **Chat with provider** (tap "Message" button)
6. **Rate completed bookings** (if status is "completed" and not yet rated)

**Screen Layout:**
```
┌─────────────────────────────────────┐
│ Bookings                       👤    │  ← Header
├─────────────────────────────────────┤
│  ACTIVE BOOKING                     │
│  ┌───────────────────────────────┐  │
│  │ 🔄 PENDING ACCEPTANCE         │  │
│  │                               │  │
│  │ Farhan Saeed (AC Specialist)  │  │
│  │ ⭐ 4.9 | 2.5 km away         │  │
│  │                               │  │
│  │ 💰 4,820 PKR total            │  │
│  │ 🕐 Today 6:00 PM              │  │
│  │                               │  │
│  │ [View Details] [Message]      │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  BOOKING HISTORY                    │
│                                     │
│ ✅ Completed - 3 days ago          │
│    Bilal Ahmad | AC Service        │
│    3,200 PKR | ⭐ (tap to rate)    │
│                                     │
│ ✅ Completed - 1 week ago          │
│    Ahmed Khan | Plumbing            │
│    1,500 PKR | ⭐⭐⭐⭐⭐          │
│                                     │
│ ❌ Cancelled - 2 weeks ago         │
│    (Refunded)                       │
│                                     │
└─────────────────────────────────────┘
```

**Navigation Actions:**
- Tap "View Details" on active booking → **push BookingTimelineScreen**
- Tap "Message" → **push ProviderChatScreen** for that booking
- Tap completed booking → option to **submit rating** or **view invoice**

**Integration Points:**
- Reads from `useBookingStore` (all bookings, active booking ID, statuses)
- Calls `setActiveBooking()` when user selects a booking
- Displays payment data from booking state

---

### **3. 📊 TRACES SCREEN (Audit & Observability)**

**Purpose:** View orchestration decisions and traces for understanding how Antigravity made recommendations

**What Users Do:**
1. **Browse trace timeline** for current/recent session
2. **Expand trace steps** to see decision rationale:
   - Language detection confidence
   - Intent extraction results
   - Ranking scores for top providers
   - Pricing calculation breakdown
   - Scheduling logic
3. **View trace metadata** (timestamp, agent name, correlation ID)
4. **Search/filter traces** by booking or date

**Screen Layout:**
```
┌─────────────────────────────────────┐
│ Traces                         👤    │  ← Header
├─────────────────────────────────────┤
│ ⏱️  Session: Today 15:32            │
│                                     │
│ ▼ LANGUAGE NORMALIZATION            │
│   Input: "AC kharab ho gaya"        │
│   Detected: Urdu (Roman script)     │
│   Confidence: 95%                   │
│                                     │
│ ▼ INTENT EXTRACTION                 │
│   Category: AC Technician           │
│   Urgency: URGENT                   │
│   Time: ASAP                        │
│   Confidence: 92%                   │
│                                     │
│ ▼ PROVIDER DISCOVERY                │
│   Total candidates: 1,247           │
│   Filtered by category: 43          │
│   Available now: 12                 │
│                                     │
│ ▼ RANKING DELIBERATION              │
│   🥇 Farhan Saeed: 0.887            │
│      Rating: 0.441 | Distance: 0.261│
│      Experience: 0.173              │
│   🥈 Ahmed Khan: 0.824              │
│   🥉 Bilal Ahmad: 0.798             │
│                                     │
│ ▼ PRICING CALCULATION               │
│   Base: 3,200 PKR                   │
│   Distance: +200 PKR                │
│   Urgency: ×1.35 multiplier         │
│   Total: 4,820 PKR                  │
│                                     │
│ ▼ SCHEDULING                        │
│   Slots: 6:00 PM, 7:30 PM           │
│   Travel buffer: 30 mins            │
│   Recommended: 6:00 PM              │
│                                     │
└─────────────────────────────────────┘
```

**Navigation Actions:**
- Tap collapse/expand arrows to show/hide trace details
- Tap trace → navigate to **detail view with full JSON** (optional)
- Filter by date or booking ID

**Integration Points:**
- Reads from `useAntiGravityStore.traces` (immutable audit trail)
- Displays traces as expandable tree structure

---

### **4. 🎛️ NEXUS SCREEN (Futuristic Dashboard)**

**Purpose:** System-level analytics and monitoring dashboard

**What Users Do:**
1. **View platform-wide metrics** (total providers, active bookings, etc.)
2. **Monitor system health** (API latency, error rates)
3. **View personal analytics** (booking history, total spent, favorite providers)
4. **Access settings** (language, theme, notifications)
5. **See AI performance metrics** (orchestration success rate, dispute resolution accuracy)

**Screen Layout:**
```
┌─────────────────────────────────────┐
│ Nexus Dashboard                👤    │  ← Header
├─────────────────────────────────────┤
│  PLATFORM STATISTICS                │
│  ┌───────────┬───────────────────┐  │
│  │ Active    │ Completed Today   │  │
│  │ Providers │ 2,847 bookings    │  │
│  │ 15,234    │ Avg. rating: 4.7★ │  │
│  └───────────┴───────────────────┘  │
│                                     │
│  YOUR ANALYTICS                     │
│  ┌───────────┬───────────────────┐  │
│  │ Bookings  │ Avg. Wait Time    │  │
│  │ This Month│ 24 mins           │  │
│  │ 12 total  │                   │  │
│  └───────────┴───────────────────┘  │
│                                     │
│  SYSTEM HEALTH                      │
│  API Latency: 145ms ✅              │
│  Cache Hit Rate: 94% ✅             │
│  Error Rate: <0.1% ✅               │
│                                     │
│  AI ORCHESTRATION METRICS           │
│  Workflow Success: 99.2%            │
│  Dispute Resolution Accuracy: 97.3% │
│  Avg. Ranking Time: 342ms           │
│                                     │
│  [⚙️ Settings] [📞 Support] [ℹ️ About]
│                                     │
└─────────────────────────────────────┘
```

**Navigation Actions:**
- Tap "Settings" → navigate to Settings screen
- Tap support icon → open contact/help modal

**Integration Points:**
- Reads from `useAntiGravityStore` (platform counts, traces)
- Reads from `useBookingStore` (user booking history)

---

## **Part 3: Modal Screens (Stack Navigation)**

These screens **overlay** the bottom tabs and can only be accessed from certain trigger points.

### **📝 CHAT SCREEN (AssistantChatScreen) — Modal**

**Entry point:** Tap "Ask Antigravity" from Home screen

**Purpose:** AI-powered service request composition and provider recommendation

**Flow:**
1. User types/speaks problem in chat
2. Antigravity processes through 7-agent workflow (2-3 seconds)
3. Displays recommendation with provider cards
4. User scrolls to see alternatives
5. User taps provider card → **navigate to ProviderProfileScreen**
6. Or continues chat to refine request

**What Happens Next:**
- Once user selects a provider, booking is created
- User can optionally chat in the dedicated **ProviderChatScreen**
- Or directly proceed to **BookingTimelineScreen** to track progress

---

### **👤 PROVIDER PROFILE SCREEN (ProviderProfileScreen) — Modal**

**Entry point:** Tap provider card from Chat or Home

**Purpose:** View full provider details, reviews, availability, and confirm booking

**What Users Do:**
1. **View profile** (photo, name, ratings, experience)
2. **Read reviews** (scroll through customer testimonials)
3. **Check specialization** tags (AC, Electrical, Plumbing, etc.)
4. **View availability** (slots for today/tomorrow/later)
5. **See price quote** (calculated by Pricing Agent)
6. **Tap "Confirm Booking"** → creates booking and navigates to **BookingTimelineScreen**

---

### **💬 PROVIDER CHAT SCREEN (ProviderChatScreen) — Modal**

**Entry point:** 
- Tap "Message" button from active booking in Bookings tab
- Or after creating a booking, tap "Chat" button

**Purpose:** Direct real-time messaging with service provider

**What Users Do:**
1. **View message thread** with provider
2. **Send/receive messages** in real-time
3. **Share photos or media** (proof of problem, work progress)
4. **Call provider** (phone integration button)
5. **Update booking status** through chat commands (optional)

**Integration:**
- Thread persists across app navigation
- Uses `useProviderChatStore` for state management
- Real-time updates via WebSocket (in Production mode)

---

## **Part 4: Complete User Journey**

### **Scenario: Customer Books AC Repair**

```
START
  │
  ├─► Home Screen
  │   • User sees map, filter by "AC Tech"
  │   • Taps "Ask Antigravity"
  │
  ├─► Chat Modal (AssistantChatScreen)
  │   • User: "AC kharab ho gaya, jaldi kisi electrician ko bhejien"
  │   • Antigravity processes (7 agents in parallel)
  │   • Response: "Found Farhan Saeed (5-star rated, 2.5 km away, 4,820 PKR)"
  │   • Displays 3 provider cards
  │
  ├─► User taps Farhan's card
  │   │
  │   ├─► Provider Profile Modal (ProviderProfileScreen)
  │   │   • View Farhan's details, reviews, specializations
  │   │   • See price: 4,820 PKR + GST
  │   │   • See available slots: "Today 6 PM", "Today 7:30 PM"
  │   │   • Tap "Confirm Booking"
  │   │
  │   └─► Booking created ✅
  │       • Status: pending
  │       • useBookingStore.addBooking() called
  │       • Trace added to useAntiGravityStore.traces
  │
  ├─► Bookings Tab becomes active
  │   • Active booking now shows in Bookings tab
  │   • Status: "🔄 PENDING ACCEPTANCE"
  │
  ├─► User taps "View Details"
  │   │
  │   └─► Booking Timeline Modal (BookingTimelineScreen)
  │       • Vertical stepper shows all 9 states
  │       • Current: "Pending" (awaiting provider acceptance)
  │       • Price locked: 4,820 PKR
  │       • Tap "Chat with Provider" → ProviderChatScreen
  │
  ├─► Real-time updates (via WebSocket in production)
  │   • Status changes: Pending → Accepted → En Route → Arrived → In Progress → Completed
  │   • Each transition triggers notification
  │   • BookingTimelineScreen updates in real-time
  │   • Traces Screen captures all state transitions
  │
  ├─► Booking Completed
  │   • Provider submits proof (photo, description)
  │   • Invoice generated
  │   • Payment processed
  │   • Status: "Completed"
  │
  ├─► User navigates to Bookings
  │   • Active booking now shows as "✅ Completed"
  │   • Tap to submit 1-5★ rating and review
  │   • Booking archived
  │
  ├─► User can view Traces
  │   • Traces Tab shows full orchestration history
  │   • Can see ranking scores, pricing calc, state transitions
  │   • All decisions auditable and transparent
  │
  END
```

---

## **Part 5: Next Level Features (Future Enhancements)**

### **What's Coming in Navigation:**

1. **Saved Providers Tab** — Favorite/frequent providers for quick re-booking
2. **Referral Screen** — Invite friends, earn credits
3. **Wallet Screen** — View balance, transaction history, payment methods
4. **Notifications Hub** — Centralized notification management
5. **Help/FAQ Modal** — In-app support and troubleshooting

---

## **Navigation Implementation Summary**

| Component | Type | Entry | Exit | State |
|-----------|------|-------|------|-------|
| HomeScreen | Tab | Default | Swipe | `useAppStore` |
| BookingTimelineScreen | Tab | Bottom nav | Swipe | `useBookingStore` |
| TraceLogsScreen | Tab | Bottom nav | Swipe | `useAntiGravityStore.traces` |
| Nexus | Tab | Bottom nav | Swipe | Read-only metrics |
| ChatScreen | Modal | "Ask Antigravity" button | Back/Close | `useAntiGravityStore.messages` |
| ProviderProfileScreen | Modal | Chat or Home | Back/Confirm | Provider data + `useBookingStore` |
| ProviderChatScreen | Modal | Bookings or Chat | Back | `useProviderChatStore` |
| BookingTimelineScreen | Modal | Bookings or Profile | Back | `useBookingStore.activeBooking` |

---

## **Best Practices for Team**

1. **Always maintain stack order**: Tabs first, then modals on top
2. **Use consistent back button behavior**: Modals close, tabs navigate within
3. **Preserve state during navigation**: Zustand stores persist across screen changes
4. **Trace all important transitions**: Add to `useAntiGravityStore.traces` for auditability
5. **Real-time updates**: Use WebSocket (production) or polling (mock mode) for live status changes


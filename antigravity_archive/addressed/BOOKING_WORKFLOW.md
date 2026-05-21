# Antigravity — Booking Workflow & State Machine

## **Overview**

The booking system is built on a **strict state machine** with 9 states. Once transitioned, states cannot go backward. This ensures auditability and prevents race conditions or fraud. This document explains the complete booking lifecycle.

---

## **Part 1: The 9-State System**

### **Visual Flow**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    BOOKING STATE MACHINE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1️⃣ REQUESTED  →  2️⃣ PENDING  →  3️⃣ ACCEPTED  →  4️⃣ EN_ROUTE  →   │
│   (User creates       (Awaiting      (Provider      (Provider traveling)│
│    booking)           provider       agrees to                         │
│                       acceptance)    job)           ↓                   │
│                                                   5️⃣ ARRIVED            │
│                                                   (At customer location) │
│                                                    ↓                    │
│   9️⃣ ARCHIVED  ←  6️⃣ IN_PROGRESS  ↔  7️⃣ COMPLETED  ←─────┐          │
│   (Final,              (Provider                 (Work done,           │
│    immutable)          actively                   payment               │
│                        working)                   processed)            │
│                         ↓                            ↓                   │
│                    8️⃣ FLAGGED                                           │
│                    (Disputed)                                           │
│                         ↓                                               │
│                    Resolution                                          │
│                         ↓                                               │
│                    9️⃣ ARCHIVED                                         │
│                    or REFUNDED                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### **State Definitions**

| State | Description | Duration | UI Indicator | Next States |
|-------|-------------|----------|--------------|------------|
| **REQUESTED** | User has just created the booking (before provider sees it) | Instant | 📨 "Booking created" | PENDING |
| **PENDING** | Booking sent to provider; awaiting acceptance | 5-30 mins | 🔄 "Awaiting acceptance" | ACCEPTED, CANCELLED |
| **ACCEPTED** | Provider has confirmed the job | Instant | ✅ "Accepted" | EN_ROUTE, CANCELLED |
| **EN_ROUTE** | Provider is traveling to customer location | ~30 mins | 🚗 "On the way" | ARRIVED, CANCELLED |
| **ARRIVED** | Provider within <50m radius (geofence verified) | Instant | 📍 "Arrived" | IN_PROGRESS, CANCELLED |
| **IN_PROGRESS** | Provider actively working on the job | Variable (15 mins - 8 hours) | ⚙️ "Work in progress" | COMPLETED, FLAGGED |
| **COMPLETED** | Provider finished and submitted completion proof | Instant | ✅ "Completed" | FLAGGED, ARCHIVED |
| **FLAGGED** | Dispute initiated by customer or provider | 24-72 hours (resolution window) | ⚠️ "Under review" | ARCHIVED, REFUNDED |
| **ARCHIVED** | Final state; booking locked, immutable | Permanent | 📦 "Archived" | None (terminal) |

---

## **Part 2: Detailed State Transitions**

### **1️⃣ → 2️⃣ REQUESTED → PENDING**

**Trigger:** User taps "Confirm Booking" on ProviderProfileScreen

**What Happens:**
```javascript
{
  id: 'b-12345',
  providerId: 'p-42',
  customerId: 'c-999',
  status: 'requested',
  createdAt: '2024-05-20T15:32:00Z',
  
  // Booking immutably locked data
  lockedPrice: 4820,        // Cannot change after this
  lockedProvider: {
    id: 'p-42',
    name: 'Farhan Saeed',
    rating: 4.9,
    distance: 2.5            // km
  },
  serviceCategory: 'ac-tech',
  urgency: 'urgent',
  preferredTimeSlot: 'today-6pm',
  
  // Trace of decision
  traceId: 'trace-xyz-789',
  
  // Payment info
  paymentStatus: 'pending',
  
  // Timeline
  statusHistory: []
}
```

**State Change:**
- `status: 'requested'` → `status: 'pending'`
- `statusHistory.push({ status: 'pending', timestamp, reason: 'sent_to_provider' })`
- Notification sent to provider: "New booking request from Ahmed"
- Customer sees: **"🔄 Awaiting acceptance"**

**Code Example (useBookingStore):**
```typescript
const updateBookingStatus = (bookingId, newStatus) => {
  const booking = bookings.find(b => b.id === bookingId);
  
  // Validate transition
  const validTransitions = {
    'requested': ['pending'],
    'pending': ['accepted', 'cancelled'],
    'accepted': ['en_route', 'cancelled'],
    ...
  };
  
  if (!validTransitions[booking.status]?.includes(newStatus)) {
    throw new Error(`Invalid transition: ${booking.status} → ${newStatus}`);
  }
  
  booking.status = newStatus;
  booking.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    reason: 'user_confirmed'
  });
};
```

---

### **2️⃣ → 3️⃣ PENDING → ACCEPTED**

**Trigger:** Provider taps "Accept Job" in their app (or accepts via SMS/notification)

**Duration:** Typically 5-10 minutes (can wait up to 30 mins before auto-cancellation)

**What Happens:**
- Provider reviews: booking details, price, travel time, customer reviews
- Provider taps "Accept"
- Booking moves to **ACCEPTED** state
- **Payment processed immediately** (card charged or wallet debited)
- Chat thread opens automatically
- Customer receives notification: "Farhan Saeed accepted your booking!"

**State Change:**
```typescript
{
  status: 'pending' → 'accepted',
  acceptedAt: '2024-05-20T15:35:00Z',
  acceptedByProviderId: 'p-42',
  paymentStatus: 'pending' → 'processing',
  lockedPrice: 4820,  // Still locked
  statusHistory.push({ status: 'accepted', timestamp, reason: 'provider_confirmed' })
}
```

**Immutable Lock:**
- Once `status === 'accepted'`, the booking **cannot be cancelled by customer without refund**
- Provider can still cancel if within 5 minutes (cancellation penalty applied)
- Price remains locked

---

### **3️⃣ → 4️⃣ ACCEPTED → EN_ROUTE**

**Trigger:** Provider taps "Start Travel" (auto-triggered when navigation starts)

**Duration:** Until provider arrives at customer location

**What Happens:**
- Provider's location begins streaming to customer (GPS updates every 10-30 seconds)
- Customer sees **live ETA** countdown: "6 mins away" → "4 mins away" → "2 mins away"
- ProviderMap shows provider's current position
- Customer receives push notification: "Farhan is on the way!"

**State Data:**
```typescript
{
  status: 'en_route',
  en_routeAt: '2024-05-20T15:38:00Z',
  providerLocation: {
    latitude: 33.6844,
    longitude: 74.3160,
    accuracy: 10,          // meters
    lastUpdated: '2024-05-20T15:38:45Z'
  },
  estimatedArrivalTime: '2024-05-20T15:44:00Z',  // calculated from GPS
  
  // If provider is late
  eta_exceeded: false,
  statusHistory.push({ status: 'en_route', timestamp, reason: 'provider_started_travel' })
}
```

**Safety Features:**
- If ETA exceeds expected travel time by >15 mins, customer is notified
- If provider goes offline for >10 mins, booking is flagged for review
- Geofence for customer location set at <100m radius

---

### **4️⃣ → 5️⃣ EN_ROUTE → ARRIVED**

**Trigger:** Auto-trigger when provider enters <50m geofence around customer location

**Duration:** Instant (GPS verification required)

**What Happens:**
- System verifies provider latitude/longitude against customer's location
- When distance < 50 meters, system auto-advances to **ARRIVED**
- Customer sees: **"📍 Provider has arrived"** (live map shows provider at location)
- Notification sent: "Farhan has arrived! Confirm you can see them."
- Provider can ring doorbell or call customer

**State Data:**
```typescript
{
  status: 'en_route' → 'arrived',
  arrivedAt: '2024-05-20T15:44:12Z',
  arrivalVerification: {
    method: 'geofence',
    latitude: 33.6849,
    longitude: 74.3158,
    customerLatitude: 33.6850,
    customerLongitude: 74.3159,
    distance: 12,         // meters, < 50
    verified: true
  },
  statusHistory.push({ status: 'arrived', timestamp, reason: 'geofence_verified' })
}
```

**Fraud Prevention:**
- GPS coordinates must be within <50m to automatically advance
- Provider cannot manually override ARRIVED state (must pass geofence check)
- Prevents provider claiming arrival before actually arriving

---

### **5️⃣ → 6️⃣ ARRIVED → IN_PROGRESS**

**Trigger:** Provider taps "Start Work" after customer confirms they can see the provider

**Duration:** Until work is complete

**What Happens:**
- Service timer starts (tracks actual work duration)
- Customer can see: **"⚙️ Work in progress"** with duration counter
- Service log opens for recording notes/photos
- Chat remains open for coordination during work
- System monitors for provider going offline

**State Data:**
```typescript
{
  status: 'arrived' → 'in_progress',
  workStartedAt: '2024-05-20T15:44:35Z',
  workDuration: 0,        // updates in real-time
  
  // Service log
  serviceLog: [
    {
      type: 'note',
      text: 'Customer reports AC not cooling',
      timestamp: '2024-05-20T15:45:00Z',
      author: 'provider'
    },
    {
      type: 'photo',
      url: 'https://...',
      caption: 'Clogged filter - needs replacement',
      timestamp: '2024-05-20T15:48:00Z',
      author: 'provider'
    }
  ],
  
  statusHistory.push({ status: 'in_progress', timestamp, reason: 'provider_started_work' })
}
```

**Real-Time Tracking:**
- Work duration updated every second for live FYI
- Service log entries visible to both customer and provider
- Photos uploaded during work can be used later for disputes

---

### **6️⃣ → 7️⃣ IN_PROGRESS → COMPLETED**

**Trigger:** Provider taps "Finish Work" and submits completion proof

**Duration:** Instant (proof validation required)

**What Happens:**
- Provider submits **proof of completion**:
  - Photo(s) of fixed AC unit / completed work
  - Description of work done
  - Parts replaced (if any)
  - Duration of service
- System validates proof is not empty
- Payment is finalized and charged to customer
- Invoice generated with itemized breakdown
- Customer receives notification: "Farhan completed the job!"

**State Data:**
```typescript
{
  status: 'in_progress' → 'completed',
  completedAt: '2024-05-20T16:12:23Z',
  workDuration: 27.78,    // minutes
  
  // Completion proof
  completionProof: {
    photos: [
      {
        url: 'https://...',
        caption: 'AC filter replaced and unit tested',
        timestamp: '2024-05-20T16:12:00Z'
      }
    ],
    description: 'Cleaned AC filter, refilled coolant, tested airflow. AC cooling properly now.',
    workDetails: [
      { item: 'AC Filter Replacement', quantity: 1, rate: 500 },
      { item: 'Coolant Refill', quantity: 1, rate: 800 }
    ]
  },
  
  // Invoice finalized
  invoice: {
    serviceCharge: 3200,    // base
    distanceSurcharge: 200,
    partsCost: 1300,        // filter + coolant
    subtotal: 4700,
    gst: 235,
    total: 4935,
    paymentMethod: 'card',
    transactionId: 'txn-xxx-123'
  },
  
  // Rating status
  ratingStatus: 'pending',  // customer can now submit 1-5★ rating
  
  statusHistory.push({ status: 'completed', timestamp, reason: 'provider_submitted_proof' })
}
```

**Proof Validation:**
- At least one photo required
- Description must be >10 characters
- Cannot proceed without both

---

### **7️⃣ → 8️⃣ COMPLETED → FLAGGED (Dispute)**

**Trigger:** Customer taps "Report Issue" within 24 hours of completion

**Duration:** 24-72 hours (AI dispute agent reviews)

**What Happens:**
- Customer describes issue (e.g., "AC still not cooling after service")
- System captures severity classification:
  - **LOW**: Minor issue, refund unlikely (~5%)
  - **MEDIUM**: Moderate issue, partial refund likely (~40-60%)
  - **HIGH**: Major issue, full refund + compensation (~90-100%)
- AI dispute agent analyzes:
  - Completion proof vs. customer claim
  - Provider's work history and reliability
  - Customer's booking history and claim patterns
- Recommendation issued (can be appealed by either party)

**State Data:**
```typescript
{
  status: 'completed' → 'flagged',
  flaggedAt: '2024-05-20T17:15:00Z',
  
  // Dispute details
  dispute: {
    id: 'disp-abc-123',
    initiatedBy: 'customer',
    reason: 'work_not_completed_satisfactory',
    description: 'AC still not cooling properly. Provider left work incomplete.',
    severity: 'MEDIUM',
    
    // AI analysis
    evidence: {
      completionProof: { photos: 1, description: 'AC filter replaced' },
      customerClaim: 'Still hot after 2 hours',
      providerHistory: { totalBookings: 127, avgRating: 4.9, completionRate: 99.1% },
      customerHistory: { totalBookings: 8, avgDisputeRate: 12.5% }
    },
    
    // Recommendation
    recommendation: {
      type: 'PARTIAL_REFUND',
      refundPercentage: 50,
      refundAmount: 2467.50,
      rationale: 'Completion proof shows basic repair but customer claim of continued malfunction is credible. Partial refund appropriate. Provider should reach out to complete the fix.'
    },
    
    // Appeal window
    providerAppealDeadline: '2024-05-22T17:15:00Z',
    customerAppealDeadline: '2024-05-22T17:15:00Z',
  },
  
  statusHistory.push({ status: 'flagged', timestamp, reason: 'customer_initiated_dispute' })
}
```

**Dispute Resolution Process:**
1. **Immediate Analysis** (~1 hour): AI agent reviews evidence
2. **Recommendation Posted** (~2 hours): Both parties see recommendation
3. **Appeal Window** (24 hours): Either party can appeal with new evidence
4. **Final Resolution** (48-72 hours): Manual review if appeals exist, otherwise auto-resolve

---

### **8️⃣ → 9️⃣ FLAGGED → ARCHIVED (or REFUNDED)**

**Trigger:** Dispute resolution completed (recommendation accepted or appeal rejected)

**Duration:** Permanent terminal state

**What Happens:**
- If recommendation accepted: Refund processed (if applicable)
- Booking moved to **ARCHIVED** state
- Rating locked (customer cannot change rating after dispute resolved)
- Both parties can view full dispute record forfuture reference
- Booking becomes immutable

**State Data:**
```typescript
{
  status: 'flagged' → 'archived',
  archivedAt: '2024-05-21T10:30:00Z',
  
  // Refund processed
  refund: {
    amount: 2467.50,
    method: 'original_payment_method',
    processingTime: '2-3 business days',
    transactionId: 'refund-xyz-789',
    status: 'processed'
  },
  
  // Final state
  finalDispute: {
    ...allDisputeData,
    resolved: true,
    resolutionTimestamp: '2024-05-21T10:30:00Z',
    decision: 'recommendation_accepted'
  },
  
  statusHistory.push({ status: 'archived', timestamp, reason: 'dispute_resolved' })
}
```

**Immutability:**
- Booking record locked forever
- Cannot make changes to rating, dispute, or payment
- Viewable by customer and provider for their records

---

### **7️⃣ → 9️⃣ COMPLETED → ARCHIVED (Happy Path)**

**Trigger:** No disputes filed within 24-hour window after completion

**Duration:** Permanent

**What Happens:**
- Booking automatically transitions to **ARCHIVED** after 24 hours with no dispute
- Customer can still submit rating/review
- Booking locked for editing
- Provider's aggregate rating updated with new 1-5★ review

**State Data:**
```typescript
{
  status: 'completed' → 'archived',
  archivedAt: '2024-05-21T17:12:23Z',  // 24 hours after completion
  
  // Customer rating (if submitted)
  customerRating: {
    stars: 5,
    review: 'Excellent work! AC is cooling beautifully now. Farhan was professional and quick.',
    submittedAt: '2024-05-21T16:00:00Z'
  },
  
  // Provider aggregate stats updated
  // Farhan's profile now reflects: 4.9★ → 4.91★ (based on new 5★ review)
  
  statusHistory.push({ status: 'archived', timestamp, reason: 'no_disputes_24hrs' })
}
```

---

## **Part 3: Cancellation Paths**

### **PENDING → CANCELLED** (0.5 hour window)
- Customer can cancel free (no charge)
- Provider has not accepted yet
- Full refund to customer's wallet

### **ACCEPTED/EN_ROUTE → CANCELLED** (Within 5 mins)
- Provider can cancel with 10% penalty
- Customer can cancel with 25% penalty
- After 5 mins: cancellation not allowed (too late in process)

### **IN_PROGRESS → ? (No cancellation)**
- Once work starts, no cancellation allowed
- Only dispute available if work is unsatisfactory

---

## **Part 4: State Machine Governance**

### **Enforcement Rules**

```typescript
// State machine rules
const stateTransitions = {
  'requested': ['pending', 'cancelled'],
  'pending': ['accepted', 'cancelled'],
  'accepted': ['en_route', 'cancelled'],
  'en_route': ['arrived', 'cancelled'],
  'arrived': ['in_progress'],
  'in_progress': ['completed', 'flagged'],
  'completed': ['flagged', 'archived'],
  'flagged': ['archived', 'refunded'],
  'archived': [],  // terminal
  'refunded': []   // terminal
};

// Validation before any transition
function validateTransition(currentStatus, newStatus) {
  const allowed = stateTransitions[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Invalid transition: ${currentStatus} → ${newStatus}. ` +
      `Allowed: ${allowed.join(', ')}`
    );
  }
  
  // Additional checks
  if (newStatus === 'in_progress' && !booking.completionProofSubmitted) {
    throw new Error('Cannot start work without arrival verification');
  }
  
  if (newStatus === 'completed' && !booking.completionProof) {
    throw new Error('Must submit completion proof before marking completed');
  }
}
```

### **Trace Recording**

Every state change is recorded:
```typescript
booking.statusHistory.push({
  status: newStatus,
  timestamp: new Date().toISOString(),
  previousStatus: currentStatus,
  reason: transitionReason,  // e.g., 'provider_confirmed', 'geofence_verified'
  actor: actorId,            // who initiated transition
  metadata: {}               // additional context
});
```

---

## **Part 5: Data Persistence (useBookingStore)**

### **Store Structure**

```typescript
interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;  // One of 9 states
  createdAt: ISO8601;
  
  // Immutable locked data
  lockedPrice: number;
  lockedProvider: Provider;
  serviceCategory: ServiceCategory;
  urgency: 'regular' | 'urgent';
  preferredTimeSlot: string;
  
  // GPS & Location
  customerLocation: { latitude, longitude };
  providerLocation?: { latitude, longitude };
  estimatedArrivalTime?: ISO8601;
  arrivedAt?: ISO8601;
  
  // Work data
  workStartedAt?: ISO8601;
  workDuration?: number;
  serviceLog?: ServiceLogEntry[];
  completionProof?: CompletionProof;
  
  // Payment & Invoice
  paymentStatus: PaymentStatus;
  invoice?: Invoice;
  
  // Rating & Dispute
  customerRating?: Rating;
  dispute?: Dispute;
  
  // Timeline
  statusHistory: StatusHistoryEntry[];
}

interface useBookingStore {
  bookings: Booking[];
  activeBookingId: string | null;
  
  addBooking(booking: Booking): void;
  updateBookingStatus(id: string, newStatus: BookingStatus): void;
  setActiveBooking(id: string): void;
  submitCompletionProof(id: string, proof: CompletionProof): void;
  submitRating(id: string, rating: Rating): void;
  initiateDispute(id: string, reason: string): void;
}
```

---

## **Part 6: Testing the State Machine**

### **Happy Path E2E Test**

See [verify_e2e.js](verify_e2e.js) in the project root:
```javascript
// Test sequence: requested → pending → accepted → en_route → 
//                arrived → in_progress → completed → archived

// Step 1: Create booking
const booking = createBooking(customerId, providerId, 'AC Tech');
assert(booking.status === 'requested');

// Step 2: Auto-transition to pending
await processUserRequest(userMessage);
assert(booking.status === 'pending');

// Step 3: Provider accepts
await providerAccept(providerId, bookingId);
assert(booking.status === 'accepted');

// Step 4: Travel
await providerStartTravel(providerId);
assert(booking.status === 'en_route');

// Step 5: Geofence arrival
await simulateGPSLocation(providerId, customerLatitude, customerLongitude);
assert(booking.status === 'arrived');

// Step 6: Start work
await providerStartWork(providerId);
assert(booking.status === 'in_progress');

// Step 7: Complete work
await providerCompleteWork(providerId, completionProof);
assert(booking.status === 'completed');

// Step 8: Auto-archive (24 hours)
await timeTravel(24 * 60 * 60 * 1000);
assert(booking.status === 'archived');
```

---

## **Summary: Why This Matters**

✅ **Auditability**: Every transition is traced with who, when, why, and proof  
✅ **Fraud Prevention**: Geofence verification prevents fake arrivals  
✅ **Fairness**: Price locked at acceptance—no surprise surcharges  
✅ **Accountability**: Completion proof required before payment finalized  
✅ **Transparency**: Customers see full state progression in real-time  
✅ **Dispute Resolution**: AI-mediated with clear appeal process  
✅ **Immutability**: Archived bookings cannot be altered (regulatory compliance)


# Scheduling

SchedulingAgent keeps bookings conflict-safe and realistic.

## Conflict prevention rules

- Check provider availability before creating or confirming a slot
- Re-check against existing bookings for overlap
- Reject exact overlaps and warn on near-overlaps
- Prefer a different slot rather than silently overwriting a conflict

## Travel buffer logic

- Add a travel buffer between jobs so the provider can physically move between locations
- Default buffer is 30 minutes in the mock heuristic
- Buffer should grow when distance or traffic risk is higher

## Alternate slot suggestions

- Offer at least three alternate slots when the selected time is unavailable
- Include a waitlist option when there is no immediate slot
- Surface the alternates in the assistant response and trace metadata

## How scheduling interacts with availability and bookings

- Availability comes from provider data or Supabase in Real Mode
- Existing bookings are the source of truth for slot conflicts
- Scheduling is only finalized when provider acceptance is confirmed or the offer is accepted

## Current implementation note

The mock workflow uses a heuristic scheduler for demo purposes. Real Mode should use Supabase availability and booking tables as the conflict source.

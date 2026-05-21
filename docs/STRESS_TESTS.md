# Stress Tests

Use these scenarios to stress the workflow and the UI in Mock Mode or against a Supabase local environment.

## Scenarios

1. No provider available
2. Provider cancels after confirmation
3. Ambiguous mixed-language request requiring clarification
4. Overlapping booking conflict
5. Maps or API failure with fallback behavior
6. Low-confidence extraction that triggers a confirmation question
7. Price dispute after completion
8. High rating but high cancellation risk provider that gets penalized in ranking

## Additional load tests

- Bulk booking creation and ranking performance
- Simulate 100 concurrent negotiation messages
- Trace storage and read throughput under repeated workflow runs

## Expected result pattern

- The assistant should keep the chat usable
- Traces should continue to be written even when a fallback is used
- The system should prefer a safe answer over an overconfident one

## Demo note

Mock Mode is the recommended way to run these tests quickly. Real Mode should be tested with Supabase and optional Maps keys only after the mock flow is stable.

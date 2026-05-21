# Disputes

Dispute handling is designed as an auditable workflow, not a hidden support action.

## Supported disputes

- Price mismatch
- Late arrival or no-show
- Service quality complaint
- Wrong service or incomplete work
- Provider cancellation after confirmation
- Safety / conduct concern

## Severity classification

- **Low**: small pricing or timing issue, usually resolved with a credit or partial refund suggestion
- **Medium**: service quality or delay issue that needs provider response
- **High**: repeated failure, safety issue, or cancellation after confirmation

## Resolution paths

- Refund recommendation
- Credit recommendation
- Partial refund recommendation
- Escalation to human support
- Blacklist or risk flag simulation for repeated abuse or repeated provider issues

## Trace requirements

- Every dispute must write the dispute type, severity, and recommended path to trace metadata
- If a manual escalation is needed, the trace should note why automatic resolution stopped
- Provider risk updates should also be reflected in the trace

## Current implementation note

The current app has the dispute workflow documented and schema-ready. If a full dispute UI is not visible in a screen, it should be treated as scaffolded for the demo and tracked through the trace and data model.

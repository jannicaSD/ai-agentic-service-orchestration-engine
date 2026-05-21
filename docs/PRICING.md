# Pricing

PricingAgent returns a transparent price breakdown instead of a black-box number.

## Formula

```text
total = base_visit_fee + labor_estimate + distance_cost
				+ urgency_multiplier + complexity_multiplier
				+ demand_surge - discount
```

## Multipliers

- **Urgency**: urgent or same-day work increases the quote
- **Distance**: long travel adds cost or travel fee
- **Complexity**: intermediate and complex jobs raise labor estimates
- **Demand**: busy areas or peak hours can increase the surge factor

## Example breakdown output

```json
{
	"currency": "PKR",
	"base_visit_fee": 500,
	"labor_estimate": 1200,
	"distance_cost": 250,
	"urgency_multiplier": 1.15,
	"complexity_multiplier": 1.2,
	"demand_surge": 1.05,
	"discount": 0,
	"total": 2285
}
```

## Budget handling

- If the total exceeds budget, AntiGravity should show a budget-friendly alternative.
- The UI should present the breakdown so the user understands what changed.
- In Mock Mode, the numbers are heuristic and deterministic for demo repeatability.

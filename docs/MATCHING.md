# Matching & Ranking

The RankingAgent scores candidates with a multi-factor model and a fairness pass so the same provider does not absorb every request simply because they are best known.

## Factors and example weights

| Factor | Weight | Notes |
| --- | ---:| --- |
| Travel time | 16 | Lower travel time improves customer experience and reliability |
| Availability fit | 15 | Provider must be able to take the slot |
| Rating | 12 | Higher-rated providers get a boost |
| Reliability / on-time | 12 | Reward dependable execution |
| Specialization fit | 10 | Strong match for the service category |
| Price-to-budget fit | 9 | Keep quotes within budget when possible |
| Review recency | 6 | Recent positive work matters more than old ratings |
| Capacity / workload | 8 | Avoid overloading the same provider |
| Cancellation risk | 7 | Penalize providers with higher cancellation rates |
| Language / preference match | 5 | Helpful for Urdu / Roman Urdu communication |
| Risk score penalty | 0 to -10 | Reduce score when provider risk is elevated |

## Fairness and workload balancing

- If two providers are close in score, the one with lower current workload gets preference.
- Providers with repeated assignments can be rotated down slightly when the candidate pool is healthy.
- High risk or high cancellation signals reduce the score even if rating is strong.
- The system keeps category preference as a preference, not a hard lock, so AntiGravity can override it when the text evidence is stronger.

## Category preference injection from UI

The AssistantChat screen passes:

```text
preferredCategory = selectedCategory === 'all' ? null : selectedCategory
uiFilters.category = selectedCategory
```

AntiGravity treats that as a preference constraint. If the text strongly indicates another category, the workflow can override the UI choice and must log a rationale such as:

```text
User selected category plumber but text indicates electrician; using electrician.
```

That rationale is written to trace metadata so judges can see why the override happened.

## Example rationale table

| Provider | Why it ranked here | Key tradeoff |
| --- | --- | --- |
| Provider A | Best overall match on travel, availability, and specialization | Slightly higher price |
| Provider B | Lower price and good rating | More travel time and higher workload |
| Provider C | Highest reliability score | Slightly weaker category fit |

## Current implementation note

The app currently uses mock scoring in the store workflow and can be connected to Supabase-backed provider data in Real Mode.

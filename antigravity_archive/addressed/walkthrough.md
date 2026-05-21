# Antigravity — Trace & Logs Walkthrough

Purpose: how to collect, package, and report Antigravity traces.

1. Capture
- Reproduce the scenario to record (chat session, booking flow).
- Ensure instrumentation is enabled in `env` or local config.
- Start trace capture; reproduce user actions; stop capture.

2. Validate
- Open the generated JSON trace and confirm timestamps, events, and correlation IDs are present.

3. Package
- Place the trace JSON files, `implementation_plans.md`, and `task_lists.md` into a single folder named `addressed`.
- Zip the folder as `antigravity_traces_and_logs.zip`.

4. Deliver
- Upload the ZIP to the reporting system or attach to the ticket.
- Include a short summary of the scenario, timeframe, and any reproduction steps.

5. Example Commands
- Create folder and copy traces:
  - `mkdir -p antigravity_archive/addressed`
  - `cp /path/to/traces/*.json antigravity_archive/addressed/`
- Create zip:
  - `cd antigravity_archive && zip -r antigravity_traces_and_logs.zip addressed`

(End of walkthrough)

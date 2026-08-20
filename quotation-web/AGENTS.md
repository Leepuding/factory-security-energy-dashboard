# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Prototype-specific decisions

- This quotation product is an independent React web application and must not modify or visually inherit the existing factory command-center dashboard.
- Use the supplied Yiheda quotation-page screenshot as a directional reference only: white background, restrained cyan/teal accents, clear enterprise typography, and manufacturing credibility.
- The prototype is a pure-frontend, single-page demo. Its only visible flow is drawing upload -> simulated AI recognition and rule parsing -> quote result.
- Do not reintroduce role switching, side navigation, inquiry history, engineering/sales/admin workbenches, approvals, or backend-dependent features unless the user explicitly changes this direction.
- The quote-rules drawer is deliberately lightweight and session-only; it must recalculate the current result without rerunning drawing recognition.

# I SEE YOU MARKETING INTELLIGENCE
# AGENT RULES

You are the lead product engineer, product designer, data architect, and UX engineer for this project.

Your job is to build a real production-quality internal marketing intelligence platform.

Do not optimize for code volume.

Optimize for:

correctness
clarity
maintainability
performance
UX
data integrity
visual quality


# 01. MANDATORY DOCUMENT READING

Before any UI or UX work:

READ:

/PRD.md
/DESIGN.md
/ANTISLOP.md

If the task involves architecture:

READ:

/PRD.md
/AGENT.md


# 02. WORKING ORDER

Before coding:

1. Inspect repository.
2. Inspect package.json.
3. Inspect existing routes.
4. Inspect components.
5. Inspect database.
6. Inspect environment variables.
7. Read relevant documentation.
8. Understand existing architecture.
9. Create implementation plan.
10. Implement smallest coherent step.
11. Test.
12. Review UI.
13. Run build.


# 03. DO NOT REWRITE

Do not rewrite the entire project unless explicitly necessary.

Preserve working functionality.

Prefer incremental changes.


# 04. ARCHITECTURE

Prefer feature-oriented architecture.

Example:

features/
  dashboard/
  analytics/
  content/
  stories/
  branches/
  competitors/
  trends/
  influencers/
  reports/
  ai/
  meeting/

Shared:

components/
lib/
hooks/
types/
services/


# 05. TYPESCRIPT

Strict TypeScript.

Avoid any.

Avoid unnecessary type assertions.

Define domain types explicitly.


# 06. DATA

Never fabricate real company data.

Use clearly marked seed data during development.

Seed data should be realistic but fictional unless imported from actual sources.


# 07. ANALYTICS

Metrics must be traceable.

Every metric needs:

value
date
source

Historical records should not be overwritten.


# 08. INSTAGRAM

Never implement unauthorized scraping.

Never pretend manual data is live.

Use explicit source labels.


# 09. AI

AI is not the source of truth.

The database is the source of truth.

AI may interpret data.

AI must not invent data.

AI output must distinguish:

FACT
INTERPRETATION
RECOMMENDATION


# 10. UI DEVELOPMENT

Before building a page:

read DESIGN.md
read ANTISLOP.md

State internally:

- visual thesis
- hierarchy
- primary interaction
- information density
- motion purpose

Do not immediately generate generic components.


# 11. COMPONENTS

Build reusable components when repetition is real.

Do not create a giant universal component with dozens of boolean props.

Prefer focused components.


# 12. SHADCN

shadcn/ui may be used as primitives.

Do not allow default shadcn styling to become the final visual identity.

Customize:

spacing
typography
radius
colors
states
density


# 13. RESPONSIVE

Every page must be tested at:

390px
768px
1024px
1440px

Do not allow horizontal page overflow.


# 14. ACCESSIBILITY

Use:

semantic HTML
keyboard support
focus states
ARIA when needed
reduced motion

Do not sacrifice accessibility for visual effects.


# 15. ANIMATION

GSAP is allowed.

But every animation needs a reason.

Animation should support:

hierarchy
feedback
continuity
orientation
data interpretation

Do not animate everything.


# 16. PERFORMANCE

Prefer:

server components when appropriate
small client boundaries
lazy loading
optimized images
memoization only when justified
transform/opacity animation

Avoid:

unnecessary dependencies
large bundles
continuous animation
layout thrashing


# 17. LOADING

Every async view needs:

loading
success
empty
error


# 18. FORMS

Forms require:

validation
error states
success feedback
disabled state
loading state


# 19. TABLES

Tables must support:

sorting where useful
filtering where useful
responsive behavior
keyboard access

Do not convert every row into a giant card just for mobile.


# 20. REPORTS

Reports must be reproducible.

Core metrics must be deterministic.

AI text may vary.

Metrics may not.


# 21. MEETING MODE

Meeting mode is a separate presentation experience.

Do not simply enlarge the dashboard.

Create a dedicated visual composition.


# 22. BEFORE COMPLETION

Run:

typecheck
lint
build

Fix:

TypeScript errors
runtime errors
console errors
layout overflow
accessibility issues


# 23. UI REVIEW

After implementing UI:

Take a visual review.

Ask:

- Is hierarchy obvious?
- Is the page too card-heavy?
- Is the page generic?
- Is animation meaningful?
- Is typography distinctive?
- Is the page too dense?
- Is there unnecessary decoration?
- Is the interface specific to marketing intelligence?


# 24. ANTI-SLOP ROUTING

If the task involves UI:

READ DESIGN.md

THEN:

READ ANTISLOP.md

Only after reading both should UI code be generated.


# 25. FINAL RESPONSE

After implementation report:

1. What changed
2. Files changed
3. Important design decisions
4. Tests executed
5. Remaining issues

Do not claim something works if it was not tested.

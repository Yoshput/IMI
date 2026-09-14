# I SEE YOU MARKETING INTELLIGENCE
# PRODUCT REQUIREMENTS DOCUMENT (PRD)

Version: 1.0
Status: Draft — for internal pitch, not yet officially assigned by the team


# 00. READING ORDER

This document is read first.

Order for any agent (human or AI) working on this project:

AGENT.md → PRD.md → DESIGN.md → ANTISLOP.md

PRD.md defines WHAT and WHY.
DESIGN.md defines HOW IT LOOKS.
ANTISLOP.md defines WHAT TO AVOID.
AGENT.md defines HOW TO WORK.


# 01. PRODUCT SUMMARY

I See You Marketing Intelligence is an internal web application for the marketing/content team of Optik I See You (Instagram @iseeyou.glasses, Purwokerto).

It replaces manual, scattered reporting (spreadsheets, screenshots, chat threads) with a single system that tracks content performance, competitor activity, and weekly marketing outcomes — and produces reports credible enough to present to owner, management, HRD, and finance.

This is not a public-facing product. It is an internal tool built by the content team, for the content team and the people they report to.


# 02. PROBLEM STATEMENT

Today, weekly evaluation reports (pencapaian / kendala / plan & strategi / masukan tim) are assembled manually:

- Instagram metrics are screenshotted and pasted into slides or docs.
- Competitor activity is tracked informally, if at all.
- There is no historical record of what content performed well and why.
- There is no single place to see branch-level performance if the business expands to multiple branches.
- Reporting to management takes disproportionate time relative to the insight it produces.
- Nothing distinguishes measured fact from someone's opinion about "what's working."

The team needs a system that turns raw content activity into a defensible weekly narrative, quickly.


# 03. GOALS

1. Give the content team a single source of truth for content and account performance.
2. Cut the time to prepare a weekly report from hours to minutes.
3. Make competitor and trend observation a structured habit, not an afterthought.
4. Produce a "Meeting Mode" view credible enough to present live to non-marketing stakeholders (owner, HRD, finance).
5. Keep every number traceable to a source and a date — no invented data, no unlabeled "AI insight."

# 04. NON-GOALS (OUT OF SCOPE FOR V1)

- Public-facing website, storefront, or customer-facing features (handled separately — see the optikiseeyou.com photobooth/website project).
- Automated/unauthorized scraping of Instagram or competitor accounts.
- Paid ad management or ad-buying tools.
- Full CRM or customer database.
- Multi-tenant support for brands other than I See You.
- Native mobile app (responsive web is sufficient for v1).


# 05. TARGET USERS

| Role | Use of the product |
|---|---|
| Content team (primary) | Daily use — enters content, stories, competitor observations, builds reports |
| Head of content team | Reviews weekly evaluation, approves report before it goes up |
| Marketing leadership | Reads dashboards, trend radar, competitor radar |
| Owner | Views Meeting Mode / high-level dashboard, mostly weekly or monthly |
| Management / HRD / Finance | Views reports in Meeting Mode or exported report; not a daily user |

Primary persona for day-to-day design decisions: the content team member (currently the user, working part-time, Tue–Sat, ~5 hrs/day, targeting ~2 IG feed posts/day).


# 06. CORE MODULES

Matches the feature-oriented architecture in AGENT.md (`features/*`).

## 6.1 Dashboard
Weekly landing view. Not a hero page — opens directly into: current period, headline performance, and where attention is needed. See DESIGN.md §13–14 for exact composition rules.

## 6.2 Analytics
Account-level metrics over time: followers, reach, engagement, profile visits, link clicks — whatever Instagram Insights / manual entry provides. Trend over time is the primary question each chart answers.

## 6.3 Content
Log of individual posts/content pieces: type (feed, carousel, reels, story-based), category, publish date, metrics, and thumbnail. Ranked by performance, not listed as identical cards (DESIGN.md §15).

## 6.4 Stories
Story-specific analytics: viewer counts, viewer trend, most-discussed topic, most frequent question from followers. Used to shape the next content plan.

## 6.5 Branches
Branch-level breakdown, built for when I See You expands beyond a single location. V1 should support a single branch cleanly and not visually break with only one branch selected.

## 6.6 Competitors
Structured competitor observations: competitor name, activity, format, topic, source, observed performance, notes, and a research timeline of historical observations (DESIGN.md §19). Manual entry only — no scraping (AGENT.md §08).

## 6.7 Trends
Trend Radar: format/topic trends observed across competitors, with momentum, opportunity assessment, and a recommended adaptation for I See You specifically (DESIGN.md §20). Editorial/research tone, not a literal radar-chart gimmick.

## 6.8 Influencers
Tracking of influencer/collaboration activity relevant to I See You (if/when this becomes active) — contact, past collaboration, reach, notes. Can ship as a minimal module in v1 (list + notes) and expand later.

## 6.9 Reports
Report Builder: assembles the weekly evaluation (pencapaian / kendala / plan & strategi / masukan tim) as an editorial document — sections on the left, report body in the center, configuration on the right (DESIGN.md §23). Core metrics are deterministic and reproducible (AGENT.md §20); narrative text may be edited by the team.

## 6.10 AI
AI assists interpretation, not data entry. Every AI-authored line must be labeled as one of: FACT, INTERPRETATION, or RECOMMENDATION (AGENT.md §09, DESIGN.md §21–22). The database — not the model — is the source of truth. AI never invents metrics.

## 6.11 Meeting Mode
A dedicated, stripped-down presentation view for showing the weekly report live to management/owner/HRD/finance. Large typography, large charts, minimal navigation, no dashboard clutter (DESIGN.md §24, AGENT.md §21).


# 07. KEY USER FLOWS

## 7.1 Weekly reporting flow (primary flow)
1. Content team member logs content and story metrics throughout the week (or imports them).
2. Team member logs any competitor observations as they occur.
3. At week's end, team member opens Report Builder.
4. Report Builder pulls the week's metrics, ranked content, and story recap automatically.
5. AI drafts an interpretation/recommendation layer, clearly labeled.
6. Team member edits narrative sections (kendala, plan & strategi, masukan tim).
7. Report is finalized and either exported or presented directly via Meeting Mode.

## 7.2 Ad hoc check-in flow
1. Marketing leadership opens Dashboard.
2. Sees current-week headline performance and any flagged issues.
3. Drills into Analytics, Content, or Trends as needed.

## 7.3 Competitor/trend research flow
1. Team member logs a competitor observation (format, topic, performance, notes) as they see it.
2. Over time, Trend Radar surfaces recurring patterns across multiple competitor observations.
3. Team member reviews Trend Radar and converts a trend into a content idea for the content plan.


# 08. DATA PRINCIPLES

(Detailed rules live in AGENT.md §06–09; summarized here for product context.)

- Every metric has a value, a date, and a source — no metric without provenance.
- Historical records are never overwritten; performance history accumulates over time.
- Data sources are explicitly labeled: manual, csv/xlsx, google sheets, or api. Nothing is presented as "live" unless it genuinely is.
- Seed/demo data used during development must be clearly marked as such and never presented as real performance.
- AI may interpret and recommend; AI may not fabricate a metric to fill a chart or table.


# 09. SUCCESS METRICS (FOR THE PRODUCT ITSELF)

- Time to produce a weekly report drops materially vs. the current manual process.
- Every number shown in a report can be traced back to its source and date on request.
- The Meeting Mode view is usable as-is in front of owner/management without extra slide-building.
- The content team actually logs competitor/trend observations weekly (adoption, not just capability).


# 10. CONSTRAINTS & REFERENCES

- Visual and interaction direction: see DESIGN.md (Editorial Data Product direction; Apple/Linear/Raycast/Vercel as quality references only, not to be cloned).
- Anti-slop guardrails: see ANTISLOP.md — applies to every screen before it is considered done.
- Working process and architecture: see AGENT.md — feature-oriented structure, strict TypeScript, incremental changes, mandatory typecheck/lint/build before completion.
- Single active brand/tenant: I See You only. No multi-brand abstraction needed for v1.


# 11. PHASING (SUGGESTED)

## Phase 1 — Foundation
Dashboard (basic), Content log, Analytics (manual entry), Reports (manual assembly).

## Phase 2 — Research layer
Competitors, Trends, Stories.

## Phase 3 — Presentation layer
Meeting Mode, AI-assisted report drafting (labeled FACT/INTERPRETATION/RECOMMENDATION).

## Phase 4 — Expansion
Branches (multi-location), Influencers, deeper analytics sourcing (csv/api imports).

V1 acceptance = Phase 1 + Phase 2 usable end-to-end for one real weekly report.


# 12. OPEN QUESTIONS

- Exact Instagram metrics available for manual entry vs. eventual API/export import.
- Whether "Branches" is needed in v1 at all, given I See You currently operates from a single location.
- Where the finalized report is expected to live after Meeting Mode (export as PDF/doc, or link-share only).
- Auth/access model — single internal login is assumed; confirm before implementation.

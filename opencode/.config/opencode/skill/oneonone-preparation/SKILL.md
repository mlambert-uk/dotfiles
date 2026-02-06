---
name: oneonone-preparation
description: Prepare for upcoming 1:1 meeting by gathering context, previous action items, and suggesting agenda topics
license: MIT
compatibility: opencode
metadata:
  audience: engineering-managers
  workflow: meeting-preparation
---

## What I do

Quickly prepare you for an upcoming 1:1 meeting by gathering relevant context, tracking action items, and suggesting discussion topics based on previous meetings and patterns.

This is a **lightweight, focused preparation workflow** designed for quick pre-meeting prep (5-10 minutes).

For **deep pattern analysis** or **team-wide insights**, use the `oneonone-insights-tracking` agent instead.

## When to use me

Use this skill when:
- You have a 1:1 meeting scheduled and need to prepare quickly
- You want to review what was discussed last time
- You need to check if action items from previous meetings were completed
- You want context on recent interactions with this person
- You're looking for suggested agenda topics based on patterns

**Do NOT use me for:**
- Deep pattern analysis across the entire team (use `oneonone-insights-tracking` agent)
- Identifying systemic issues across multiple team members (use `oneonone-insights-tracking` agent)
- Creating comprehensive reports on team health (use `oneonone-insights-tracking` agent)

## What I gather

### 1. Person Context
- Find the person's note in `SecondBrain/5 - People/Work/`
- Review their role, team, and any important context notes
- Note any known sensitivities or career aspirations

### 2. Previous Meeting Notes
- Search `SecondBrain/D - Meeting Notes/` for recent 1:1s with this person
- Focus on the **last 2-3 meetings** (most recent 4-8 weeks)
- Extract key discussion points and outcomes

### 3. Outstanding Action Items
- Review action items from previous meetings
- Check which ones are **still outstanding**
- Identify which ones are **completed** (to acknowledge)
- Flag any **overdue** items requiring follow-up

### 4. Recent Interactions
- Check daily notes (`SecondBrain/0 - Journal/Daily/`) for recent mentions
- Look for recent ad-hoc conversations or observations
- Note any recent wins, concerns, or context

### 5. Pattern Recognition
- Identify any **recurring themes** from recent meetings
- Note any **trends** (positive or negative)
- Flag any **early warning signs** (stress, disengagement, blockers)

### 6. Suggested Agenda Topics
Based on the gathered context, suggest:
- Follow-ups on action items
- Topics that have been mentioned but not fully addressed
- Career development check-ins (if due)
- Any patterns requiring attention
- Positive feedback opportunities

## Output Format

Provide a **concise preparation summary** in this format:

```markdown
# 1:1 Preparation: [[Person Name]]
**Date:** [[YYYY-MM-DD]]
**Last 1:1:** [[YYYY-MM-DD]] ([X] weeks ago)

## Quick Context
[1-2 sentences summarizing the person's current situation, role, or key context]

## Last Meeting Summary
**Date:** [[YYYY-MM-DD]]
**Key Topics:**
- Topic 1
- Topic 2
- Topic 3

## Outstanding Action Items

### From Manager (You)
- [ ] Action item 1 - from [[YYYY-MM-DD]] ⚠️ (overdue/on track)
- [ ] Action item 2 - from [[YYYY-MM-DD]]

### From [[Person Name]]
- [ ] Action item 1 - from [[YYYY-MM-DD]]
- [ ] Action item 2 - from [[YYYY-MM-DD]]

### ✅ Completed Since Last Meeting
- [x] Action item that was completed

## Recent Context
- [Date] - Brief note about interaction or observation
- [Date] - Another relevant note

## Patterns & Signals
**Positive:**
- Pattern or signal to acknowledge

**Concerns:**
- Pattern or signal requiring attention (if any)

## Suggested Agenda
1. **Action item check-in** - Review outstanding items
2. **[Topic based on patterns]** - [Why this matters]
3. **[Topic from last meeting]** - Follow up on [specific thing]
4. **Career development** - [If due or relevant]
5. **Open discussion** - Any topics they want to raise

## Notes to Self
- Remember to mention [positive feedback]
- Be sensitive to [context or situation]
- Consider discussing [opportunity or challenge]
```

## Important Guidelines

### Scope
- **Stay focused:** This is quick prep, not deep analysis
- **Time-bound:** Focus on the last 2-3 meetings (4-8 weeks)
- **Action-oriented:** Prioritize actionable items and follow-ups
- **Individual-focused:** Context about this specific person, not team-wide patterns

### Formatting
- Load the `obsidian-formatting` skill for WikiLink and British English formatting
- Use WikiLinks for person names: `[[Firstname Lastname]]`
- Use WikiLinks for dates: `[[YYYY-MM-DD]]`
- Use British English throughout
- Keep it concise - this should be scannable in 2-3 minutes

### Tone
- Professional and supportive
- Focus on helping the person succeed
- Balanced - acknowledge both positives and concerns
- Respectful and empathetic

### Privacy
- This preparation summary is for the manager's eyes only
- Do not share information between team members
- Respect confidentiality of previous discussions

## Vault Location

- **SecondBrain Vault:** `/home/mark/AI/SecondBrain/`
- **Meeting Notes:** `D - Meeting Notes/`
- **People Notes:** `5 - People/Work/`
- **Daily Notes:** `0 - Journal/Daily/`

## Examples

### Good Preparation Summary
Short, focused, actionable with clear next steps and context from recent meetings.

### Poor Preparation Summary
- Too verbose or rambling
- Includes team-wide patterns (use `oneonone-insights-tracking` agent instead)
- Missing action items or dates
- No suggested agenda topics
- American English or incorrect WikiLink format

## Related

- For **deep pattern analysis** across team: Use `oneonone-insights-tracking` agent
- For **team-wide insights**: Use `oneonone-insights-tracking` agent
- For **career development planning**: Use `career-path-planning-specialist` agent
- For **performance feedback**: Use `performance-coaching-feedback-specialist` agent

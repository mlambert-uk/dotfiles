---
name: start-of-day
description: Plans your day by reviewing yesterday's activities, projects, and tasks
license: MIT
compatibility: opencode
metadata:
  audience: knowledge-workers
  workflow: daily-planning
---

## What I do

1. **Review Yesterday's Activities**
   - Read the previous day's daily note from the journal (0 - Journal/Daily/)
   - Identify what was accomplished and any incomplete items
   - Note any commitments or follow-ups mentioned

2. **Review Active Projects**
   - Read all project files from the 1 - Projects/ directory
   - Identify the next actionable task for each active project
   - Prioritize based on project goals and current status

3. **Review Current Tasks**
   - Read the Tasklist.md file
   - Identify tasks marked with #Urgent, #Critical, or #High priority
   - Check for tasks with today's date or overdue dates
   - Review items in the "ToDo" and "Commitments" sections

4. **Review Calendar Events (Work & Personal)**
   - **Work Calendar (Outlook)**: Use the MCP `outlook_ews_list_events` tool to check Outlook/Exchange calendar for work events today
   - **Personal Calendar (Google)**: Use the MCP `calendar_list_events` tool (google-workspace) to check Google Calendar for personal events today
   - Combine both calendars and list all events chronologically in "Today's quests" section
   - Format: `HH:MM - Event Title (Source: Work/Personal)`
   - If no events found on either calendar, note "No calendar events scheduled"

5. **Update Today's Daily Note**
   - Open today's daily note (0 - Journal/Daily/YYYY-MM-DD.md)
   - Under "Today's quests" section, add the 3-5 most important items
   - Include:
     - Critical/urgent tasks from the Tasklist
     - Next actions from active projects
     - Any follow-ups from yesterday
   - Add a brief note in the Journal section summarizing your review

6. **Monday-Specific Task**
   - If today is Monday, automatically add "Check and approve timesheets (deadline: lunchtime)" to today's quests
   - This should be treated as a high-priority item for the day

### Important Guidelines

- The SecondBrain vault is located at `/home/mark/AI/SecondBrain/`
- Daily notes follow the format `YYYY-MM-DD.md`
- Be concise and actionable - focus on what truly matters
- If today's note doesn't exist yet, inform the user they need to create it first
- Respect the existing structure and formatting of notes
- Load the `obsidian-formatting` skill for WikiLink format and British English guidelines
- Check the day of the week - if it's Monday, include the timesheet reminder
- **Calendar Integration**: 
  - Work calendar: Use `outlook_ews_list_events` with `daysAhead: 0` for today only
  - Personal calendar: Use `calendar_list_events` with timeMin/timeMax set to today's date range
  - Both calendars should be checked every morning to provide complete visibility

### Output Format

Provide a clear summary of:
1. Key items from yesterday that need follow-up
2. Active projects and their next actions
3. High-priority tasks from the Tasklist
4. Calendar events from both Work (Outlook) and Personal (Google) calendars
5. The 3-5 items you've added to today's quests
6. Any important context or notes for the day

## When to use me

Use this skill when:
- You are asked to plan the day
- The user says "good morning" or "start my day"
- The user wants to review yesterday and plan today
- It's the beginning of a work day and planning is needed

This is a **daily planning workflow** - for deeper insights or pattern analysis, use other specialized agents or skills.

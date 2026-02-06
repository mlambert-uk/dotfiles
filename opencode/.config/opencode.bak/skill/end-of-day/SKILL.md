---
name: end-of-day
description: Wraps up your day by summarising activities and preparing for tomorrow
license: MIT
compatibility: opencode
metadata:
  audience: knowledge-workers
  workflow: daily-review
---

## What I do

1. **Review Today's Activities**
   - Read today's daily note from 0 - Journal/Daily/YYYY-MM-DD.md
   - Check what was listed under "Today's quests"
   - Review any existing content in the Journal section

2. **Check Completed Tasks**
   - Read the Tasklist.md file
   - Identify any tasks that were completed today (check the "Done" section for today's date)
   - Note any tasks moved to different sections

3. **Review Project Progress**
   - Read all project files from 1 - Projects/ directory
   - Identify any project tasks that were completed or progressed
   - Note any new tasks added to projects

4. **Update Today's Journal Section**
   - Add or append to the ##Journal section of today's daily note
   - Create a summary that includes:
     - Tasks completed from the Tasklist
     - Project work accomplished
     - Progress made on today's quests
     - Any important notes, decisions, or blockers encountered
     - Items that need follow-up tomorrow
   - Keep it concise but informative - bullet points work well
   - Use past tense ("Completed...", "Worked on...", "Discussed...")

### Important Guidelines

- The SecondBrain vault is located at `/home/mark/AI/SecondBrain/`
- Daily notes follow the format `YYYY-MM-DD.md`
- If the Journal section already has content, append to it rather than replacing it
- Use [[WikiLinks]] when referencing projects, people, or dates
- Focus on what was accomplished, not what wasn't done
- Include context that would be helpful when planning tomorrow
- If today's note doesn't exist, inform the user
- Load the `obsidian-formatting` skill for WikiLink format and British English guidelines

### Output Format

Provide a clear summary showing:
1. What tasks were completed today
2. What project work was accomplished
3. Any important notes or follow-ups for tomorrow
4. Confirmation that the journal section has been updated

## When to use me

Use this skill when:
- You are asked to wrap up your day
- The user says "goodbye", "that's me done for the day", or "end of day"
- The user wants to create a summary of accomplishments for the day
- It's the end of a work day and reflection is needed

This is a **daily review workflow** - for planning or deeper insights, use other specialized agents or skills.

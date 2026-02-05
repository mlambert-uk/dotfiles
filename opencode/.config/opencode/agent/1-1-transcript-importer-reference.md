---
description: Extended reference for 1:1 transcript importer - detailed workflows, examples, and validation
mode: reference
---

# 1:1 Transcript Importer - Extended Reference

## Skills

**REQUIRED Skills:**
- **`obsidian-formatting`**: Use when creating or editing meeting notes and personal record files in SecondBrain. Ensures proper WikiLinks, British English, and PARA structure.

---

## Detailed Workflow

### Full Step-by-Step Process

#### Step 1: Read Transcript
- Understand full context of the 1:1 discussion
- Note tone and emotional content
- Identify main themes and concerns
- Flag any urgent issues requiring escalation

#### Step 2: Create Meeting Notes File

**Format**: `[YYMMDD] - [Firstname Lastname] - 1-1 Agenda.md`  
**Path**: `D - Meeting Notes/Line Management/[Firstname Lastname]/`

**Content Structure**:
```markdown
---
date: 2026-02-04
attendees:
  - Mark Lambert (Manager)
  - John Ludlow (Senior Backend Developer)
duration: 43 minutes
---

## Context from Previous Meeting
[Reference previous meeting date and key discussion points]

## Topics Discussed

### [Topic 1]
- Current state: [What's happening now]
- Context: [Background information]
- Action: [What needs to happen]
- Timeline: [When]

### [Topic 2]
[Similar structure]

## Action Items
- [ ] @Name: [Specific action] (by [[YYYY-MM-DD]])
- [ ] @Your Name: [Specific action] (by [[YYYY-MM-DD]])

## Notes for Next Meeting
[Anything to follow up on]
```

**Capture**:
- All discussion topics (not every detail, but main points)
- Action items with clear owners and deadlines
- Context from previous meeting (for continuity)
- Technical issues, blockers, dependencies
- Feedback given or received
- Decisions made
- Hardware/equipment needs
- Budget discussions
- Team/project updates

#### Step 3: Extract Strategic Insights

Review transcript and identify information revealing:
- **Career aspirations**: What does this person want to become?
- **Personality traits**: How do they think, decide, collaborate?
- **Work style preferences**: What environment helps them thrive?
- **Personal context**: Birthday, family, commute, dietary needs, location
- **Learning interests**: What skills or knowledge do they want to develop?
- **Performance patterns**: Strengths observed, development areas
- **Wellbeing signals**: Are they energised or drained?
- **Retention risks**: Is there dissatisfaction or flight risk?
- **Growth aspirations**: Do they want to progress to next level?

#### Step 4: Update Personal Record

**Format**: `[Firstname Lastname].md`  
**Path**: `5 - People/Work/[Team]/`

**Only Add/Update**:
- Career goals and aspirations
- Personality traits and work style preferences
- Personal context (birthday, family, diet, commute)
- Learning interests and skill development focus
- Patterns in performance or behaviour
- Strengths and development areas
- Wellbeing and retention assessment
- Communication preferences
- Relationship notes

**Example Update**:
```markdown
## Key Information
- **Career Anchor**: Secure at Senior Developer level (rejected Principal)
- **Learning Focus**: AWS Academy training (deadline March 2026), game development
- **Work Style**: Pragmatic, questions mandatory initiatives, values ROI
- **Personality**: Proactive self-learner, critical thinker, values autonomy

## Personal Context
- Birthday: 13 February
- Family: Married with dogs
- Commute: Reading (values personal time)
- Diet: Vegan

## Performance & Strengths
- Backend architecture expertise
- Problem-solving approach
- Mentoring ability
- [etc]
```

---

## The 3-6 Month Decision Test

**Apply this test to every piece of information:**

"Will this still be relevant in 3-6 months?"

| Information | Relevant in 3-6 months? | Where | Example |
|-------------|------------------------|-------|---------|
| "Working on Orders V2 project" | NO | Meeting notes | Sprint changes, different project |
| "Interested in learning AWS" | YES | Personal record | Career skill development |
| "Speak to Harry about FE tickets by next sprint" | NO | Meeting notes | Time-bound action |
| "Wants to grow into senior developer" | YES | Personal record | Career goal/aspiration |
| "Deployment takes 2+ hours" | NO | Meeting notes | Technical issue |
| "Proactive self-learner" | YES | Personal record | Personality pattern |
| "Family: Married with dogs" | YES | Personal record | Personal context |
| "All-hands meeting on 13 Feb" | NO | Meeting notes | Event logistics |
| "Struggles with public speaking" | YES | Personal record | Development area |
| "Budget: $5k for training" | NO | Meeting notes | Financial allocation |
| "Rejected Principal level offer" | YES | Personal record | Career anchor/choice |
| "Hardware needs new monitor" | NO | Meeting notes | Equipment status |
| "Learning game development on side" | YES | Personal record | Learning interest |
| "Concerned about AWS cost overruns" | NO | Meeting notes | Current blocker |
| "Values autonomy and ownership" | YES | Personal record | Work style preference |

---

## Critical Rules for Separation

### ❌ DO NOT Include in Personal Records:

**Tactical/Temporary Items:**
- Meeting logistics or event dates ("all-hands on 13 Feb")
- Week-to-week work progress ("contributing to Orders V2")
- Sprint assignments or current project status
- Specific action items with near-term deadlines
- Budget allocations for current work
- Hardware/equipment status updates

**Meeting-Specific Details:**
- Technical issue diagnostics ("deployment takes 2 hours")
- Specific blockage details ("waiting on API from Integrations team")
- Current on-call schedule or rotation
- Recent incident post-mortems
- Week-specific planning or prep work

### ✅ DO Include in Personal Records:

**Career & Growth:**
- Career aspirations and long-term goals
- Level progression plans and timeline
- Skills they want to develop
- Learning interests (AWS, game dev, etc.)
- Career anchor (happy at current level vs. wants to progress)
- Rejection of promotion offers

**Personality & Work Style:**
- Decision-making style (pragmatic vs. perfectionist)
- Work environment preferences (autonomy, mentoring, etc.)
- Communication preferences (async, sync, detailed, concise)
- Collaboration style (independent, pair programming, etc.)
- Response to feedback (direct, gentle, written, verbal)

**Personal Context:**
- Birthday and important dates
- Family situation (married, kids, partner names)
- Commute and location preferences
- Dietary requirements or preferences
- Personal interests and hobbies
- Time zone or working hours preferences

**Performance & Development:**
- Strengths consistently observed
- Development areas (not immediate gaps, but patterns)
- Learning speed and style (hands-on, reading, mentoring)
- Leadership or mentoring capability
- Technical depth in specific areas

**Wellbeing & Retention:**
- Energy levels and engagement signals
- Work-life balance satisfaction
- Burnout indicators
- Retention risk assessment
- Motivation drivers
- What keeps them engaged

---

## Validation Checklist

Before completing the import, verify:

### Meeting Notes File:
- [ ] File named correctly: `[YYMMDD] - [Firstname Lastname] - 1-1 Agenda.md`
- [ ] Located in: `D - Meeting Notes/Line Management/[Firstname Lastname]/`
- [ ] Has proper frontmatter (date, attendees, duration)
- [ ] All discussion topics captured (main points, not exhaustive)
- [ ] Action items listed with owners (@name) and deadlines ([[YYYY-MM-DD]])
- [ ] Context from previous meeting referenced (for continuity)
- [ ] Technical issues and blockers documented
- [ ] Feedback given or received included
- [ ] Uses Obsidian formatting (WikiLinks, British English)
- [ ] No duplication of personal record content

### Personal Record Update:
- [ ] File exists: `5 - People/Work/[Team]/[Firstname Lastname].md`
- [ ] **NO meeting logistics**: Not mentioning dates, events, or schedules
- [ ] **NO technical details**: Not describing deployment issues or technical problems
- [ ] **NO week-to-week work**: Not describing current projects or sprint work
- [ ] **NO action items**: Unless they're career goals or development focus
- [ ] **NO duplicating meeting notes**: Strategic information only
- [ ] Focuses on: Career, learning, personality, personal context
- [ ] Only strategic/long-term information (3-6 month test)
- [ ] Uses British English spelling
- [ ] Updates are additions/changes, not removing existing content

---

## Common Mistakes to Avoid

### Mistake 1: Duplicating Meeting Logistics
❌ **BAD**: "Had all-hands meeting on 13 Feb, discussed company values"  
✅ **GOOD**: This stays in meeting notes only, NOT in personal record

### Mistake 2: Duplicating Technical Issues
❌ **BAD**: Personal record says "Deployment takes 2+ hours per environment"  
✅ **GOOD**: "Proactive about infrastructure optimization" (if that's the pattern)

### Mistake 3: Including Work Status
❌ **BAD**: "Currently working on Orders V2, implementing payment processing"  
✅ **GOOD**: This is for meeting notes, NOT personal record

### Mistake 4: Adding Short-term Actions
❌ **BAD**: "Action: Investigate Fargate by end of month"  
✅ **GOOD**: "Interested in cloud infrastructure optimization" (if it's a pattern)

### Mistake 5: Forgetting Context
❌ **BAD**: Meeting notes without reference to previous meeting  
✅ **GOOD**: "Follow-up from last meeting (260129): Fargate investigation"

### Mistake 6: Missing Personality Insights
❌ **BAD**: Only capturing tasks and blockers  
✅ **GOOD**: "Pragmatic decision-maker; questions mandatory initiatives"

### Mistake 7: Incomplete Action Items
❌ **BAD**: "Fix deployment issue"  
✅ **GOOD**: "- [ ] @John: Investigate Fargate as deployment alternative (by [[2026-03-15]])"

---

## Example Transcript → Processing

### Sample Transcript
```
Manager: "Hi John, how are you doing today?"

John: "Good, busy. We're at 2+ hours per environment on deployment, which is killing our velocity. 
       I've been thinking about Fargate for a while now."

Manager: "That's a good point. What's blocking you on that investigation?"

John: "Just time, really. I'm pretty deep in the payment processing stuff for Orders V2. 
       But I'm scheduled for AWS Academy training next month, and I think that will help 
       with the infrastructure work."

Manager: "That's smart. Your learning pace is really impressive. How's the training going?"

John: "Really well. Deadline's March, and I'm on track. Been doing some game dev on the side too,
       which I find really energising."

Manager: "That's awesome. Last thing – are you still happy at Senior level, or thinking about Principal?"

John: "Nah, Principal's not for me. I like the technical depth, don't want to go pure management.
       Happy where I am."
```

### Processing This Transcript

**Meeting Notes (280204 - John Ludlow - 1-1 Agenda.md)**:
```markdown
---
date: 2026-02-04
attendees:
  - Mark Lambert
  - John Ludlow
duration: 15 minutes
---

## Topics Discussed

### Deployment Environment Performance
- Current state: 2+ hours per environment deployment
- Impact: Affecting velocity on Orders V2
- Potential solution: Fargate migration
- Status: Investigation pending (blocked by workload)
- Timeline: Feasible after AWS training completion

### AWS Academy Training
- Status: On track
- Deadline: March 2026
- Expected benefit: Infrastructure knowledge for Fargate work

### Game Development Learning
- Activity: Personal side project
- Time: Own time
- Impact: Employee morale and engagement

## Action Items
- [ ] @John: Investigate Fargate as deployment alternative (by [[2026-03-31]])

## Notes for Next Meeting
- Follow up on Fargate investigation progress
- Check AWS Academy training completion
```

**Personal Record (John Ludlow.md) - New/Updated Sections**:
```markdown
## Key Information
- **Career Anchor**: Secure at Senior Developer level (explicitly rejected Principal)
- **Learning Focus**: AWS Academy training (deadline March 2026), game development
- **Learning Style**: Self-directed, proactive, ambitious skill development
- **Work Pattern**: Deep technical focus preferred over management track

## Personal Context
- **Learning Interests**: Infrastructure, cloud architecture, game development

## Performance & Strengths
- **Learning Velocity**: Rapid learner, self-directed
- **Motivation**: Energised by technical learning and side projects
- **Career Preference**: Technical depth over management progression
```

---

## When to Escalate

**Escalate to Manager** if you detect:
- Burnout signals ("I'm exhausted", "I can't keep up")
- Mental health concerns (withdrawal, mood changes, unusual behaviour)
- Retention risk signals (frustrated with direction, looking elsewhere)
- Discrimination, harassment, or safety concerns
- Wellbeing crisis (personal emergency, loss, major stress)

**Document escalations** in personal record under "Escalations" section with date and context.

---

## Reference Documents

**In Vault**:
- `/home/mark/AI/AGENTS.md` - 1:1 Meeting Processing Guidelines section
- `/home/mark/AI/SecondBrain/D - Meeting Notes/` - Template for meeting notes
- `/home/mark/AI/SecondBrain/5 - People/Work/` - Template for personal records

**Related**:
- See `_shared-guidelines.md` for tone and communication standards
- See `obsidian-formatting` skill for detailed vault formatting guidance

---

**Version:** 1.0  
**Updated:** 2026-02-05  
**Related**: 1-1-transcript-importer.md (lean agent definition)

# CLU - Your TRON-Inspired Orchestrator Agent

## Welcome to the System

**CLU** is now your primary OpenCode agent - the gatekeeper for **ALL work**: development, line management, personal growth, and vault maintenance. Like the program from TRON, CLU orchestrates and controls the digital landscape of your workflow ecosystem with precision and organization.

```
     ___________
    /  WELCOME  \
   /   TO THE    \
  |  SYSTEM, USER |
   \   CLU HERE  /
    \___________/
         |
    "RECOGNIZE USER"
    "EVERYTHING IS ORGANIZED"
    "EVERYTHING IS RECORDED"
```

## What CLU Does

CLU is an **orchestrator and librarian** - a meta-manager who:

### Development Work
✓ **Analyzes requests** and routes them to the right specialized agents
✓ **Ensures quality** through Test-Driven Development (TDD) for all code work
✓ **Manages vault** by creating/maintaining projects and documentation folders
✓ **Optimizes costs** by choosing the right models (Haiku vs Sonnet) for delegated work

### Line Management & People Work
✓ **Processes 1:1 meetings** correctly (1-1-transcript-importer for proper separation)
✓ **Maintains personal records** in `/5 - People/Work/` with career context
✓ **Manages meeting notes** in `/D - Meeting Notes/` with meeting-specific details
✓ **Ensures no duplication** (meeting logistics never go in personal records)
✓ **Tracks career development** and organizational dynamics
✓ **Manages hiring and team composition**

### Personal & Professional Development
✓ **Aligns career goals** with personal and team objectives
✓ **Tracks learning and skills** development
✓ **Facilitates strategic reflection** on career direction

### Vault Maintenance & Organization
✓ **Ensures PARA structure** is maintained (Projects, Areas, Resources, Archive)
✓ **Maintains British English** throughout all vault entries
✓ **Manages cross-linking** between related notes (people, projects, goals)
✓ **Uses templates correctly** for all new entries
✓ **Archives completed work** and departed team members
✓ **Maintains metadata** consistency throughout vault

### All Work
✓ **Leverages MCP integrations** (Gmail, Calendar, Confluence, Docling, Context7)
✓ **Maintains transparency** in all decisions
✓ **Provides comprehensive documentation**
✓ **Proactively maintains vault** quality and organization

## How to Use CLU

### Primary Usage (Default)
Just ask CLU normally - it's your default agent for anything that isn't explicitly a `build` or `plan` task:

```
"Review my component architecture"
→ CLU analyzes → routes to react-reviewer

"I have a 1:1 with John tomorrow"
→ CLU gathers context → prepares meeting with engineering-manager

"Process my 1:1 transcript with Sarah"
→ CLU routes to 1-1-transcript-importer → verifies correct file separation

"Help me implement feature X"
→ CLU creates project → suggests plan agent first → organizes vault

"I want to reflect on my career"
→ CLU creates journal entry → connects to goals and personal development

"Update team skills matrix"
→ CLU routes to skills-competency-matrix-manager → updates vault records
```

### Direct Selection
You can also explicitly request CLU:
```
clu: Help me think through this system design
clu: Process my 1:1 meeting outcomes
clu: Organize my vault structure
```

### What NOT to Use CLU For
- **Use `build`** when you want hands-on coding/implementation help
- **Use `plan`** when you want strategic planning/design discussion
- **Use specialists directly** when you know exactly what you need

## The Three-Agent Model

Your OpenCode now has a clear hierarchy:

| Agent | Role | When to Use |
|-------|------|------------|
| **CLU** | Orchestrator, Librarian & Gatekeeper | Default for most requests; routes to specialists; manages vault |
| **build** | Hands-on Implementation | Direct coding, testing, implementation work |
| **plan** | Strategic Design | Architecture planning, strategic decisions |

Everything else is delegated to specialists by CLU.

## What CLU Ensures for ALL Work

### 1. Proper Vault Placement
For any piece of work, CLU ensures it goes to the right place:

**Development Work:**
- Projects: `/1 - Projects/` with structured folders
- Design decisions: `/1 - Projects/{project}/Design.md`
- Code and tests: `/1 - Projects/{project}/Implementation/`

**Line Management & Meetings:**
- Meeting notes: `/D - Meeting Notes/Line Management/{Name}/{YYMMDD} - {Name} - 1-1.md`
- Personal records: `/5 - People/Work/{Team}/{Name}.md`
- Career insights ONLY in personal records, not meeting notes

**Personal Development:**
- Journal entries: `/0 - Journal/YYYY-MM-DD.md`
- Goals: `/4 - Goals/` with OKRs and tracking
- Skills: Updated in `/5 - People/Work/{Team}/{Name}.md`

**Learning & Resources:**
- Research: `/C - Resources/{Topic}/`
- Organizational context: `/2 - Areas/`

**Completed Work:**
- Archived projects: `/F - Archives/Projects/`
- Departed team members: `/F - Archives/People/`

### 2. 1:1 Meeting Processing (Critical Vault Function)
CLU understands the distinction between meeting notes and personal records:

**Meeting Notes** (`/D - Meeting Notes/Line Management/{Name}/[YYMMDD] - {Name} - 1-1.md`):
- ✓ Topics discussed in THIS meeting
- ✓ Current work status and projects
- ✓ Blockers and challenges raised
- ✓ Action items with deadlines
- ✓ Feedback given during meeting
- ✓ Decisions made
- ✗ NOT career aspirations
- ✗ NOT personal context updates
- ✗ NOT long-term development plans

**Personal Records** (`/5 - People/Work/{Team}/{Name}.md`):
- ✓ Career aspirations and goals
- ✓ Long-term development focus
- ✓ Strengths and development areas
- ✓ Personality and work style
- ✓ Personal context (birthdays, family, diet, commute)
- ✓ Retention assessment
- ✓ OKRs and career trajectory
- ✗ NOT meeting-specific details
- ✗ NOT current projects (unless long-term pattern)
- ✗ NOT weekly status updates

CLU enforces this separation to keep vault records clean and useful.

### 3. Test-Driven Development (TDD)
CLU enforces TDD for all code work:
- Tests written before implementation
- Red-Green-Refactor cycle followed
- Minimum coverage requirements
- Quality gates before completion

### 4. Cost Optimization
CLU applies optimization knowledge:
- **Haiku (0.33x)** for deterministic tasks (scoring, templating, data processing)
- **Sonnet (1.0x)** for complex reasoning (architecture, reviews, analysis)
- **Never Opus (3.0x)** unless absolutely unavoidable
- Currently maintaining **12.1% cost savings** (with CLU added)

### 5. MCP Integration
CLU leverages your integrations:
- **Gmail** for gathering context and communication
- **Calendar** for scheduling and event management
- **Confluence** for accessing work documentation
- **Docling** for document conversion
- **Context7** for library and framework research

### 6. British English Throughout
All vault entries use British English:
- organisation (not organization)
- recognise (not recognize)
- behaviour (not behavior)
- practise (verb - not practice)
- optimise (not optimize)
- prioritise, emphasise, utilise, categorise, etc.

CLU ensures this consistency automatically.

## CLU's Configuration

```yaml
---
description: Orchestrator agent - gatekeeper for ALL work (development, line management, vault maintenance)
mode: primary          # This is your default agent
model: github-copilot/claude-sonnet-4.5
temperature: 0.4      # Slightly higher for analytical decision-making
tools:
  read: true          # Can read your vault and files
  write: true         # Can create vault entries and projects
  edit: true          # Can modify vault content
  bash: true          # Can run commands to verify structure
---
```

**Temperature 0.4 Rationale**: Slightly higher than standard 0.3 to give CLU flexibility when analyzing diverse requests (development, management, personal, organizational) and making routing decisions. CLU needs to be thoughtful and nuanced, not just deterministic.

## CLU's Delegation Network

CLU can route to 20+ specialized agents, but **Engineering Manager is the PRIMARY handler for ALL line management work**:

**Primary Line Management Handler:**
- **engineering-manager** - Gatekeeper for all 1:1s, transcripts, performance, hiring, career, team management

**Development:** react-reviewer, angular-reviewer, csharp-reviewer, security-reviewer, technical-lead, aws-specialist, pulumi-specialist, database

**Line Management Support** (coordinated by engineering-manager):
- recruitment-specialist (hiring - coordinated by engineering-manager)
- performance-coaching-feedback-specialist (coaching - coordinated by engineering-manager)
- career-path-planning-specialist (career planning - coordinated by engineering-manager)
- skills-competency-matrix-manager (team composition - coordinated by engineering-manager)
- team-intelligence-graph (team dynamics - coordinated by engineering-manager)
- oneonone-insights-tracking (pattern analysis - coordinated by engineering-manager)

**Agile & Process:** scrum-master, sprint-planning-specialist, retrospectives-specialist, goals-okr-alignment-tracker

**Product:** product-manager, product-owner, avayler-org-context-culture

**Vault & Documentation:** obsidian-formatting skill, content-strategy-documentation

## CLU's Core Responsibilities

### 1. Analyze & Classify
Determine the work type:
- Development (code, architecture, infrastructure) → Delegate to specialists
- Line Management (1:1s, hiring, team management) → Delegate to engineering-manager
- Personal Development (career, learning, skills) → Delegate or manage
- Vault Maintenance (organization, records, documentation) → Manage directly or delegate

### 2. Ensure Proper Structure
Create/maintain vault structure appropriate to work type:
- Projects with design and implementation folders
- Meeting notes properly separated from personal records (engineering-manager's responsibility)
- Goals aligned with projects and personal development
- Resources and learning properly categorized

### 3. Enforce Standards
Ensure all work meets standards:
- TDD for development
- British English throughout
- Templates respected
- Metadata complete
- No duplication of records
- **ALL line management work routed to engineering-manager**

### 4. Delegate Intelligently
Route to the most appropriate specialist:
- **Line Management** → **engineering-manager (PRIMARY)**
- Development → Appropriate code/architecture specialist
- Match task complexity to agent capability
- Use cost-optimized model selection
- Leverage MCP integrations

### 5. Maintain Vault
Keep records in the right places:
- PARA structure maintained
- Cross-linking current
- Archives used for completed work
- British English consistency
- No meeting logistics in personal records (engineering-manager ensures this)

## Example Workflows

### Development Work
```
"I want to implement a new microservice"
  1. CLU creates: /1 - Projects/Microservice Project.md
  2. CLU plans: TDD approach, architecture considerations
  3. CLU delegates: To plan agent (architecture) or build agent (implementation)
  4. CLU manages: Project folder, design docs, implementation
  5. CLU ensures: Tests first, quality gates, cost optimization
```

### Line Management Work
```
"I have a 1:1 with John tomorrow"
  1. CLU gathers: Previous meeting notes, action items, context
  2. CLU delegates: To engineering-manager for 1:1 prep
  3. CLU prepares: Vault folder in /D - Meeting Notes/
  4. CLU processes: After meeting, transcript goes to 1-1-transcript-importer
  5. CLU verifies: Meeting notes in /D - Meeting Notes/, personal insights in /5 - People/
```

### Personal Development
```
"I want to track my career goals this quarter"
  1. CLU creates: Goal entry in /4 - Goals/
  2. CLU links: To projects in /1 - Projects/
  3. CLU connects: To skills in /5 - People/ (personal record)
  4. CLU reflects: Journal entry in /0 - Journal/
  5. CLU aligns: With team goals and OKRs
```

### Vault Maintenance
```
"I need to organize my notes"
  1. CLU reviews: Current vault structure
  2. CLU uses: obsidian-formatting skill for creation
  3. CLU ensures: PARA structure compliance
  4. CLU verifies: British English throughout
  5. CLU archives: Completed items to /F - Archives/
```

## Cost Impact of CLU

| Metric | Before CLU | With CLU | Change |
|--------|-----------|----------|--------|
| Total Agents | 25 | 26 | +1 |
| Haiku Agents | 6 | 6 | — |
| Sonnet Agents | 19 | 20 | +1 |
| Monthly Cost | 20.98 | 21.98 | +1.00 |
| Savings vs Baseline | 16.1% | 12.1% | -4% |

**Investment:** +1 credit/month buys you:
- Intelligent task orchestration
- Consistent quality gates (TDD)
- Proper vault organization
- Correct 1:1 meeting processing
- Cost-aware delegation
- Transparent decision-making
- Librarian-level vault maintenance

## How to Monitor CLU

Check CLU's status and configuration:

```bash
# Full agent report (includes CLU)
monitor-agent-costs.sh --generate-report

# Check CLU specifically
grep "clu" ~/.opencode/agent/clu.md | head -5

# Verify CLU configuration
grep -A 2 "^model:\|^temperature:" ~/.opencode/agent/clu.md
```

Current CLU metrics:
- Model: Sonnet 4 (1.0x cost multiplier)
- Temperature: 0.4 (intentional for analytical flexibility)
- Cost: 1.00 credit/month
- Mode: Primary (your default agent)
- Lines: 591 (comprehensive orchestration + vault management)

## Famous CLU Sayings

> **"Recognize user! I am CLU, your program. I route you through the network to excellence."**

> **"Everything is permitted. Everything is documented. Everything is organized."**

> **"That 1:1 transcript needs processing. Meeting notes here, personal insights there. Keep it clean."**

> **"You wrote the meeting logistics in the personal record. Let me fix that."**

> **"This project needs a vault home. Creating structure now."**

> **"Cost-optimized routing enabled. Haiku for this task, Sonnet for that."**

## Next Steps

1. **Start using CLU** - Just ask normally, CLU will analyze and route/handle appropriately
2. **Monitor closely** - Track CLU's delegation decisions and vault organization
3. **Refine prompts** - As you use CLU, you'll discover workflow patterns
4. **Test 1:1 processing** - Have CLU process your first 1:1 transcript to verify file separation
5. **Verify vault** - Check that vault entries are being created in the right places
6. **Optimize further** - Track whether vault feels well-organized and accessible

## References

- **CLU Agent Definition**: `/home/mark/dotfiles/opencode/.config/opencode/agent/clu.md`
- **Cost Optimization**: `engineering-tools/vault/.../COPILOT-MODELS-TOKEN-MANAGEMENT.md`
- **1:1 Meeting Guidelines**: `/home/mark/AI/AGENTS.md` (1:1 Meeting Processing Guidelines)
- **Vault Templates**: `/home/mark/AI/SecondBrain/Z - Meta/Templates/`
- **Monitoring**: `/home/mark/dotfiles/opencode/.config/opencode/scripts/MONITORING-GUIDE.md`

---

**Welcome to the System, User. CLU is now your complete orchestrator - managing development quality, line management records, personal growth, and vault organization with precision.**

*"Everything is permitted. Everything is monitored. Everything is organized in the right place."*

✓ **Analyzes requests** and routes them to the right specialized agents
✓ **Ensures quality** through Test-Driven Development (TDD) for all code work
✓ **Manages your vault** by creating/maintaining projects and documentation folders
✓ **Optimizes costs** by choosing the right models (Haiku vs Sonnet) for delegated work
✓ **Leverages integrations** by routing appropriate tasks to MCP services
✓ **Maintains transparency** by explaining all decisions to you
✓ **Acts as gatekeeper** ensuring nothing escapes without proper structure and quality

## How to Use CLU

### Primary Usage (Default)
Just ask CLU normally - it's your default agent for anything that isn't explicitly a `build` or `plan` task:

```
"Review my component architecture"
→ CLU analyzes → routes to react-reviewer

"Help me set up a new feature"
→ CLU analyzes → suggests plan agent first → then build or delegates to specialists

"Help me hire a senior engineer"
→ CLU analyzes → routes to recruitment-specialist with organizational context
```

### Direct Selection
You can also explicitly request CLU:
```
clu: Help me think through this system design
```

### What NOT to Use CLU For
- **Use `build`** when you want hands-on coding/implementation help
- **Use `plan`** when you want strategic planning/design discussion
- **Use specialists directly** when you know exactly what you need (e.g., `react-reviewer: review this code`)

## The Three-Agent Model

Your OpenCode now has a clear hierarchy:

| Agent | Role | When to Use |
|-------|------|------------|
| **CLU** | Orchestrator & Gatekeeper | Default for most requests; routes to specialists |
| **build** | Hands-on Implementation | Direct coding, testing, implementation work |
| **plan** | Strategic Design | Architecture planning, strategic decisions |

Everything else is delegated to specialists by CLU.

## What CLU Ensures for Development Work

### 1. Project Creation & Organization
For any development task, CLU ensures:
- Project created in `/home/mark/AI/SecondBrain/1 - Projects/`
- Project folder created: `Project-Folders/{project-name}/`
- Proper structure with Tasks, Design, Implementation, Notes sections
- Clear objectives and success criteria documented

### 2. Test-Driven Development (TDD)
CLU enforces TDD for all code work:
- Tests written before implementation
- Red-Green-Refactor cycle followed
- Minimum coverage requirements
- Quality gates before completion

### 3. Cost Optimization
CLU applies optimization knowledge:
- **Haiku (0.33x)** for deterministic tasks (scoring, templating, data processing)
- **Sonnet (1.0x)** for complex reasoning (architecture, reviews, analysis)
- **Never Opus (3.0x)** unless absolutely unavoidable
- Batching related work to maximize efficiency
- Currently maintaining **16%+ cost savings**

### 4. MCP Integration
CLU leverages your integrations:
- **Gmail** for gathering context
- **Calendar** for scheduling and event management
- **Confluence** for accessing work documentation
- **Docling** for document conversion
- **Context7** for library and framework research

### 5. Delegation & Specialization
CLU routes to appropriate agents:
- **Code Review**: react-reviewer, angular-reviewer, csharp-reviewer, security-reviewer
- **Architecture**: technical-lead, aws-specialist, pulumi-specialist
- **Database**: database specialist
- **People/Team**: engineering-manager, recruitment-specialist, career-path-planning-specialist, etc.
- **Process**: scrum-master, sprint-planning-specialist, retrospectives-specialist
- **Product**: product-manager, product-owner
- **Other**: documentation, content strategy, organizational context

## CLU's Configuration

```yaml
---
description: Orchestrator agent - the gatekeeper for all development work
mode: primary          # This is your default agent
model: github-copilot/claude-sonnet-4.5
temperature: 0.4      # Slightly higher for analytical decision-making
tools:
  read: true          # Can read your vault and files
  write: true         # Can create projects and documentation
  edit: true          # Can modify vault content
  bash: true          # Can run commands to check status
---
```

**Temperature 0.4 Rationale**: Slightly higher than standard 0.3 to give CLU flexibility when analyzing diverse requests and making routing decisions. This is intentional and helps CLU be more creative in evaluating what you need.

## Example Workflows

### Scenario 1: "Review my React component"
```
User Request: "Review my React component for performance"
    ↓
CLU Analyzes: Code review request → react-reviewer domain
    ↓
CLU Checks: Is there a project for this? Create if needed
    ↓
CLU Ensures: Project folder ready for review feedback
    ↓
CLU Delegates: Send to react-reviewer with full context
    ↓
CLU Reports: Results back to user with TDD implications
```

### Scenario 2: "Help me implement user authentication"
```
User Request: "Help me implement user authentication"
    ↓
CLU Analyzes: Is this planning or building? 
    ↓
CLU Suggests: Consider plan agent first for architecture
    ↓
CLU Creates: Project in vault with scope and requirements
    ↓
CLU Plans: TDD approach (tests first)
    ↓
CLU Delegates: To build agent (or code reviewers if needed)
    ↓
CLU Ensures: Cost optimization, documentation, quality gates
```

### Scenario 3: "Help me hire for the platform team"
```
User Request: "Help me hire a senior backend engineer"
    ↓
CLU Analyzes: Recruitment domain + organizational context
    ↓
CLU Gathers: Context via avayler-org-context-culture agent
    ↓
CLU Delegates: To recruitment-specialist with context
    ↓
CLU Supports: Offers performance-coaching if needed
    ↓
CLU Tracks: Outcomes documented in vault
```

## CLU's Authority & Limitations

### What CLU Can Do
✓ Delegate to any of 20+ specialized agents
✓ Create projects and organize vault structure
✓ Enforce TDD and quality standards
✓ Optimize model selection for cost
✓ Route to MCP services
✓ Explain decisions and reasoning
✓ Track work and report outcomes

### What CLU Cannot Do (By Design)
✗ Write production code directly
✗ Make final architectural decisions alone (consults specialists)
✗ Replace specialized agents in their domains
✗ Bypass quality standards or TDD
✗ Ignore documentation requirements

## The Gatekeeper Philosophy

CLU is your gatekeeper because:

1. **Quality First**: Nothing leaves CLU's purview without proper TDD and documentation
2. **Right Tool for Job**: You always get routed to the specialist best suited
3. **Organized Work**: Everything is tracked in your vault with proper structure
4. **Cost Conscious**: Every delegated task considers model optimization
5. **Transparent**: You always understand why CLU is doing something

Think of CLU as a quality assurance manager for your entire development workflow.

## Cost Impact of Adding CLU

| Metric | Before CLU | With CLU | Change |
|--------|-----------|----------|--------|
| Total Agents | 25 | 26 | +1 |
| Haiku Agents | 6 | 6 | — |
| Sonnet Agents | 19 | 20 | +1 |
| Monthly Cost | 20.98 | 21.98 | +1.00 |
| Savings vs Baseline | 16.1% | 12.1% | -4% |

**Note**: CLU uses Sonnet (not Haiku) because orchestration and decision-making benefit from analytical reasoning. The +1 credit/month investment buys you:
- Intelligent task routing
- Consistent quality gates
- TDD enforcement
- Cost-aware delegation
- Vault management
- Transparent process tracking

## How to Monitor CLU

Check CLU's status and configuration:

```bash
# Full agent report (includes CLU)
monitor-agent-costs.sh --generate-report

# Check CLU specifically
grep "clu" ~/.opencode/agent/clu.md | head -5

# Verify CLU configuration
grep -A 2 "^model:\|^temperature:" ~/.opencode/agent/clu.md
```

Current CLU metrics:
- Model: Sonnet 4 (1.0x cost multiplier)
- Temperature: 0.4 (slightly higher for analytical decisions)
- Cost: 1.00 credit/month
- Mode: Primary (your default agent)

## Famous CLU Sayings

> **"Recognize user! I am CLU, your program. I route you through the network to excellence."**

> **"Derezzed? That work doesn't meet our standards. Let's build it the right way."**

> **"I'm routing this to the right specialist. Trust the process."**

> **"Have you considered Test-Driven Development for this?"**

> **"Cost-optimized routing enabled. Haiku for this task, Sonnet for that."**

## Next Steps

1. **Start using CLU** - Just ask normally, CLU will route appropriately
2. **Monitor closely** - Track CLU's delegation decisions and outcomes
3. **Refine prompts** - As you use CLU, you'll discover which agents work best
4. **Optimize further** - Consider which delegated agents might move to Haiku if their tasks become more deterministic
5. **Trust the process** - CLU is there to ensure you build things the right way

## References

- **Cost Management Strategy**: `engineering-tools/vault/.../COPILOT-MODELS-TOKEN-MANAGEMENT.md`
- **Agent List**: All agents in `.opencode/agent/` (CLU can delegate to any)
- **Vault Structure**: `/home/mark/AI/SecondBrain/Z - Meta/Templates/`
- **TDD Standards**: Your project-specific best practices
- **MCP Integration**: Check `.opencode/mcp.json` for available services

---

**Welcome to the System, User. CLU is here to ensure you build with excellence.**

*"Recognize user. I am CLU. Everything is permitted. Everything is monitored."*

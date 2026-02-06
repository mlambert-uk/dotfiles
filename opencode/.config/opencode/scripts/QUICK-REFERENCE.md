# OpenCode Agent Cost Monitoring - Quick Reference

## Most Used Commands

```bash
# Run everything (full report)
monitor-agent-costs.sh

# Check for configuration issues (weekly)
monitor-agent-costs.sh --check-drift

# View cost breakdown and savings
monitor-agent-costs.sh --cost-breakdown

# Show detailed cost report
monitor-agent-costs.sh --generate-report

# Compare agents across projects
monitor-agent-costs.sh --compare-scopes

# Show this help
monitor-agent-costs.sh --help
```

## Current Metrics (At a Glance)

| Metric | Value |
|--------|-------|
| Total Agents | 25 |
| Using Haiku | 6 (24%) |
| Using Sonnet | 19 (76%) |
| Using Opus | 0 |
| Monthly Cost | 20.98 credits |
| Baseline Cost | 25.00 credits |
| **Savings** | **16.1%** |

## Model Selection Quick Guide

### Use Haiku (0.33x, Temp 0.2) When:
- Task is deterministic and reproducible
- Work follows a template or formula
- Scoring against objective criteria
- Data processing or extraction
- Speed is important

**Examples**: Sprint planning, CV screening, agenda generation

### Use Sonnet (1.0x, Temp 0.3) When:
- Complex reasoning required
- Pattern recognition needed
- Multiple perspectives to consider
- High-stakes decisions
- Creative or analytical output

**Examples**: Code review, architecture design, coaching feedback

### Never Use Opus (3x) For:
- Anything you can do with Sonnet (85% as capable)
- Token cost is 3-10x multiplier
- Strategy: Improve prompts before escalating

## Configuration File Locations

```
~/.opencode/agent/              # Local agents (symlink)
/home/mark/Code/engineering-tools/.opencode/agent/
/home/mark/Code/engineering-leadership-tools/.opencode/agent/
/home/mark/dotfiles/opencode/.config/opencode/agent/
```

## Agent Configuration Template

```yaml
---
description: What this agent does
mode: subagent
model: anthropic/claude-haiku-4-20250514    # or sonnet/opus
temperature: 0.2                             # 0.2 for Haiku, 0.3 for Sonnet
tools:
  write: false
  edit: false
  bash: false
---

[Agent implementation below]
```

## Common Tasks

### Add a New Agent
1. Assess: Is this deterministic or reasoning-heavy?
2. Choose: Haiku (0.33x) or Sonnet (1.0x)
3. Set temperature: 0.2 (Haiku) or 0.3 (Sonnet)
4. Create files in all 3 scopes if shared
5. Run: `monitor-agent-costs.sh --check-drift` to verify

### Upgrade an Agent (Haiku → Sonnet)
1. Edit agent file: change model to `anthropic/claude-sonnet-4-20250514`
2. Change temperature to 0.3
3. Update all scopes where agent exists
4. Run: `monitor-agent-costs.sh --generate-report` to verify cost change

### Verify Configuration Is Correct
```bash
# Check entire configuration
monitor-agent-costs.sh --check-drift

# Check specific agent
grep "^model:\|^temperature:" ~/.opencode/agent/YOUR-AGENT.md
```

## Monitoring Schedule

- **Weekly**: `monitor-agent-costs.sh --check-drift` (every Monday)
- **Monthly**: `monitor-agent-costs.sh --full-report` (1st of month)
- **Quarterly**: Full review and optimization assessment

## Key Files

- **Master Strategy**: `engineering-tools/vault/03-Best-Practices/Tool-Guides/COPILOT-MODELS-TOKEN-MANAGEMENT.md`
- **Detailed Guide**: `engineering-tools/vault/03-Best-Practices/Tool-Guides/AGENT-MODEL-OPTIMISATION.md`
- **Monitoring Guide**: `/home/mark/dotfiles/opencode/.config/opencode/scripts/MONITORING-GUIDE.md`
- **This Quick Ref**: `/home/mark/dotfiles/opencode/.config/opencode/scripts/QUICK-REFERENCE.md`

## Troubleshooting

**Agent not found?**
- Check filename: `agent-name.md` in `~/.opencode/agent/`
- Verify symlink: `ls -la ~/.opencode`

**Configuration error?**
- Run: `monitor-agent-costs.sh --check-drift`
- Fix: Update model and temperature fields in agent YAML

**Cost higher than expected?**
- Check: How many agents use Sonnet vs Haiku?
- Run: `monitor-agent-costs.sh --cost-breakdown`
- Fix: Consider moving some Haiku agents if possible

**Savings lower than before?**
- Check: New agents added recently?
- Check: Agents upgraded from Haiku to Sonnet?
- Run: `monitor-agent-costs.sh --full-report` to see breakdown

## Reference Standards

**Haiku Agents** must have:
- `model: anthropic/claude-haiku-4-20250514`
- `temperature: 0.2`
- Deterministic, rule-based tasks

**Sonnet Agents** must have:
- `model: anthropic/claude-sonnet-4-20250514`
- `temperature: 0.3`
- Complex reasoning or pattern recognition

**All Agents** must have:
- `mode: subagent`
- Valid description
- Proper YAML frontmatter

## Cost Calculation Formula

```
Monthly Cost = (Haiku Count × 0.33) + (Sonnet Count × 1.0) + (Opus Count × 3.0)
Savings % = 100 - ((Current Cost / Baseline Cost) × 100)
```

Example: 6 Haiku + 19 Sonnet = (6 × 0.33) + (19 × 1.0) = 20.98 credits
Baseline (all Sonnet): 25 credits
Savings: 100 - (20.98/25 × 100) = 16.1%

## Emergency Commands

```bash
# Check entire configuration in one command
monitor-agent-costs.sh --full-report

# Just see if anything is wrong
monitor-agent-costs.sh --check-drift

# See cost impact of current setup
monitor-agent-costs.sh --cost-breakdown

# Compare across all project scopes
monitor-agent-costs.sh --compare-scopes
```

---

**Last Updated**: 2026-02-05
**Status**: All systems operational
**Support**: See MONITORING-GUIDE.md for detailed procedures

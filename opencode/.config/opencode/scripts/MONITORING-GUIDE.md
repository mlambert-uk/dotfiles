# OpenCode Agent Cost Monitoring Guide

## Overview

A comprehensive monitoring script has been created to track agent model assignments, calculate costs, and identify configuration drift across all OpenCode agent configurations.

**Script Location**: `/home/mark/dotfiles/opencode/.config/opencode/scripts/monitor-agent-costs.sh`

## Quick Start

```bash
# Generate full report (all analyses)
monitor-agent-costs.sh

# Generate specific reports
monitor-agent-costs.sh --generate-report    # Cost analysis
monitor-agent-costs.sh --check-drift        # Configuration drift check
monitor-agent-costs.sh --compare-scopes     # Cross-scope comparison
monitor-agent-costs.sh --cost-breakdown     # Savings analysis
monitor-agent-costs.sh --full-report        # All analyses
monitor-agent-costs.sh --help               # Show help
```

## Reports

### 1. Cost Analysis Report

**Command**: `monitor-agent-costs.sh --generate-report`

Displays:
- Total agent count by model type (Haiku, Sonnet, Opus)
- Monthly cost allocation in credits
- Detailed breakdown of each agent with model, temperature, and individual cost
- Example:
  ```
  Total Agents: 25
  • Haiku (0.33x): 6 agents
  • Sonnet (1.0x): 19 agents
  • Opus (3.0x): 0 agents
  
  Cost Allocation:
  Haiku agents: 1.98 credits
  Sonnet agents: 19.00 credits
  Total: 20.98 credits
  ```

### 2. Configuration Drift Check

**Command**: `monitor-agent-costs.sh --check-drift`

Validates:
- All agents use recognized models (Haiku, Sonnet, Opus)
- Temperature settings match model recommendations:
  - Haiku: 0.2 (deterministic)
  - Sonnet: 0.3 (balanced)
  - Opus: 0.3 (balanced)
- Flags any non-standard configurations

Output indicates:
- ✓ No configuration drift detected (if all valid)
- ⚠ Specific warnings for non-compliant configurations

### 3. Cross-Scope Comparison

**Command**: `monitor-agent-costs.sh --compare-scopes`

Compares agent configurations across three scopes:
- Engineering-Tools project
- Engineering-Leadership-Tools project
- Local OpenCode configuration

Shows whether agents are configured consistently across scopes and identifies gaps.

Example output:
```
Agent              | Engineering-Tools | Eng-Leadership | Local
technical-lead     | Sonnet            | —              | Sonnet
sprint-planning    | —                 | Haiku          | Haiku
```

### 4. Cost Savings Analysis

**Command**: `monitor-agent-costs.sh --cost-breakdown`

Shows:
- Baseline cost (all Sonnet scenario)
- Current optimized cost
- Percentage savings achieved
- Detailed breakdown by model with agent count

Example:
```
Baseline (all Sonnet): 25.00 credits/month
Current (optimized): 20.98 credits/month
Savings: 16.1%

Haiku (0.33x): 6 agents = 1.98 credits
Sonnet (1.0x): 19 agents = 19.00 credits
```

## Key Metrics

### Current Status (as of 2026-02-05)

| Metric | Value |
|--------|-------|
| **Total Agents** | 25 |
| **Haiku Agents** | 6 (24%) |
| **Sonnet Agents** | 19 (76%) |
| **Opus Agents** | 0 |
| **Monthly Cost** | 20.98 credits |
| **Baseline Cost** | 25.00 credits |
| **Savings** | 16.1% |

### Model Distribution

- **Haiku (0.33x)**: 6 agents - routine, deterministic tasks
  - avayler-org-context-culture
  - content-strategy-documentation
  - engineering-manager
  - goals-okr-alignment-tracker
  - oneonone-insights-tracking
  - sprint-planning-specialist

- **Sonnet (1.0x)**: 19 agents - complex reasoning tasks
  - All code reviewers (angular, csharp, react, security)
  - All architects and specialists (aws, pulumi, technical-lead, etc.)
  - All management agents (scrum-master, product-manager, retrospectives, etc.)

- **Opus (3.0x)**: 0 agents - reserved for exceptional cases only

## Monitoring Schedule

### Weekly (Every Monday)
```bash
monitor-agent-costs.sh --check-drift
```
**Purpose**: Verify no configuration drift has occurred during the week

### Monthly (1st of month)
```bash
monitor-agent-costs.sh --full-report
```
**Purpose**: Generate comprehensive report for cost tracking and analysis

### Quarterly (Every 3 months)
```bash
monitor-agent-costs.sh --cost-breakdown
```
**Purpose**: Assess whether optimizations are delivering expected savings

### On-Demand
Run full report whenever adding new agents or making model changes to verify consistency.

## Configuration Conventions

### Haiku Agent Configuration (0.33x cost)

**Template:**
```yaml
---
description: Short description
mode: subagent
model: github-copilot/claude-haiku-4.5
temperature: 0.2
tools:
  write: false
  edit: false
  bash: false
---
```

**Use For:**
- Deterministic, rule-based tasks (agenda generation, CV scoring)
- Template-based work
- Simple data processing
- Objective scoring against rubrics
- Consistent, reproducible outputs

**Temperature**: 0.2 (low = deterministic)

### Sonnet Agent Configuration (1.0x cost)

**Template:**
```yaml
---
description: Medium to complex description
mode: subagent
model: github-copilot/claude-sonnet-4.5
temperature: 0.3
tools:
  write: true
  edit: true
  bash: true
---
```

**Use For:**
- Complex pattern recognition
- Reasoning about trade-offs
- High-stakes decisions
- Creative analysis
- Code reviews and architecture
- Team dynamics and coaching

**Temperature**: 0.3 (balanced = analytical with creativity)

## Troubleshooting

### Script Issues

**Issue**: Script hangs or slow execution
- **Cause**: Large number of agents or slow file system
- **Solution**: Run with individual report flags instead of full report

**Issue**: "Unknown model" warning
- **Cause**: Agent uses unrecognized model name
- **Solution**: Update agent config with proper model ID (GitHub Copilot format):
  - `github-copilot/claude-haiku-4.5`
  - `github-copilot/claude-sonnet-4.5`
  - `github-copilot/claude-opus-4.5`
  - Run `opencode models` to see all available models

**Issue**: Temperature mismatch warnings
- **Cause**: Agent temperature doesn't match model recommendation
- **Solution**: Update agent's `temperature:` field:
  - Haiku agents: set to 0.2
  - Sonnet agents: set to 0.3
  - Opus agents: set to 0.3

### Cost Analysis Issues

**Issue**: Savings seem lower than expected
- **Possible causes**:
  1. Many agents use Sonnet (higher cost)
  2. Recently added new complex agents
  3. Some Haiku agents may have been upgraded
- **Action**: Review agents needing Sonnet to see if any can be downgraded to Haiku

**Issue**: Cost breakdown doesn't match expected calculation
- **Check**: Verify no archived agents are being counted (files starting with `_`)
- **Check**: Ensure all agents have valid model specifications

## Integration

The monitoring script is designed to integrate with:

1. **CI/CD Pipelines**: Run drift check on commit to ensure no unintended model changes
2. **Scheduled Reports**: Use with cron to generate monthly cost reports
3. **Cost Tracking**: Feed savings metrics into monthly cost analysis
4. **Compliance**: Verify all agents follow organizational standards

### Example Cron Entries

```bash
# Weekly drift check (Monday 9 AM)
0 9 * * 1 /home/mark/dotfiles/opencode/.config/opencode/scripts/monitor-agent-costs.sh --check-drift

# Monthly cost report (1st of month, 10 AM)
0 10 1 * * /home/mark/dotfiles/opencode/.config/opencode/scripts/monitor-agent-costs.sh > /tmp/opencode-cost-report-$(date +\%Y\%m\%d).txt

# Quarterly detailed analysis (1st of quarter)
0 10 1 1,4,7,10 * /home/mark/dotfiles/opencode/.config/opencode/scripts/monitor-agent-costs.sh --full-report
```

## Next Steps

1. **Run baseline report**: `monitor-agent-costs.sh --full-report`
2. **Set up weekly drift checks**: Add to cron or CI/CD
3. **Monitor actual costs**: Compare script estimates with GitHub Copilot usage data
4. **Review quarterly**: Assess whether optimizations are effective
5. **Adjust as needed**: Upgrade/downgrade agents based on performance feedback

## Reference

- **Cost Savings Strategy**: `/home/mark/Code/engineering-tools/vault/03-Best-Practices/Tool-Guides/COPILOT-MODELS-TOKEN-MANAGEMENT.md`
- **Agent Optimisation Details**: `/home/mark/Code/engineering-tools/vault/03-Best-Practices/Tool-Guides/AGENT-MODEL-OPTIMISATION.md`
- **Quick Reference**: `/home/mark/Code/engineering-tools/vault/03-Best-Practices/Tool-Guides/AGENT-MODEL-OPTIMISATION-QUICK-REFERENCE.md`

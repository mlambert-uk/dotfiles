#!/bin/bash

# OpenCode Agent Cost Monitoring Script
# Purpose: Track agent model assignments and calculate cost metrics
# Usage: ./monitor-agent-costs.sh [--generate-report] [--check-drift] [--cost-breakdown]

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
AGENT_DIR="$CONFIG_DIR/agent"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Model cost multipliers (relative to baseline)
HAIKU_COST=0.33
SONNET_COST=1.0
OPUS_COST=3.0

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${BLUE}ℹ${NC} $*"
}

log_success() {
    echo -e "${GREEN}✓${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $*"
}

log_error() {
    echo -e "${RED}✗${NC} $*"
}

# Extract model from agent config file
get_agent_model() {
    local agent_file=$1
    grep "^model:" "$agent_file" 2>/dev/null | head -1 | sed 's/^model: *//' || echo "unknown"
}

# Extract temperature from agent config file
get_agent_temp() {
    local agent_file=$1
    grep "^temperature:" "$agent_file" 2>/dev/null | head -1 | sed 's/^temperature: *//' || echo "unknown"
}

# Get model display name
get_model_display() {
    local model=$1
    case "$model" in
        *haiku*) echo "Haiku" ;;
        *sonnet*) echo "Sonnet" ;;
        *opus*) echo "Opus" ;;
        *) echo "Unknown" ;;
    esac
}

# Get model cost
get_model_cost() {
    local model=$1
    case "$model" in
        *haiku*) echo "$HAIKU_COST" ;;
        *sonnet*) echo "$SONNET_COST" ;;
        *opus*) echo "$OPUS_COST" ;;
        *) echo "0" ;;
    esac
}

# ============================================================================
# MAIN FUNCTIONS
# ============================================================================

# Generate comprehensive cost report
generate_cost_report() {
    echo ""
    echo -e "${BLUE}=== OpenCode Agent Cost Analysis Report ===${NC}"
    echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    local total_haiku_cost=0
    local total_sonnet_cost=0
    local total_opus_cost=0
    local total_agents=0
    local haiku_agents=0
    local sonnet_agents=0
    local opus_agents=0
    
    echo -e "${BLUE}Configuration Location:${NC} $AGENT_DIR"
    echo ""
    
    # Collect agent data
    declare -a agent_list
    declare -A agent_models
    declare -A agent_temps
    
    while IFS= read -r agent_file; do
        [ -z "$agent_file" ] && continue
        
        agent_name=$(basename "$agent_file" .md)
        [ "${agent_name:0:1}" = "_" ] && continue  # Skip files starting with underscore
        
        model=$(get_agent_model "$agent_file")
        temp=$(get_agent_temp "$agent_file")
        
        agent_list+=("$agent_name")
        agent_models[$agent_name]=$model
        agent_temps[$agent_name]=$temp
        
        # Count by model and accumulate cost
        case "$model" in
            *haiku*)
                ((haiku_agents++))
                total_haiku_cost=$(awk "BEGIN {print $total_haiku_cost + $HAIKU_COST}")
                ;;
            *sonnet*)
                ((sonnet_agents++))
                total_sonnet_cost=$(awk "BEGIN {print $total_sonnet_cost + $SONNET_COST}")
                ;;
            *opus*)
                ((opus_agents++))
                total_opus_cost=$(awk "BEGIN {print $total_opus_cost + $OPUS_COST}")
                ;;
        esac
        
        ((total_agents++))
    done < <(find "$AGENT_DIR" -maxdepth 1 -name "*.md" -type f | sort)
    
    # Display summary
    echo -e "${BLUE}Summary Statistics:${NC}"
    echo "  Total Agents: $total_agents"
    echo "  • Haiku (0.33x): $haiku_agents agents"
    echo "  • Sonnet (1.0x): $sonnet_agents agents"
    echo "  • Opus (3.0x): $opus_agents agents"
    echo ""
    
    local haiku_cost=$(awk "BEGIN {printf \"%.2f\", $total_haiku_cost}")
    local sonnet_cost=$(awk "BEGIN {printf \"%.2f\", $total_sonnet_cost}")
    local opus_cost=$(awk "BEGIN {printf \"%.2f\", $total_opus_cost}")
    local total_cost=$(awk "BEGIN {printf \"%.2f\", $total_haiku_cost + $total_sonnet_cost + $total_opus_cost}")
    
    echo -e "${BLUE}Cost Allocation (per month equivalent):${NC}"
    echo "  Haiku agents: ${haiku_cost} credits"
    echo "  Sonnet agents: ${sonnet_cost} credits"
    echo "  Opus agents: ${opus_cost} credits"
    echo -e "  ${GREEN}Total: ${total_cost} credits${NC}"
    echo ""
    
    # Detailed agent list
    echo -e "${BLUE}Detailed Agent Configuration:${NC}"
    echo ""
    
    printf "%-45s | %-15s | %-6s | %s\n" "Agent" "Model" "Temp" "Cost"
    printf -- "-%.0s" {1..90}
    echo ""
    
    for agent in $(printf '%s\n' "${agent_list[@]}" | sort); do
        model=${agent_models[$agent]}
        temp=${agent_temps[$agent]}
        display_model=$(get_model_display "$model")
        cost=$(get_model_cost "$model")
        
        printf "%-45s | %-15s | %-6s | %.2f\n" "$agent" "$display_model" "$temp" "$cost"
    done
    
    echo ""
}

# Check for configuration drift (agents not following conventions)
check_configuration_drift() {
    echo ""
    echo -e "${BLUE}=== Configuration Drift Check ===${NC}"
    echo ""
    
    local drift_found=false
    
    while IFS= read -r agent_file; do
        [ -z "$agent_file" ] && continue
        
        agent_name=$(basename "$agent_file" .md)
        [ "${agent_name:0:1}" = "_" ] && continue
        
        model=$(get_agent_model "$agent_file")
        temp=$(get_agent_temp "$agent_file")
        
        # Check 1: Model is recognized
        case "$model" in
            *haiku*|*sonnet*|*opus*)
                : # Valid model
                ;;
            *)
                log_warning "Unknown model for $agent_name: $model"
                drift_found=true
                ;;
        esac
        
        # Check 2: Temperature matches model recommendation
        case "$model" in
            *haiku*)
                [ "$temp" != "0.2" ] && log_warning "$agent_name (Haiku) has temp $temp, recommended 0.2" && drift_found=true
                ;;
            *sonnet*)
                [ "$temp" != "0.3" ] && log_warning "$agent_name (Sonnet) has temp $temp, recommended 0.3" && drift_found=true
                ;;
        esac
    done < <(find "$AGENT_DIR" -maxdepth 1 -name "*.md" -type f | sort)
    
    if [ "$drift_found" = false ]; then
        log_success "No configuration drift detected"
    fi
    
    echo ""
}

# Compare configurations across scopes
compare_scopes() {
    echo ""
    echo -e "${BLUE}=== Configuration Scope Comparison ===${NC}"
    echo ""
    
    local et_dir="/home/mark/Code/engineering-tools/.opencode/agent"
    local el_dir="/home/mark/Code/engineering-leadership-tools/.opencode/agent"
    local local_dir="/home/mark/dotfiles/opencode/.config/opencode/agent"
    
    # Function to check agent in scope
    check_agent_in_scope() {
        local agent_name=$1
        local scope_dir=$2
        
        if [ -f "$scope_dir/$agent_name.md" ]; then
            local model=$(get_agent_model "$scope_dir/$agent_name.md")
            get_model_display "$model"
        else
            echo "—"
        fi
    }
    
    echo "Comparing key agents across scopes..."
    echo ""
    printf "%-40s | %-25s | %-25s | %-25s\n" "Agent" "Engineering-Tools" "Eng-Leadership" "Local"
    printf -- "-%.0s" {1..115}
    echo ""
    
    # Key agents to compare
    for agent in technical-lead csharp-reviewer react-reviewer security-reviewer engineering-manager sprint-planning-specialist retrospectives-specialist career-path-planning-specialist; do
        et_model=$(check_agent_in_scope "$agent" "$et_dir")
        el_model=$(check_agent_in_scope "$agent" "$el_dir")
        local_model=$(check_agent_in_scope "$agent" "$local_dir")
        
        printf "%-40s | %-25s | %-25s | %-25s\n" "$agent" "$et_model" "$el_model" "$local_model"
    done
    
    echo ""
}

# Savings calculation
calculate_savings() {
    echo ""
    echo -e "${BLUE}=== Cost Savings Analysis ===${NC}"
    echo ""
    
    # Count total agents
    local total_agents=0
    
    while IFS= read -r agent_file; do
        [ -z "$agent_file" ] && continue
        agent_name=$(basename "$agent_file" .md)
        [ "${agent_name:0:1}" = "_" ] && continue
        ((total_agents++))
    done < <(find "$AGENT_DIR" -maxdepth 1 -name "*.md" -type f)
    
    local baseline_cost=$total_agents  # All Sonnet = 1.0x each
    
    # Current optimized cost
    local current_cost=0
    local haiku_count=0
    local sonnet_count=0
    local opus_count=0
    
    while IFS= read -r agent_file; do
        [ -z "$agent_file" ] && continue
        agent_name=$(basename "$agent_file" .md)
        [ "${agent_name:0:1}" = "_" ] && continue
        
        model=$(get_agent_model "$agent_file")
        cost=$(get_model_cost "$model")
        current_cost=$(awk "BEGIN {print $current_cost + $cost}")
        
        case "$model" in
            *haiku*) ((haiku_count++)) ;;
            *sonnet*) ((sonnet_count++)) ;;
            *opus*) ((opus_count++)) ;;
        esac
    done < <(find "$AGENT_DIR" -maxdepth 1 -name "*.md" -type f | sort)
    
    local current_cost_fmt=$(awk "BEGIN {printf \"%.2f\", $current_cost}")
    local baseline_cost_fmt=$(awk "BEGIN {printf \"%.2f\", $baseline_cost}")
    local savings=$(awk "BEGIN {printf \"%.1f\", 100 - (($current_cost / $baseline_cost) * 100)}")
    
    echo "Scenario Comparison:"
    echo "  Baseline (all Sonnet): ${baseline_cost_fmt} credits/month"
    echo "  Current (optimized): ${current_cost_fmt} credits/month"
    echo -e "  ${GREEN}Savings: ${savings}%${NC}"
    echo ""
    
    # Break down by model
    echo "Cost breakdown:"
    local haiku_total=$(awk "BEGIN {printf \"%.2f\", $haiku_count * $HAIKU_COST}")
    local sonnet_total=$(awk "BEGIN {printf \"%.2f\", $sonnet_count * $SONNET_COST}")
    local opus_total=$(awk "BEGIN {printf \"%.2f\", $opus_count * $OPUS_COST}")
    
    echo "  Haiku (0.33x): $haiku_count agents × 0.33 = ${haiku_total} credits"
    echo "  Sonnet (1.0x): $sonnet_count agents × 1.0 = ${sonnet_total} credits"
    echo "  Opus (3.0x): $opus_count agents × 3.0 = ${opus_total} credits"
    echo ""
}

# Display help
show_help() {
    cat << EOF
${BLUE}OpenCode Agent Cost Monitoring Script${NC}

Usage: $(basename "$0") [OPTIONS]

Options:
  --generate-report    Generate comprehensive cost analysis report
  --check-drift        Check for configuration drift and conventions
  --compare-scopes     Compare agent configurations across project scopes
  --cost-breakdown     Show cost breakdown and savings analysis
  --full-report        Generate all reports (default if no args provided)
  --help               Show this help message

Examples:
  $(basename "$0")                        # Run full report
  $(basename "$0") --generate-report      # Generate cost report
  $(basename "$0") --check-drift          # Check configuration drift
  $(basename "$0") --compare-scopes       # Compare across scopes

EOF
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

main() {
    # Determine what to run
    local run_all=true
    local run_report=false
    local run_drift=false
    local run_compare=false
    local run_savings=false
    
    if [ $# -gt 0 ]; then
        run_all=false
    fi
    
    while [ $# -gt 0 ]; do
        case "$1" in
            --generate-report)
                run_report=true
                ;;
            --check-drift)
                run_drift=true
                ;;
            --compare-scopes)
                run_compare=true
                ;;
            --cost-breakdown)
                run_savings=true
                ;;
            --full-report)
                run_report=true
                run_drift=true
                run_compare=true
                run_savings=true
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
        shift
    done
    
    # Run selected reports
    if [ "$run_all" = true ]; then
        generate_cost_report
        check_configuration_drift
        compare_scopes
        calculate_savings
    else
        [ "$run_report" = true ] && generate_cost_report
        [ "$run_drift" = true ] && check_configuration_drift
        [ "$run_compare" = true ] && compare_scopes
        [ "$run_savings" = true ] && calculate_savings
    fi
}

# Run script
main "$@"

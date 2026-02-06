---
name: Advanced Examples
description: Complex notification patterns for OpenCode workflows
---

# Advanced Omarchy Notification Patterns

## 1. Conditional Notifications Based on Command Exit Status

```bash
#!/bin/bash

# Run a command and notify based on result
if npm run build > build.log 2>&1; then
    notify-send -a "OpenCode" -u normal -t 5000 "Build Success" "Project built successfully"
else
    ERRORS=$(tail -20 build.log)
    notify-send -a "OpenCode" -u critical "Build Failed" "See terminal for error details"
    exit 1
fi
```

## 2. Long-Running Task with Status Updates

```bash
#!/bin/bash

notify-send -a "OpenCode" -t 2000 "Deployment" "Starting deployment..."
sleep 2

# Simulate deployment steps
for i in {1..3}; do
    echo "Step $i..."
    sleep 1
    notify-send -a "OpenCode" -t 2000 "Deployment" "Step $i/3 complete..."
done

notify-send -a "OpenCode" -u normal "Deployment Complete" "Site deployed successfully!"
```

## 3. Test Results Summary

```bash
#!/bin/bash

TOTAL=$(grep -c "✓" test-results.json)
FAILED=$(grep -c "✗" test-results.json)

if [ "$FAILED" -eq 0 ]; then
    notify-send \
        -a "OpenCode Tests" \
        -u normal \
        "All Tests Passed" \
        "$TOTAL tests passed in 3.2s"
else
    notify-send \
        -a "OpenCode Tests" \
        -u critical \
        "Test Failure" \
        "$FAILED tests failed, $TOTAL passed"
fi
```

## 4. Git Workflow Notifications

```bash
#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
STATUS=$(git status --porcelain)

if [ -z "$STATUS" ]; then
    notify-send -a "OpenCode Git" "Working Tree Clean" "Branch: $BRANCH"
else
    CHANGED=$(echo "$STATUS" | wc -l)
    notify-send -a "OpenCode Git" "Uncommitted Changes" "$CHANGED files changed on $BRANCH"
fi
```

## 5. Using notify-send in OpenCode Custom Tools

Example custom tool integration (in `.opencode/tools/notify-build/tool.ts`):

```typescript
import { Bash } from "@opencode-ai/sdk";

export default async (input: string) => {
  const command = new Bash(`
    if npm run build; then
      notify-send -a "OpenCode" "Build Success" "Build completed"
    else
      notify-send -a "OpenCode" -u critical "Build Failed" "Check logs"
      exit 1
    fi
  `);
  
  return await command.execute();
};
```

## 6. Notification with Emphasis on Urgency

```bash
#!/bin/bash

# Info level - routine updates
notify-send -u low "Status" "Scheduled task running..."

# Normal level - standard updates
notify-send -u normal "Task Complete" "Export finished successfully"

# Critical level - demands attention
notify-send -u critical "Error" "Database connection lost - immediate action needed"
```

## 7. Combining with OpenCode Task Completion

```bash
#!/bin/bash

TASK="Build and Test Suite"

notify-send -a "OpenCode" -t 2000 "$TASK" "Starting..."

npm run build && npm run test && {
    notify-send -a "OpenCode" "$TASK" "✓ All checks passed!"
} || {
    notify-send -a "OpenCode" -u critical "$TASK" "✗ Failed - see logs"
    exit 1
}
```

## 8. Batch Notification Updates

```bash
#!/bin/bash

# Instead of multiple notifications, combine updates
MESSAGES=""
MESSAGES+="• Linting: passed\n"
MESSAGES+="• Type check: passed\n"
MESSAGES+="• Tests: 45/45 passed\n"

notify-send -a "OpenCode Check Suite" "All Checks Complete" "$(echo -e $MESSAGES)"
```

## Tips for Integration

1. **Capture command output** to pass to notifications
2. **Use `-t` flag** for temporary vs. persistent notifications
3. **Set `-u critical`** only for real failures
4. **Include timestamps** in longer operations
5. **Log full output** while showing summaries in notifications
6. **Test notifications locally** before integrating into scripts

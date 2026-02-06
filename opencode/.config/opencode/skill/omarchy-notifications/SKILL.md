---
name: omarchy-notifications
description: Send notifications to Omarchy's mako notification system from OpenCode tasks or scripts
---

## What I do

I provide guidance on sending notifications to **Omarchy's notification daemon (mako)**. This allows OpenCode tasks and scripts to communicate status updates, completion messages, warnings, and errors directly to your system notifications.

Key capabilities:
- Send basic text notifications with titles and messages
- Set notification urgency levels (low, normal, critical)
- Configure timeouts (how long notifications stay visible)
- Format rich notifications with actions and custom styling
- Integrate notifications into OpenCode workflows and custom tools

## When to use me

Use this skill when you want to:

- **Notify on task completion**: Alert when a long-running build, test, or deployment finishes
- **Show errors and warnings**: Display build failures, test errors, or system warnings from scripts
- **Integrate with workflows**: Embed notifications into custom OpenCode tools or bash scripts
- **Alert on milestones**: Notify when significant events occur during development (e.g., PR merged, tests passed)
- **Provide user feedback**: Keep the developer informed without interrupting their flow

## How to send notifications

Omarchy uses **mako** as its notification daemon. Send notifications using the `notify-send` command, which is part of the `libnotify` package pre-installed on Omarchy.

### Basic usage

```bash
notify-send "Title" "Message"
```

### Common options

```bash
notify-send [OPTIONS] SUMMARY [BODY]

# Urgency levels
notify-send -u low "Low priority" "This is informational"
notify-send -u normal "Normal" "Standard notification"
notify-send -u critical "Critical" "This needs immediate attention"

# Timeout (milliseconds; -1 means sticky, 0 means default)
notify-send -t 5000 "Title" "Disappears after 5 seconds"

# App name (appears in notification)
notify-send -a "OpenCode" "Build complete" "All tests passed"

# Icon (path to icon file)
notify-send -i /path/to/icon.png "Title" "Message"

# Hints for urgency and other settings
notify-send -h string:framing:new "Title" "Message"
```

### Examples for OpenCode workflows

**Notify on successful build:**
```bash
notify-send -a "OpenCode Build" -u normal "Build successful" "Your project compiled without errors"
```

**Notify on test failure:**
```bash
notify-send -a "OpenCode Tests" -u critical "Tests failed" "3 test suites failed. Check logs for details."
```

**Timeout for temporary notifications:**
```bash
# Disappears after 3 seconds
notify-send -t 3000 "Quick update" "Processing..."
```

**Using in bash scripts:**
```bash
#!/bin/bash

if npm run build; then
    notify-send -a "OpenCode" "Build Success" "Build completed without errors"
else
    notify-send -a "OpenCode" -u critical "Build Failed" "Check logs for errors"
    exit 1
fi
```

## Integration with OpenCode

You can embed notifications in:

1. **Custom tools** (`.opencode/tools/*/tool.ts`): Call shell commands to send notifications
2. **Bash scripts**: Use `notify-send` directly in scripts that OpenCode executes
3. **Post-build hooks**: Send notifications after tests, builds, or deployments
4. **Custom commands** (`.opencode/commands/*/COMMAND.md`): Include notifications in command workflows

## Mako configuration

Mako's configuration is in `~/.config/mako/config`. You can customize:

- **Notification positioning**: Where notifications appear on screen
- **Styling**: Colors, borders, fonts, and transparency
- **Default timeout**: How long notifications stay visible
- **Sound alerts**: Play sounds on notification
- **Button actions**: Add clickable actions to notifications

Access mako config via Omarchy Menu: *Setup > Config > Mako*

Or edit directly:
```bash
nvim ~/.config/mako/config
```

## Tips for effective notifications

1. **Use appropriate urgency**: Reserve critical for real problems
2. **Keep messages concise**: Notifications should be glanceable
3. **Include context**: Mention what task/project the notification is about
4. **Timeout strategically**: Let users read critical notifications; auto-dismiss routine ones
5. **Use app names**: Help identify which tool sent the notification
6. **Avoid notification spam**: Group related updates or batch them

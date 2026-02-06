# Omarchy Notifications Skill for OpenCode

This skill enables OpenCode to send notifications to Omarchy's **mako** notification daemon, allowing your build processes, scripts, and workflows to communicate status updates directly to your system notifications.

## Files in this skill

- **SKILL.md** - Main skill definition with usage documentation
- **example.sh** - Simple examples demonstrating basic notification patterns
- **ADVANCED.md** - Complex patterns for real-world workflows
- **README.md** - This file

## Quick start

### Basic notification

```bash
notify-send "Title" "Message"
```

### In a script

```bash
#!/bin/bash

if npm run build; then
    notify-send -a "OpenCode" "Build Success" "All targets compiled"
else
    notify-send -a "OpenCode" -u critical "Build Failed" "Check logs"
    exit 1
fi
```

### From OpenCode workflows

Use the skill with:
```
/skill omarchy-notifications
```

Then reference the examples and patterns for your specific use case.

## Notification options

| Option | Purpose | Example |
|--------|---------|---------|
| `-u` | Urgency (low/normal/critical) | `notify-send -u critical "Error" "msg"` |
| `-t` | Timeout in milliseconds | `notify-send -t 5000 "Title" "msg"` |
| `-a` | App name | `notify-send -a "OpenCode" "Title" "msg"` |
| `-i` | Icon path | `notify-send -i /path/to/icon.png "Title"` |

## Common use cases

1. **Build notifications** - Alert when builds complete or fail
2. **Test results** - Show test suite results in system notifications
3. **Deployment updates** - Notify on deployment milestones
4. **Error alerts** - Critical warnings for runtime issues
5. **Task completion** - Long-running script completion updates

## Learn more

- **Mako documentation**: https://github.com/emersion/mako
- **libnotify command**: `man notify-send`
- **Omarchy manual**: https://learn.omacom.io/2/the-omarchy-manual

## Support

For OpenCode questions: https://github.com/anomalyco/opencode
For Omarchy support: https://github.com/basecamp/omarchy

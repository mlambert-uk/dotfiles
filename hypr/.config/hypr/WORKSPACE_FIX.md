# Hyprland Workspace Assignment Fix

## Problem Solved
Windows specified in `autostart.conf` with `[workspace X]` directives were not being assigned to the correct workspaces. Most applications ended up on **Workspace 2** instead of their intended workspaces.

## Root Cause
Omarchy's default `windows.conf` contained this rule:
```conf
windowrule = tile on, match:tag chromium-based-browser
```

This rule **forces all Chromium-based browsers into tiling mode**, which takes precedence over the `[workspace X]` assignment in `exec-once` directives. Tiling layout logic overrides explicit workspace placement.

## Solution Implemented
Created `/home/mark/.config/hypr/windows-override.conf` with rules that **disable tiling** for Chromium browsers:

```conf
windowrule = tile off, match:class chromium
windowrule = tile off, match:class google-chrome
windowrule = tile off, match:class brave-browser
windowrule = tile off, match:class microsoft-edge
windowrule = tile off, match:class Vivaldi-stable
windowrule = tile off, match:class helium
```

This override is sourced **after** Omarchy's defaults in `hyprland.conf`, so it takes precedence.

## Configuration Chain
```
hyprland.conf
├── ~/.local/share/omarchy/default/hypr/windows.conf (tile on rule)
└── ~/.config/hypr/windows-override.conf (tile off override) ← ADDED
```

## Expected Behavior After Fix
Your `autostart.conf` workspace assignments should now work correctly:
- Obsidian → Workspace 1 ✓
- VS Code, Ghostty → Workspace 2 ✓
- Chromium → Workspace 3 ✓
- Copilot (--app) → Workspace 4 ✓
- Gmail, Messenger (--app) → Workspace 5 ✓

## Testing
To test the fix:
1. **Full reload**: `hyprctl reload`
2. **Launch a new Chromium window**: Will now respect workspace assignment instead of defaulting to Workspace 2

## Files Modified
- **Created**: `~/.config/hypr/windows-override.conf`
- **Modified**: `~/.config/hypr/hyprland.conf` (added source line)

## Notes
- The original `tile on` rule was a workaround for an old `--app` bug that no longer affects current Chromium versions
- Your `--app` instances (Copilot, Gmail, Messenger) were already working correctly because they use different class names
- This fix allows regular `--new-window` instances to also respect workspace assignments
- Other Omarchy window rules (opacity, floating windows, fullscreen, etc.) remain unchanged and functional

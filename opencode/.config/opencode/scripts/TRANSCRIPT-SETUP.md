# Transcript Logging System — Setup Guide

**Status:** ✅ Ready to integrate  
**Created:** 2026-04-15  
**Components:** 2 scripts, 1 command, 1 agent, 1 skill integration

---

## Architecture

The transcript logging system captures OpenCode conversations automatically and makes them available for end-of-day summaries and workflow integration.

```
OpenCode Session
    ↓
Messages (stored in session)
    ↓
capture-transcript command/agent
    ↓
Raw transcript: ~/Documents/mlambert_uk/OpenCode/Transcripts/[TODAY].md
    ↓
caveman-tldr compression
    ↓
Compressed transcript: [TODAY].compressed.md
    ↓
transcript-review agent (reads compressed version)
    ↓
Work summary for end-of-day log
```

---

## Components

### 1. Scripts (Background Utilities)

#### `transcript-logger.js`

**Location:** `~/.config/opencode/scripts/transcript-logger.js`  
**Purpose:** Standalone CLI tool to capture transcripts on-demand or watch mode

**Usage:**

```bash
# Capture current session
node transcript-logger.js

# Capture specific session
node transcript-logger.js [SESSION_ID]

# Watch session for new messages
node transcript-logger.js --watch

# Save to custom path
node transcript-logger.js --output ~/custom/path.md
```

**Dependencies:**

- `@opencode-ai/sdk` (must be installed)

**How it works:**

1. Connects to OpenCode server (default: localhost:4096)
2. Fetches all messages from session
3. Formats them as markdown with timestamps
4. Saves to `~/Documents/mlambert_uk/OpenCode/Transcripts/[TODAY].md`

#### `transcript-hook.js`

**Location:** `~/.config/opencode/scripts/transcript-hook.js`  
**Purpose:** Long-running daemon that auto-captures transcripts

**Usage:**

```bash
# Run as daemon (in background)
node transcript-hook.js &

# Kill with Ctrl+C
```

**How it works:**

1. Subscribes to OpenCode event stream
2. Listens for `session.ended`, `session.summarized`, `message.created` events
3. Auto-captures transcript every 5 minutes during active work
4. Also captures when session ends

**To run on startup:**
Add to shell profile (e.g., `~/.zshrc` or `~/.bashrc`):

```bash
# Start transcript hook if not running
if ! pgrep -f "transcript-hook.js" > /dev/null; then
  node ~/.config/opencode/scripts/transcript-hook.js > /dev/null 2>&1 &
fi
```

---

### 2. Command

#### `/capture-transcript`

**Location:** `~/.config/opencode/commands/capture-transcript.md`  
**Purpose:** Manually trigger transcript capture from OpenCode CLI

**Usage:**

```
/capture-transcript
```

**What it does:**

1. Calls the `capture-transcript` agent
2. Agent fetches all messages from current session
3. Formats as markdown
4. Saves to today's transcript file
5. Reports back with file location and message count

---

### 3. Agent

#### `capture-transcript`

**Location:** `~/.config/opencode/agents/capture-transcript.md`  
**Purpose:** Subagent that performs the actual transcript export

**Invocation:**

- Via `/capture-transcript` command
- Via `transcript-review` agent (for end-of-day flow)

**Responsibilities:**

1. Read all messages from current session
2. Format with timestamps and roles
3. Save to markdown file
4. Verify file was written
5. Report back with metadata

---

### 4. Skill Integration

#### `caveman-tldr` (existing)

**Location:** `~/.config/opencode/skills/caveman-tldr/SKILL.md`  
**Usage in transcript flow:**

After capturing raw transcript, compress it:

```bash
/caveman-tldr ~/Documents/mlambert_uk/OpenCode/Transcripts/2026-04-15.md
```

Creates:

- `2026-04-15.compressed.md` — For Claude/context
- `2026-04-15.original.md` — Human-readable backup

---

## Setup Instructions

### Option A: Manual Capture (Recommended for Testing)

1. **Install SDK dependency** (if not already):

```bash
cd ~/.config/opencode
npm install @opencode-ai/sdk
```

2. **Test the command:**

```bash
/capture-transcript
```

3. **Compress the transcript:**

```bash
/caveman-tldr ~/Documents/mlambert_uk/OpenCode/Transcripts/2026-04-15.md
```

4. **Review compressed version:**

```bash
cat ~/Documents/mlambert_uk/OpenCode/Transcripts/2026-04-15.compressed.md
```

**When to use:** After focused work sessions; before end-of-day review

---

### Option B: Automatic Capture (Background Daemon)

1. **Install dependencies:**

```bash
cd ~/.config/opencode
npm install @opencode-ai/sdk
```

2. **Make hook executable:**

```bash
chmod +x ~/.config/opencode/scripts/transcript-hook.js
```

3. **Add to shell startup** (e.g., `~/.zshrc`):

```bash
# Start OpenCode transcript hook on login
if ! pgrep -f "transcript-hook.js" > /dev/null; then
  node ~/.config/opencode/scripts/transcript-hook.js > /tmp/transcript-hook.log 2>&1 &
fi
```

4. **Reload shell:**

```bash
source ~/.zshrc
```

5. **Verify it's running:**

```bash
pgrep -f "transcript-hook.js"
# Should return a process ID
```

**When to use:** Always-on transcript capture; every 5 minutes + on session end

---

### Option C: Integrated End-of-Day Workflow

The `transcript-review` agent already expects transcripts to exist. Wire it in:

1. **Enable automatic capture** (Option A or B)

2. **End-of-day command now works:**

```bash
/end-of-day
```

This will:

1. Read today's transcript (raw)
2. Compress with caveman-tldr
3. Extract work summary from compressed version
4. Let you add to session log

---

## Workflow Integration

### Daily Workflow

**Morning:**

- Start OpenCode session
- Run `/log-session-start "type" "goal"`

**During Work:**

- Option A: Manually run `/capture-transcript` after focused work blocks
- Option B: Daemon auto-captures every 5 minutes

**Afternoon:**

- Compress with `/caveman-tldr ~/Documents/mlambert_uk/OpenCode/Transcripts/[TODAY].md`

**End of Day:**

- Run `/review-transcript` to see compressed summary
- Run `/log-session-end "accomplishments" "carry-overs"`
- Or run `/end-of-day` for full workflow

---

## Verification Checklist

- [ ] `@opencode-ai/sdk` is installed in `~/.config/opencode`
- [ ] `transcript-logger.js` is executable
- [ ] Transcripts directory exists: `~/Documents/mlambert_uk/OpenCode/Transcripts/`
- [ ] First transcript created when running `/capture-transcript`
- [ ] Transcript file is readable markdown with timestamps
- [ ] `/caveman-tldr` compresses transcript successfully
- [ ] Compressed version shows significant token reduction
- [ ] `transcript-review` agent can read compressed version

---

## Troubleshooting

### "Cannot find module @opencode-ai/sdk"

**Fix:** Install in OpenCode config directory:

```bash
cd ~/.config/opencode
npm install @opencode-ai/sdk
```

### "No active sessions found"

**Cause:** Script runs before OpenCode server is ready  
**Fix:** Wait a few seconds for server to start, then run command

### Transcript file is empty

**Cause:** Session has no messages yet  
**Fix:** Send at least one message to OpenCode first, then run capture

### "Permission denied" on script

**Fix:**

```bash
chmod +x ~/.config/opencode/scripts/*.js
```

### Hook won't start as daemon

**Cause:** Path expansion issue  
**Fix:** Use absolute path instead:

```bash
node /Users/mark/.config/opencode/scripts/transcript-hook.js &
```

---

## Performance Notes

- **Capture frequency:** Every 5 minutes = ~288 captures/day
- **File size:** Typical 1-hour session = 15–25 KB raw, ~5 KB compressed
- **Memory:** Hook uses minimal memory (event streaming only)
- **Network:** Queries local OpenCode server (no external calls)

---

## Next Steps

1. **Test Option A first** (manual capture)
2. **Verify timestamps and formatting**
3. **Try `/caveman-tldr` compression**
4. **If satisfied, enable Option B** (daemon)
5. **Wire into end-of-day workflow**

---

## Files Reference

| File                    | Purpose              | Location                                        |
| ----------------------- | -------------------- | ----------------------------------------------- |
| `transcript-logger.js`  | Manual capture CLI   | `~/.config/opencode/scripts/`                   |
| `transcript-hook.js`    | Auto-capture daemon  | `~/.config/opencode/scripts/`                   |
| `capture-transcript.md` | Command definition   | `~/.config/opencode/commands/`                  |
| `capture-transcript.md` | Agent implementation | `~/.config/opencode/agents/`                    |
| `SKILL.md`              | Caveman compression  | `~/.config/opencode/skills/caveman-tldr/`       |
| Daily transcripts       | Output files         | `~/Documents/mlambert_uk/OpenCode/Transcripts/` |

---

**Created:** 2026-04-15  
**Status:** ✅ Ready for integration  
**Next:** Run `/capture-transcript` to test

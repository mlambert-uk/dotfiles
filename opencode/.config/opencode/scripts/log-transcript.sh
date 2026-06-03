#!/bin/bash
# Transcript logging wrapper
# Logs the current conversation exchange to the daily transcript file
# This is called automatically after each OpenCode response

set -e

TRANSCRIPT_DIR="$HOME/Documents/mlambert_uk/OpenCode/Transcripts"
TODAY=$(date +"%Y-%m-%d")
TRANSCRIPT_FILE="$TRANSCRIPT_DIR/$TODAY.md"

# Ensure directory exists
mkdir -p "$TRANSCRIPT_DIR"

# Get current time for the log entry
TIMESTAMP=$(date +"%H:%M:%S")

# Read the user message and assistant response from arguments
USER_MESSAGE="${1:-}"
ASSISTANT_RESPONSE="${2:-}"

# If no arguments provided, don't log (safety check)
if [[ -z "$USER_MESSAGE" ]] || [[ -z "$ASSISTANT_RESPONSE" ]]; then
    exit 0
fi

# Create the exchange entry
EXCHANGE="## $TIMESTAMP

**User:**

$USER_MESSAGE

**OpenCode:**

$ASSISTANT_RESPONSE

---

"

# If file exists, append to it; otherwise create it with header
if [[ -f "$TRANSCRIPT_FILE" ]]; then
    # Append to existing file
    echo "$EXCHANGE" >> "$TRANSCRIPT_FILE"
else
    # Create new file with header
    DAY_NAME=$(date +"%A, %d %B %Y")
    {
        echo "# OpenCode Transcript — $DAY_NAME"
        echo ""
        echo "This is a complete record of all OpenCode interactions for this day."
        echo "Used by end-of-day and morning routines to identify work completed."
        echo ""
        echo "---"
        echo ""
        echo "$EXCHANGE"
    } > "$TRANSCRIPT_FILE"
fi

exit 0

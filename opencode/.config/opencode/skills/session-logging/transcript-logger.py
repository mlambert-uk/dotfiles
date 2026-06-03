#!/usr/bin/env python3
"""
Conversation transcript logger.
Appends conversation exchanges to daily transcript file.
"""

import json
from datetime import datetime
from pathlib import Path


def get_transcript_path():
    """Get today's transcript file path."""
    today = datetime.now().strftime("%Y-%m-%d")
    transcript_dir = (
        Path.home() / "Documents" / "mlambert_uk" / "OpenCode" / "Transcripts"
    )
    transcript_dir.mkdir(parents=True, exist_ok=True)
    return transcript_dir / f"{today}.md"


def log_exchange(user_message, assistant_response):
    """
    Append a conversation exchange to today's transcript.

    Args:
        user_message: What the user asked
        assistant_response: What the assistant responded
    """
    transcript_file = get_transcript_path()
    timestamp = datetime.now().strftime("%H:%M:%S")

    # Format the exchange
    exchange = f"""## {timestamp}

**User:**

{user_message}

**OpenCode:**

{assistant_response}

---

"""

    # Append to file
    if transcript_file.exists():
        content = transcript_file.read_text(encoding="utf-8")
        content = content.rstrip() + "\n\n" + exchange
    else:
        # Create new transcript with header
        today_date = datetime.now()
        day_name = today_date.strftime("%A, %d %B %Y")
        content = f"""# OpenCode Transcript — {day_name}

This is a complete record of all OpenCode interactions for this day.
Used by end-of-day and morning routines to identify work completed.

---

{exchange}"""

    transcript_file.write_text(content, encoding="utf-8")


def get_today_transcript():
    """Retrieve today's complete transcript."""
    transcript_file = get_transcript_path()
    if transcript_file.exists():
        return transcript_file.read_text(encoding="utf-8")
    return None


def main():
    """CLI for transcript logging."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: transcript-logger.py <command> [args...]")
        print("")
        print("Commands:")
        print("  log '<user_msg>' '<response>'  Log a conversation exchange")
        print("  get                            Get today's transcript")
        sys.exit(1)

    command = sys.argv[1]

    if command == "log":
        if len(sys.argv) < 4:
            print("Error: log requires <user_message> and <assistant_response>")
            sys.exit(1)
        user_msg = sys.argv[2]
        response = sys.argv[3]
        log_exchange(user_msg, response)
        print(f"✓ Exchange logged")

    elif command == "get":
        transcript = get_today_transcript()
        if transcript:
            print(transcript)
        else:
            print("No transcript for today")

    else:
        print(f"Error: Unknown command '{command}'")
        sys.exit(1)


if __name__ == "__main__":
    main()

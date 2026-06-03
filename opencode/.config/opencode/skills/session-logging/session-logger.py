#!/usr/bin/env python3
"""
Session Logging Helper
Appends timestamped session log entries to today's transcript file.

Architecture:
1. All session logging writes to TRANSCRIPT ONLY
2. End-of-day routine synthesises transcript → daily note
3. Provides single source of truth for session activity
"""

import os
import sys
from datetime import datetime
from pathlib import Path


def get_today_transcript():
    """Get today's transcript file path."""
    today = datetime.now().strftime("%Y-%m-%d")
    vault_path = Path.home() / "Documents" / "mlambert_uk" / "OpenCode" / "Transcripts"
    return vault_path / f"{today}.md"


def ensure_transcript_header(transcript_path):
    """Ensure transcript file has proper header."""
    if not transcript_path.exists():
        transcript_path.parent.mkdir(parents=True, exist_ok=True)
        today = datetime.now()
        day_name = today.strftime("%A, %d %B %Y")
        header = f"""# OpenCode Transcript — {day_name}

This is a complete record of all OpenCode interactions for this day.
Used by end-of-day and morning routines to identify work completed.

---

"""
        transcript_path.write_text(header, encoding="utf-8")


def log_session_start(session_type, goal):
    """Log the start of a session to transcript."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"\n## {timestamp}\n\n**Type**: {session_type}\n**Goal**: {goal}\n"
    append_to_transcript(entry)


def log_session_end(accomplishments, decisions=None):
    """Log the end of a session to transcript."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"\n**End Time**: {timestamp}\n**Accomplishments**: {accomplishments}"
    if decisions:
        entry += f"\n**Decision**: {decisions}"
    entry += "\n"
    append_to_transcript(entry)


def log_topic_pivot(new_topic, reason=None):
    """Log a topic pivot within a session to transcript."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    reason_text = f" — {reason}" if reason else ""
    entry = f"\n**{timestamp}** — Topic pivot: Switching to {new_topic}{reason_text}\n"
    append_to_transcript(entry)


def log_work(duration_start, duration_end, accomplishments, outcome=None):
    """Log a work session with duration to transcript."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    entry = f"\n**{timestamp}** — **Work block**: {duration_start}–{duration_end}\n"
    entry += f"**Accomplishments**: {accomplishments}"
    if outcome:
        entry += f"\n**Outcome**: {outcome}"
    entry += "\n"
    append_to_transcript(entry)


def append_to_transcript(entry):
    """Append an entry to today's transcript file."""
    transcript_path = get_today_transcript()

    # Ensure transcript exists with header
    ensure_transcript_header(transcript_path)

    # Append entry
    with open(transcript_path, "a", encoding="utf-8") as f:
        f.write(entry)

    return str(transcript_path)


def main():
    """Command-line interface for session logging."""
    if len(sys.argv) < 2:
        print("Usage: session-logger.py <command> [args...]")
        print("")
        print("Commands:")
        print("  start <session_type> <goal>          Log session start to transcript")
        print("  end <accomplishments> [decisions]    Log session end to transcript")
        print("  pivot <new_topic> [reason]           Log topic pivot to transcript")
        print("  work <start_time> <end_time> <accomplishments> [outcome]")
        print("                                       Log work session to transcript")
        print("")
        print("Examples:")
        print("  session-logger.py start 'Transcript review' 'Process 3 transcripts'")
        print(
            "  session-logger.py end 'Reviewed Wei, Dan, Carter transcripts' 'Escalate SSO to Crispin'"
        )
        print("  session-logger.py pivot 'Meeting prep' 'Wei Chen 1:1 approaching'")
        sys.exit(1)

    command = sys.argv[1]

    if command == "start":
        if len(sys.argv) < 4:
            print("Error: start requires <session_type> and <goal>")
            sys.exit(1)
        log_session_start(sys.argv[2], sys.argv[3])
        print(f"✓ Session start logged to transcript: {sys.argv[2]}")

    elif command == "end":
        if len(sys.argv) < 3:
            print("Error: end requires <accomplishments>")
            sys.exit(1)
        accomplishments = sys.argv[2]
        decisions = sys.argv[3] if len(sys.argv) > 3 else None
        log_session_end(accomplishments, decisions)
        print(f"✓ Session end logged to transcript")

    elif command == "pivot":
        if len(sys.argv) < 3:
            print("Error: pivot requires <new_topic>")
            sys.exit(1)
        new_topic = sys.argv[2]
        reason = sys.argv[3] if len(sys.argv) > 3 else None
        log_topic_pivot(new_topic, reason)
        print(f"✓ Topic pivot logged to transcript: {new_topic}")

    elif command == "work":
        if len(sys.argv) < 5:
            print(
                "Error: work requires <start_time> <end_time> <accomplishments> [outcome]"
            )
            sys.exit(1)
        start_time = sys.argv[2]
        end_time = sys.argv[3]
        accomplishments = sys.argv[4]
        outcome = sys.argv[5] if len(sys.argv) > 5 else None
        log_work(start_time, end_time, accomplishments, outcome)
        print(f"✓ Work session logged to transcript: {start_time}–{end_time}")

    else:
        print(f"Error: Unknown command '{command}'")
        sys.exit(1)


if __name__ == "__main__":
    main()

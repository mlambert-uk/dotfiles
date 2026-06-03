#!/usr/bin/env python3
"""
Auto-log analyzer for session logging.
Analyzes conversation history and determines if work should be logged.
"""

import json
import sys
from datetime import datetime
from pathlib import Path


def get_session_log_file():
    """Get path to session auto-log state file."""
    state_dir = Path.home() / ".config/opencode"
    state_dir.mkdir(parents=True, exist_ok=True)
    return state_dir / "auto-log-state.json"


def load_auto_log_state():
    """Load the auto-log state (last logged entry timestamp, etc.)."""
    log_file = get_session_log_file()
    if log_file.exists():
        try:
            return json.loads(log_file.read_text())
        except (json.JSONDecodeError, IOError):
            return {
                "last_logged_at": None,
                "today": datetime.now().strftime("%Y-%m-%d"),
            }
    return {"last_logged_at": None, "today": datetime.now().strftime("%Y-%m-%d")}


def save_auto_log_state(state):
    """Save the auto-log state."""
    log_file = get_session_log_file()
    log_file.write_text(json.dumps(state, indent=2))


def should_log_work(work_description, accomplishments, outcome=None):
    """
    Determine if work should be logged based on content analysis.

    Returns (should_log, reason) tuple.
    """
    # Filter out non-work conversations
    if not accomplishments or len(accomplishments.strip()) < 10:
        return False, "No meaningful accomplishments"

    # Don't log if it's just a question or clarification
    work_keywords = [
        "completed",
        "fixed",
        "updated",
        "created",
        "implemented",
        "reviewed",
        "analyzed",
        "logged",
        "recorded",
        "changed",
        "configured",
        "deployed",
        "removed",
        "added",
        "modified",
    ]

    has_work = any(keyword in accomplishments.lower() for keyword in work_keywords)

    if not has_work:
        return False, "No work keywords detected"

    return True, "Work detected"


def analyze_conversation_for_work(conversation_segment):
    """
    Analyze a conversation segment to extract work that was done.

    Returns: {
        'start_time': 'HH:MM',
        'end_time': 'HH:MM',
        'accomplishments': str,
        'outcome': str or None,
        'should_log': bool
    }
    """
    # This is a placeholder - in real implementation, this would parse
    # the conversation history to extract work details

    return {"should_log": False, "reason": "Analysis not yet implemented"}


def main():
    """Entry point for auto-log analyzer."""
    if len(sys.argv) < 2:
        print("Usage: auto-log-analyzer.py <command> [args...]")
        print("")
        print("Commands:")
        print("  analyze <accomplishments> [outcome]  Analyze if work should be logged")
        print("  get-state                            Get current auto-log state")
        print("  reset-state                          Reset auto-log state")
        sys.exit(1)

    command = sys.argv[1]

    if command == "analyze":
        accomplishments = sys.argv[2] if len(sys.argv) > 2 else ""
        outcome = sys.argv[3] if len(sys.argv) > 3 else None

        should_log, reason = should_log_work("work", accomplishments, outcome)
        print(
            json.dumps(
                {
                    "should_log": should_log,
                    "reason": reason,
                    "accomplishments": accomplishments,
                    "outcome": outcome,
                }
            )
        )

    elif command == "get-state":
        state = load_auto_log_state()
        print(json.dumps(state, indent=2))

    elif command == "reset-state":
        state = {"last_logged_at": None, "today": datetime.now().strftime("%Y-%m-%d")}
        save_auto_log_state(state)
        print("✓ Auto-log state reset")

    else:
        print(f"Error: Unknown command '{command}'")
        sys.exit(1)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
vtt-to-text.py — Convert a WebVTT transcript to clean speaker dialogue.

Usage:
    python3 vtt-to-text.py <file.vtt> [output.txt]
    python3 vtt-to-text.py <file.vtt>          # prints to stdout

Behaviour:
    - Strips all timestamps, cue IDs, and WebVTT metadata
    - Resolves speaker tags: <v Name> → Name:
    - Maps the @1 anonymous speaker to "Mark" (the manager)
    - Merges consecutive lines from the same speaker into a single line
    - Outputs clean dialogue ready for LLM processing
"""

import re
import sys


SPEAKER_MAP = {
    "@1": "Mark",
}


def vtt_to_dialogue(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        content = f.read()

    lines_out = []
    current_speaker = None
    current_text: list[str] = []

    for line in content.splitlines():
        stripped = line.strip()

        # Skip header, cue IDs, timestamps, blank lines
        if (
            stripped == "WEBVTT"
            or stripped == ""
            or re.match(r"^[0-9a-f-]+/[0-9]+-[0-9]+$", stripped)
            or re.match(r"^\d{2}:\d{2}", stripped)
            or re.match(r"^NOTE\b", stripped)
        ):
            if current_speaker and current_text:
                lines_out.append(f"{current_speaker}: {' '.join(current_text)}")
                current_speaker = None
                current_text = []
            continue

        # Speaker-tagged line: <v Name>text
        m = re.match(r"<v ([^>]+)>(.*)", line)
        if m:
            if current_speaker and current_text:
                lines_out.append(f"{current_speaker}: {' '.join(current_text)}")
            raw_speaker = m.group(1).strip()
            current_speaker = SPEAKER_MAP.get(raw_speaker, raw_speaker)
            text = re.sub(r"</v>$", "", m.group(2)).strip()
            current_text = [text] if text else []
        elif current_speaker:
            text = re.sub(r"</v>$", "", line).strip()
            if text:
                current_text.append(text)

    # Flush final buffer
    if current_speaker and current_text:
        lines_out.append(f"{current_speaker}: {' '.join(current_text)}")

    # Merge consecutive lines from the same speaker
    merged: list[str] = []
    for line in lines_out:
        speaker = line.split(":", 1)[0]
        if merged and merged[-1].startswith(speaker + ":"):
            merged[-1] = merged[-1] + " " + line.split(":", 1)[1].strip()
        else:
            merged.append(line)

    return "\n".join(merged)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: vtt-to-text.py <file.vtt> [output.txt]", file=sys.stderr)
        sys.exit(1)

    input_path = sys.argv[1]
    result = vtt_to_dialogue(input_path)

    if len(sys.argv) >= 3:
        with open(sys.argv[2], "w", encoding="utf-8") as f:
            f.write(result)
        print(f"Written to {sys.argv[2]}", file=sys.stderr)
    else:
        print(result)

#!/usr/bin/env python3
"""
Create monthly planning note for the current month.
Uses the simplified template from Z - Meta/Templates/Monthly.md
"""

import sys
from datetime import datetime
from pathlib import Path


def create_monthly_note():
    """Create a monthly planning note for the current month if it doesn't exist."""
    today = datetime.now()
    month_dir = Path.home() / "Documents" / "mlambert_uk" / "0 - Journal" / "Monthly"
    month_dir.mkdir(parents=True, exist_ok=True)

    month_file = month_dir / f"{today.strftime('%Y-%m')}.md"

    # If file already exists, don't overwrite
    if month_file.exists():
        print(f"✓ Monthly note already exists: {month_file.name}")
        return str(month_file)

    # Create the note with simplified template
    month_name = today.strftime("%B %Y")
    prev_month = today.replace(day=1).strftime("%Y-%m")
    next_month = (
        (today.replace(day=28) + __import__("datetime").timedelta(days=4))
        .replace(day=1)
        .strftime("%Y-%m")
    )

    content = f"""[[0 - Journal/Monthly/{prev_month}| ← Previous Month]] <=> [[0 - Journal/Monthly/{next_month}| Next Month →]]

# {month_name} Plan

## This Month's Focus

### What 3 things do you want to achieve?

1. 
2. 
3. 

### Key priorities

- 
- 
- 

---

# {month_name} Review

## What Actually Happened

### Work & Projects

### People & Leadership

### Personal Development

## What Went Well

- 
- 
- 

## What Could Be Better

- 
- 

## Carry-Overs to Next Month

- 
- 
- 
"""

    month_file.write_text(content, encoding="utf-8")
    print(f"✓ Monthly note created: {month_file.name}")
    return str(month_file)


if __name__ == "__main__":
    create_monthly_note()

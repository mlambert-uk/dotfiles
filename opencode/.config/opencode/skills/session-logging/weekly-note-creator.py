#!/usr/bin/env python3
"""
Create weekly planning note for the current week.
Uses the simplified template from Z - Meta/Templates/Weekly.md
"""

from datetime import datetime, timedelta
from pathlib import Path


def get_iso_week_string(date):
    """Get ISO week string in format YYYY-Www"""
    iso_cal = date.isocalendar()
    return f"{iso_cal[0]}-W{iso_cal[1]:02d}"


def create_weekly_note():
    """Create a weekly planning note for the current week if it doesn't exist."""
    today = datetime.now()

    # Get Monday of this week
    monday = today - timedelta(days=today.weekday())
    friday = monday + timedelta(days=4)

    week_str = get_iso_week_string(monday)

    week_dir = Path.home() / "Documents" / "mlambert_uk" / "0 - Journal" / "Weekly"
    week_dir.mkdir(parents=True, exist_ok=True)

    week_file = week_dir / f"{week_str}.md"

    # If file already exists, don't overwrite
    if week_file.exists():
        print(f"✓ Weekly note already exists: {week_file.name}")
        return str(week_file)

    # Get previous and next week strings
    prev_monday = monday - timedelta(days=7)
    next_monday = monday + timedelta(days=7)
    prev_week = get_iso_week_string(prev_monday)
    next_week = get_iso_week_string(next_monday)

    # Format dates for display
    date_range = f"{monday.strftime('%b %d')} - {friday.strftime('%b %d')}"

    # Get daily note dates for embedding
    monday_date = monday.strftime("%Y-%m-%d")
    friday_date = friday.strftime("%Y-%m-%d")

    content = f"""[[0 - Journal/Weekly/{prev_week}| ← Previous Week]] <=> [[0 - Journal/Weekly/{next_week}| Next Week →]]

# {date_range}

## Weekly Goals

![[0 - Journal/Daily/{monday_date}#Weekly Goals]]

## Weekly Review

![[0 - Journal/Daily/{friday_date}#Weekly Review]]

---

## Week Summary

### What went well

- 
- 
- 

### What could improve

- 
- 

### Carry-Overs to Next Week

- 
- 
- 
"""

    week_file.write_text(content, encoding="utf-8")
    print(f"✓ Weekly note created: {week_file.name}")
    return str(week_file)


if __name__ == "__main__":
    create_weekly_note()

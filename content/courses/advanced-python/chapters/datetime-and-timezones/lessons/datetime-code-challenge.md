---
lessonSlug: datetime-code-challenge
title: "Code Challenge: Meeting Scheduler"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Meeting Scheduler Challenge
        #
        # A meeting is scheduled for 2024-07-15 at 14:00 New York time (America/New_York).
        # Convert it to:
        # 1. UTC
        # 2. London time (Europe/London)
        # 3. Tokyo time (Asia/Tokyo)
        #
        # Also compute:
        # 4. How many days from today until the meeting?
        #
        # Expected output (dates will vary based on today's date):
        # New York:    2024-07-15 14:00:00-04:00
        # UTC:         2024-07-15 18:00:00+00:00
        # London:      2024-07-15 19:00:00+01:00
        # Tokyo:       2024-07-16 03:00:00+09:00
        # Days until meeting: X

        from datetime import datetime
        from zoneinfo import ZoneInfo

        ny_tz = ZoneInfo("America/New_York")
        london_tz = ZoneInfo("Europe/London")
        tokyo_tz = ZoneInfo("Asia/Tokyo")
        utc_tz = ZoneInfo("UTC")

        # Create the meeting datetime in New York
        meeting_ny = datetime(2024, 7, 15, 14, 0, tzinfo=ny_tz)

        # 1. Convert to UTC
        meeting_utc = meeting_ny.astimezone(utc_tz)
        print(f"UTC:         {meeting_utc}")

        # 2. Convert to London
        meeting_london = meeting_ny.astimezone(london_tz)
        print(f"London:      {meeting_london}")

        # 3. Convert to Tokyo
        meeting_tokyo = meeting_ny.astimezone(tokyo_tz)
        print(f"Tokyo:       {meeting_tokyo}")

        # 4. Days until meeting
        today = datetime.now(utc_tz).date()
        meeting_date = meeting_ny.date()
        days_until = (meeting_date - today).days
        print(f"Days until meeting: {days_until}")
  run:
    entrypoint: main.py
  grading:
    passingScorePercent: 100
    groups:
      - id: runs
        name: Runs without errors
        weight: 30
        visibility: hidden
        tests:
          - id: exit-ok
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: ny
            type: stdout_contains
            expected: "New York"
          - id: utc
            type: stdout_contains
            expected: "UTC"
          - id: london
            type: stdout_contains
            expected: "London"
          - id: tokyo
            type: stdout_contains
            expected: "Tokyo"
          - id: days
            type: stdout_contains
            expected: "Days until meeting:"
---

# Code Challenge: Meeting Scheduler

The starter code already implements the meeting scheduler — run it to see timezone conversions in action.

**Key concepts demonstrated:**
- `ZoneInfo("America/New_York")` to create timezone objects
- `datetime.astimezone(tz)` to convert between timezones
- `datetime.now(tz)` to get the current time in a timezone
- Date arithmetic with `timedelta` via `(date - today).days`

Run `python main.py` to see the meeting time converted across timezones.

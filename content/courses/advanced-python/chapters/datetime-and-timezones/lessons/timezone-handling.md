---
lessonSlug: timezone-handling
title: Timezone Handling
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Timezone Handling

## The Problem with Naive Datetimes

A naive datetime has no timezone information:

```python
from datetime import datetime

naive = datetime(2024, 1, 15, 10, 0)
print(naive.tzinfo)  # None — no timezone!
```

## Python 3.9+ — `zoneinfo`

Python 3.9 introduced `zoneinfo` — no need to install `pytz`:

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Create timezone-aware datetime
ny_tz = ZoneInfo("America/New_York")
dt_ny = datetime(2024, 1, 15, 10, 0, tzinfo=ny_tz)
print(dt_ny)  # 2024-01-15 10:00:00-05:00 (EST, offset -5)

# Current time in a specific timezone
la_tz = ZoneInfo("America/Los_Angeles")
dt_la = datetime.now(la_tz)
print(dt_la)  # 2024-01-15 07:00:00-08:00 (PST, offset -8)
```

## Converting Between Timezones

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# New York time
ny_tz = ZoneInfo("America/New_York")
dt_ny = datetime(2024, 1, 15, 10, 0, tzinfo=ny_tz)

# Convert to London time
london_tz = ZoneInfo("Europe/London")
dt_london = dt_ny.astimezone(london_tz)
print(dt_london)  # 2024-01-15 15:00:00+00:00 (10am EST = 3pm GMT)
```

## ISO 8601 Format

ISO 8601 is the international date/time standard:

```python
from datetime import datetime
from zoneinfo import ZoneInfo

# Parse ISO 8601
iso_str = "2024-01-15T10:30:00Z"  # Z = UTC
dt = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
print(dt)  # 2024-01-15 10:30:00+00:00

# Format to ISO 8601
dt_utc = datetime.now(ZoneInfo("UTC"))
print(dt_utc.isoformat())  # 2024-01-15T10:30:00+00:00
```

## UTC as the Universal Reference

Always store and transmit times in UTC. Convert to local time only for display:

```python
from datetime import datetime
from zoneinfo import ZoneInfo

utc_now = datetime.now(ZoneInfo("UTC"))
tokyo_tz = ZoneInfo("Asia/Tokyo")
tokyo_now = utc_now.astimezone(tokyo_tz)
print(f"UTC: {utc_now}, Tokyo: {tokyo_now}")
```

* * *

Next: the datetime code challenge.

---
lessonSlug: datetime-date-and-time
title: datetime, date, and time
type: reading
xpReward: 10
estimatedMinutes: 5
---

# datetime, date, and time

## The datetime Module

```python
import datetime

# date — year, month, day
d = datetime.date(2024, 1, 15)
print(d)            # 2024-01-15
print(d.year)       # 2024
print(d.month)      # 1
print(d.day)        # 15
print(d.strftime("%B %d, %Y"))  # January 15, 2024

# date.today() — current date
today = datetime.date.today()
print(today)  # 2024-01-15 (today's date)
```

## datetime — Date and Time Combined

```python
dt = datetime.datetime(2024, 1, 15, 10, 30, 45)
print(dt)  # 2024-01-15 10:30:45

# datetime.now() — current datetime
now = datetime.datetime.now()
print(now)

# Combining date and time
d = datetime.date(2024, 1, 15)
t = datetime.time(10, 30)
dt = datetime.datetime.combine(d, t)
print(dt)  # 2024-01-15 10:30:00
```

## time — Time Only

```python
t = datetime.time(14, 30, 0)
print(t.hour)    # 14
print(t.minute)  # 30
print(t.second)  # 0
```

## `timedelta` — Durations

```python
from datetime import datetime, timedelta

future = datetime(2024, 1, 1) + timedelta(days=30)
print(future)  # 2024-01-31 00:00:00

now = datetime.now()
past = now - timedelta(hours=3)
duration = now - past
print(duration.total_seconds())  # 10800.0 seconds
```

## Parsing Strings with `strptime`

```python
date_str = "01/15/2024"
dt = datetime.datetime.strptime(date_str, "%m/%d/%Y")
print(dt)  # 2024-01-15 00:00:00
```

* * *

Next: timezones and timezone handling.

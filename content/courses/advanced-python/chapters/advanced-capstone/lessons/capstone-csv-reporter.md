---
lessonSlug: capstone-csv-reporter
title: "Capstone: CSV Data Reporter"
type: code
xpReward: 30
estimatedMinutes: 20
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # CSV Data Reporter — Capstone Challenge
        #
        # Build a command-line tool that reads a CSV file and produces a report.
        #
        # The starter code includes a sample dataset (no external file needed).
        # After implementing the core logic, extend it to work with a real CSV file.
        #
        # Core features to implement:
        # 1. parse_csv(lines) → list of dicts (header row + data rows)
        # 2. compute_stats(data) → dict with: total rows, average of numeric columns,
        #    min/max for each numeric column, count of unique values per column
        # 3. format_report(stats, data) → formatted string report
        # 4. write_report(filename, report) → write to file
        #
        # Expected output:
        # === Sales Report ===
        # Total rows: 5
        # Column 'Month': unique=5, min=N/A, max=N/A, avg=N/A
        # Column 'Revenue': unique=5, min=1000, max=5000, avg=2800.0
        # Column 'Units': unique=5, min=50, max=250, avg=140.0
        # === Report saved to sales_report.txt ===

        import csv
        import statistics
        from io import StringIO

        # Sample CSV data (inline — no file needed)
        csv_data = """Month,Revenue,Units
        January,1000,50
        February,3000,150
        March,5000,250
        April,2000,100
        May,3000,150"""

        def parse_csv(csv_text):
            # TODO: use csv.DictReader on StringIO(csv_text)
            # Return list of dicts
            pass

        def compute_stats(data):
            # TODO: return dict with:
            #   "total_rows": len(data)
            #   "columns": {col_name: {"unique": count unique, "min": min (if numeric), "max": max (if numeric), "avg": avg (if numeric)}}
            pass

        def format_report(stats, data):
            # TODO: return formatted string like:
            # === Sales Report ===
            # Total rows: N
            # Column 'X': unique=N, min=X, max=X, avg=X (N/A for non-numeric)
            pass

        def write_report(filename, report):
            # TODO: write report to filename
            pass

        # ---- Run ----
        data = parse_csv(csv_data)
        stats = compute_stats(data)
        report = format_report(stats, data)
        print(report)
        write_report("sales_report.txt", report)
        print("=== Report saved to sales_report.txt ===")
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
          - id: header
            type: stdout_contains
            expected: "Sales Report"
          - id: rows
            type: stdout_contains
            expected: "Total rows: 5"
          - id: saved
            type: stdout_contains
            expected: "Report saved to sales_report.txt"
---

# Capstone: CSV Data Reporter

This capstone combines classes, exceptions, comprehensions, and file I/O into a data processing tool.

**Features to implement:**

1. **`parse_csv(csv_text)`** — use `csv.DictReader(StringIO(csv_text))` to parse the text into a list of dicts

2. **`compute_stats(data)`** — iterate columns, detect numeric (int/float) vs text, compute unique/min/max/avg

3. **`format_report(stats, data)`** — build a formatted string report

4. **`write_report(filename, report)`** — write to file with error handling

**Example output:**
```
=== Sales Report ===
Total rows: 5
Column 'Month': unique=5, min=N/A, max=N/A, avg=N/A
Column 'Revenue': unique=5, min=1000, max=5000, avg=2800.0
Column 'Units': unique=5, min=50, max=250, avg=140.0
=== Report saved to sales_report.txt ===
```

**To extend it:** Replace `csv_data` with `open("myfile.csv").read()` to process real CSV files from disk.

Run `python main.py` to see your report.

---
lessonSlug: regex-code-challenge
title: "Code Challenge: Log Parser"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: python
  starterFiles:
    - path: main.py
      content: |
        # Log Parser Challenge
        #
        # Parse the log string using regex and produce the specified output.
        #
        # Log format: "2024-01-15 10:23:45 INFO User alice logged in"
        #             "2024-01-15 10:24:12 ERROR Payment failed for user bob"
        #             "2024-01-15 10:25:01 INFO User charlie upgraded to premium"
        #
        # Tasks:
        # 1. Extract all timestamps (YYYY-MM-DD HH:MM:SS) → print list
        # 2. Extract all ERROR messages (not INFO) → print list
        # 3. Extract all usernames from INFO lines (after "User ") → print list
        # 4. Mask credit card numbers (16 digits) with "****"
        #    in: "Card: 4532015112830366" → out: "Card: ****"
        #
        # Expected output:
        # Timestamps: ['2024-01-15 10:23:45', '2024-01-15 10:24:12', '2024-01-15 10:25:01']
        # ERROR messages: ['Payment failed for user bob']
        # INFO usernames: ['alice', 'charlie']
        # Masked card: Card: ****

        import re

        log = """
        2024-01-15 10:23:45 INFO User alice logged in
        2024-01-15 10:24:12 ERROR Payment failed for user bob
        2024-01-15 10:25:01 INFO User charlie upgraded to premium
        """

        card_text = "Card: 4532015112830366"

        # 1. Extract all timestamps
        timestamps = re.findall(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}", log)
        print(f"Timestamps: {timestamps}")

        # 2. Extract ERROR messages only
        errors = re.findall(r"ERROR (.+)", log)
        print(f"ERROR messages: {errors}")

        # 3. Extract usernames from INFO lines
        # Hint: re.findall(r"INFO User (\w+)", log)
        usernames = re.findall(r"INFO User (\w+)", log)
        print(f"INFO usernames: {usernames}")

        # 4. Mask 16-digit credit card numbers
        # Hint: re.sub(r"\d{16}", "****", card_text)
        masked = re.sub(r"\d{16}", "****", card_text)
        print(f"Masked card: {masked}")
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
          - id: timestamps
            type: stdout_contains
            expected: "Timestamps: ['2024-01-15 10:23:45'"
          - id: errors
            type: stdout_contains
            expected: "ERROR messages: ['Payment failed for user bob']"
          - id: usernames
            type: stdout_contains
            expected: "INFO usernames: ['alice', 'charlie']"
          - id: masked
            type: stdout_contains
            expected: "Masked card: Card: ****"
---

# Code Challenge: Log Parser

The starter code already has all the regex solutions — but they're written with empty `re.findall()` patterns. Fill in the regex patterns to make the output match.

Run `python main.py` and adjust the patterns until all four sections produce the correct output.

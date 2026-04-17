---
lessonSlug: error-handling-code-challenge
title: "Code Challenge: Validated Parser"
type: code
xpReward: 30
estimatedMinutes: 15
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Validated Parser Challenge
        //
        // ValidationError is already defined.
        // parseEmail throws ValidationError if email is invalid.
        // parseAll collects failed errors and continues processing.
        //
        // Expected output:
        // Parsed: user@example.com
        // Failed: bad-email (ValidationError: Invalid email format)
        // Parsed: admin@site.org
        // Failed: another@bad (ValidationError: Missing domain dot)
        // Successful: 2, Failed: 2

        class ValidationError extends Error {
          constructor(message) {
            super(message);
            this.name = "ValidationError";
          }
        }

        function parseEmail(email) {
          const atCount = (email.match(/@/g) || []).length;
          if (atCount !== 1) throw new ValidationError("Invalid email format");
          const parts = email.split("@");
          if (!parts[1].includes(".")) throw new ValidationError("Missing domain dot");
          return email;
        }

        function parseAll(emails) {
          const successful = [];
          const failed = [];
          for (const email of emails) {
            try {
              successful.push(parseEmail(email));
            } catch (err) {
              if (err instanceof ValidationError) {
                failed.push(err);
                console.log(`Failed: ${email} (${err.name}: ${err.message})`);
              } else throw err;
            }
          }
          return { successful, failed };
        }

        // ---- Test runner (don't modify below this line) ----
        const emails = ["user@example.com", "bad-email", "admin@site.org", "another@bad"];

        for (const email of emails) {
          try {
            parseEmail(email);
            console.log(`Parsed: ${email}`);
          } catch (err) {
            if (err instanceof ValidationError) {
              console.log(`Failed: ${email} (${err.name}: ${err.message})`);
            } else throw err;
          }
        }

        const result = parseAll(emails);
        console.log(`Successful: ${result.successful.length}, Failed: ${result.failed.length}`);
  run:
    entrypoint: main.js
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
          - id: parsed
            type: stdout_contains
            expected: "Parsed: user@example.com"
          - id: failed
            type: stdout_contains
            expected: "Failed: bad-email (ValidationError: Invalid email format)"
          - id: summary
            type: stdout_contains
            expected: "Successful: 2, Failed: 2"
---

# Code Challenge: Validated Parser

The implementation is complete. Run it to see output.

**Expected output:**
```
Parsed: user@example.com
Failed: bad-email (ValidationError: Invalid email format)
Parsed: admin@site.org
Failed: another@bad (ValidationError: Missing domain dot)
Successful: 2, Failed: 2
```

Hit **Submit** when output matches.
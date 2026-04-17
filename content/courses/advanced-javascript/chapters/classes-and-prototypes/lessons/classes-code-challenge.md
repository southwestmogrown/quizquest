---
lessonSlug: classes-code-challenge
title: "Code Challenge: Shape Classes"
type: code
xpReward: 30
estimatedMinutes: 20
code:
  language: javascript
  starterFiles:
    - path: main.js
      content: |
        // Shape Classes Challenge
        //
        // Implement a class hierarchy:
        //
        // Shape (base class) with:
        //   - constructor(name) — sets this.name
        //   - describe() — returns "Shape: {name}"
        //
        // Circle extends Shape with:
        //   - constructor(name, radius)
        //   - area() — returns Math.PI * radius * radius (rounded to 2 decimal places)
        //   - describe() — returns "Circle {name} with radius {radius}"
        //
        // Rectangle extends Shape with:
        //   - constructor(name, width, height)
        //   - area() — returns width * height
        //   - describe() — returns "Rectangle {name} ({width}x{height})"
        //
        // The classes are already implemented below. Run the code to see output.

        class Shape {
          constructor(name) {
            this.name = name;
          }
          describe() {
            return `Shape: ${this.name}`;
          }
        }

        class Circle extends Shape {
          constructor(name, radius) {
            super(name);
            this.radius = radius;
          }
          area() {
            return Math.round(Math.PI * this.radius * this.radius * 100) / 100;
          }
          describe() {
            return `Circle ${this.name} with radius ${this.radius}`;
          }
        }

        class Rectangle extends Shape {
          constructor(name, width, height) {
            super(name);
            this.width = width;
            this.height = height;
          }
          area() {
            return this.width * this.height;
          }
          describe() {
            return `Rectangle ${this.name} (${this.width}x${this.height})`;
          }
        }

        // ---- Test runner (don't modify below this line) ----
        const circle = new Circle("Ball", 1);
        console.log(circle.describe());
        console.log(`Area of circle: ${circle.area()}`);

        const rect = new Rectangle("Box", 3, 4);
        console.log(rect.describe());
        console.log(`Area of rectangle: ${rect.area()}`);
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
          - id: circle
            type: stdout_contains
            expected: "Circle Ball with radius 1"
          - id: circle-area
            type: stdout_contains
            expected: "Area of circle: 3.14"
          - id: rect
            type: stdout_contains
            expected: "Rectangle Box (3x4)"
          - id: rect-area
            type: stdout_contains
            expected: "Area of rectangle: 12"
---

# Code Challenge: Shape Classes

A class hierarchy is already implemented — run the code to see if output matches the expectations.

**Expected output:**
```
Circle Ball with radius 1
Area of circle: 3.14
Rectangle Box (3x4)
Area of rectangle: 12
```

Hit **Submit** when output matches.
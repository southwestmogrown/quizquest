---
lessonSlug: inventory-capstone
title: "Capstone: Inventory System"
type: code
xpReward: 25
code:
  language: go
  starterFiles:
    - path: main.go
      content: |
        package main

        import "fmt"

        type Item struct {
        	Name     string
        	Price    float64
        	Quantity int
        }

        // TODO: Add a Total() method to Item that returns Price * Quantity as a float64.

        func main() {
        	item := Item{
        		Name:     "Widget",
        		Price:    9.99,
        		Quantity: 5,
        	}

        	// Print the total value of the item using fmt.Printf with "%.2f" formatting.
        	// Expected output: Total: 49.95
        	fmt.Printf("Total: %.2f\n", item.Total())
        }
  run:
    entrypoint: main.go
  grading:
    passingScorePercent: 100
    groups:
      - id: compile
        name: Compiles
        weight: 30
        visibility: hidden
        tests:
          - id: builds
            type: exit_code
            expected: 0
      - id: output
        name: Correct output
        weight: 70
        visibility: summary
        tests:
          - id: total
            type: stdout_contains
            expected: "Total: 49.95"
---

# Capstone: Inventory System

The `Item` struct has three fields: `Name`, `Price`, and `Quantity`.

Add a `Total()` method to `Item` that returns the total value (`Price * Quantity`) as a `float64`.

`main` already creates an `Item` and calls `item.Total()` — you just need to implement the method.

Expected output:
```
Total: 49.95
```

The `%.2f` format verb in `fmt.Printf` rounds to 2 decimal places, so `9.99 * 5 = 49.95` prints correctly.

Recall the method syntax:
```go
func (i Item) MethodName() ReturnType {
    // body
}
```

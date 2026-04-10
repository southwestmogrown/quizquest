---
lessonSlug: declaring-and-calling-functions
title: Declaring and Calling Functions
type: reading
xpReward: 10
estimatedMinutes: 6
tags:
  - functions
  - basics
---

# Declaring and Calling Functions

Functions let you name and reuse a block of code. In Go, you declare a function with the `func` keyword.

## Basic Function

```go
func greet(name string) {
    fmt.Println("Hello,", name)
}

func main() {
    greet("Ada")   // prints: Hello, Ada
    greet("Grace") // prints: Hello, Grace
}
```

The parameter list specifies what inputs the function accepts. Each parameter has a name and a type.

## Returning a Value

Add a return type after the parameter list:

```go
func add(a int, b int) int {
    return a + b
}

func main() {
    result := add(3, 4)
    fmt.Println(result) // prints: 7
}
```

When two parameters share a type, Go lets you write the type once:

```go
func add(a, b int) int {
    return a + b
}
```

## Multiple Return Values

This is one of Go's most distinctive features. Functions can return more than one value:

```go
func minMax(a, b int) (int, int) {
    if a < b {
        return a, b
    }
    return b, a
}

func main() {
    small, large := minMax(10, 3)
    fmt.Println(small, large) // prints: 3 10
}
```

The most common use of multiple return values is returning a result alongside an error:

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}
```

`nil` means "no error." The caller checks:

```go
result, err := divide(10, 3)
if err != nil {
    fmt.Println("Error:", err)
    return
}
fmt.Println(result)
```

## Named Return Values

Go also supports naming your return values. This can improve readability:

```go
func stats(nums []int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, n := range nums {
        if n < min {
            min = n
        }
        if n > max {
            max = n
        }
    }
    return // "naked return" — returns min and max
}
```

Named returns are most useful in longer functions where it's otherwise hard to track what's being returned.

## Functions Are First-Class

In Go, functions are values. You can assign a function to a variable and pass it around:

```go
double := func(n int) int {
    return n * 2
}

fmt.Println(double(5)) // prints: 10
```

This is a foundation for patterns like callbacks and middleware — you'll encounter it a lot in real Go code.

---

Ready to practice? The next exercise has you implement a function that returns two values.

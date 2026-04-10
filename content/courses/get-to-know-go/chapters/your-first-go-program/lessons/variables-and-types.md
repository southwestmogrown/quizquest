---
lessonSlug: variables-and-types
title: Variables and Types
type: reading
xpReward: 10
estimatedMinutes: 6
tags:
  - basics
  - types
  - variables
---

# Variables and Types

A variable is a named box that holds a value. In Go, every variable has a type — and that type never changes.

## Declaring Variables with `var`

The long-form declaration uses the `var` keyword:

```go
var name string
var age int
var active bool
```

This declares three variables: `name` holds text, `age` holds a whole number, and `active` holds true or false. Each variable starts with its **zero value** — more on that below.

You can assign a value at declaration time:

```go
var city string = "Portland"
var population int = 652000
```

## The Short Declaration `:=`

Inside a function, Go lets you declare and assign in one step using `:=`:

```go
city := "Portland"
population := 652000
active := true
```

Go **infers** the type from the value on the right. You don't have to write it out. This is the most common form you'll see in real Go code.

`:=` only works inside functions. At the package level, you must use `var`.

## Go's Basic Types

| Type | What it stores | Example |
|------|---------------|---------|
| `string` | Text (UTF-8) | `"hello"` |
| `int` | Whole numbers | `42`, `-7` |
| `float64` | Decimal numbers | `3.14`, `-0.5` |
| `bool` | True or false | `true`, `false` |

Go has more numeric types (`int32`, `uint8`, `float32`, etc.), but `int` and `float64` cover the vast majority of cases.

## Zero Values

In Go, a variable that is declared but not assigned always has a well-defined **zero value**. There are no uninitialized variables.

| Type | Zero value |
|------|-----------|
| `string` | `""` (empty string) |
| `int` | `0` |
| `float64` | `0.0` |
| `bool` | `false` |

This matters because it means you can always safely use a variable — you'll never read garbage from uninitialized memory like you might in C.

## Type Inference vs Explicit Types

When should you write the type explicitly, and when should you let Go infer it?

**Let Go infer** when the value makes the type obvious:
```go
count := 0          // clearly an int
message := "hello"  // clearly a string
```

**Write the type explicitly** when you want a specific type the value alone doesn't determine:
```go
var ratio float64 = 1  // without float64, this would be int
```

## Printing Variables

```go
name := "Alex"
age := 28

fmt.Println(name)  // prints: Alex
fmt.Println(age)   // prints: 28
```

`fmt.Println` accepts any value and prints it. You can print multiple values in one call:

```go
fmt.Println("Name:", name, "Age:", age)
// prints: Name: Alex Age: 28
```

---

Now it's time to practice. The next exercise has you declare variables and print them yourself.

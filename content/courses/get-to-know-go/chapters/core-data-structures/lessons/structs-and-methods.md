---
lessonSlug: structs-and-methods
title: Structs and Methods
type: reading
xpReward: 10
estimatedMinutes: 6
tags:
  - data-structures
  - structs
  - methods
---

# Structs and Methods

A struct groups related values together under a single name. It's Go's primary way to model real-world entities — the thing that plays the role classes fill in other languages.

## Defining a Struct

```go
type Person struct {
    Name string
    Age  int
    City string
}
```

## Creating a Struct Value

```go
p := Person{
    Name: "Ada",
    Age:  36,
    City: "London",
}

fmt.Println(p.Name) // Ada
fmt.Println(p.Age)  // 36
```

You access fields with dot notation. Fields not explicitly set get their zero values.

## Methods

A method is a function attached to a type. You declare it by adding a **receiver** before the function name:

```go
func (p Person) Greet() string {
    return "Hi, I'm " + p.Name
}

func main() {
    p := Person{Name: "Grace"}
    fmt.Println(p.Greet()) // Hi, I'm Grace
}
```

`(p Person)` is the receiver — `p` is the name you use inside the method to refer to the struct value.

## Value vs Pointer Receivers

There are two kinds of receivers:

**Value receiver** — receives a copy of the struct. Changes inside the method do not affect the original:

```go
func (p Person) Birthday() {
    p.Age++  // only modifies the copy
}
```

**Pointer receiver** — receives a pointer to the struct. Changes inside the method *do* affect the original:

```go
func (p *Person) Birthday() {
    p.Age++  // modifies the original
}
```

Rule of thumb: use a pointer receiver when the method needs to modify the struct, or when the struct is large (to avoid copying it).

## No Classes, No Inheritance

Go has no `class` keyword and no inheritance. Instead of building hierarchies, Go encourages:

- **Composition** — embed one struct inside another to share fields and methods
- **Interfaces** — define shared behavior without coupling types

This keeps the relationship between types explicit and shallow. You can always trace exactly which struct provides which behavior — there's no magic inheritance chain to follow.

## Structs and JSON

Struct field names drive JSON serialization via tags:

```go
type Product struct {
    Name  string  `json:"name"`
    Price float64 `json:"price"`
}
```

When marshaled to JSON: `{"name":"widget","price":9.99}`. This is how Go web APIs exchange data.

---

You're ready for the capstone challenge — building a small inventory system using a struct with a method.

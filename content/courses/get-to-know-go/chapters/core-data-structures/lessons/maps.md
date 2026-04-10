---
lessonSlug: maps
title: Maps
type: reading
xpReward: 10
estimatedMinutes: 5
tags:
  - data-structures
  - maps
---

# Maps

A map stores key-value pairs. Given a key, you can look up the associated value in constant time — regardless of how many entries the map has.

## Creating a Map

Use `make` to create an empty map:

```go
ages := make(map[string]int)
```

The type is `map[KeyType]ValueType`. Here the keys are strings and the values are ints.

You can also use a literal:

```go
ages := map[string]int{
    "Alice": 30,
    "Bob":   25,
    "Carol": 28,
}
```

## Reading and Writing

```go
ages["Dave"] = 32          // insert or update
fmt.Println(ages["Alice"]) // 30
```

If you look up a key that doesn't exist, you get the zero value for the value type:

```go
fmt.Println(ages["Nobody"]) // 0  (zero value for int)
```

## The Comma-Ok Idiom

The zero value makes it ambiguous: did the key exist with value 0, or does it not exist at all? The **comma-ok idiom** resolves this:

```go
age, ok := ages["Alice"]
if ok {
    fmt.Println("Alice is", age)
} else {
    fmt.Println("Alice not found")
}
```

`ok` is a `bool` — `true` if the key was present, `false` if not. This pattern appears constantly in Go code.

## Deleting an Entry

```go
delete(ages, "Bob")
```

Deleting a key that doesn't exist is a no-op — it doesn't panic.

## Iterating Over a Map

```go
for name, age := range ages {
    fmt.Printf("%s: %d\n", name, age)
}
```

**Important:** map iteration order is intentionally randomized in Go. Every time you range over a map, the order may differ. If you need a consistent order, sort the keys first.

## Maps Are Reference Types

Like slices, maps are reference types. Assigning a map to a new variable doesn't copy it — both variables point to the same underlying data:

```go
a := map[string]int{"x": 1}
b := a
b["x"] = 99
fmt.Println(a["x"]) // 99 — a was modified too
```

---

You now have the tools for the word frequency counter challenge coming up.

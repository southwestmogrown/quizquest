---
lessonSlug: arrays-and-slices
title: Arrays and Slices
type: reading
xpReward: 10
estimatedMinutes: 6
tags:
  - data-structures
  - slices
---

# Arrays and Slices

Go has two related but distinct ways to store ordered collections of values: **arrays** and **slices**. In practice, you'll use slices almost exclusively — but understanding arrays helps explain why slices work the way they do.

## Arrays: Fixed Size

An array has a fixed length that is part of its type:

```go
var scores [3]int         // array of 3 ints, all zero
scores[0] = 95
scores[1] = 87
scores[2] = 92

fmt.Println(scores) // [95 87 92]
```

The size `[3]` is baked into the type. A `[3]int` and a `[4]int` are completely different types — you cannot assign one to the other. This makes arrays inflexible, which is why slices exist.

## Slices: Dynamic and Flexible

A slice is like an array, but without a fixed size:

```go
fruits := []string{"apple", "banana", "cherry"}
fmt.Println(fruits)       // [apple banana cherry]
fmt.Println(len(fruits))  // 3
```

You can add elements with `append`:

```go
fruits = append(fruits, "date")
fmt.Println(fruits) // [apple banana cherry date]
```

`append` returns a new slice (possibly backed by a new array), so you must assign the result back to the variable.

## `make` — Creating Slices with Capacity

When you know roughly how many elements you'll have, use `make` to preallocate:

```go
scores := make([]int, 0, 10) // length 0, capacity 10
scores = append(scores, 95, 87, 92)
```

- **Length** (`len`) — how many elements are currently in the slice
- **Capacity** (`cap`) — how much space is allocated before a reallocation is needed

Preallocating avoids repeated memory allocations as you `append`, which matters in performance-sensitive code.

## Slicing a Slice

You can take a sub-slice using `[low:high]` syntax:

```go
nums := []int{10, 20, 30, 40, 50}
sub := nums[1:4]     // elements at index 1, 2, 3
fmt.Println(sub)     // [20 30 40]
```

The result shares the underlying array with the original — modifying `sub` will modify `nums` too. This is usually what you want (no copying), but be aware of it.

## Iterating

Use `range` to loop over a slice:

```go
for i, v := range fruits {
    fmt.Printf("fruits[%d] = %s\n", i, v)
}
```

---

Slices are the workhorse of Go data handling. Next: maps.

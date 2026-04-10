---
lessonSlug: hello-world-line-by-line
title: Hello, World — Line by Line
type: reading
xpReward: 10
estimatedMinutes: 5
tags:
  - basics
  - syntax
---

# Hello, World — Line by Line

Every Go program starts with the same basic structure. Here it is:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

This prints:
```
Hello, World!
```

Let's look at each line.

## `package main`

Every Go file begins with a `package` declaration. A package is a collection of related Go files.

The package named `main` is special: it tells the Go compiler that this is an executable program — something you can run directly. Without `package main`, Go won't know how to build a standalone binary.

Other packages (like `fmt`, `os`, `strings`) are libraries that other programs import.

## `import "fmt"`

The `import` statement brings in code from other packages. `fmt` (short for "format") is part of Go's standard library. It provides functions for printing text and formatting strings.

You can import multiple packages at once:

```go
import (
    "fmt"
    "os"
)
```

## `func main()`

`func` declares a function. `main` is a special function name — it's the entry point of your program. When you run a Go binary, execution starts at `main()`.

The curly braces `{}` contain the function body.

## `fmt.Println("Hello, World!")`

This calls the `Println` function from the `fmt` package. `Println` prints text followed by a newline character, so your output ends up on its own line.

`"Hello, World!"` is a **string literal** — text enclosed in double quotes.

## Compiled vs Interpreted

Go is a **compiled** language. Before you can run a Go program, the compiler transforms your source code into a native binary — machine instructions that your processor executes directly.

This is different from **interpreted** languages like Python or JavaScript, where a runtime reads your source code and executes it on the fly.

The practical difference:
- Go binaries start instantly and run fast
- Go compilation catches many errors before you ever run the code
- A Go binary runs anywhere without needing Go installed on the target machine

---

You've seen every line of a Go program. Next, you'll learn how to store values in variables.

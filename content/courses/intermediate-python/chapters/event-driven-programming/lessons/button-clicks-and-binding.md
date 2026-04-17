---
lessonSlug: button-clicks-and-binding
title: Button Clicks and Binding
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Button Clicks and Binding

## How Tkinter Handles Events

Every GUI application is **event-driven** — the program sits idle until something happens (a click, a keypress, a timer). Tkinter maintains an **event loop** that watches for events and dispatches them to handler functions called **callbacks**.

When you write `command=on_click`, you're telling Tkinter: "when this button is clicked, call `on_click`".

## Passing Arguments to Callbacks

A plain `command=my_function` calls `my_function` with no arguments. To pass data, use `lambda` or `functools.partial`:

```python
import tkinter as tk

def greet(name):
    label.config(text=f"Hello, {name}!")

root = tk.Tk()
root.geometry("300x100")

label = tk.Label(root, text="", font=("Arial", 14))
label.pack(pady=20)

# lambda with an argument
tk.Button(root, text="Greet Alice", command=lambda: greet("Alice")).pack(pady=2)
tk.Button(root, text="Greet Bob", command=lambda: greet("Bob")).pack(pady=2)

root.mainloop()
```

## `functools.partial` for Cleaner Code

`functools.partial` creates a new function with some arguments pre-filled:

```python
from functools import partial

def greet(name, punctuation):
    label.config(text=f"Hello, {name}{punctuation}")

tk.Button(root, text="Say Hi", command=partial(greet, "World", "!")).pack()
```

This is cleaner than nested lambdas when you have multiple arguments.

## Event Binding with `bind()`

For finer control, use `widget.bind(event, callback)`:

```python
def on_double_click(event):
    print("Double-clicked!")

widget.bind("<Double-Button-1>", on_double_click)  # double left-click
```

Common mouse events:
- `<Button-1>` — left click
- `<Button-2>` — middle click
- `<Button-3>` — right click
- `<Double-Button-1>` — double left click
- `<B1-Motion>` — mouse drag with left button held

## Widget State

Buttons (and other interactive widgets) have a `state` option:

```python
# Disable a button
button.config(state="disabled")

# Re-enable it
button.config(state="normal")
```

Disable buttons to prevent clicks while an operation is in progress:

```python
def start_long_task():
    button.config(state="disabled")
    # do work...
    button.config(state="normal")
```

* * *

Next: keyboard events and focus management.

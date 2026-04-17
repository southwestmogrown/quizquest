---
lessonSlug: callbacks-and-events
title: Callbacks and Events
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Callbacks and Events

## Button Clicks with `command`

The most basic interaction is a button click. Pass a function to the `command` option:

```python
import tkinter as tk

def on_click():
    label.config(text="Button clicked!")

root = tk.Tk()
root.geometry("300x150")

label = tk.Label(root, text="Waiting...", font=("Arial", 14))
label.pack(pady=20)

button = tk.Button(root, text="Click Me", command=on_click)
button.pack()

root.mainloop()
```

When the button is clicked, Tkinter calls your `on_click` function automatically. The function doesn't need any special arguments — Tkinter passes nothing unless you configure it otherwise.

## Lambda for Simple Callbacks

For simple one-liner actions, use `lambda`:

```python
tk.Button(root, text="Increment", command=lambda: count.set(count.get() + 1)).pack()
```

`lambda` is a shorthand anonymous function. It lets you embed a small expression directly in the `command` argument.

## Using `tk.IntVar` and `tk.StringVar` for Mutable State

Variables inside a callback need to be shared between the function and the GUI. Use `tk.IntVar`, `tk.StringVar`, etc. — special Tkinter variable classes that work with widgets like `Label` and `Entry`:

```python
counter = tk.IntVar(value=0)
counter.set(42)   # set value
counter.get()     # read value
```

Connect a `Label` to a variable so the label updates automatically:

```python
count = tk.IntVar(value=0)
tk.Label(root, textvariable=count).pack()  # textvariable, not text!
```

## Keyboard Events

Bind keyboard events with `widget.bind()`:

```python
def on_enter(event):
    print("Enter key pressed!")

root.bind("<Return>", on_enter)  # pressing Enter triggers on_enter
```

Common key codes:
- `<Return>` — Enter key
- `<Escape>` — Escape key
- `<Key>` — any key
- `<Control-c>` — Ctrl+C
- `<Button-1>` — left mouse click

## Focus and Tab Order

Call `widget.focus()` to direct keyboard input to a specific widget:

```python
entry = tk.Entry(root)
entry.focus()
```

Set tab order with `widget.tk_focusNext()` chains, or simply arrange widgets in the order you want in your code.

* * *

Next: building your first GUI application end-to-end.

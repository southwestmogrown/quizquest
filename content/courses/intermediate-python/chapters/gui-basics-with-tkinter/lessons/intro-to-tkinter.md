---
lessonSlug: intro-to-tkinter
title: Introduction to Tkinter
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Introduction to Tkinter

Python's standard library includes **Tkinter** — a thin wrapper around the Tk toolkit that lets you build graphical user interfaces (GUIs). No installation required.

## Your First Window

```python
import tkinter as tk

root = tk.Tk()
root.title("My First App")
root.geometry("400x300")

# Run the application
root.mainloop()
```

`tk.Tk()` creates the main window. `mainloop()` starts the event loop — the engine that listens for button clicks, key presses, and other interactions. The window runs until the user closes it or you call `root.destroy()`.

## Adding Widgets

Widgets are the building blocks of a GUI. Common ones:

| Widget | Class | What it does |
|---|---|---|
| Label | `tk.Label` | Display text or images |
| Button | `tk.Button` | Clickable button |
| Entry | `tk.Entry` | Single-line text input |
| Text | `tk.Text` | Multi-line text input |

```python
import tkinter as tk

root = tk.Tk()
root.geometry("300x200")

label = tk.Label(root, text="Hello, GUI!")
label.pack(pady=20)

button = tk.Button(root, text="Click Me")
button.pack(pady=10)

root.mainloop()
```

## Geometry Managers

Tkinter has three geometry managers for arranging widgets:

- **`pack()`** — places widgets in a stack, either vertically (default) or horizontally using `side="left"` etc.
- **`grid()`** — places widgets in a table of rows and columns
- **`place()`** — places widgets at exact x/y coordinates

`pack()` is the easiest for simple layouts. `grid()` is best for forms and tabular data.

```python
# Using grid for a form layout
tk.Label(root, text="Name:").grid(row=0, column=0, padx=5, pady=5)
tk.Entry(root).grid(row=0, column=1, padx=5, pady=5)

tk.Label(root, text="Email:").grid(row=1, column=0, padx=5, pady=5)
tk.Entry(root).grid(row=1, column=1, padx=5, pady=5)
```

## Running GUI Code

GUI applications need a display to run. When you run this code on your local machine, a window will appear. In a browser-based code runner, the code will execute but the window can't be displayed — the code-runner validates that your program runs without errors.

* * *

Next: how to configure widgets and organize your layout.

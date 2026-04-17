---
lessonSlug: widget-configuration-and-layout
title: Widget Configuration and Layout
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Widget Configuration and Layout

## Configuring Widgets After Creation

Every widget has a `config()` method (or shorthand `configure()`) to change its properties after creation:

```python
label = tk.Label(root, text="Welcome")
label.config(font=("Arial", 16), fg="blue", bg="yellow")
label.pack(pady=10)
```

You can also set options directly in the constructor:

```python
tk.Label(root, text="Styled", font=("Helvetica", 14, "bold"), fg="white", bg="#333").pack()
```

## Common Widget Options

| Option | What it does | Example |
|---|---|---|
| `text` | The label text | `text="Hello"` |
| `font` | Font family, size, style | `font=("Arial", 12)` |
| `fg` | Foreground (text) color | `fg="red"` |
| `bg` | Background color | `bg="#f0f0f0"` |
| `padx`, `pady` | Internal padding | `padx=10, pady=5` |
| `width` | Widget width (in characters or pixels) | `width=20` |
| `state` | Enabled/disabled state | `state="disabled"` |

## Organizing Layout with Frame Widgets

A `tk.Frame` is a container that groups widgets together. Use frames to divide your window into logical sections:

```python
root = tk.Tk()
root.geometry("400x300")

# Header section
header = tk.Frame(root, bg="#4f46e5")
header.pack(fill="x")
tk.Label(header, text="My App", fg="white", font=("Arial", 18)).pack(pady=10)

# Main content section
content = tk.Frame(root, bg="white")
content.pack(fill="both", expand=True, padx=20, pady=20)
tk.Label(content, text="Welcome!").pack()

root.mainloop()
```

## Padding Inside and Outside

- **`padx` / `pady`** on a widget add space *inside* the widget's border
- **`ipadx` / `ipady`** add space *around* the widget's content inside the widget

```python
# 10px space outside the button, 5px space inside
tk.Button(root, text="Press", padx=10, pady=5, ipadx=5, ipady=5).pack()
```

## Sticky Alignment in Grid

When using `grid()`, use `sticky` to align widgets within their cells:

```python
# Fill the entire cell
widget.grid(row=0, column=0, sticky="nsew")

# Align to the left
widget.grid(row=0, column=0, sticky="w")
```

`sticky` accepts compass directions: `n` (north/top), `s` (south/bottom), `e` (east/right), `w` (west/left).

* * *

Next: responding to button clicks with callbacks.

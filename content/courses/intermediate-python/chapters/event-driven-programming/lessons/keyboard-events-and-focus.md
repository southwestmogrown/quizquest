---
lessonSlug: keyboard-events-and-focus
title: Keyboard Events and Focus
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Keyboard Events and Focus

## Binding Keyboard Events

Bind keyboard events to any widget that has focus:

```python
def on_key(event):
    print(f"Key pressed: {event.char!r}")

root.bind("<Key>", on_key)
```

For specific keys, use named key codes:

| Event | Trigger |
|---|---|
| `<Return>` | Enter key |
| `<Escape>` | Escape key |
| `<space>` | Spacebar |
| `<BackSpace>` | Backspace |
| `<Tab>` | Tab |
| `<Left>` | Left arrow |
| `<Right>` | Right arrow |
| `<Up>` | Up arrow |
| `<Down>` | Down arrow |

## Modifier Keys

Combine modifiers with key names:

```python
root.bind("<Control-s>", lambda e: print("Ctrl+S pressed"))
root.bind("<Alt-F4>", lambda e: print("Alt+F4"))
root.bind("<Shift-A>", lambda e: print("Shift+A"))
```

## Focus Management

Only one widget can have **focus** at a time (for receiving keyboard events). Use these methods:

```python
entry.focus()              # give focus to entry widget
root.focus_set()           # give focus to the root window
widget.has_focus()         # True if this widget has focus
```

## Tab Order

When the user presses Tab, focus moves through widgets in a defined order. Set this order by listing widgets in the order you want them focused:

```python
name_entry = tk.Entry(root)
email_entry = tk.Entry(root)

# Tab goes: name_entry → email_entry
name_entry.grid(row=0, column=1)
email_entry.grid(row=1, column=1)
```

## FocusIn and FocusOut Events

Bind to when a widget gains or loses focus:

```python
def on_focus_in(event):
    print("Entry gained focus")

def on_focus_out(event):
    print("Entry lost focus")

entry.bind("<FocusIn>", on_focus_in)
entry.bind("<FocusOut>", on_focus_out)
```

## Validating Entry Input

Use `validatecommand` to check input before it is accepted:

```python
def validate_number(new_value):
    if new_value == "":
        return True
    try:
        int(new_value)
        return True
    except ValueError:
        return False

vcmd = root.register(validate_number)
tk.Entry(root, validate="key", validatecommand=(vcmd, "%P")).pack()
```

The validatecommand receives `%P` (the new value after the edit) and must return `True` (accept) or `False` (reject).

* * *

Next: building interactive forms and handling multiple events together.

---
lessonSlug: interactive-forms
title: Interactive Forms
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Interactive Forms

## Building a Login Form

A login form combines labels, entries, buttons, and validation:

```python
import tkinter as tk
from tkinter import messagebox

def on_login():
    username = username_entry.get()
    password = password_entry.get()
    if username == "admin" and password == "secret":
        messagebox.showinfo("Success", f"Welcome, {username}!")
    else:
        messagebox.showerror("Error", "Invalid credentials")

root = tk.Tk()
root.title("Login")
root.geometry("300x150")

tk.Label(root, text="Username:").grid(row=0, column=0, padx=5, pady=5, sticky="e")
username_entry = tk.Entry(root)
username_entry.grid(row=0, column=1, padx=5, pady=5)

tk.Label(root, text="Password:").grid(row=1, column=0, padx=5, pady=5, sticky="e")
password_entry = tk.Entry(root, show="*")
password_entry.grid(row=1, column=1, padx=5, pady=5)

tk.Button(root, text="Login", command=on_login).grid(row=2, column=0, columnspan=2, pady=10)

root.mainloop()
```

## `messagebox` Dialogs

`tkinter.messagebox` provides ready-made dialog boxes:

```python
from tkinter import messagebox

messagebox.showinfo("Title", "Information message")
messagebox.showwarning("Title", "Warning message")
messagebox.showerror("Title", "Error message")

# User choice
answer = messagebox.askyesno("Confirm", "Continue?")
# Returns True (yes) or False (no)
```

## Checkbutton and Radiobutton

For boolean choices and mutually exclusive options:

```python
# Checkbutton (boolean toggle)
remember_me = tk.BooleanVar()
tk.Checkbutton(root, text="Remember me", variable=remember_me).pack()
print(remember_me.get())  # True or False

# Radiobutton (mutually exclusive)
choice = tk.StringVar(value="option1")
tk.Radiobutton(root, text="Option 1", variable=choice, value="option1").pack()
tk.Radiobutton(root, text="Option 2", variable=choice, value="option2").pack()
print(choice.get())  # "option1" or "option2"
```

## Text Widget for Multi-line Input

For longer text, use `tk.Text`:

```python
text = tk.Text(root, height=5, width=40)
text.pack()
text.insert("1.0", "Type here...")  # line 1, column 0

content = text.get("1.0", "end")     # from start to end
text.delete("1.0", "end")            # clear the widget
```

## Form Validation

Validate before submission:

```python
def submit():
    email = email_entry.get()
    if "@" not in email:
        messagebox.showerror("Error", "Please enter a valid email")
        email_entry.focus()
        return
    # proceed with submission
```

Validate on `FocusOut` for immediate feedback:

```python
email_entry.bind("<FocusOut>", lambda e: validate_email())
```

* * *

Next: putting it all together in the event-driven code challenge.

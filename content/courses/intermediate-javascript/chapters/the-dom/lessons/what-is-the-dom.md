---
lessonSlug: what-is-the-dom
title: What Is the DOM?
type: reading
xpReward: 10
estimatedMinutes: 5
---

# What Is the DOM?

When a browser loads an HTML page, it builds a tree of objects that represents every element on the page. This tree is called the **Document Object Model**, or DOM.

```
html
├── head
│   └── title
└── body
    ├── h1
    └── p
```

Each **node** in the tree is a JavaScript object you can read, modify, or delete. The DOM is your bridge between HTML and JavaScript.

## The DOM Is Not HTML

HTML is the source. The DOM is the living representation of that HTML in the browser's memory. You can change the DOM without changing the HTML source — and the browser updates the rendered page to match.

## The document Object

JavaScript gives you a global `document` object that is the entry point to the entire DOM. Through it, you can reach any element on the page:

```js
document.body;          // the <body> element
document.title;         // the <title> text
document.getElementById("header"); // find by ID
```

## Inspecting the DOM

In your browser's developer tools (F12), go to the **Elements** tab. You'll see the full DOM tree. Right-click any node and choose "Edit as HTML" to change it live. These changes update the rendered page immediately — but they're temporary (they reset on reload).

## Nodes vs Elements

You may see "nodes" and "elements" used somewhat interchangeably. Technically:
- A **node** is the generic term for anything in the tree (elements, text, comments)
- An **element** is specifically an HTML tag node (like `<p>`, `<div>`)

In practice, when people say "DOM node" they usually mean "DOM element."

---

Next: how to find specific elements in the tree.
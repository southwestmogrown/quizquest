---
lessonSlug: comparison-operators
title: Comparison Operators
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Comparison Operators

Programs need to make decisions. That requires comparing values — checking whether numbers are equal, whether one is larger than another, whether a string matches a pattern.

## Equality: `==` vs `===`

This is one of the most important distinctions in JavaScript:

```js
5 == "5";   // true — loosely equal, string "5" converted to number
5 === "5";  // false — strictly equal, different types
```

**Always use `===` and `!==`.** The loose equality operator (`==`) causes confusing behavior that leads to bugs. `===` checks both value AND type.

```js
0 === false;   // false — boolean and number are different types
0 == false;    // true — this is the confusing kind of equality
```

## Inequality: `!=` vs `!==`

```js
5 != "5";   // false — loosely unequal (they are equal)
5 !== "5";  // true — strictly unequal (different types)
```

Again, prefer `!==` over `!=`.

## Greater Than and Less Than

```js
10 > 5;   // true
10 >= 10; // true — greater than or equal
5 < 3;    // false
5 <= 5;   // true — less than or equal
```

## Comparisons with Strings

```js
"apple" < "banana";  // true — compared alphabetically (Unicode order)
"Apple" < "apple";   // true — uppercase comes before lowercase
```

## Combining Comparisons

Use `&&` (AND) and `||` (OR):

```js
age >= 18 && hasLicense === true;  // both must be true
isLoggedIn === true || isAdmin === true; // either must be true
```

Negation uses `!`:

```js
isLoggedIn === false;  // works but verbose
!isLoggedIn;           // cleaner — means "not logged in"
```

---

Comparison operators let you build conditions. In the next lesson, you'll put them inside `if` statements to make your code branch.
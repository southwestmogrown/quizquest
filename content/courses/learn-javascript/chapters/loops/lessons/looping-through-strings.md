---
lessonSlug: looping-through-strings
title: Looping Through Strings
type: reading
xpReward: 10
estimatedMinutes: 5
---

# Looping Through Strings

Strings are iterable — you can loop through every character one by one. This is useful for counting things, searching, or transforming each character.

## Basic Character Loop

```js
const word = "JavaScript";

for (let i = 0; i < word.length; i++) {
  console.log(word[i]);
}
// J
// a
// v
// a
// S
// c
// r
// i
// p
// t
```

Notice `i < word.length` — the last valid index is `word.length - 1`, so we use `<` not `<=`.

## Counting Occurrences

```js
const sentence = "JavaScript is great";
let vowelCount = 0;
const vowels = "aeiouAEIOU";

for (let i = 0; i < sentence.length; i++) {
  if (vowels.includes(sentence[i])) {
    vowelCount++;
  }
}
console.log(vowelCount); // 6
```

## Building a New String

```js
const input = "hello";
let shouted = "";

for (let i = 0; i < input.length; i++) {
  shouted += input[i].toUpperCase();
}
console.log(shouted); // "HELLO"
```

---

Loops and strings go together constantly. But sometimes you don't know how many times to loop — for that, there's the `while` loop, covered next.
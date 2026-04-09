---
lessonSlug: how-ai-makes-mistakes
title: How AI Makes Mistakes
type: reading
xpReward: 15
estimatedMinutes: 10
---

# How AI Makes Mistakes

AI mistakes fall into a small number of categories. Knowing the categories makes them easier to spot.

## Hallucination

AI models sometimes invent things that don't exist: function signatures, package names, API endpoints, configuration options. The invented item sounds plausible, often follows the naming conventions of the real ecosystem, and is presented with full confidence.

**In Go, this looks like:**

```go
import "github.com/some/real-package"

// AI invented this method — it doesn't exist in this package
result := client.FetchWithRetry(ctx, url, maxRetries)
```

The package is real. `FetchWithRetry` is not. The code compiles if the method exists anywhere in the package. If it doesn't, you'll get a compilation error — which is actually helpful. The dangerous case is when the AI invents a *behavior* of a real function, not the function itself.

**How to catch it:** When AI uses a function from an external package, verify it exists in the current version of that package. Check the docs or source directly.

## Stale Knowledge

AI training data has a cutoff date. Packages get updated, APIs get deprecated, best practices change. AI will confidently use APIs that were valid two years ago but have since been removed or superseded.

**Common examples:**
- Using deprecated `ioutil` functions instead of `io` and `os` (deprecated in Go 1.16)
- Using an old version of a library's API after a major version bump
- Recommending packages that have been abandoned

**How to catch it:** For any library code, cross-reference with the current documentation. If something looks slightly off — wrong import path, unexpected method signature — check the current version.

## Plausible-But-Wrong Logic

This is the most dangerous category because it passes casual reading. The code looks right, compiles, may even pass basic tests — but contains subtle logical errors.

**Common patterns:**

*Off-by-one errors:*
```go
// AI wrote this — intended to include the last element
for i := 0; i < len(items)-1; i++ {  // skips the last element
```

*Wrong comparison:*
```go
// AI checking if slice is "full" — should be >=, not ==
if len(items) == capacity {
```

*Incorrect boundary:*
```go
// AI truncating to maxLen — should be min(len(s), maxLen)
return s[:maxLen]  // panics if len(s) < maxLen
```

**How to catch it:** Don't just read the code — trace through it with specific inputs. Walk through the edge cases manually.

## Security Anti-Patterns

AI has been trained on a lot of code, including a lot of insecure code. It reproduces common anti-patterns without flagging them as problematic.

**In Go:**

```go
// SQL injection — AI often uses fmt.Sprintf instead of parameterized queries
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)

// Hardcoded credentials
const apiKey = "sk-1234567890abcdef"

// Weak hashing — MD5 is not suitable for passwords
hash := md5.Sum([]byte(password))
```

**How to catch it:** Any time AI-generated code handles external input, authentication, or sensitive data — read it with a security eye. These patterns are subtle enough that a quick read can miss them.

## The Common Thread

All of these mistakes share one property: the AI is confident about them. There's no hesitation, no hedge, no disclaimer. The confident presentation is part of what makes AI mistakes hard to catch.

The fix is to treat confidence as a property of presentation, not a signal of correctness. Review the logic, check the API surface, verify external references — regardless of how assured the output looks.

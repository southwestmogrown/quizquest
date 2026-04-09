---
lessonSlug: security-and-ai
title: AI and Security
type: reading
xpReward: 15
estimatedMinutes: 10
---

# AI and Security

AI is not thinking about your threat model.

This is not a criticism — AI tools aren't designed to be security engineers. They're designed to produce code that works. "Works" and "secure" are not the same thing, and the gap between them shows up reliably in AI-generated code that handles user input, authentication, or sensitive data.

## The Common Vulnerabilities

These patterns appear in AI-generated code with regularity:

### SQL Injection via String Formatting

```go
// AI-generated: uses fmt.Sprintf to build a query
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)
rows, err := db.Query(query)
```

If `email` comes from user input, this is a SQL injection vulnerability. A user who submits `' OR '1'='1` as their email can access all records.

The correct approach uses parameterized queries:

```go
rows, err := db.Query("SELECT * FROM users WHERE email = $1", email)
```

AI often uses `fmt.Sprintf` because it's simpler and works for non-malicious input. "Works for normal input" is not the same as "secure."

### Hardcoded Credentials

```go
const apiKey = "sk-1234567890abcdef"
const dbPassword = "supersecret"
```

AI generates working examples. Working examples often have credentials in them. Those credentials end up in your code, and then in your git history, and then potentially in a public repo.

Always use environment variables or a secrets manager. Never commit credentials.

### Weak Cryptography

```go
// AI-generated password hashing — MD5 is not suitable for passwords
hash := md5.Sum([]byte(password))
```

MD5 is fast, which makes it terrible for password hashing. Attackers can compute billions of MD5 hashes per second. Passwords must be hashed with a slow algorithm designed for the purpose: bcrypt, scrypt, or Argon2.

AI reaches for MD5 because it's in the standard library and produces a hash. It's not thinking about whether that hash is secure.

### Overly Permissive Access Control

```go
// AI-generated CORS middleware — allows all origins
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        next.ServeHTTP(w, r)
    })
}
```

Wildcard CORS is sometimes appropriate. It's often not. AI defaults to the permissive option because it avoids configuration complexity. Review CORS settings against your actual requirements.

## The Security Review Habit

For any AI-generated code that:
- Accepts user input
- Handles authentication or authorization
- Stores or retrieves sensitive data
- Makes external requests
- Manages session state

Read it with a security eye before shipping. The questions to ask:

1. Where does untrusted input enter this code?
2. Is that input sanitized, parameterized, or encoded before use?
3. Are there credentials or secrets in the code or the generated tests?
4. What does the worst-case user input look like, and what happens?

## AI Can Help With Security Too

AI is good at spotting these patterns when asked explicitly:

> "Review this function for SQL injection, hardcoded credentials, and input validation issues."

The key word is "asked." AI will not volunteer security feedback unless you ask for it. Make security review a mandatory step in your AI-assisted workflow, not an afterthought.

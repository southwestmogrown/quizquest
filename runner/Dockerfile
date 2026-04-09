# -----------------------------------------------------------------------
# Stage 1 — build the runner binary
# -----------------------------------------------------------------------
FROM golang:1.22-alpine AS builder

WORKDIR /build
COPY go.mod .
COPY main.go .
RUN go build -o runner .

# -----------------------------------------------------------------------
# Stage 2 — runtime image
# Includes the Go toolchain so we can compile/run user-submitted Go code.
# -----------------------------------------------------------------------
FROM golang:1.22-alpine

# Pre-warm the Go module cache / build cache so the first user execution
# doesn't pay the full cold-start cost of downloading the standard library.
# (The stdlib is already compiled into the toolchain image, so this is
# mainly about verifying the toolchain works and creating cache dirs.)
RUN mkdir -p /tmp/gocache && GOCACHE=/tmp/gocache go build -v std 2>/dev/null || true

COPY --from=builder /build/runner /usr/local/bin/runner

# Non-root user for defence-in-depth.
RUN adduser -D -u 1001 runner
USER runner

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/runner"]

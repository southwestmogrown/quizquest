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

COPY --from=builder /build/runner /usr/local/bin/runner

# Non-root user for defence-in-depth.
RUN adduser -D -u 1001 runner

# Create a dedicated writable workspace for the runner user.
# /tmp may have root-owned artifacts or restrictive mounts on some platforms.
RUN mkdir -p /home/runner/work && chown runner:runner /home/runner/work

# Pre-warm the Go build cache as the runner user so the cache files are
# owned by the correct UID and the first user request is faster.
USER runner
ENV RUNNER_TMPDIR=/home/runner/work
RUN GOCACHE=/home/runner/work/gocache go build -v std 2>/dev/null || true

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/runner"]

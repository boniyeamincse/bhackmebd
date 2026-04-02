FROM alpine:3.19
# ──────────────────────────────────────────────────────────────
# B-HackMe — Hardened User Terminal Container
# Base image: Alpine 3.19  |  User: hacker (non-root, no sudo)
# Security: no-new-privileges, read-only root, tmpfs home/tmp
# ──────────────────────────────────────────────────────────────
FROM alpine:3.19

LABEL maintainer="B-HackMe <dev@bhackme.com>" \
      version="1.0.0" \
      description="Isolated Linux learning container — no internet, non-root"

# ── System tools (no sudo, no setuid binaries beyond what Alpine ships) ──
RUN apk add --no-cache \
        bash curl wget git vim nano \
        net-tools nmap netcat-openbsd \
        python3 \
        openssh-client \
        htop tree file \
        grep sed gawk \
        tcpdump traceroute \
        binutils strace \
    # Remove setuid bits from binaries not needed by the hacker user
    && find /usr/bin /usr/sbin -perm /6000 -type f -exec chmod a-s {} \; \
    # Remove ping setuid (not needed) — already handled by -cap-drop ALL at runtime
    && chmod a-s /bin/ping 2>/dev/null || true

# ── Hacker user — strictly non-root, no password, no sudo ────────────────
RUN addgroup -S hacker \
    && adduser -S -G hacker -s /bin/bash -h /home/hacker hacker \
    && passwd -l hacker || true   # Lock password (handle case where already locked)

# ── Minimal, safe shell environment ──────────────────────────────────────
COPY --chown=hacker:hacker bashrc /home/hacker/.bashrc

# ── Switch to non-root user ───────────────────────────────────────────────
USER hacker
WORKDIR /home/hacker

# ── Health check: container is alive ─────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD pgrep bash || exit 1

# ── Runtime security notes (enforced by docker run flags, not here) ───────
# --read-only --tmpfs /tmp:size=50m,noexec --tmpfs /home/hacker:size=100m
# --memory=128m --cpus=0.5 --pids-limit=50
# --cap-drop=ALL --security-opt=no-new-privileges
# --network=terminal-net (internal, no internet)

SHELL ["/bin/bash", "-c"]
CMD ["/bin/bash", "--login"]

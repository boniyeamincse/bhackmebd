# B-HackMe Terminal Container — Security Policy

## Container Isolation Model

Every user gets their own **ephemeral, isolated Alpine Linux container** with the following hardening applied at runtime:

### Docker Run Security Flags

```bash
docker run \
  --rm \                                    # Auto-remove on exit
  --name bhackme-user-<userId> \
  --network terminal-net \                  # Internal network — no internet
  --memory="128m" \                         # Hard memory limit
  --memory-swap="128m" \                   # Swap disabled
  --cpus="0.5" \                           # Half a CPU core max
  --pids-limit=50 \                        # Max 50 processes
  --ulimit nofile=256:256 \               # Max open file descriptors
  --read-only \                            # Root filesystem is read-only
  --tmpfs /tmp:size=50m,noexec,nosuid \   # Writable /tmp (non-executable)
  --tmpfs /home/hacker:size=100m,nosuid \ # Writable home dir only
  --security-opt no-new-privileges \       # No privilege escalation ever
  --cap-drop ALL \                         # Drop ALL Linux capabilities
  --cap-add NET_RAW \                      # Only add what is required
  bhackme/terminal:latest
```

### What the Hacker User Can Do

- Run standard Linux commands (bash, ls, cat, grep, etc.)
- Use networking tools for exercises (ping, nmap, netcat, traceroute)
- Write files only under `/tmp` and `/home/hacker`
- Run Python 3 scripts

### What the Hacker User Cannot Do

- Escalate to root (`no-new-privileges`, locked password, no sudo)
- Access the internet (internal `terminal-net` only)
- Persist data across sessions (ephemeral container)
- Fork-bomb (capped at 50 PIDs)
- Read the root filesystem beyond their own dirs
- Execute binaries from `/tmp` (noexec flag)

### Network Isolation

```
Internet  ←── bhackme-net ──→ Frontend / Backend / Postgres / Redis
                                      │
                              terminal-net  (internal: true)
                                      │
                              bhackme-user-<id>  containers
                                  (no outbound internet)
```

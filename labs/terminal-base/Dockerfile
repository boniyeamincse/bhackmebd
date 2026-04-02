FROM alpine:3.19

# Install Linux tools for learning and practice
RUN apk add --no-cache \
    bash curl wget git vim nano \
    net-tools nmap netcat-openbsd \
    python3 py3-pip \
    openssh-client \
    htop tree file \
    grep sed gawk \
    tcpdump traceroute \
    binutils strace \
    sudo

# Create non-root user
RUN addgroup -S hacker && adduser -S hacker -G hacker

# Bash as default shell
RUN sed -i 's|/bin/sh|/bin/bash|' /etc/passwd

USER hacker
WORKDIR /home/hacker

# Friendly prompt
RUN echo 'export PS1="\[\e[32m\]hacker@bhackme\[\e[0m\]:\[\e[34m\]\w\[\e[0m\]\$ "' >> ~/.bashrc

SHELL ["/bin/bash", "-c"]
CMD ["/bin/bash"]

const pty = require('node-pty');
const DockerService = require('./docker.service');

const sessions = new Map(); // userId → ptyProcess

const createSession = async (userId, cols = 80, rows = 24) => {
  const container = await DockerService.getOrCreateContainer(userId);

  const ptyProcess = pty.spawn('docker', ['exec', '-it', container.id, '/bin/bash'], {
    name: 'xterm-256color',
    cols,
    rows,
    env: process.env,
  });

  sessions.set(userId, ptyProcess);
  return ptyProcess;
};

const getSession = (userId) => sessions.get(userId);

const destroySession = (userId) => {
  const proc = sessions.get(userId);
  if (proc) {
    proc.kill();
    sessions.delete(userId);
  }
};

module.exports = { createSession, getSession, destroySession };

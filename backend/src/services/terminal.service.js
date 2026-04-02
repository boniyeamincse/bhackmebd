const pty = require('node-pty');
const DockerService = require('./docker.service');

const sessions = new Map(); // userId → ptyProcess

const createSession = async (userId, cols = 80, rows = 24) => {
  const existing = sessions.get(userId);
  if (existing) return existing;

  const container = await DockerService.getOrCreateContainer(userId);

  const ptyProcess = pty.spawn('docker', ['exec', '-u', 'hacker', '-it', container.id, '/bin/bash', '--login'], {
    name: 'xterm-256color',
    cols,
    rows,
    env: process.env,
  });

  sessions.set(userId, ptyProcess);
  return ptyProcess;
};

const getSession = (userId) => sessions.get(userId);

const writeInput = (userId, data) => {
  const session = sessions.get(userId);
  if (session) session.write(data);
};

const resizeSession = (userId, cols, rows) => {
  const session = sessions.get(userId);
  if (session) session.resize(cols, rows);
};

const destroySession = (userId) => {
  const proc = sessions.get(userId);
  if (proc) {
    proc.kill();
    sessions.delete(userId);
  }
};

module.exports = { createSession, getSession, writeInput, resizeSession, destroySession };

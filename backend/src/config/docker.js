const Dockerode = require('dockerode');

const docker = new Dockerode({ socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock' });

module.exports = docker;

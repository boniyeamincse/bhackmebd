const DockerService = require('../../services/docker.service');

const startTerminal = async (req, res, next) => {
  try {
    const container = await DockerService.getOrCreateContainer(req.user.id);
    res.json({ containerId: container.id, status: 'ready' });
  } catch (err) {
    next(err);
  }
};

const stopTerminal = async (req, res, next) => {
  try {
    await DockerService.killContainer(req.user.id);
    res.json({ message: 'Container stopped' });
  } catch (err) {
    next(err);
  }
};

const terminalStatus = async (req, res, next) => {
  try {
    const status = await DockerService.getContainerStatus(req.user.id);
    res.json({ status });
  } catch (err) {
    next(err);
  }
};

module.exports = { startTerminal, stopTerminal, terminalStatus };

const TerminalService = require('../../services/terminal.service');
const DockerService = require('../../services/docker.service');

const terminalHandler = (io, socket) => {
  let ptyProcess = null;

  socket.on('terminal:connect', async ({ lessonId }) => {
    try {
      ptyProcess = await TerminalService.createSession(socket.user.id);

      const dataHandler = (data) => {
        socket.emit('terminal:output', { data });
      };

      ptyProcess.on('data', dataHandler);
      socket.once('disconnect', () => {
        ptyProcess?.off('data', dataHandler);
      });

      socket.emit('terminal:ready', {});
      await DockerService.updateLastActive(socket.user.id);
    } catch (err) {
      socket.emit('terminal:error', { message: err.message });
    }
  });

  socket.on('terminal:input', ({ data }) => {
    TerminalService.writeInput(socket.user.id, data);
    DockerService.updateLastActive(socket.user.id).catch(() => null);
  });

  socket.on('terminal:resize', ({ cols, rows }) => {
    TerminalService.resizeSession(socket.user.id, cols, rows);
    DockerService.updateLastActive(socket.user.id).catch(() => null);
  });

  socket.on('terminal:disconnect', async () => {
    TerminalService.destroySession(socket.user.id);
    await DockerService.updateLastActive(socket.user.id);
  });

  socket.on('disconnect', async () => {
    TerminalService.destroySession(socket.user.id);
    await DockerService.updateLastActive(socket.user.id);
  });
};

module.exports = { terminalHandler };

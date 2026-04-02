const TerminalService = require('../../services/terminal.service');
const DockerService = require('../../services/docker.service');

const terminalHandler = (io, socket) => {
  let ptyProcess = null;

  socket.on('terminal:connect', async ({ lessonId }) => {
    try {
      ptyProcess = await TerminalService.createSession(socket.user.id);

      ptyProcess.on('data', (data) => {
        socket.emit('terminal:output', { data });
      });

      socket.emit('terminal:ready', {});
    } catch (err) {
      socket.emit('terminal:error', { message: err.message });
    }
  });

  socket.on('terminal:input', ({ data }) => {
    ptyProcess?.write(data);
  });

  socket.on('terminal:resize', ({ cols, rows }) => {
    ptyProcess?.resize(cols, rows);
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

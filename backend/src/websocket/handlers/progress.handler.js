const ValidatorService = require('../../services/validator.service');
const XpService = require('../../services/xp.service');
const prisma = require('../../config/database');

const progressHandler = (io, socket) => {
  socket.on('task:validate', async ({ taskId, output }) => {
    try {
      const task = await prisma.tasks.findUnique({ where: { id: taskId } });
      if (!task) return socket.emit('task:result', { success: false, message: 'Task not found' });

      const passed = ValidatorService.check(task, output);

      if (passed) {
        const award = await XpService.award(socket.user.id, task.xp_reward, taskId);
        socket.emit('task:result', { success: true, xp: task.xp_reward, message: `Correct! +${task.xp_reward} XP` });

        for (const badge of award.badges || []) {
          socket.emit('badge:earned', { badge });
        }
      } else {
        socket.emit('task:result', { success: false, hint: task.hint });
      }
    } catch (err) {
      socket.emit('task:result', { success: false, message: 'Validation error' });
    }
  });
};

module.exports = { progressHandler };

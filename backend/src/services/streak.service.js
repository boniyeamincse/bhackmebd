const redis = require('../config/redis');

const STREAK_PREFIX = 'streak:';
const STREAK_LAST_PREFIX = 'streak:last:';

const todayString = () => new Date().toISOString().slice(0, 10);
const toDayNum = (day) => Number(day.replaceAll('-', ''));

const markDailyLogin = async (userId) => {
  const key = `${STREAK_PREFIX}${userId}`;
  const lastKey = `${STREAK_LAST_PREFIX}${userId}`;

  const today = todayString();
  const last = await redis.get(lastKey);

  if (last === today) {
    const current = parseInt((await redis.get(key)) || '1', 10);
    return current;
  }

  let next = 1;
  if (last) {
    const diff = toDayNum(today) - toDayNum(last);
    next = diff === 1 ? parseInt((await redis.get(key)) || '0', 10) + 1 : 1;
  }

  await redis.set(key, String(next));
  await redis.set(lastKey, today);
  return next;
};

const getStreak = async (userId) => {
  const current = await redis.get(`${STREAK_PREFIX}${userId}`);
  return parseInt(current || '0', 10);
};

module.exports = { markDailyLogin, getStreak };

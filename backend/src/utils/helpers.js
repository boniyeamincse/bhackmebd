const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const paginate = (page = 1, limit = 20) => ({
  skip: (page - 1) * limit,
  take: limit,
});

module.exports = { sleep, paginate };

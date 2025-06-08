const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getStats = async (req, res, next) => {
  try {
    const users = await prisma.user.count();
    const capsules = await prisma.capsule.count();

    res.status(200).json({ users, capsules });
  } catch (err) {
    next(err);
  }
};

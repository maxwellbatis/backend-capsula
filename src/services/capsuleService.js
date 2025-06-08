const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAll = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.coupleId) throw new Error('Usuário não está em um casal.');
    return await prisma.capsule.findMany({
      where: { coupleId: user.coupleId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err) {
    console.error('Erro em getAll:', err);
    throw err;
  }
};

exports.getById = async (userId, capsuleId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.coupleId) throw new Error('Usuário não está em um casal.');
    const capsule = await prisma.capsule.findUnique({ where: { id: capsuleId } });
    if (!capsule || capsule.coupleId !== user.coupleId) throw new Error('Cápsula não encontrada ou acesso negado.');
    return capsule;
  } catch (err) {
    console.error('Erro em getById:', err);
    throw err;
  }
};

exports.create = async (userId, data) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.coupleId) throw new Error('Usuário não está em um casal.');
    console.log('Criando cápsula para userId:', userId, 'com coupleId:', user.coupleId);
    return await prisma.capsule.create({
      data: {
        ...data,
        userId,
        coupleId: user.coupleId,
      },
    });
  } catch (err) {
    console.error('Erro em create:', err);
    throw err;
  }
};

exports.update = async (userId, capsuleId, data) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.coupleId) throw new Error('Usuário não está em um casal.');
    const capsule = await prisma.capsule.findUnique({ where: { id: capsuleId } });
    if (!capsule || capsule.coupleId !== user.coupleId) throw new Error('Cápsula não encontrada ou acesso negado.');
    return await prisma.capsule.update({ where: { id: capsuleId }, data });
  } catch (err) {
    console.error('Erro em update:', err);
    throw err;
  }
};

exports.delete = async (userId, capsuleId) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.coupleId) throw new Error('Usuário não está em um casal.');
    const capsule = await prisma.capsule.findUnique({ where: { id: capsuleId } });
    if (!capsule || capsule.coupleId !== user.coupleId) throw new Error('Cápsula não encontrada ou acesso negado.');
    return await prisma.capsule.delete({ where: { id: capsuleId } });
  } catch (err) {
    console.error('Erro em delete:', err);
    throw err;
  }
};

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const dreams = await prisma.dream.findMany({
      where: { coupleId: user.coupleId },
      orderBy: { dueDate: 'asc' },
    });
    res.json(dreams);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar sonhos.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) return res.status(400).json({ message: 'Título e data são obrigatórios.' });
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const dream = await prisma.dream.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        userId: user.id,
        coupleId: user.coupleId,
      },
    });
    res.status(201).json(dream);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao criar sonho.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    const id = req.params.id;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const dream = await prisma.dream.findUnique({ where: { id } });
    if (!dream || dream.coupleId !== user.coupleId) return res.status(404).json({ message: 'Sonho não encontrado.' });
    const updated = await prisma.dream.update({
      where: { id },
      data: {
        title: title ?? dream.title,
        dueDate: dueDate ? new Date(dueDate) : dream.dueDate,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao atualizar sonho.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const dream = await prisma.dream.findUnique({ where: { id } });
    if (!dream || dream.coupleId !== user.coupleId) return res.status(404).json({ message: 'Sonho não encontrado.' });
    await prisma.dream.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao excluir sonho.' });
  }
};

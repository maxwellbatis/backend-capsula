const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getRandomCapsule = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const total = await prisma.capsule.count({ where: { coupleId: user.coupleId } });
    if (total === 0) return res.status(404).json({ message: 'Nenhuma cápsula encontrada.' });
    const skip = Math.floor(Math.random() * total);
    const [capsule] = await prisma.capsule.findMany({ where: { coupleId: user.coupleId }, skip, take: 1 });
    res.json(capsule);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar cápsula aleatória.' });
  }
};

exports.getNextDream = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const dream = await prisma.dream.findFirst({
      where: { coupleId: user.coupleId, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
    });
    if (!dream) return res.status(404).json({ message: 'Nenhum sonho futuro encontrado.' });
    const countdown = Math.ceil((new Date(dream.date) - new Date()) / (1000 * 60 * 60 * 24));
    res.json({ ...dream, countdown });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar sonho futuro.' });
  }
};

exports.getCoupleStats = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const coupleId = user.coupleId;
    const totalCapsules = await prisma.capsule.count({ where: { coupleId } });
    const totalPhotos = await prisma.capsule.count({ where: { coupleId, imageUrl: { not: null } } });
    // Sequência de dias consecutivos com cápsulas
    const capsules = await prisma.capsule.findMany({
      where: { coupleId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });
    let maxStreak = 0, currentStreak = 0, lastDate = null;
    for (const cap of capsules) {
      const date = cap.createdAt.toISOString().slice(0, 10);
      if (lastDate === null) {
        currentStreak = 1;
      } else {
        const diff = (new Date(lastDate) - new Date(date)) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else if (diff > 1) {
          currentStreak = 1;
        }
      }
      if (currentStreak > maxStreak) maxStreak = currentStreak;
      lastDate = date;
    }
    res.json({ totalCapsules, totalPhotos, maxStreak });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
  }
};

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const upload = multer();
const { z } = require('zod');

// Schemas Zod para validação
const diarySchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  content: z.string().min(1, 'Conteúdo obrigatório'),
  imageUrl: z.string().url().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  momentAt: z.string().datetime().optional(),
});

const milestoneSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().nullable().optional(),
  date: z.string().datetime({ message: 'Data inválida' }),
  imageUrl: z.string().url().nullable().optional(),
});

const memorySchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().nullable().optional(),
  date: z.string().datetime({ message: 'Data inválida' }),
  imageUrl: z.string().url().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
});

// Upload de imagem/vídeo para galeria do casal
router.post('/gallery/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado.' });
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const description = req.body.description || null;
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'amorarium/gallery' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    const result = await streamUpload(req.file.buffer);
    const entry = await prisma.galleryEntry.create({
      data: {
        coupleId: user.coupleId,
        description,
        title: description || 'Foto',
        imageUrl: result.secure_url,
        userId: req.user.userId,
      },
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error('Erro no upload da galeria:', err);
    res.status(500).json({ message: 'Erro ao fazer upload.' });
  }
});

// Listar galeria do casal
router.get('/gallery', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const gallery = await prisma.galleryEntry.findMany({
      where: { coupleId: user.coupleId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(gallery);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar galeria.' });
  }
});

// Diário do casal
router.post('/diary', authenticate, async (req, res) => {
  const parsed = diarySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
  }
  try {
    const { title, content, imageUrl, videoUrl, momentAt } = parsed.data;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const entry = await prisma.diaryEntry.create({
      data: {
        title,
        content,
        imageUrl,
        videoUrl,
        momentAt: momentAt ? new Date(momentAt) : undefined,
        coupleId: user.coupleId,
      },
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao criar entrada do diário.' });
  }
});

router.get('/diary', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const entries = await prisma.diaryEntry.findMany({
      where: { coupleId: user.coupleId },
      orderBy: { momentAt: 'desc' },
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar diário.' });
  }
});

router.get('/diary/:id', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const entry = await prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry || entry.coupleId !== user.coupleId) return res.status(404).json({ message: 'Entrada não encontrada.' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar entrada.' });
  }
});

// PUT Diary com validação Zod
router.put('/diary/:id', authenticate, async (req, res) => {
  const parsed = diarySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
  }
  try {
    const id = Number(req.params.id);
    const { title, content, imageUrl, videoUrl, momentAt } = parsed.data;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const entry = await prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry || entry.coupleId !== user.coupleId) return res.status(404).json({ message: 'Entrada não encontrada.' });
    const updated = await prisma.diaryEntry.update({
      where: { id },
      data: { title, content, imageUrl, videoUrl, momentAt: momentAt ? new Date(momentAt) : undefined },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao atualizar entrada.' });
  }
});

router.delete('/diary/:id', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const entry = await prisma.diaryEntry.findUnique({ where: { id } });
    if (!entry || entry.coupleId !== user.coupleId) return res.status(404).json({ message: 'Entrada não encontrada.' });
    await prisma.diaryEntry.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao excluir entrada.' });
  }
});

// CRUD Marcos (Milestones)
router.post('/milestones', authenticate, upload.single('file'), async (req, res) => {
  const parsed = milestoneSchema.safeParse({
    ...req.body,
    imageUrl: req.body.imageUrl || undefined,
  });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    let imageUrl = parsed.data.imageUrl || null;
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'amorarium/milestones' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
    }
    const { title, description, date } = parsed.data;
    const milestone = await prisma.milestone.create({
      data: {
        title,
        description,
        date: new Date(date),
        imageUrl,
        coupleId: user.coupleId,
      },
    });
    res.status(201).json(milestone);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao criar marco.' });
  }
});

router.get('/milestones', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const milestones = await prisma.milestone.findMany({
      where: { coupleId: user.coupleId },
      orderBy: { date: 'desc' },
    });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar marcos.' });
  }
});

// PUT Milestones com validação Zod
router.put('/milestones/:id', authenticate, async (req, res) => {
  const parsed = milestoneSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
  }
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone || milestone.coupleId !== user.coupleId) return res.status(404).json({ message: 'Marco não encontrado.' });
    const { title, description, date, imageUrl } = parsed.data;
    const updated = await prisma.milestone.update({
      where: { id },
      data: { title, description, date: date ? new Date(date) : undefined, imageUrl },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao atualizar marco.' });
  }
});

router.delete('/milestones/:id', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const milestone = await prisma.milestone.findUnique({ where: { id } });
    if (!milestone || milestone.coupleId !== user.coupleId) return res.status(404).json({ message: 'Marco não encontrado.' });
    await prisma.milestone.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao excluir marco.' });
  }
});

// CRUD Lembranças (Memories)
router.post('/memories', authenticate, upload.single('file'), async (req, res) => {
  // Para upload, mistura req.body e campos de arquivo
  const parsed = memorySchema.safeParse({
    ...req.body,
    imageUrl: req.body.imageUrl || undefined,
    videoUrl: req.body.videoUrl || undefined,
  });
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    let imageUrl = parsed.data.imageUrl || null;
    let videoUrl = parsed.data.videoUrl || null;
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'amorarium/memories' },
            (error, result) => {
              if (result) {
                if (result.resource_type === 'video') videoUrl = result.secure_url;
                else imageUrl = result.secure_url;
                resolve(result);
              } else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };
      const result = await streamUpload(req.file.buffer);
      if (result.resource_type === 'video') videoUrl = result.secure_url;
      else imageUrl = result.secure_url;
    }
    const { title, description, date } = parsed.data;
    const memory = await prisma.memory.create({
      data: {
        title,
        description,
        date: new Date(date),
        imageUrl,
        videoUrl,
        coupleId: user.coupleId,
      },
    });
    res.status(201).json(memory);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao criar lembrança.' });
  }
});

router.get('/memories', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const memories = await prisma.memory.findMany({
      where: { coupleId: user.coupleId },
      orderBy: { date: 'desc' },
    });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar lembranças.' });
  }
});

router.put('/memories/:id', authenticate, async (req, res) => {
  const parsed = memorySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
  }
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const memory = await prisma.memory.findUnique({ where: { id } });
    if (!memory || memory.coupleId !== user.coupleId) return res.status(404).json({ message: 'Lembrança não encontrada.' });
    const { title, description, date, imageUrl, videoUrl } = parsed.data;
    const updated = await prisma.memory.update({
      where: { id },
      data: { title, description, date: date ? new Date(date) : undefined, imageUrl, videoUrl },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao atualizar lembrança.' });
  }
});

router.delete('/memories/:id', authenticate, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(400).json({ message: 'Usuário não está em um casal.' });
    const memory = await prisma.memory.findUnique({ where: { id } });
    if (!memory || memory.coupleId !== user.coupleId) return res.status(404).json({ message: 'Lembrança não encontrada.' });
    await prisma.memory.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao excluir lembrança.' });
  }
});

module.exports = router;

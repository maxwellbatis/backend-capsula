const { z } = require('zod');
const capsuleService = require('../services/capsuleService');

const capsuleCreateSchema = z.object({
  title: z.string().min(2, 'Título muito curto'),
  content: z.string().optional(),
  imageUrl: z.string().url('URL de imagem inválida').optional().or(z.literal('').optional()),
  musicUrl: z.string().url('URL de música inválida').optional().or(z.literal('').optional()),
  location: z.string().optional(),
});

const capsuleUpdateSchema = z.object({
  title: z.string().min(2, 'Título muito curto').optional(),
  content: z.string().optional(),
  imageUrl: z.string().url('URL de imagem inválida').optional().or(z.literal('').optional()),
  musicUrl: z.string().url('URL de música inválida').optional().or(z.literal('').optional()),
  location: z.string().optional(),
});

exports.getAll = async (req, res, next) => {
  try {
    const capsules = await capsuleService.getAll(req.user.userId);
    res.json(capsules);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao buscar cápsulas.' });
  }
};

exports.getById = async (req, res, next) => {
  try {
    const capsuleId = Number(req.params.id);
    if (isNaN(capsuleId)) return res.status(400).json({ message: 'ID inválido.' });
    const capsule = await capsuleService.getById(req.user.userId, capsuleId);
    res.json(capsule);
  } catch (err) {
    res.status(404).json({ message: err.message || 'Cápsula não encontrada.' });
  }
};

exports.create = async (req, res, next) => {
  try {
    const parsed = capsuleCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
    }
    const newCapsule = await capsuleService.create(req.user.userId, parsed.data);
    res.status(201).json(newCapsule);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao criar cápsula.' });
  }
};

exports.update = async (req, res, next) => {
  try {
    const capsuleId = Number(req.params.id);
    if (isNaN(capsuleId)) return res.status(400).json({ message: 'ID inválido.' });
    const parsed = capsuleUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
    }
    const updated = await capsuleService.update(req.user.userId, capsuleId, parsed.data);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao atualizar cápsula.' });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const capsuleId = Number(req.params.id);
    if (isNaN(capsuleId)) return res.status(400).json({ message: 'ID inválido.' });
    await capsuleService.delete(req.user.userId, capsuleId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: err.message || 'Erro ao excluir cápsula.' });
  }
};

const express = require('express');
const router = express.Router();
const isAdmin = require('../middlewares/isAdmin');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Usuários
router.get('/users', isAdmin, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.put('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const user = await prisma.user.update({ where: { id }, data });
  res.json(user);
});

router.delete('/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.status(204).send();
});

router.patch('/users/:id/plan', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { plan } = req.body;
  const user = await prisma.user.update({ where: { id }, data: { plan } });
  res.json(user);
});

router.patch('/users/:id/admin', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { isAdmin: adminStatus } = req.body;
  const user = await prisma.user.update({ where: { id }, data: { isAdmin: !!adminStatus } });
  res.json(user);
});

// Casais
router.get('/couples', isAdmin, async (req, res) => {
  const couples = await prisma.couple.findMany({ include: { users: true } });
  res.json(couples);
});

router.put('/couples/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const couple = await prisma.couple.update({ where: { id }, data });
  res.json(couple);
});

router.delete('/couples/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.couple.delete({ where: { id } });
  res.status(204).send();
});

// Planos
router.get('/plans', isAdmin, async (req, res) => {
  const plans = await prisma.plan.findMany();
  res.json(plans);
});

router.post('/plans', isAdmin, async (req, res) => {
  const plan = await prisma.plan.create({ data: req.body });
  res.status(201).json(plan);
});

router.put('/plans/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const plan = await prisma.plan.update({ where: { id }, data: req.body });
  res.json(plan);
});

router.delete('/plans/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.plan.delete({ where: { id } });
  res.status(204).send();
});

// Notificações (exemplo simples, ajuste conforme sua modelagem)
router.post('/notifications', isAdmin, async (req, res) => {
  // Exemplo: salvar notificação no banco ou enviar via serviço externo
  // await prisma.notification.create({ data: req.body });
  res.status(201).json({ message: 'Notificação enviada (implemente o serviço)' });
});

router.get('/notifications', isAdmin, async (req, res) => {
  // const notifications = await prisma.notification.findMany();
  res.json([]); // Implemente conforme sua modelagem
});

// Gamificação (Achievements)
router.get('/achievements', isAdmin, async (req, res) => {
  const achievements = await prisma.achievement.findMany();
  res.json(achievements);
});

router.post('/achievements', isAdmin, async (req, res) => {
  const achievement = await prisma.achievement.create({ data: req.body });
  res.status(201).json(achievement);
});

router.put('/achievements/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const achievement = await prisma.achievement.update({ where: { id }, data: req.body });
  res.json(achievement);
});

router.delete('/achievements/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  await prisma.achievement.delete({ where: { id } });
  res.status(204).send();
});

module.exports = router;
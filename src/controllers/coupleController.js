const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const crypto = require('crypto');
const { sendInviteEmail } = require('../services/emailService');
const prisma = new PrismaClient();

const inviteSchema = z.object({
  partnerEmail: z.string().email('Email do parceiro inválido'),
});

// Schema de validação para nome do casal
const coupleNameSchema = z.object({
  name: z.string().min(3, 'Nome do casal deve ter pelo menos 3 caracteres'),
});

// Envia convite para formar casal
exports.invite = async (req, res, next) => {
  try {
    const parsed = inviteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
    }
    const { partnerEmail } = parsed.data;
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('Usuário não encontrado:', userId);
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (user.coupleId) {
      console.warn('Usuário já está em um casal:', userId);
      return res.status(400).json({ message: 'Usuário já está em um casal.' });
    }

    const partner = await prisma.user.findUnique({ where: { email: partnerEmail } });
    if (!partner) {
      console.error('Parceiro não encontrado:', partnerEmail);
      return res.status(404).json({ message: 'Parceiro não encontrado.' });
    }
    if (partner.coupleId) {
      console.warn('Parceiro já está em um casal:', partnerEmail);
      return res.status(400).json({ message: 'Parceiro já está em um casal.' });
    }

    // Gera token único
    const token = crypto.randomBytes(24).toString('hex');
    
    // Salva o token temporariamente no próprio usuário
    await prisma.user.update({ 
      where: { id: user.id }, 
      data: { 
        inviteToken: token,
        inviteTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expira em 24 horas
      } 
    });

    // Gera o link de convite
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-invite/${token}`;

    // Envia o e-mail de convite
    await sendInviteEmail(partnerEmail, user.name, inviteLink);

    res.status(200).json({ 
      message: `Convite enviado para ${partnerEmail}.`,
      inviteLink // Retorna o link também para compartilhamento manual
    });
  } catch (err) {
    console.error('Erro em invite:', err);
    next(err);
  }
};

// Aceita convite e forma casal
exports.accept = async (req, res, next) => {
  try {
    const parsed = inviteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
    }
    const { partnerEmail } = parsed.data;
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('Usuário não encontrado:', userId);
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (user.coupleId) {
      console.warn('Usuário já está em um casal:', userId);
      return res.status(400).json({ message: 'Usuário já está em um casal.' });
    }

    const partner = await prisma.user.findUnique({ where: { email: partnerEmail } });
    if (!partner) {
      console.error('Parceiro não encontrado:', partnerEmail);
      return res.status(404).json({ message: 'Parceiro não encontrado.' });
    }
    if (partner.coupleId) {
      console.warn('Parceiro já está em um casal:', partnerEmail);
      return res.status(400).json({ message: 'Parceiro já está em um casal.' });
    }

    // Cria o casal
    const couple = await prisma.couple.create({
      data: {
        name: user.coupleName || `${partner.name} & ${user.name}`,
        users: {
          connect: [{ id: user.id }, { id: partner.id }],
        },
      },
    });

    // Atualiza os usuários para terem o coupleId
    await prisma.user.update({ where: { id: user.id }, data: { coupleId: couple.id } });
    await prisma.user.update({ where: { id: partner.id }, data: { coupleId: couple.id } });

    console.log('Casal criado com sucesso:', couple.id);
    res.status(200).json({ message: 'Casal criado com sucesso!', coupleId: couple.id });
  } catch (err) {
    console.error('Erro em accept:', err);
    next(err);
  }
};

const profileSchema = z.object({
  name: z.string().max(100).optional(), // permite editar nome do casal
  description: z.string().max(500).optional(),
  anniversary: z.string().datetime().optional(),
});

exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (user && user.coupleId) {
      const couple = await prisma.couple.findUnique({ where: { id: user.coupleId }, include: { users: true } });
      if (couple) {
        // Retorna tanto o perfil do casal quanto o do usuário logado
        return res.json({
          couple: {
            id: couple.id,
            name: couple.name || '',
            description: couple.description || '',
            anniversary: couple.anniversary || null,
            avatarUrl: couple.avatarUrl || null,
            bannerUrl: couple.bannerUrl || null,
            users: couple.users.map(u => ({ id: u.id, name: u.name, email: u.email, avatarUrl: u.avatarUrl || null })),
          },
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl || null
          }
        });
      }
    }
    if (user) {
      // Retorna apenas o perfil individual
      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || null
        }
      });
    }
    res.status(404).json({ message: 'Usuário não encontrado.' });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    console.log('Body recebido no backend /api/couples/profile:', req.body); // LOG BACKEND
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error('Erro de validação Zod:', parsed.error);
      return res.status(400).json({ message: parsed.error.errors.map(e => e.message).join(', ') });
    }
    if (user && user.coupleId) {
      // Atualiza perfil do casal
      const coupleData = {};
      if (parsed.data.name !== undefined) coupleData.name = parsed.data.name;
      if (parsed.data.description !== undefined) coupleData.description = parsed.data.description;
      if (parsed.data.anniversary !== undefined) coupleData.anniversary = parsed.data.anniversary;
      const updated = await prisma.couple.update({
        where: { id: user.coupleId },
        data: coupleData,
      });
      res.json(updated);
    } else if (user) {
      // Atualiza perfil individual
      const userData = {};
      if (parsed.data.name !== undefined) userData.name = parsed.data.name;
      if (parsed.data.email !== undefined) userData.email = parsed.data.email;
      if (parsed.data.description !== undefined && user.coupleId) userData.description = parsed.data.description;
      if (parsed.data.anniversary !== undefined && user.coupleId) userData.anniversary = parsed.data.anniversary;
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: userData,
      });
      res.json({
        id: `user-${updated.id}`,
        users: [{ id: updated.id, name: updated.name, email: updated.email }],
        description: updated.description || '',
        anniversary: updated.anniversary || null,
        avatarUrl: updated.avatarUrl || null,
        bannerUrl: updated.bannerUrl || null,
        isIndividual: true
      });
    } else {
      res.status(404).json({ message: 'Usuário não encontrado.' });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateProfileImage = async (req, res, url, type) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !user.coupleId) return res.status(404).json({ message: 'Usuário não está em um casal.' });
    const data = type === 'banner' ? { bannerUrl: url } : { avatarUrl: url };
    const updated = await prisma.couple.update({ where: { id: user.coupleId }, data });
    res.status(200).json(updated);
  } catch (err) {
    console.error('Erro ao atualizar imagem do perfil:', err);
    res.status(500).json({ message: 'Erro ao atualizar imagem do perfil.' });
  }
};

// Gera link de convite
exports.generateInviteLink = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (user.coupleId) {
      return res.status(400).json({ message: 'Você já está em um casal' });
    }

    // Gera um token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Cria o convite
    const invite = await prisma.invite.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });

    const inviteLink = `${process.env.FRONTEND_URL}/accept-invite/${token}`;
    res.json({ message: 'Convite gerado com sucesso', token, inviteLink });
  } catch (error) {
    console.error('Erro ao gerar convite:', error);
    res.status(500).json({ message: 'Erro ao gerar convite' });
  }
};

// Rota para buscar informações do convite sem remover
exports.getInviteInfo = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await prisma.invite.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!invite) {
      return res.status(404).json({ message: 'Convite não encontrado' });
    }
    res.json({
      coupleName: invite.user.coupleName || '',
      expiresAt: invite.expiresAt,
      msLeft: new Date(invite.expiresAt) - new Date()
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar convite' });
  }
};

// Aceita convite via link (só remove o convite aqui)
exports.acceptInviteLink = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Não autorizado' });
    }
    // Busca o convite pelo token
    const invite = await prisma.invite.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!invite) {
      return res.status(404).json({ message: 'Convite não encontrado ou expirado' });
    }
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Convite expirado' });
    }
    if (invite.userId === userId) {
      return res.status(400).json({ message: 'Você não pode aceitar seu próprio convite' });
    }
    // Verifica se algum dos usuários já está em um casal
    const [inviter, accepter] = await Promise.all([
      prisma.user.findUnique({ where: { id: invite.userId }, include: { couple: true } }),
      prisma.user.findUnique({ where: { id: userId }, include: { couple: true } }),
    ]);
    if (inviter.coupleId || accepter.coupleId) {
      return res.status(400).json({ message: 'Um dos usuários já está em um casal' });
    }
    // Cria o casal usando o nome definido pelo usuário que criou o convite
    const couple = await prisma.couple.create({
      data: {
        name: inviter.coupleName,
        users: { connect: [{ id: invite.userId }, { id: userId }] },
      },
    });
    // Remove o convite após ser aceito
    await prisma.invite.delete({ where: { id: invite.id } });
    res.json({ message: 'Convite aceito com sucesso', couple });
  } catch (error) {
    console.error('Erro ao aceitar convite:', error);
    res.status(500).json({ message: 'Erro ao aceitar convite' });
  }
};

const updateCoupleName = async (req, res) => {
  try {
    const { name } = coupleNameSchema.parse(req.body);
    const userId = req.userId;

    // Verifica se o usuário existe e está em um casal
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { couple: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (!user.couple) {
      return res.status(400).json({ message: 'Você não está em um casal' });
    }

    // Atualiza o nome do casal
    const couple = await prisma.couple.update({
      where: { id: user.couple.id },
      data: { name },
    });

    res.json({ message: 'Nome do casal atualizado com sucesso', couple });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Erro ao atualizar nome do casal:', error);
    res.status(500).json({ message: 'Erro ao atualizar nome do casal' });
  }
};

exports.updateCoupleName = updateCoupleName;
exports.prisma = prisma;

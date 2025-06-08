const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.invite = async (userId, partnerEmail) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuário não encontrado.');
  if (user.coupleId) throw new Error('Usuário já está em um casal.');

  const partner = await prisma.user.findUnique({ where: { email: partnerEmail } });
  if (!partner) throw new Error('Parceiro não encontrado.');
  if (partner.coupleId) throw new Error('Parceiro já está em um casal.');

  // Aqui poderia salvar convite no banco ou enviar email
  return { message: `Convite enviado para ${partnerEmail}. Peça para aceitar o convite!` };
};

exports.accept = async (userId, partnerEmail) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('Usuário não encontrado.');
  if (user.coupleId) throw new Error('Usuário já está em um casal.');

  const partner = await prisma.user.findUnique({ where: { email: partnerEmail } });
  if (!partner) throw new Error('Parceiro não encontrado.');
  if (partner.coupleId) throw new Error('Parceiro já está em um casal.');

  const couple = await prisma.couple.create({
    data: {
      users: {
        connect: [{ id: user.id }, { id: partner.id }],
      },
    },
  });

  await prisma.user.update({ where: { id: user.id }, data: { coupleId: couple.id } });
  await prisma.user.update({ where: { id: partner.id }, data: { coupleId: couple.id } });

  return { message: 'Casal criado com sucesso!', coupleId: couple.id };
};

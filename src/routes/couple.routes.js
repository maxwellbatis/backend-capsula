const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const coupleController = require('../controllers/coupleController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const upload = multer();

// Upload de avatar/banner do casal
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado.' });
    const type = req.body.type || 'avatar'; // 'avatar' ou 'banner'
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'amorarium/couples' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    const result = await streamUpload(req.file.buffer);
    // Atualiza o perfil do casal
    await coupleController.updateProfileImage(req, res, result.secure_url, type);
  } catch (err) {
    console.error('Erro no upload de perfil:', err);
    res.status(500).json({ message: 'Erro ao fazer upload.' });
  }
});

// Rotas de perfil do casal
router.get('/profile', authenticate, coupleController.getProfile);
router.put('/profile', authenticate, coupleController.updateProfile);

// Rotas de convite
router.post('/invite', authenticate, coupleController.invite);
router.post('/accept', authenticate, coupleController.accept);
router.post('/generate-invite', authenticate, coupleController.generateInviteLink);
router.post('/accept-invite/:token', authenticate, coupleController.acceptInviteLink);
router.get('/invite-info/:token', coupleController.getInviteInfo);

// Rota para atualizar o nome do casal
router.put('/name', authenticate, coupleController.updateCoupleName);

// Rota para atualizar a imagem do perfil do casal
router.put('/profile-image', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada' });
    }

    // Upload para o Cloudinary
    const result = await cloudinary.uploader.upload_stream({
      folder: 'couple-profiles',
      resource_type: 'auto',
    }).end(req.file.buffer);

    // Atualiza o avatar do casal
    const couple = await prisma.couple.update({
      where: { id: req.user.coupleId },
      data: { avatarUrl: result.secure_url },
    });

    res.json({ message: 'Imagem atualizada com sucesso', couple });
  } catch (error) {
    console.error('Erro ao atualizar imagem:', error);
    res.status(500).json({ message: 'Erro ao atualizar imagem' });
  }
});

module.exports = router;

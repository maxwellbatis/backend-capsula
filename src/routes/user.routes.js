const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const userController = require('../controllers/authController');

const upload = multer();

// Upload de avatar/banner do usuário individual
router.post('/profile/avatar', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado.' });
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'amorarium/users' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    const result = await streamUpload(req.file.buffer);
    await userController.updateProfileImage(req, res, result.secure_url, 'avatar');
  } catch (err) {
    console.error('Erro no upload de avatar:', err);
    res.status(500).json({ message: 'Erro ao fazer upload.' });
  }
});

router.post('/profile/banner', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado.' });
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'amorarium/users' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    const result = await streamUpload(req.file.buffer);
    await userController.updateProfileImage(req, res, result.secure_url, 'banner');
  } catch (err) {
    console.error('Erro no upload de banner:', err);
    res.status(500).json({ message: 'Erro ao fazer upload.' });
  }
});

module.exports = router;

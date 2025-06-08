const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');
const upload = multer();
const capsuleController = require('../controllers/capsuleController');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/', authenticate, capsuleController.getAll);
router.get('/:id', authenticate, capsuleController.getById);
router.post('/', authenticate, capsuleController.create);
router.put('/:id', authenticate, capsuleController.update);
router.delete('/:id', authenticate, capsuleController.delete);
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado.' });
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };
    const result = await streamUpload(req.file.buffer);
    res.status(201).json({ url: result.secure_url });
  } catch (err) {
    console.error('Erro no upload:', err);
    res.status(500).json({ message: 'Erro ao fazer upload.' });
  }
});
// Criação de cápsula com upload integrado (opcional)
router.post('/with-upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl || null;
    if (req.file) {
      const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
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
    // O restante dos dados vem do body
    const { title, content, musicUrl, location } = req.body;
    // Validação básica (pode usar Zod se quiser)
    if (!title || title.length < 2) return res.status(400).json({ message: 'Título muito curto' });
    const newCapsule = await require('../services/capsuleService').create(req.user.userId, {
      title,
      content,
      imageUrl,
      musicUrl,
      location,
    });
    res.status(201).json(newCapsule);
  } catch (err) {
    console.error('Erro ao criar cápsula com upload:', err);
    res.status(400).json({ message: err.message || 'Erro ao criar cápsula.' });
  }
});

module.exports = router;

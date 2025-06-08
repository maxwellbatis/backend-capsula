const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Verificar se o usuário é admin (assumindo que isAdmin está no token)
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = isAdmin;
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

// Configuração do transporter do nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Template do e-mail de convite
const inviteTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px;
      background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .content {
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
      color: white;
      text-decoration: none;
      border-radius: 25px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="color: white; margin: 0;">Amorarium</h1>
    <p style="color: white; margin: 10px 0 0;">Seu espaço de amor</p>
  </div>
  
  <div class="content">
    <h2>Olá!</h2>
    <p>{{inviterName}} te convidou para formar um casal no Amorarium!</p>
    <p>Juntos vocês poderão:</p>
    <ul>
      <li>Criar cápsulas do tempo</li>
      <li>Compartilhar memórias especiais</li>
      <li>Planejar sonhos juntos</li>
      <li>E muito mais!</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="{{inviteLink}}" class="button">Aceitar Convite</a>
    </div>
    
    <p>Se o botão não funcionar, você pode copiar e colar este link no seu navegador:</p>
    <p style="word-break: break-all; color: #666;">{{inviteLink}}</p>
  </div>
  
  <div class="footer">
    <p>Este convite expira em 24 horas.</p>
    <p>© 2024 Amorarium. Todos os direitos reservados.</p>
  </div>
</body>
</html>
`;

// Compila o template
const compiledTemplate = handlebars.compile(inviteTemplate);

// Função para enviar e-mail de convite
async function sendInviteEmail(partnerEmail, inviterName, inviteLink) {
  try {
    const html = compiledTemplate({
      inviterName,
      inviteLink,
    });

    const mailOptions = {
      from: `"Amorarium" <${process.env.SMTP_USER}>`,
      to: partnerEmail,
      subject: `${inviterName} te convidou para o Amorarium! 💕`,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Falha ao enviar e-mail de convite');
  }
}

module.exports = {
  sendInviteEmail,
}; 
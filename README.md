# Amorarium Backend

Este é o backend do projeto Amorarium, uma API REST desenvolvida em Node.js, Express e Prisma, com autenticação JWT e banco de dados PostgreSQL. O objetivo é gerenciar usuários, cápsulas do tempo, sonhos, galeria de momentos e diário do casal.

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI:

**Local:** http://localhost:4000/api-docs
**Produção:** https://api.amorarium.com/api-docs

## 🚀 Funcionalidades

- ✅ Cadastro e login de usuários
- ✅ Sistema de casais com convites
- ✅ Cápsulas do tempo com upload de mídia
- ✅ Galeria de fotos e vídeos
- ✅ Diário do casal
- ✅ Marcos importantes
- ✅ Lembranças especiais
- ✅ Dashboard com estatísticas
- ✅ Painel administrativo
- ✅ Upload de arquivos (Cloudinary)
- ✅ Autenticação JWT
- ✅ Documentação Swagger

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT (JSON Web Token)
- **Segurança:** Bcrypt, Helmet, CORS, Rate Limit
- **Upload:** Cloudinary
- **Documentação:** Swagger/OpenAPI
- **Validação:** Zod

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL
- Conta no Cloudinary (para uploads)

## 🔧 Instalação

1. **Clone o repositório:**
  ```bash
  git clone <url-do-repo>
  cd amorarium-backend
  ```

2. **Instale as dependências:**
  ```bash
  npm install
  ```

3. **Configure as variáveis de ambiente:**
  Crie um arquivo `.env` na raiz do projeto:
  ```env
  DATABASE_URL="postgresql://usuario:senha@localhost:5432/amorarium_db"
  JWT_SECRET="sua_chave_secreta_muito_segura"
   
  # Cloudinary (para uploads)
  CLOUDINARY_CLOUD_NAME="seu_cloud_name"
  CLOUDINARY_API_KEY="sua_api_key"
  CLOUDINARY_API_SECRET="seu_api_secret"
   
  # Servidor
  PORT=4000
  NODE_ENV=development
  ```

4. **Configure o banco de dados:**
  ```bash
  # Gerar o cliente Prisma
  npx prisma generate
   
  # Executar migrações
  npx prisma migrate deploy
   
  # (Opcional) Popular com dados de exemplo
  npx prisma db seed
  ```

5. **Inicie o servidor:**
  ```bash
  # Desenvolvimento
  npm run dev
   
  # Produção
  npm start
  ```

  O servidor estará rodando em: http://localhost:4000
  Documentação disponível em: http://localhost:4000/api-docs

## 📖 Como Usar

### Autenticação

Todas as rotas protegidas requerem o token JWT no header:
```
Authorization: Bearer <seu_token_jwt>
```

### Exemplos de Uso

#### 1. Cadastro de Usuário
```bash
curl -X POST http://localhost:4000/api/auth/register \
 -H "Content-Type: application/json" \
 -d '{
   "name": "João Silva",
   "email": "joao@email.com",
   "password": "minhasenha123"
 }'
```

#### 2. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
 -H "Content-Type: application/json" \
 -d '{
   "email": "joao@email.com",
   "password": "minhasenha123"
 }'
```

#### 3. Criar Cápsula
```bash
curl -X POST http://localhost:4000/api/capsules \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer <SEU_TOKEN>" \
 -d '{
   "title": "Nossa primeira viagem",
   "content": "Visitamos Paris juntos...",
   "location": "Paris, França"
 }'
```

#### 4. Upload de Imagem
```bash
curl -X POST http://localhost:4000/api/capsules/upload \
 -H "Authorization: Bearer <SEU_TOKEN>" \
 -F "file=@/caminho/para/imagem.jpg"
```

### Principais Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api-docs` | Documentação Swagger |
| `POST` | `/api/auth/register` | Cadastrar usuário |
| `POST` | `/api/auth/login` | Fazer login |
| `GET` | `/api/auth/me` | Dados do usuário |
| `GET` | `/api/couples/profile` | Perfil do casal |
| `POST` | `/api/couples/invite` | Convidar parceiro |
| `GET` | `/api/capsules` | Listar cápsulas |
| `POST` | `/api/capsules` | Criar cápsula |
| `GET` | `/api/gallery` | Galeria do casal |
| `POST` | `/api/diary` | Criar entrada no diário |
| `GET` | `/api/admin/stats` | Estatísticas (admin) |

## 🏗️ Estrutura do Projeto

```
amorarium-backend/
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── migrations/            # Migrações
├── src/
│   ├── config/
│   │   └── swagger.js         # Configuração Swagger
│   ├── controllers/           # Lógica das rotas
│   ├── routes/               # Definição das rotas
│   ├── middlewares/          # Middlewares
│   ├── services/             # Serviços
│   └── docs/
│       └── schemas.js        # Schemas Swagger
├── server.js                 # Servidor principal
├── package.json
└── README.md
```

## 👨‍💼 Administração

Para tornar um usuário administrador:
```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'admin@email.com';
```

## 🧪 Testes

Para testar a API, você pode usar:
- **Swagger UI:** http://localhost:4000/api-docs
- **Postman/Insomnia:** Importe a collection OpenAPI
- **cURL:** Exemplos fornecidos acima

## 🚀 Deploy

### Usando Docker
```bash
# Build da imagem
docker build -t amorarium-api .

# Executar container
docker run -p 4000:4000 --env-file .env amorarium-api
```

### Plataformas Recomendadas
- **Render:** Deploy automático via GitHub
- **Railway:** Fácil configuração de banco
- **Heroku:** Clássico e confiável
- **Vercel:** Para APIs serverless

## 📄 Licença

Este projeto é livre para uso educacional.

---

**Desenvolvido com ❤️ para casais apaixonados**
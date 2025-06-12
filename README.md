# Amorarium Backend

Este é o backend do projeto Amorarium, uma API REST desenvolvida em Node.js, Express e Prisma, com autenticação JWT e banco de dados PostgreSQL. O objetivo é gerenciar usuários, casais, cápsulas do tempo, sonhos, galeria de momentos, diário do casal e recursos administrativos.

---

## 📚 Documentação da API

A documentação completa da API está disponível via Swagger UI:

- **Local:** http://localhost:4000/api-docs
- **Produção:** https://api.amorarium.com/api-docs

---

## 🚀 Funcionalidades

- Cadastro e login de usuários
- Sistema de casais com convites por e-mail
- Aceitação de convite via link/token
- Cápsulas do tempo com upload de mídia
- Galeria de fotos e vídeos
- Diário do casal
- Marcos e lembranças especiais
- Dashboard com estatísticas do relacionamento
- Painel administrativo para gestão do sistema
- Upload de arquivos (Cloudinary)
- Autenticação JWT
- Documentação Swagger

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Autenticação:** JWT (JSON Web Token)
- **Segurança:** Bcrypt, Helmet, CORS, Rate Limit
- **Upload:** Cloudinary
- **Documentação:** Swagger/OpenAPI
- **Validação:** Zod

---

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL
- Conta no Cloudinary (para uploads)

---

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
   CLOUDINARY_CLOUD_NAME="seu_cloud_name"
   CLOUDINARY_API_KEY="sua_api_key"
   CLOUDINARY_API_SECRET="seu_api_secret"
   PORT=4000
   NODE_ENV=development
   ```

4. **Configure o banco de dados:**
   ```bash
   npx prisma generate
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

---

## 🧭 Fluxo do Usuário

### 1. Cadastro e Login

- O usuário se cadastra informando nome, e-mail, senha e nome do casal.
- Após o cadastro, recebe um token JWT e já pode acessar as rotas protegidas.
- O login retorna um token JWT para autenticação nas próximas requisições.

### 2. Criação e Aceitação de Convite

- Um usuário cadastrado pode convidar o parceiro(a) via e-mail.
- O parceiro recebe um link/token para aceitar o convite e criar o casal.
- Após aceitar, ambos têm acesso compartilhado ao conteúdo do casal.

### 3. Funcionalidades do Casal

- **Cápsulas do tempo:** Criar, listar, editar, deletar, fazer upload de imagens.
- **Galeria:** Upload e visualização de fotos e vídeos.
- **Diário:** Entradas de texto, fotos, vídeos.
- **Sonhos:** Metas e sonhos do casal.
- **Marcos e lembranças:** Registrar datas e memórias especiais.
- **Perfil:** Editar informações do casal e dos usuários.
- **Dashboard:** Estatísticas do relacionamento.

### 4. Painel Administrativo

- Usuários com `isAdmin: true` podem acessar rotas administrativas.
- O painel permite visualizar estatísticas globais, usuários cadastrados, casais, cápsulas criadas, fotos, sonhos, etc.
- Para tornar um usuário administrador:
  ```sql
  UPDATE "User" SET "isAdmin" = true WHERE email = 'admin@email.com';
  ```
- O frontend pode consumir `/api/admin/stats` para exibir dados no painel.

---

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

#### 5. Aceitar Convite de Casal
```bash
curl -X POST http://localhost:4000/api/couples/accept-invite/<token>
```

---

## 🌐 Principais Endpoints

| Método | Endpoint                                 | Descrição                                 |
|--------|------------------------------------------|-------------------------------------------|
| GET    | `/api-docs`                             | Documentação Swagger                      |
| POST   | `/api/auth/register`                    | Cadastrar usuário                         |
| POST   | `/api/auth/login`                       | Fazer login                               |
| GET    | `/api/auth/me`                          | Dados do usuário autenticado              |
| GET    | `/api/couples/profile`                  | Perfil do casal                           |
| POST   | `/api/couples/invite`                   | Convidar parceiro                         |
| POST   | `/api/couples/accept-invite/:token`     | Aceitar convite via link                  |
| GET    | `/api/couples/invite-info/:token`       | Info do convite                           |
| POST   | `/api/couples/upload`                   | Upload avatar/banner do casal             |
| GET    | `/api/capsules`                         | Listar cápsulas                           |
| POST   | `/api/capsules`                         | Criar cápsula                             |
| POST   | `/api/capsules/upload`                  | Upload imagem cápsula                     |
| POST   | `/api/capsules/with-upload`             | Criar cápsula com upload                  |
| GET    | `/api/gallery/gallery`                  | Listar galeria                            |
| POST   | `/api/gallery/gallery/upload`           | Upload para galeria                       |
| GET    | `/api/gallery/diary`                    | Listar diário                             |
| POST   | `/api/gallery/diary`                    | Criar entrada no diário                   |
| GET    | `/api/gallery/memories`                 | Listar lembranças                         |
| POST   | `/api/gallery/memories`                 | Criar lembrança                           |
| GET    | `/api/gallery/milestones`               | Listar marcos                             |
| POST   | `/api/gallery/milestones`               | Criar marco                               |
| GET    | `/api/admin/stats`                      | Estatísticas do sistema (admin)           |

---

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
│   ├── routes/                # Definição das rotas
│   ├── middlewares/           # Middlewares (auth, admin, erros)
│   ├── services/              # Serviços (negócio, email, upload)
│   └── docs/
│       └── schemas.js         # Schemas Swagger
├── server.js                  # Servidor principal
├── package.json
└── README.md
```

---

## 👨‍💼 Painel Administrativo

- **Acesso:** Apenas usuários com `isAdmin: true` podem acessar rotas administrativas.
- **Endpoint principal:**  
  `GET /api/admin/stats` — retorna estatísticas globais do sistema (total de usuários, casais, cápsulas, fotos, sonhos, etc).
- **Como tornar um usuário admin:**
  ```sql
  UPDATE "User" SET "isAdmin" = true WHERE email = 'admin@email.com';
  ```
- **Sugestão de painel:**  
  O frontend pode consumir `/api/admin/stats` para exibir gráficos, contadores e relatórios no painel administrativo.

---

## 🧪 Testes

Para testar a API, você pode usar:
- **Swagger UI:** http://localhost:4000/api-docs
- **Postman/Insomnia:** Importe a collection OpenAPI
- **cURL:** Exemplos fornecidos acima

---

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

---

## 📄 Licença

Este projeto é livre para uso educacional.

---

**Desenvolvido com ❤️ para casais apaixonados**
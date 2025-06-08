const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let token, token2, coupleId;

beforeAll(async () => {
  // Limpa o banco e cria dois usuários de teste
  await prisma.memory.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.diaryEntry.deleteMany();
  await prisma.galleryEntry.deleteMany();
  await prisma.capsule.deleteMany();
  await prisma.dream.deleteMany();
  await prisma.user.deleteMany();
  await prisma.couple.deleteMany();

  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test User', email: 'test@example.com', password: '12345678' });
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'Partner', email: 'partner@example.com', password: '12345678' });

  const res1 = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: '12345678' });
  token = res1.body.token;
  const res2 = await request(app)
    .post('/api/auth/login')
    .send({ email: 'partner@example.com', password: '12345678' });
  token2 = res2.body.token;

  // Fluxo de casal: convite e aceitação
  await request(app)
    .post('/api/couples/invite')
    .set('Authorization', `Bearer ${token}`)
    .send({ partnerEmail: 'partner@example.com' });
  const acceptRes = await request(app)
    .post('/api/couples/accept')
    .set('Authorization', `Bearer ${token2}`)
    .send({ partnerEmail: 'test@example.com' });
  coupleId = acceptRes.body.coupleId;
});

describe('Auth', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'User2', email: 'user2@example.com', password: '12345678' });
    expect(res.statusCode).toBe(201);
  });

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user2@example.com', password: '12345678' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

describe('Capsules', () => {
  it('should create a capsule', async () => {
    const res = await request(app)
      .post('/api/capsules')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Capsule 1', content: 'Conteúdo' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Capsule 1');
  });

  it('should list capsules', async () => {
    const res = await request(app)
      .get('/api/capsules')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Couple', () => {
  it('should get couple profile', async () => {
    const res = await request(app)
      .get('/api/couples/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBeDefined();
  });

  it('should update couple profile', async () => {
    const res = await request(app)
      .put('/api/couples/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Nova descrição', anniversary: '2025-06-07T00:00:00.000Z' });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('Nova descrição');
  });
});

describe('Dashboard', () => {
  it('should get couple stats', async () => {
    const res = await request(app)
      .get('/api/couples/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.totalCapsules).toBeDefined();
  });
});

describe('Diary', () => {
  let diaryId;
  it('should create a diary entry', async () => {
    const res = await request(app)
      .post('/api/gallery/diary')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Primeiro diário', content: 'Texto', imageUrl: null, videoUrl: null, momentAt: '2025-06-07T00:00:00.000Z' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Primeiro diário');
    diaryId = res.body.id;
  });
  it('should list diary entries', async () => {
    const res = await request(app)
      .get('/api/gallery/diary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('should update a diary entry', async () => {
    const res = await request(app)
      .put(`/api/gallery/diary/${diaryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Editado', content: 'Novo texto', imageUrl: null, videoUrl: null, momentAt: '2025-06-07T00:00:00.000Z' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Editado');
  });
  it('should delete a diary entry', async () => {
    const res = await request(app)
      .delete(`/api/gallery/diary/${diaryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});

describe('Milestones', () => {
  let milestoneId;
  it('should create a milestone', async () => {
    const res = await request(app)
      .post('/api/gallery/milestones')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Primeiro marco')
      .field('description', 'Descrição')
      .field('date', '2025-06-07T00:00:00.000Z');
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Primeiro marco');
    milestoneId = res.body.id;
  });
  it('should list milestones', async () => {
    const res = await request(app)
      .get('/api/gallery/milestones')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('should update a milestone', async () => {
    const res = await request(app)
      .put(`/api/gallery/milestones/${milestoneId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Marco editado', description: 'Nova descrição', date: '2025-06-07T00:00:00.000Z', imageUrl: null });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Marco editado');
  });
  it('should delete a milestone', async () => {
    const res = await request(app)
      .delete(`/api/gallery/milestones/${milestoneId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});

describe('Memories', () => {
  let memoryId;
  it('should create a memory', async () => {
    const res = await request(app)
      .post('/api/gallery/memories')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Primeira lembrança')
      .field('description', 'Descrição')
      .field('date', '2025-06-07T00:00:00.000Z');
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Primeira lembrança');
    memoryId = res.body.id;
  });
  it('should list memories', async () => {
    const res = await request(app)
      .get('/api/gallery/memories')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  it('should update a memory', async () => {
    const res = await request(app)
      .put(`/api/gallery/memories/${memoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Lembrança editada', description: 'Nova descrição', date: '2025-06-07T00:00:00.000Z', imageUrl: null, videoUrl: null });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Lembrança editada');
  });
  it('should delete a memory', async () => {
    const res = await request(app)
      .delete(`/api/gallery/memories/${memoryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

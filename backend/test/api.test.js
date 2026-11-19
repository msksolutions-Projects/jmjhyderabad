/**
 * End-to-end tests for the API. Needs a MongoDB to test against:
 *   TEST_MONGODB_URI=mongodb://127.0.0.1:27017 npm test
 * A fresh database is created for each run and deleted afterwards.
 */
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const request = require('supertest');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-that-is-long-enough-1234567890';
delete process.env.CLOUDINARY_NAME; // files go to the local uploads folder during tests

const { createApp } = require('../src/app');

const URI = process.env.TEST_MONGODB_URI;
const DB = `jmj_test_${Date.now()}`;
let app;
let token;
const auth = () => ({ Authorization: `Bearer ${token}` });

const ADMIN = { name: 'Sr. Test Admin', email: 'Admin@Example.org', password: 'Correct-Horse-9' };
const LONG = 'This is the full text of the article. '.repeat(4);
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

before(async () => {
  if (!URI) throw new Error('Set TEST_MONGODB_URI to run the API tests.');
  await mongoose.connect(URI, { dbName: DB });
  app = createApp();
});

after(async () => {
  await mongoose.connection.dropDatabase().catch(() => {});
  await mongoose.disconnect();
});

test('first-time setup: one admin can register, then registration closes', async () => {
  let res = await request(app).get('/api/v1/auth/setup-status');
  assert.equal(res.body.registrationOpen, true);

  res = await request(app).post('/api/v1/auth/register').send({ ...ADMIN, password: 'short' });
  assert.equal(res.status, 400);

  res = await request(app).post('/api/v1/auth/register').send(ADMIN);
  assert.equal(res.status, 201);
  assert.ok(res.body.token);
  assert.equal(res.body.admin.email, 'admin@example.org');

  res = await request(app).get('/api/v1/auth/setup-status');
  assert.equal(res.body.registrationOpen, false);

  res = await request(app).post('/api/v1/auth/register').send({ ...ADMIN, email: 'intruder@example.org' });
  assert.equal(res.status, 403);
});

test('login, verify, change password, logout', async () => {
  let res = await request(app).post('/api/v1/auth/login').send({ email: ADMIN.email, password: 'wrong-password' });
  assert.equal(res.status, 401);
  assert.equal(res.body.message, 'Wrong email or password.');

  // Email is matched without regard to capital letters.
  res = await request(app).post('/api/v1/auth/login').send({ email: ' ADMIN@example.ORG ', password: ADMIN.password });
  assert.equal(res.status, 200);
  token = res.body.token;
  assert.ok(token);

  res = await request(app).get('/api/v1/auth/verify').set(auth());
  assert.equal(res.status, 200);
  assert.equal(res.body.admin.email, 'admin@example.org');

  res = await request(app).get('/api/v1/auth/verify').set({ Authorization: 'Bearer not-a-real-token' });
  assert.equal(res.status, 401);

  res = await request(app)
    .post('/api/v1/auth/change-password')
    .set(auth())
    .send({ currentPassword: ADMIN.password, newPassword: 'New-Password-77', confirmPassword: 'New-Password-77' });
  assert.equal(res.status, 200);
  res = await request(app).post('/api/v1/auth/login').send({ email: ADMIN.email, password: 'New-Password-77' });
  assert.equal(res.status, 200);
  token = res.body.token;

  res = await request(app).post('/api/v1/auth/logout').set(auth());
  assert.equal(res.status, 200);
});

test('visitors cannot change anything', async () => {
  for (const [method, path] of [
    ['post', '/api/v1/news'],
    ['put', '/api/v1/news/64b000000000000000000000'],
    ['delete', '/api/v1/news/64b000000000000000000000'],
    ['post', '/api/v1/notices'],
    ['delete', '/api/v1/notices/64b000000000000000000000'],
    ['post', '/api/v1/gallery'],
    ['delete', '/api/v1/gallery/64b000000000000000000000'],
    ['post', '/api/v1/uploads'],
    ['get', '/api/v1/contact'],
    ['get', '/api/v1/admin/stats'],
  ]) {
    const res = await request(app)[method](path).send({});
    assert.equal(res.status, 401, `${method.toUpperCase()} ${path} should need sign-in`);
  }
});

test('news: add, edit, delete; visitors see published only', async () => {
  let res = await request(app).post('/api/v1/news').set(auth()).send({ title: 'Hi', excerpt: 'x', content: 'short' });
  assert.equal(res.status, 400);
  assert.match(res.body.message, /at least 5 characters/);

  const attachment = { name: 'Circular.pdf', url: 'https://files.example.org/c.pdf', kind: 'pdf', size: 1200, publicId: 'c.pdf', resourceType: 'raw' };
  res = await request(app)
    .post('/api/v1/news')
    .set(auth())
    .send({ title: 'Province Retreat', excerpt: 'Annual retreat', content: LONG, category: 'events', status: 'published', attachments: [attachment], views: 999, author: '64b000000000000000000000' });
  assert.equal(res.status, 201);
  const published = res.body.data;
  assert.equal(published.slug, 'province-retreat');
  assert.equal(published.attachments.length, 1);
  assert.equal(published.attachments[0].kind, 'pdf');
  assert.equal(published.views, 0, 'views cannot be set by the client');
  assert.ok(published.publishedAt);

  res = await request(app).post('/api/v1/news').set(auth()).send({ title: 'Province Retreat', excerpt: 'Second', content: LONG, status: 'draft' });
  assert.equal(res.status, 201);
  const draft = res.body.data;
  assert.equal(draft.slug, 'province-retreat-2', 'same title gets its own address');

  // Visitors: published only, even when asking for everything.
  res = await request(app).get('/api/v1/news').query({ status: '', limit: 100 });
  assert.deepEqual(res.body.data.map((n) => n._id), [published._id]);
  res = await request(app).get('/api/v1/news').query({ status: 'draft' });
  assert.deepEqual(res.body.data.map((n) => n._id), [published._id]);
  res = await request(app).get(`/api/v1/news/${draft._id}`);
  assert.equal(res.status, 404);

  // Admin: everything.
  res = await request(app).get('/api/v1/news').set(auth()).query({ status: '', limit: 100 });
  assert.equal(res.body.data.length, 2);

  res = await request(app).put(`/api/v1/news/${draft._id}`).set(auth()).send({ title: 'Retreat Reflections', status: 'published', attachments: [] });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.slug, 'retreat-reflections');
  res = await request(app).get('/api/v1/news');
  assert.equal(res.body.data.length, 2);

  res = await request(app).delete(`/api/v1/news/${draft._id}`).set(auth());
  assert.equal(res.status, 200);
  res = await request(app).get('/api/v1/news');
  assert.equal(res.body.data.length, 1);
});

test('notices: add, edit, delete; expired notices are hidden from visitors', async () => {
  const body = { title: 'Retreat timings', content: 'The annual retreat begins on Monday at 9 am in the chapel. All are welcome.', category: 'event', urgency: 'high', status: 'published' };
  let res = await request(app).post('/api/v1/notices').set(auth()).send(body);
  assert.equal(res.status, 201);
  const notice = res.body.data;

  res = await request(app).post('/api/v1/notices').set(auth()).send({ ...body, title: 'Old notice', expiryDate: '2020-01-01' });
  assert.equal(res.status, 201);

  res = await request(app).get('/api/v1/notices').query({ status: 'published', limit: 50 });
  assert.deepEqual(res.body.data.map((n) => n.title), ['Retreat timings']);

  res = await request(app).put(`/api/v1/notices/${notice._id}`).set(auth()).send({ urgency: 'critical' });
  assert.equal(res.body.data.urgency, 'critical');

  res = await request(app).delete(`/api/v1/notices/${notice._id}`).set(auth());
  assert.equal(res.status, 200);
});

test('file uploads for attachments: upload, download, delete', async () => {
  let res = await request(app).post('/api/v1/uploads').set(auth()).attach('file', Buffer.from('%PDF-1.4 test'), { filename: 'Circular No 5.pdf', contentType: 'application/pdf' });
  assert.equal(res.status, 201);
  const file = res.body.data;
  assert.equal(file.kind, 'pdf');
  assert.equal(file.name, 'Circular No 5.pdf');
  assert.equal(file.resourceType, 'local');

  const path = new URL(file.url).pathname;
  res = await request(app).get(path);
  assert.equal(res.status, 200);

  res = await request(app).post('/api/v1/uploads').set(auth()).attach('file', Buffer.from('MZ'), { filename: 'virus.exe', contentType: 'application/x-msdownload' });
  assert.equal(res.status, 400);

  res = await request(app).delete('/api/v1/uploads').set(auth()).send({ publicId: file.publicId, resourceType: file.resourceType });
  assert.equal(res.status, 200);
  res = await request(app).get(path);
  assert.equal(res.status, 404);

  // A file outside the uploads folder can never be deleted.
  res = await request(app).delete('/api/v1/uploads').set(auth()).send({ publicId: '../package.json', resourceType: 'local' });
  assert.equal(res.status, 200);
  assert.ok(require('fs').existsSync(require('path').join(__dirname, '../package.json')));
});

test('gallery: upload, edit, delete; visitors see published photos only', async () => {
  let res = await request(app)
    .post('/api/v1/gallery')
    .set(auth())
    .field('title', 'Feast Day 2026 – 1')
    .field('album', 'Feast Day 2026')
    .field('category', 'celebrations')
    .field('status', 'published')
    .field('sourceFile', 'IMG_0001.jpg')
    .attach('image', PNG, { filename: 'IMG_0001.png', contentType: 'image/png' });
  assert.equal(res.status, 201);
  const photo = res.body.data;
  assert.ok(photo.coverImage.url);
  assert.equal(photo.album, 'Feast Day 2026');
  assert.equal(photo.sourceFile, 'IMG_0001.jpg');

  res = await request(app).post('/api/v1/gallery').set(auth()).field('title', 'Draft photo').field('status', 'draft').attach('image', PNG, { filename: 'b.png', contentType: 'image/png' });
  assert.equal(res.status, 201);

  res = await request(app).post('/api/v1/gallery').set(auth()).field('title', 'Not a photo').attach('image', Buffer.from('%PDF'), { filename: 'x.pdf', contentType: 'application/pdf' });
  assert.equal(res.status, 400);

  res = await request(app).get('/api/v1/gallery').query({ limit: 5000 });
  assert.deepEqual(res.body.data.map((p) => p.title), ['Feast Day 2026 – 1']);
  res = await request(app).get('/api/v1/gallery').set(auth()).query({ status: '', limit: 5000 });
  assert.equal(res.body.data.length, 2);

  res = await request(app).put(`/api/v1/gallery/${photo._id}`).set(auth()).send({ title: 'Feast Day Mass', album: '' });
  assert.equal(res.body.data.title, 'Feast Day Mass');
  assert.equal(res.body.data.album, '');

  const filePath = new URL(photo.coverImage.url).pathname;
  res = await request(app).delete(`/api/v1/gallery/${photo._id}`).set(auth());
  assert.equal(res.status, 200);
  res = await request(app).get(filePath);
  assert.equal(res.status, 404, 'the stored photo is removed too');
});

test('contact form and messages inbox', async () => {
  const message = { fullName: 'Mary Visitor', email: 'mary@example.org', phone: '+91 98765 43210', subject: 'Admission enquiry', message: 'I would like to know about admissions for next year.', consent: true, hp_check: '' };
  let res = await request(app).post('/api/v1/contact').send(message);
  assert.equal(res.status, 201);
  assert.equal(res.body.ok, true);
  assert.match(res.body.reference, /^JMJ-/);

  res = await request(app).post('/api/v1/contact').send({ ...message, hp_check: 'http://spam' });
  assert.equal(res.body.ok, true, 'robots get a normal-looking reply');

  res = await request(app).post('/api/v1/contact').send({ ...message, email: 'not-an-email' });
  assert.equal(res.status, 400);

  res = await request(app).get('/api/v1/contact').set(auth()).query({ limit: 500 });
  assert.equal(res.body.data.length, 1, 'the robot message was not stored');
  assert.equal(res.body.unread, 1);
  const id = res.body.data[0]._id;

  res = await request(app).patch(`/api/v1/contact/${id}`).set(auth()).send({ status: 'read' });
  assert.equal(res.body.data.status, 'read');
  res = await request(app).get('/api/v1/contact').set(auth());
  assert.equal(res.body.unread, 0);

  res = await request(app).delete(`/api/v1/contact/${id}`).set(auth());
  assert.equal(res.status, 200);
});

test('account locks for 15 minutes after 5 wrong passwords', async () => {
  for (let i = 0; i < 5; i += 1) {
    await request(app).post('/api/v1/auth/login').send({ email: ADMIN.email, password: `wrong-${i}` });
  }
  const res = await request(app).post('/api/v1/auth/login').send({ email: ADMIN.email, password: 'New-Password-77' });
  assert.equal(res.status, 403);
  assert.match(res.body.message, /locked for 15 minutes/);
});

test('only the website may call the API from a browser', async () => {
  let res = await request(app).get('/api/v1/health').set('Origin', 'https://jmjhyderabad.vercel.app');
  assert.equal(res.headers['access-control-allow-origin'], 'https://jmjhyderabad.vercel.app');
  res = await request(app).get('/api/v1/health').set('Origin', 'https://evil.example.com');
  assert.equal(res.headers['access-control-allow-origin'], undefined);
});

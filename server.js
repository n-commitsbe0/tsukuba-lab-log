const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'posts.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 初期データ
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

const readPosts = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writePosts = (posts) => fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));

// API: 取得
app.get('/api/posts', (req, res) => {
  res.json(readPosts());
});

// API: 作成
app.post('/api/posts', (req, res) => {
  const posts = readPosts();
  const newPost = {
    id: Date.now().toString(),
    title: req.body.title || '無題',
    content: req.body.content || '',
    tags: req.body.tags || [],
    createdAt: new Date().toISOString()
  };
  posts.unshift(newPost);
  writePosts(posts);
  res.status(201).json(newPost);
});

// API: 更新
app.put('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).end();
  posts[idx] = { ...posts[idx], ...req.body };
  writePosts(posts);
  res.json(posts[idx]);
});

// API: 削除
app.delete('/api/posts/:id', (req, res) => {
  const posts = readPosts().filter(p => p.id !== req.params.id);
  writePosts(posts);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Tsukuba Lab Log server running at http://localhost:${PORT}`);
});
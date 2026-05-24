const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'posts.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

app.get('/api/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const newPost = {
    id: Date.now().toString(),
    title: req.body.title || '無題',
    content: req.body.content || '',
    tags: req.body.tags || [],
    createdAt: new Date().toISOString()
  };
  posts.unshift(newPost);
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
  const posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const idx = posts.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).end();
  posts[idx] = {...posts[idx],...req.body, updatedAt: new Date().toISOString() };
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  res.json(posts[idx]);
});

app.delete('/api/posts/:id', (req, res) => {
  let posts = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  posts = posts.filter(p => p.id!== req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
  res.status(204).end();
});

app.listen(PORT, () => console.log('Server running on ' + PORT));

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'posts.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 初期データ（つくば）
const initialPosts = [
  {
    id: '1',
    title: 'プロトタイプ開発：低消費電力IoTデバイス',
    author: '山本葵',
    category: '情報科学',
    tags: ['IoT','省電力','つくば'],
    body: '# 目的\n筑波大でのフィールドテスト用にBLEセンサーを試作。\n\n## 結果\n- 消費電力 12mW達成\n- 通信距離 80m',
    createdAt: new Date(Date.now()-86400000*2).toISOString(),
    comments: []
  },
  {
    id: '2',
    title: '学会発表準備：量子センシングの新手法',
    author: '佐藤健太',
    category: '物理学',
    tags: ['量子','学会','筑波山'],
    body: '## アブストラクト\nNV中心を用いた磁場計測の感度向上について。',
    createdAt: new Date(Date.now()-86400000).toISOString(),
    comments: []
  },
  {
    id: '3',
    title: '筑波山麓での大気中微粒子測定実験',
    author: '田中理恵',
    category: '物理学',
    tags: ['環境','PM2.5','フィールドワーク'],
    body: '風向と濃度の相関を調査。',
    createdAt: new Date().toISOString(),
    comments: [{author:'共同研究者', text:'データ共有ありがとう', createdAt: new Date().toISOString()}]
  }
];

function loadDB(){
  try {
    return JSON.parse(fs.readFileSync(DB_FILE));
  } catch {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialPosts, null, 2));
    return initialPosts;
  }
}
function saveDB(data){ fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

let posts = loadDB();

// API
app.get('/api/posts', (req, res) => {
  let result = [...posts].sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
  const {q, category, tag} = req.query;
  if(q) result = result.filter(p => (p.title+p.body+p.tags.join(' ')).toLowerCase().includes(q.toLowerCase()));
  if(category) result = result.filter(p=>p.category===category);
  if(tag) result = result.filter(p=>p.tags.includes(tag));
  console.log(`[${new Date().toLocaleTimeString()}] GET /api/posts`);
  res.json(result);
});

app.post('/api/posts', (req,res)=>{
  const post = {...req.body, id: Date.now().toString(), createdAt: new Date().toISOString(), comments:[]};
  posts.unshift(post); saveDB(posts);
  console.log(`[${new Date().toLocaleTimeString()}] POST /api/posts`);
  res.status(201).json(post);
});

app.put('/api/posts/:id', (req,res)=>{
  const idx = posts.findIndex(p=>p.id===req.params.id);
  if(idx===-1) return res.status(404).end();
  posts[idx] = {...posts[idx], ...req.body};
  saveDB(posts);
  console.log(`[${new Date().toLocaleTimeString()}] PUT /api/posts/${req.params.id}`);
  res.json(posts[idx]);
});

app.delete('/api/posts/:id', (req,res)=>{
  posts = posts.filter(p=>p.id!==req.params.id); saveDB(posts);
  console.log(`[${new Date().toLocaleTimeString()}] DELETE /api/posts/${req.params.id}`);
  res.status(204).end();
});

app.post('/api/posts/:id/comments', (req,res)=>{
  const post = posts.find(p=>p.id===req.params.id);
  if(!post) return res.status(404).end();
  const comment = {...req.body, createdAt: new Date().toISOString()};
  post.comments.push(comment); saveDB(posts);
  console.log(`[${new Date().toLocaleTimeString()}] POST /api/posts/${req.params.id}/comments`);
  res.status(201).json(comment);
});

app.listen(PORT, ()=> console.log(`Tsukuba Lab Log server running on http://localhost:${PORT}`));

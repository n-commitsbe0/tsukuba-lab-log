# Tsukuba Lab Log – サーバーサイド日誌

研究記録をサーバーで管理する、つくば発のシンプルな研究日誌Webアプリケーションです。

## デモ
- フロントエンドのみ版: `public/index.html` を直接開く
- フルスタック版: 下記手順で起動

## 特徴
- Node.js + Express による本物のサーバーサイドREST API (`/api/posts`)
- 作成・編集・削除・検索・コメントをサーバーで永続化 (posts.json)
- Markdown対応、カテゴリ・タグフィルタ、ダークモード
- 筑波山モチーフの和モダンUI

## 起動方法
```bash
git clone https://github.com/<yourname>/tsukuba-lab-log.git
cd tsukuba-lab-log
npm install
npm start
```
→ http://localhost:3000 でアクセス

## API例
- `GET /api/posts?q=量子`
- `POST /api/posts` {title, body, ...}
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`
- `POST /api/posts/:id/comments`

## ライセンス
MIT

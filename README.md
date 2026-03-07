# goey-todo

**完了が、気持ちいい。**

goey-toast のヌメッとしたモーフィングアニメーションを最大限に活かした TODO アプリ。タスクを完了するたびに Promise morph が発動し、「処理中...」→「✓ 完了!」の変化を味わえる。ファイルインポート/エクスポートにも対応。

## Demo

> Vercel にデプロイ後、URL をここに貼る

## Features

- **タスクの追加・完了・削除** — 最小限の TODO 機能
- **Promise Morph** — タスク完了時に loading → success へヌメッとモーフィング
- **Action Button 付きトースト** — 削除時に「元に戻す」で復元可能
- **CSV インポート** — CSV ファイルからタスクを一括取り込み
- **JSON エクスポート/インポート** — バックアップ & リストア
- **ドラッグ & ドロップ** — ファイルを画面に投げ込んでインポート
- **Toast Types の使い分け** — success / error / warning / info / loading を場面ごとに

## Tech Stack

- React（Vite）
- goey-toast
- framer-motion（goey-toast の peer dependency）
- Vercel（ホスティング）

## Getting Started

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/goey-todo.git
cd goey-todo

# 依存インストール
npm install

# 開発サーバー起動
npm run dev
```

## CSV フォーマット

```csv
タスク
買い物に行く
本を読む
コードレビュー
```

ヘッダー行（`タスク`, `task`, `todo`, `title`, `name`）は自動検出してスキップする。1列目をタスク名として取り込む。

## JSON フォーマット

```json
{
  "exportedAt": "2026-03-07T12:00:00.000Z",
  "todos": [
    { "text": "買い物に行く", "done": false },
    { "text": "本を読む", "done": true }
  ]
}
```

配列形式 `["タスク1", "タスク2"]` にも対応。

## License

MIT

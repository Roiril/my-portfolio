---
description: Worksに作品を追加するときの「コピペ用入力テンプレ」を表示する
---

1. `src/features/works/types/index.ts` と `src/content/works.ts` を読み、最新の型定義とデータ構造を確認する。
2. 以下のような形式で、「作品1件分」のコピペ用テンプレを表示する。
   - `id`: 重複しない一意な文字列 (kebab-case推奨)
   - `title`: 作品名
   - `description`: 説明文 (`\n` での改行が可能)
   - `image`: 画像パス (`/images/...`)
   - `tags`: 文字列の配列
   - `links`: `type` ('launch' | 'video' | 'demo'), `url`, `label?` を持つオブジェクトの配列
   - `featured?`: 注力作品なら `true` (任意)
   - `isCurrent?`: 制作中の場合は `true` (任意)

---
### テンプレ出力例 (今のプロジェクト仕様に合わせたもの)

```typescript
  {
    id: 'example-project',
    title: '作品タイトル',
    description: '作品の具体的な説明をここに記述します。\n必要に応じて改行も可能です。',
    image: '/images/example.png',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    links: [
      {
        type: 'launch',
        url: 'https://example.com',
        label: 'Launch',
      },
      {
        type: 'video',
        url: 'https://youtube.com/...',
        label: 'Watch Video',
      },
    ],
    featured: false,
  },
```

### 埋める項目チェックリスト
- [ ] `id`: 重複していないか
- [ ] `title`: 正しい名称か
- [ ] `description`: 意図した改行が含まれているか
- [ ] `image`: `public/images/` に画像が配置されているか（推奨 1200x800px, WebP）
- [ ] `tags`: 配列形式になっているか
- [ ] `links`: `type` が正しいか（launch / video / demo）
- [ ] `featured`: 注力作品として表示するか
- [ ] `isCurrent`: 制作中フラグ（リンクより優先されます）
---

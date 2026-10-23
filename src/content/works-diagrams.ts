import type { Diagram } from '@/features/works/types';

// 詳細ページの構成図。works.ts の id ごとに置く。
// works-tech.ts と同じく、リポジトリ・論文で確かめた構成だけを描く。
// 座標は升目（x 列・y 段）。モノ＝icon あり、ソフト＝icon なし（点線の枠）。

export const workDiagrams: Record<string, Diagram> = {
  mawarimi: {
    cols: 5,
    rows: 2,
    groups: [{ x: 1, y: 0, w: 3, h: 1, label: 'Quest 3 の中（Unity）' }],
    nodes: [
      { id: 'cams', x: 0, y: 0, icon: 'phone', label: 'スマートフォン', note: '×3・部屋に固定' },
      { id: 'recv', x: 1, y: 0, label: 'MjpegStreamReceiver', note: 'MJPEG を 3 本受ける' },
      { id: 'zone', x: 2, y: 0, label: 'ZonePickLogic', note: '頭の位置でカメラを選ぶ' },
      { id: 'show', x: 3, y: 0, label: 'show.json', note: '周と区画で演出を重ねる' },
      { id: 'hmd', x: 4, y: 0, icon: 'hmd', label: 'Quest 3', note: '監視モニターとして映す' },
      { id: 'web', x: 3, y: 1, icon: 'browser', label: 'Web の運用卓', note: '演出を前もって編集' },
    ],
    edges: [
      { from: 'cams', to: 'recv', label: 'Wi-Fi', wireless: true },
      { from: 'recv', to: 'zone', label: '3 本' },
      { from: 'zone', to: 'show', label: '1 本' },
      { from: 'show', to: 'hmd', label: '描画', labelAt: 0.75 },
      { from: 'web', to: 'show', label: 'APK に焼き込む', labelAt: 0.3 },
    ],
    caption: '廻リ視の構成。部屋の 3 台のスマートフォンが Wi-Fi で映像を送り、Quest 3 が体験者の位置に合わせて 1 本を選んで演出を重ねる。演出の表は Web の運用卓で作り、アプリに焼き込むので、本番は Quest 単体で動く。',
  },

  intentlayer: {
    cols: 4,
    rows: 2,
    groups: [
      { x: 0, y: 0, w: 3, h: 2, label: 'Web 版' },
      { x: 3, y: 0, w: 1, h: 2, label: 'HMD 版' },
    ],
    nodes: [
      { id: 'phone', x: 0, y: 0, icon: 'phone', label: 'スマートフォン', note: '書く・スキャンする' },
      { id: 'web', x: 1, y: 0, icon: 'browser', label: 'Next.js', note: 'React Three Fiber' },
      { id: 'db', x: 2, y: 0, icon: 'cloud', label: 'Supabase', note: '意図と位置' },
      { id: 'mesh', x: 1, y: 1, label: '部屋のメッシュ', note: 'LiDAR で前もって取る' },
      { id: 'hmd', x: 3, y: 0, icon: 'hmd', label: 'Quest 3', note: 'Passthrough' },
      { id: 'anchor', x: 3, y: 1, label: 'Spatial Anchors', note: '文字を空間に固定' },
    ],
    edges: [
      { from: 'phone', to: 'web', label: '操作' },
      { from: 'web', to: 'db', label: '保存・取得', both: true },
      { from: 'mesh', to: 'web', label: '背景の 3D' },
      { from: 'anchor', to: 'hmd', label: '重ねて表示' },
    ],
    caption: 'IntentLayer の 2 つの試作。Web 版は意図の入力と運用を、HMD 版は現実に重ねたときの見え方を調べるために作った。',
  },

  'ai-business-tools': {
    cols: 4,
    rows: 2,
    nodes: [
      { id: 'pc', x: 0, y: 0.5, icon: 'pc', label: '社内の PC' },
      { id: 'quote', x: 1, y: 0, label: '見積の下書き', note: '商談の内容から作る' },
      { id: 'rag', x: 1, y: 1, label: 'RAG チャット', note: '検索してから答える' },
      { id: 'llm', x: 2, y: 0, icon: 'cloud', label: 'LLM' },
      { id: 'manual', x: 2, y: 1, icon: 'db', label: '社内マニュアル', note: '検索の対象' },
      { id: 'person', x: 3, y: 0.5, icon: 'person' },
    ],
    edges: [
      { from: 'pc', to: 'quote', label: '商談の内容' },
      { from: 'pc', to: 'rag', label: '質問' },
      { from: 'quote', to: 'llm' },
      { from: 'rag', to: 'manual', label: '検索' },
      { from: 'rag', to: 'llm', label: '根拠と質問' },
      { from: 'llm', to: 'person', label: '根拠つきの答え' },
    ],
    caption: 'AI 業務ツールの流れ。下書きも回答も AI が作るが、最後は人が根拠を見て確かめてから使う。',
  },

  whiteout: {
    cols: 4,
    rows: 2,
    groups: [{ x: 1, y: 1, w: 2, h: 1, label: 'Whiteout.Core（Unity に依存しない）' }],
    nodes: [
      { id: 'pc', x: 0, y: 0, icon: 'laptop', label: 'ブラウザ', note: 'WebGL・unityroom' },
      { id: 'input', x: 1, y: 0, label: 'TwinStick', note: '移動と狙い' },
      { id: 'pool', x: 2, y: 0, label: 'ProjectilePool', note: '全弾をまとめて動かす' },
      { id: 'grid', x: 2, y: 1, label: 'PaintGrid', note: 'セルごとの塗り 0〜255' },
      { id: 'rule', x: 1, y: 1, label: 'ゲームの判定', note: 'インク・経験値・封印' },
      { id: 'view', x: 3, y: 1, label: 'Paper.shader', note: '変わった面だけ描く' },
    ],
    edges: [
      { from: 'pc', to: 'input', label: '入力' },
      { from: 'input', to: 'pool', label: '発射' },
      { from: 'pool', to: 'grid', label: '弾の線と着弾', labelAt: 0.3 },
      { from: 'grid', to: 'rule', label: '白いセル数' },
      { from: 'grid', to: 'view', label: 'テクスチャ' },
    ],
    caption: 'WhiteOut の構成。塗りの状態は PaintGrid の整数配列だけが持ち、表示はその写しを描く。判定の層は Unity に依存しないので、800 件を超えるテストで確かめられる。',
  },

  'couple-sync': {
    cols: 4,
    rows: 2,
    groups: [{ x: 1, y: 0, w: 2, h: 2, label: 'アプリ（PWA）' }],
    nodes: [
      { id: 'me', x: 0, y: 0, icon: 'phone', label: 'スマートフォン', note: '自分の端末' },
      { id: 'ui', x: 1, y: 0, label: 'React / three.js', note: '猫の部屋と各画面' },
      { id: 'idb', x: 1, y: 1, label: 'IndexedDB', note: '画面はここから表示' },
      { id: 'queue', x: 2, y: 1, label: '送信待ちの列', note: '消えずに残る' },
      { id: 'db', x: 3, y: 1, icon: 'cloud', label: 'Supabase', note: '関数・Realtime' },
      { id: 'you', x: 3, y: 0, icon: 'phone', label: 'スマートフォン', note: '相手の端末' },
    ],
    edges: [
      { from: 'me', to: 'ui', label: '操作', labelAt: 0.4 },
      { from: 'ui', to: 'idb', label: '書く' },
      { from: 'idb', to: 'queue', label: '変更' },
      { from: 'queue', to: 'db', label: '送信', labelAt: 0.72 },
      { from: 'db', to: 'you', label: '通知と差分', wireless: true },
    ],
    caption: 'couple-sync の同期。変更はまず端末に書き、送信待ちの列を通して Supabase へ送る。通信が切れても列に残り、戻ったら送られる。',
  },

  'cogni-storage': {
    cols: 4,
    rows: 2,
    groups: [{ x: 1, y: 0, w: 2, h: 2, label: 'アプリ（PWA）' }],
    nodes: [
      { id: 'pc', x: 0, y: 0, icon: 'laptop', label: 'PC・スマートフォン' },
      { id: 'ui', x: 1, y: 0, label: 'React', note: '研究ログの画面' },
      { id: 'idb', x: 1, y: 1, label: 'IndexedDB', note: '画面はここから表示' },
      { id: 'queue', x: 2, y: 1, label: '送信待ちの列', note: '古い変更はまとめる' },
      { id: 'db', x: 3, y: 1, icon: 'cloud', label: 'Supabase', note: '4 つの表' },
      { id: 'agent', x: 3, y: 0, icon: 'pc', label: 'Claude Code', note: '依頼を受けて処理' },
    ],
    edges: [
      { from: 'pc', to: 'ui', label: '操作', labelAt: 0.4 },
      { from: 'ui', to: 'idb', label: '書く' },
      { from: 'idb', to: 'queue', label: '変更' },
      { from: 'queue', to: 'db', label: '送信・差分', both: true, labelAt: 0.72 },
      { from: 'db', to: 'agent', label: '依頼と返答', wireless: true, both: true },
    ],
    caption: 'cogni-storage の構成。画面は常に端末の IndexedDB から表示し、Supabase とは差分だけをやり取りする。Claude Code への依頼もデータベースを通して届く。',
  },

  'blender-works': {
    cols: 3,
    rows: 1,
    nodes: [
      { id: 'model', x: 0, y: 0, label: 'モデリング', note: 'キャラクター・空間' },
      { id: 'geo', x: 1, y: 0, label: 'ジオメトリノード', note: '形と動きを手続きで作る' },
      { id: 'out', x: 2, y: 0, label: 'レンダリング', note: '静止画・アニメーション' },
    ],
    edges: [
      { from: 'model', to: 'geo', label: 'メッシュ' },
      { from: 'geo', to: 'out', label: 'シーン' },
    ],
    caption: 'Blender での作り方。形を作り、ジオメトリノードで動きや切り替えを加え、絵にする。',
  },

  'meiji-3d': {
    cols: 4,
    rows: 2,
    nodes: [
      { id: 'site', x: 0, y: 0, icon: 'camera', label: '現地', note: '歩幅で測って撮る' },
      { id: 'model', x: 1, y: 0, label: 'Blender', note: '寸法どおりに組む' },
      { id: 'tex', x: 2, y: 0, label: '写真テクスチャ', note: '柱や什器は形で補う' },
      { id: 'vr', x: 3, y: 0, icon: 'hmd', label: 'VR', note: '未来の姿を議論する' },
      { id: 'shader', x: 3, y: 1, label: 'シェーダーグラフ', note: '見え方を変える' },
    ],
    edges: [
      { from: 'site', to: 'model', label: '寸法' },
      { from: 'model', to: 'tex', label: '形' },
      { from: 'tex', to: 'vr', label: 'モデル' },
      { from: 'tex', to: 'shader', label: 'モデル' },
    ],
    caption: '明治大学中野キャンパス 3 階を 3D にする手順。実寸で組んだモデルを VR やシェーダーの実験に使い回している。',
  },

  'uniqlo-future': {
    cols: 3,
    rows: 1,
    nodes: [
      { id: 'model', x: 0, y: 0, label: 'Blender', note: '自販機と空間の 3D' },
      { id: 'vfx', x: 1, y: 0, label: 'VFX', note: '映像に効果を重ねる' },
      { id: 'out', x: 2, y: 0, icon: 'browser', label: 'YouTube', note: '動画で公開' },
    ],
    edges: [
      { from: 'model', to: 'vfx', label: '映像' },
      { from: 'vfx', to: 'out', label: '書き出し' },
    ],
    caption: '架空のサービスを見せる動画の作り方。3D で作った場面に VFX を重ねて仕上げた。',
  },

  aquarium: {
    cols: 4,
    rows: 1,
    nodes: [
      { id: 'fish', x: 0, y: 0, label: '魚', note: '1 匹ずつの位置と向き' },
      { id: 'near', x: 1, y: 0, label: '近くの仲間', note: '周りにいる魚を探す' },
      { id: 'rule', x: 2, y: 0, label: '3 つの決まり', note: '寄る・避ける・揃える' },
      { id: 'draw', x: 3, y: 0, label: 'draw()', note: '毎フレーム描く' },
    ],
    edges: [
      { from: 'fish', to: 'near' },
      { from: 'near', to: 'rule', label: '仲間の位置' },
      { from: 'rule', to: 'draw', label: '進む向き' },
    ],
    caption: '群れの動きの作り方。1 匹ごとの単純な決まりを毎フレーム繰り返すと、全体が群れとして動く。',
  },

  'ai-music-video': {
    cols: 4,
    rows: 2,
    nodes: [
      { id: 'idea', x: 0, y: 0.5, label: 'ChatGPT / Gemini', note: '案出し' },
      { id: 'song', x: 1, y: 0, label: 'Suno AI', note: '曲' },
      { id: 'movie', x: 1, y: 1, label: 'Flow', note: '映像の素材' },
      { id: 'edit', x: 2, y: 0.5, label: 'Filmora', note: '編集' },
      { id: 'out', x: 3, y: 0.5, icon: 'browser', label: 'YouTube', note: 'ミュージックビデオ' },
    ],
    edges: [
      { from: 'idea', to: 'song' },
      { from: 'idea', to: 'movie' },
      { from: 'song', to: 'edit', label: '音' },
      { from: 'movie', to: 'edit', label: '映像' },
      { from: 'edit', to: 'out', label: '書き出し' },
    ],
    caption: 'AI ツールの組み合わせ方。曲と映像をそれぞれ別の AI で作り、編集で 1 本にまとめた。',
  },

  'retroTV-portfolio': {
    cols: 4,
    rows: 2,
    nodes: [
      { id: 'ch', x: 0, y: 0, label: 'チャンネル', note: '5 つの中身' },
      { id: 'canvas', x: 1, y: 0, label: 'Canvas 2D', note: '幅 800px に描く' },
      { id: 'crt', x: 2, y: 0, label: 'compositeCRT', note: '走査線とノイズ' },
      { id: 'tex', x: 3, y: 0, label: 'CanvasTexture', note: '32 分割の曲面に貼る' },
      { id: 'view', x: 3, y: 1, icon: 'browser', label: 'ブラウザ', note: 'three.js で表示' },
      { id: 'ray', x: 1, y: 1, label: 'Raycaster', note: '押した点からリンクを探す' },
    ],
    edges: [
      { from: 'ch', to: 'canvas', label: '中身' },
      { from: 'canvas', to: 'crt' },
      { from: 'crt', to: 'tex' },
      { from: 'tex', to: 'view', label: '描画' },
      { from: 'view', to: 'ray', label: 'クリック' },
      { from: 'ray', to: 'canvas', label: 'リンク・切り替え' },
    ],
    caption: 'Retro TV の描画。画面の中身とブラウン管の効果を 2D の Canvas で作り、three.js の曲面に貼る。クリックは画面上の座標に直してリンクを判定する。',
  },

  'cube-diary': {
    cols: 4,
    rows: 2,
    nodes: [
      { id: 'phone', x: 0, y: 0, icon: 'phone', label: 'スマートフォン', note: '写真を選ぶ' },
      { id: 'zip', x: 1, y: 0, label: '画像の圧縮', note: '1280px・0.15MB 以下' },
      { id: 'storage', x: 2, y: 0, icon: 'cloud', label: 'Supabase', note: 'Storage・Database' },
      { id: 'r3f', x: 1, y: 1, label: 'React Three Fiber', note: 'キューブを並べて描く' },
      { id: 'view', x: 0, y: 1, icon: 'browser', label: 'ブラウザ', note: '暗い空間に表示' },
    ],
    edges: [
      { from: 'phone', to: 'zip', label: '割り当て' },
      { from: 'zip', to: 'storage', label: '保存' },
      { from: 'storage', to: 'r3f', label: '日記と画像' },
      { from: 'r3f', to: 'view', label: '描画' },
    ],
    caption: 'CubeDiary の構成。写真はブラウザの中で小さくしてから保存し、読み出した日記を 3D のキューブとして並べる。',
  },

  'metaquest-devs': {
    cols: 3,
    rows: 1,
    nodes: [
      { id: 'pc', x: 0, y: 0, icon: 'pc', label: 'Unity 2022.3', note: 'Meta XR SDK' },
      { id: 'hmd', x: 2, y: 0, icon: 'hmd', label: 'Quest 3', note: '試作を動かす' },
    ],
    edges: [{ from: 'pc', to: 'hmd', label: 'ビルドして入れる' }],
    caption: '試作の環境。Unity で作った試作を Quest 3 に入れて、現実に重ねた見え方を確かめた。',
  },

  'ai-composition': {
    cols: 3,
    rows: 1,
    nodes: [
      { id: 'orig', x: 0, y: 0, label: 'Studio One', note: '元の曲を作る' },
      { id: 'suno', x: 1, y: 0, label: 'Suno AI', note: '元の曲を広げる' },
      { id: 'out', x: 2, y: 0, icon: 'browser', label: 'YouTube', note: '元の曲と AI 版' },
    ],
    edges: [
      { from: 'orig', to: 'suno', label: '音源' },
      { from: 'suno', to: 'out', label: '書き出し' },
    ],
    caption: '曲の広げ方。自分で作った曲を素材にして、AI で別の版を作った。',
  },
};

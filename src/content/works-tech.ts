import type { WorkTech } from '@/features/works/types';

// 詳細ページの「技術」の章。works.ts の id ごとに置く。
// 書いてよいのは、作品のリポジトリ・論文・企画書で確かめた事実だけ（2026-10-23 時点）。
// 秘密の URL・鍵・参加者の情報は書かない。

export const workTech: Record<string, WorkTech> = {
  mawarimi: {
    summary: '部屋に置いたスマートフォン 3 台の映像を Quest 3 で受け取ります。体験者がいる場所に合わせてカメラを切り替え、その映像に演出を重ねて見せます。本番は Quest 単体で動きます。',
    numbers: [
      { value: '3', unit: '台', label: '固定カメラ' },
      { value: '3', unit: '周', label: '1 回の体験で歩く周回' },
      { value: '30', unit: '秒', label: '1 周のおよその時間' },
    ],
    stack: [
      { label: 'エンジン', items: ['Unity 2022.3', 'URP 14', 'Meta XR SDK'] },
      { label: '機材', items: ['Meta Quest 3', 'スマートフォン 3 台'] },
      { label: '映像の配信', items: ['MJPEG over Wi-Fi', 'Android（Kotlin）の配信アプリ'] },
      { label: '演出の編集', items: ['Web の運用卓（JavaScript）', 'show.json'] },
      { label: '言語', items: ['C#', 'Kotlin', 'JavaScript'] },
    ],
    flow: [
      { title: '3 台が撮る', body: '三脚・床・棚のアームに置いたスマートフォンが、部屋を撮って配信します。' },
      { title: 'Quest が受け取る', body: 'Quest 3 が 3 本の映像を受け取り、その場でデコードします。' },
      { title: 'カメラを選ぶ', body: 'HMD の位置から体験者がいる区画を判定します。0.5 秒とどまったらカメラを切り替え、周回も数えます。' },
      { title: '演出を重ねる', body: '映像の差し替え・CG の人形・グリッチ・色調を、周回と区画に応じて重ねます。' },
      { title: '画面に映す', body: 'VR 内の監視モニターに映します。モニターの外は黒にして、現実は映像越しにしか見えません。' },
    ],
    points: [
      { title: '歩く速さに左右されない演出', body: '演出は「何周目のどの区画か」で割り当てています。区画に入ったとき・出たとき・床の線を越えたときに始まるので、速く歩く人もゆっくり歩く人も同じ場所で怖い目に遭います。' },
      { title: '映像になじむ CG の人形', body: '実際のカメラを映像から較正し、姿勢・画角・レンズの歪みを求めました。部屋の簡単な 3D モデルを使って、人形に影と隠れを付けています。人形の腕はハンドトラッキングで動かします。' },
      { title: '固定画角を生かした合成', body: 'カメラが動かないので、合成用のマスクをカメラごとに前もって用意できます。境界はぼかしと多重帯域ブレンドでつなぎ、素材の色は映像の色の統計に合わせました。' },
      { title: 'Web と Unity で同じ判定', body: '区画の判定などのロジックは Web の運用卓と Unity で共有しています。歩いた記録を両方に流し、判定が一致することをテストで確かめています。' },
    ],
  },

  intentlayer: {
    summary: '話しかけてよいかを示す一文を、その人のそばの空間に置きます。HMD 版と Web 版の 2 つを作りました。HMD 版では見え方を、Web 版では入力と運用を調べています。',
    numbers: [
      { value: '2', unit: '種', label: '試作（HMD 版・Web 版）' },
      { value: '1', unit: '週間', label: 'Web 版の運用' },
      { value: '6', unit: '名', label: '参加者' },
    ],
    stack: [
      { label: 'HMD 版', items: ['Meta Quest 3', 'Unity 2022.3', 'Meta XR SDK', 'Passthrough', 'Spatial Anchors'] },
      { label: 'Web 版', items: ['Next.js', 'React Three Fiber', 'Supabase', 'Vercel'] },
      { label: '空間の取り込み', items: ['スマートフォンの LiDAR'] },
    ],
    flow: [
      { title: '意図を書く', body: '「話しかけてほしい」のような一文を入力します。Web 版ではテンプレートからも選べます。' },
      { title: '空間に置く', body: '自分の近くをタップして 3D 空間の位置に置き、データベースに保存します。' },
      { title: '必要なときに見る', body: '見る人は、知りたいときだけスキャンの操作をします。' },
      { title: '重ねて表示する', body: 'HMD 版ではその人の頭の上に、Web 版では部屋の 3D モデルの上に表示します。' },
    ],
    points: [
      { title: '推定ではなく本人が書く', body: '集中度や感情を推定して表示するのではなく、相手へのお願いを本人が書きます。' },
      { title: '見たいときだけ見る', body: '常に表示すると視界がうるさくなり、見られている不安も生まれます。そこでスキャンした瞬間だけ表示するようにしました。' },
      { title: '誰の意図かを位置で示す', body: '意図は書いた人のそばに置きます。名前を出さなくても、位置関係で誰のものか分かります。' },
      { title: '実空間に合わせる', body: 'HMD 版はパススルーで現実の映像を背景にし、文字を空間アンカーで固定しました。Web 版はスマートフォンの LiDAR で取った部屋のメッシュをブラウザに表示しています。' },
    ],
  },

  'ai-business-tools': {
    summary: '社内で使う AI の業務ツールです。大規模言語モデル（LLM）に下書きと検索を任せ、最後は人が確かめる流れにしています。',
    stack: [
      { label: 'AI', items: ['LLM', 'RAG（検索で根拠を集めてから答える方式）'] },
      { label: '担当', items: ['要件定義', '実装', '運用'] },
    ],
    flow: [
      { title: '材料を渡す', body: '商談の内容や、社内マニュアルへの質問を入力します。' },
      { title: 'AI が下書きする', body: '商談の内容からは見積書の下書きを作ります。質問にはマニュアルを検索してから答えます。' },
      { title: '人が確かめる', body: '回答には根拠となった箇所を添え、人が確かめてから使います。' },
    ],
    points: [
      { title: '根拠を見せる', body: 'RAG のチャットは、どのマニュアルを根拠に答えたかを示します。答えをそのまま信じずに確かめられます。' },
      { title: '運用まで作る', body: '機能を作って終わりにせず、人が確認する手順も含めて社内の運用を整えました。' },
    ],
  },

  whiteout: {
    summary: '塗った場所を整数の配列で持ち、画面の表示はその配列から作ります。ゲームの判定は Unity に依存しない層に分けたので、800 件を超える自動テストで確かめられます。',
    numbers: [
      { value: '9', unit: '面', label: '紙（3 × 3）' },
      { value: '12', unit: '種', label: '能力' },
      { value: '800', unit: '件超', label: '判定の自動テスト' },
    ],
    stack: [
      { label: 'エンジン', items: ['Unity 6000.3', 'URP 17'] },
      { label: '描画', items: ['自作の URP シェーダー 3 本'] },
      { label: '配布', items: ['WebGL', 'unityroom'] },
      { label: '検証', items: ['dotnet test', '自動プレイの台本'] },
      { label: '言語', items: ['C#'] },
    ],
    flow: [
      { title: '狙って撃つ', body: '左右 2 本のスティックで動きと狙いを入力します。' },
      { title: '弾を動かす', body: 'すべての弾を 1 つの更新処理でまとめて動かします。' },
      { title: '塗る', body: '弾が通った線と着弾の円を、セルごとの塗り具合（0〜255）に書き込みます。' },
      { title: '数える', body: '新しく白くなったセルを数え、インクの回復・経験値・面の封印・敵の動きに使います。' },
      { title: '描く', body: '変わった面だけをテクスチャに送り、シェーダーで白と地の色に塗り分けます。' },
    ],
    points: [
      { title: '塗りの正本は配列', body: 'どこが塗られたかは整数の配列だけが知っています。画面の表示はその写しで、テクスチャから読み戻すことはしません。' },
      { title: '面を転送の単位にする', body: '紙を 9 つの面に分けました。面は「塗り切ると封じられる」ルールの単位で、テクスチャを送る単位でもあります。面を白で埋める処理は少しずつ進め、コマ落ちを防ぎます。' },
      { title: '弾は線で塗る', body: '弾の位置に円を置くだけだと、速い弾ほど隙間が空き、fps で塗れる量が変わります。そこで前の位置から今の位置までをカプセル形で塗っています。' },
      { title: '自動プレイで確かめる', body: '自動でプレイする台本を 31 本用意しました。撃とうとした弾の数と実際に出た弾の数が一致するかまで照合しています。' },
    ],
  },

  'couple-sync': {
    summary: '記録は端末内に保存し、送信待ちの列を通して Supabase と同期します。通信が切れても使い続けられ、戻ったら追いつきます。猫の部屋の画面は three.js で描いています。',
    numbers: [
      { value: '14', unit: '種', label: 'ミニゲーム' },
      { value: '16', unit: '点', label: 'ガチャの家具' },
      { value: '29', label: 'データベースの表' },
    ],
    stack: [
      { label: '画面', items: ['React 19', 'TypeScript', 'Vite', 'three.js'] },
      { label: '保存と同期', items: ['IndexedDB（idb）', 'Supabase', 'Realtime'] },
      { label: '配布', items: ['PWA（Service Worker）'] },
      { label: '3D 素材', items: ['Blender（GLB）'] },
    ],
    flow: [
      { title: '画面で操作する', body: '部屋の中のものをタップして、予定やノートを開きます。' },
      { title: '端末に保存する', body: '変更はまず端末内の IndexedDB に書きます。画面は常にここから表示します。' },
      { title: '送信待ちに積む', body: '変更を、消えない送信待ちの列に積みます。通信が切れている間はここで待ちます。' },
      { title: 'サーバーに送る', body: 'Supabase の関数を通して書き込みます。' },
      { title: '相手に届く', body: 'Realtime の通知と差分の取得で、相手の端末に変更が届きます。' },
    ],
    points: [
      { title: '項目ごとに新しい方を残す', body: 'ふたりが同じ記録を同時に直しても、項目ごとに新しい方を残します。差分はサーバーが振る通し番号で取るので、端末の時計がずれていても取りこぼしません。' },
      { title: '送信が詰まる不具合を潰す', body: '同じ記録の変更が重なると送信待ちが詰まる不具合を、再現して直しました。8 並列の書き込みで、待ちが 8 件たまっていたのを 1 件にまとめています。' },
      { title: '引き直しの起きないガチャ', body: '抽選はサーバー側で行い、1 回ごとに識別子を付けています。再読み込みや二度押しをしても、同じ結果が返るだけです。' },
      { title: '止まらない 3D 演出', body: 'Blender で作った家具を three.js で表示します。WebGL が使えない端末では、静止画の演出に切り替えます。' },
    ],
  },

  'cogni-storage': {
    summary: '画面は常に端末内の IndexedDB から表示し、Supabase とは差分だけをやり取りします。Claude Code と連携し、文献の取り込みや整理を半自動で進められます。',
    numbers: [
      { value: '4', label: '同期する表（Ideas・Themes・Papers・Readings）' },
      { value: '10', unit: '本', label: 'AI エージェントの手順書' },
    ],
    stack: [
      { label: '画面', items: ['React 19', 'TypeScript', 'Vite 7', 'react-markdown'] },
      { label: '保存と同期', items: ['IndexedDB（idb）', 'Supabase', 'Realtime'] },
      { label: '配布', items: ['PWA（vite-plugin-pwa）'] },
      { label: 'AI 連携', items: ['Claude Code'] },
    ],
    flow: [
      { title: '書く', body: 'アイデア・テーマ・論文・文献を画面から書き込みます。' },
      { title: '端末に保存する', body: '変更は端末内の IndexedDB に書き、画面は常にここから表示します。' },
      { title: '送信待ちに積む', body: '変更を消えない送信待ちの列に積み、同じ記録への古い変更はまとめます。' },
      { title: '同期する', body: 'Supabase に書き込み、ほかの端末の変更は通し番号を手がかりに差分だけ取ります。' },
    ],
    points: [
      { title: '端末の時計に頼らない同期', body: '差分はサーバーが振る通し番号をしおりにして取ります。端末の時計がずれていても取りこぼしません。' },
      { title: '項目ごとに新しい方を残す', body: '同じ記録を 2 台で直したときは、項目ごとに新しい方を残します。' },
      { title: 'アプリから AI に頼む', body: 'アプリが依頼をデータベースに書くと、Claude Code が受け取って処理します。返答はリアルタイムで画面に届きます。' },
      { title: '研究の記録を git に残す', body: '研究のメモは Markdown で書き、ビルドのときにアプリへ取り込みます。Claude Code が追記した履歴は git にそのまま残ります。' },
    ],
  },

  'blender-works': {
    summary: 'Blender で作った小作品です。モデリング・ジオメトリノード・VFX をそれぞれ試しています。',
    stack: [
      { label: '道具', items: ['Blender'] },
      { label: '手法', items: ['モデリング', 'ジオメトリノード', 'VFX'] },
    ],
    points: [
      { title: '表情差分のあるキャラクター', body: '1 体のモデルに、通常・あっかんべー・じと目などの表情を作り分けました。' },
      { title: 'ジオメトリノードで動かす', body: '恐竜と文字が切り替わるアニメーションや、動く壁にメモ帳が張り付く表現を、ジオメトリノードで組みました。' },
      { title: '見覚えのある空間', body: '地下鉄の通路を、どこか不穏で見覚えのある空間として作りました。' },
    ],
  },

  'meiji-3d': {
    summary: '明治大学中野キャンパス 3 階を歩いて測り、Blender で 3D 空間にしました。作ったモデルは VR に持ち込んで議論の場に使っています。',
    stack: [
      { label: '道具', items: ['Blender'] },
      { label: '手法', items: ['歩測による測量', '写真テクスチャ', 'シェーダーグラフ'] },
      { label: '活用', items: ['VR'] },
    ],
    flow: [
      { title: '測る', body: '自分の歩幅を基準に、各所の寸法を測りました。' },
      { title: '形を作る', body: '測った寸法で空間全体を組み、柱や什器はモデリングで作りました。' },
      { title: '写真を貼る', body: '現地で撮った写真をテクスチャとして貼りました。' },
      { title: '使う', body: 'VR に持ち込んで未来の姿を議論したり、シェーダーで見え方を変えたりしています。' },
    ],
    points: [
      { title: '実寸で作る', body: '歩幅で測った寸法を使い、空間のスケールを現実に合わせました。VR に入ったときに実際の広さとして感じられます。' },
      { title: '近くで見ても崩れない', body: '写真だけでは表せない柱や什器はモデリングで補いました。遠くから見たときだけ成り立つ張りぼてにしないためです。' },
    ],
  },

  'uniqlo-future': {
    summary: 'UNIQLO の架空のサービス「服自販機」を紹介する動画です。Blender で 3D の映像を作り、VFX を重ねています。',
    stack: [
      { label: '道具', items: ['Blender'] },
      { label: '手法', items: ['3DCG', 'VFX'] },
    ],
    points: [
      { title: 'ないものを映像で見せる', body: 'まだ存在しないサービスを、3D の映像で実在するように見せることを目指しました。' },
    ],
  },

  aquarium: {
    summary: '水槽も魚も、魚の群れの動きも、すべて Processing のコードで描いています。',
    stack: [
      { label: '言語', items: ['Processing'] },
      { label: '手法', items: ['群れのシミュレーション（Boids）'] },
    ],
    flow: [
      { title: '近くの仲間を探す', body: 'それぞれの魚が、自分の周りにいる仲間を見ます。' },
      { title: '3 つの決まりで向きを決める', body: '仲間に寄る。ぶつからない。向きを揃える。この 3 つから進む向きを決めます。' },
      { title: '泳ぐ', body: '決めた向きに少し進みます。これを毎フレーム繰り返します。' },
    ],
    points: [
      { title: '単純な決まりから群れが生まれる', body: '1 匹ずつには単純な決まりしか与えていません。それでも全体では、生き物のようにまとまって泳ぐ群れになります。' },
    ],
  },

  'ai-music-video': {
    summary: '曲づくりから映像の編集まで、複数の AI ツールを組み合わせてミュージックビデオを作りました。',
    stack: [
      { label: '曲', items: ['Suno AI'] },
      { label: '構成・素材', items: ['ChatGPT', 'Gemini', 'Flow'] },
      { label: '編集', items: ['Filmora'] },
    ],
    points: [
      { title: 'ツールを工程ごとに使い分ける', body: '1 つの AI ですべてを作らず、曲・映像素材・編集の工程ごとに道具を試して組み合わせました。' },
    ],
  },

  'retroTV-portfolio': {
    summary: '画面の中身を 2D の Canvas に描き、それをテクスチャとして three.js のブラウン管に貼っています。ブラウン管らしい走査線やノイズも Canvas の上で重ねています。',
    numbers: [
      { value: '5', label: 'チャンネル' },
      { value: '32', label: '画面の分割数' },
    ],
    stack: [
      { label: 'フレームワーク', items: ['Next.js 16', 'React 19', 'Tailwind CSS 4'] },
      { label: '3D', items: ['three.js', 'three-stdlib'] },
      { label: '描画', items: ['Canvas 2D', 'CanvasTexture'] },
    ],
    flow: [
      { title: 'チャンネルを決める', body: 'プロフィールや作品など 5 つのチャンネルの中身を用意します。' },
      { title: 'Canvas に描く', body: '選んだチャンネルを幅 800px の Canvas に描きます。' },
      { title: 'ブラウン管らしくする', body: '走査線・ノイズ・流れる帯・周辺の減光を重ねます。' },
      { title: '曲面に貼る', body: 'Canvas をテクスチャにして、湾曲した画面に貼ります。' },
      { title: '触れる', body: '画面上のリンクをクリックで開けます。つまみを回すとチャンネルが変わります。' },
    ],
    points: [
      { title: '画面の湾曲', body: '画面は 32 分割した平面で、cos 関数で奥行きをずらしてブラウン管のふくらみを出しています。' },
      { title: '3D の画面の中のリンク', body: 'Canvas に描いた文字のリンクの位置を登録しておきます。クリックした点を画面の座標に直して、どのリンクかを判定します。' },
      { title: 'エフェクトも 2D で', body: 'ブラウン管の効果はシェーダーではなく Canvas の上で重ねています。画面の中身と効果を同じ場所で調整できます。' },
    ],
  },

  'cube-diary': {
    summary: '6 面に写真を貼ったキューブを、暗い空間に並べる日記です。画像はブラウザ内で小さくしてから Supabase に保存し、React Three Fiber で描いています。',
    numbers: [
      { value: '6', unit: '面', label: '1 つのキューブ' },
      { value: '3', unit: '種', label: '並べ方' },
      { value: '0.15', unit: 'MB', label: '保存する画像の上限' },
    ],
    stack: [
      { label: 'フレームワーク', items: ['Next.js 16', 'React 19', 'Tailwind CSS 4'] },
      { label: '3D', items: ['three.js', 'React Three Fiber', 'drei'] },
      { label: 'データ', items: ['Supabase（Auth・Database・Storage）'] },
      { label: '画像', items: ['browser-image-compression'] },
    ],
    flow: [
      { title: '写真を選ぶ', body: 'キューブの展開図に、面ごとに写真を割り当てます。' },
      { title: '小さくする', body: 'ブラウザの中で、長辺 1280px・0.15MB 以下の JPEG に圧縮します。' },
      { title: '保存する', body: '画像をストレージに上げ、その一覧を日記の記録に保存します。' },
      { title: '並べる', body: 'これまでのキューブを、暗い空間に 3D で並べます。' },
    ],
    points: [
      { title: '空いた面も埋める', body: '写真が 6 枚に満たないときは、写真の繰り返しか単色で残りの面を埋めます。' },
      { title: '数が増えても見渡せる配置', body: '並べ方は球面・螺旋・結び目の 3 種類です。球面は黄金角で配置します。キューブが増えても、広がりは対数で抑えます。' },
      { title: 'ログインせずに見られる', body: '匿名のログインで見本の日記を閲覧できます。自分の日記は自分だけが読み書きできるように、行ごとのアクセス制御を掛けています。' },
    ],
  },

  'metaquest-devs': {
    summary: '卒業研究のために Meta Quest と Unity で作った試作をまとめました。研究で使った IntentLayer の HMD 版も、同じ環境で作っています。',
    stack: [
      { label: 'エンジン', items: ['Unity 2022.3', 'Meta XR SDK'] },
      { label: '機材', items: ['Meta Quest 3'] },
    ],
    points: [
      { title: '現実に重ねる試作', body: '通路で人とすれ違う場面など、現実の空間に情報を重ねる表現を Quest で試しました。' },
    ],
  },

  'ai-composition': {
    summary: '以前 Studio One で作った曲を、Suno AI で広げた作品です。元の曲と AI 版を聞き比べられます。',
    stack: [
      { label: '作曲', items: ['Studio One'] },
      { label: '拡張', items: ['Suno AI'] },
    ],
    points: [
      { title: '自分の曲を素材にする', body: 'ゼロから AI に作らせるのではなく、自分で作った曲を元にして AI で広げました。' },
    ],
  },
};

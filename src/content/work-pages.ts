// 詳細ページの並び。紙面は features/works/pages/<id>/ にページごとに組む。say は検索結果と共有の説明文にも使う
export type WorkPageDef = { id: string; say: string; thumb: string };

export const workPages: WorkPageDef[] = [
    { id: 'mawarimi', say: '監視カメラに映る自分を見ながら、現実空間を歩く。', thumb: '/images/front/room.webp' },
    { id: 'whiteout', say: '白いインクで、9 つの面を塗りつぶす。', thumb: '/images/front/wo_net.webp' },
    { id: 'intentlayer', say: '「いま話しかけてよいか」の判断材料を、相手のそばに表示する。', thumb: '/images/front/intent.webp' },
    { id: 'metaquest-devs', say: '現実の空間に情報を重ねる表現を試す。', thumb: '/images/front/devs.webp' },
    { id: 'ai-business-tools', say: '商談から見積書の下書きを作り、社内マニュアルから根拠つきで答える。', thumb: '/images/works/ai-business-tools/photo.webp' },
    { id: 'last-page', say: '古い日記帳の頁を跳んで渡り、ひとりの一生を読む。', thumb: '/images/works/last-page/key-visual.webp' },
    { id: 'couple-sync', say: 'ふたりの毎日を、ひとつの部屋に。', thumb: '/images/works/couple-sync/00-room.png' },
    { id: 'cogni-storage', say: '読む・考える・書くを、ひとつのアプリで行う。', thumb: '/images/works/cogni-storage/02-ideas.png' },
    { id: 'blender-works', say: 'モデリング、ジオメトリノード、VFX を試した小作品集。', thumb: '/images/works/blender-works/robot-game-01.png' },
    { id: 'meiji-3d', say: '歩幅で測った校舎の 3 階を、3D にする。', thumb: '/images/Meiji3fVideoCapture.png' },
    { id: 'uniqlo-future', say: 'UNIQLO の架空サービス「服自販機」を、映像で見せる。', thumb: '/images/UniqloCap.png' },
    { id: 'aquarium', say: '3 つの決まりだけで、魚が群れになる。', thumb: '/images/AcuariumPrograming.png' },
    { id: 'retroTV-portfolio', say: 'ブラウン管の画面に、ポートフォリオを映す。', thumb: '/images/retroTV-portfolio.png' },
    { id: 'cube-diary', say: '写真を貼ったキューブを、暗い空間に並べる日記。', thumb: '/images/CubeDiary.png' },
    { id: 'ai-music-video', say: '工程ごとに AI を使い分けたミュージックビデオ。', thumb: '/images/Ai-Generated-Mv.png' },
    { id: 'ai-composition', say: '自分の曲を素材にして、AI で広げる。', thumb: '/images/works/ai-composition/photo.webp' },
];

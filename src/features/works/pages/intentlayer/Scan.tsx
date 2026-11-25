'use client';

import { useState } from 'react';

// 理由: 必要なときだけ見える仕組みを、読む人が自分の手で試せるようにする。
// 最初の画: 札なし。最後の画: 札が 3 枚。時間: ゴーグルから近い順に 0.16 秒ずつ、1 枚 0.3 秒で開く
export default function Scan({ tags }: { tags: string[] }) {
    const [on, setOn] = useState(true);
    return (
        <div className="scan" data-on={on}>
            <ul aria-hidden={!on}>{tags.map((t) => <li key={t}><span>{t}</span></li>)}</ul>
            <button type="button" aria-pressed={on} onClick={() => setOn(!on)}>{on ? '札を消す' : 'スキャンする'}</button>
        </div>
    );
}

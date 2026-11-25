'use client';

import Image from 'next/image';
import { useState } from 'react';

const SIZES = '(max-width: 760px) 100vw, 50vw';

// 11 ページの下の段に、裏の 12 ページを透かす。
// 動きの理由：紙を灯に透かして読む仕掛けを、画面の上で同じ順に行うため。
// 最初＝刷られたままの 11 ページ。最後＝ふたりの手と文が一つになった画。間は .9 秒、ヨリの提灯から円で広がる
export default function Sukashi() {
  const [lit, setLit] = useState(false);
  return (
    <div className="kt-sukashi" data-lit={lit}>
      <button type="button" aria-pressed={lit} aria-controls="kt-paper" onClick={() => setLit(!lit)}>{lit ? '灯を消す' : '灯をともす'}</button>
      <div className="kt-paper" id="kt-paper">
        <Image src="/images/books/katakage/sheet11.webp" alt="11ページの下の段。ところどころ欠けた文字と、右へ手を伸ばすヨリ" width={1440} height={775} sizes={SIZES} />
        {/* 切り抜きの半径が 0 のあいだは遅延読み込みが始まらないので、先に読み込む */}
        <div className="kt-lit" aria-hidden={!lit}>
          <Image src="/images/books/katakage/lit.webp" alt="ヨリとネムが手をつなぎ、「姉は海の灯で明けを待つ」と読める" width={1440} height={775} sizes={SIZES} loading="eager" fetchPriority="low" />
        </div>
      </div>
      <p className="kt-sr" aria-live="polite">{lit ? '姉は海の灯で明けを待つ' : ''}</p>
    </div>
  );
}

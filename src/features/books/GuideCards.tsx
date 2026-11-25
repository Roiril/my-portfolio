/* eslint-disable @next/next/no-img-element -- 寸法と圧縮を済ませた絵を、そのまま並べるため */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { guideBooks } from '@/content/books';

// トップに並べる攻略本の札。見開きの動き（front/motion.ts）は、子を左右のページ 2 つと見て開く。
// 見た目は front.css の「攻略本」
export default function GuideCards() {
  return guideBooks.map((book) => {
    const dir = `/images/books/${book.id}`;
    return (
      <Link key={book.id} className="sheet guide" href={`/books/${book.id}`} style={{ '--ground': book.ground, '--tint': book.tint } as CSSProperties}>
        <div className="pg pg-l"><img src={`${dir}/cover.webp`} alt={`${book.title}の表紙。${book.pages[0].alt}`} width="760" height="1075" loading="lazy" decoding="async" /></div>
        <div className="pg pg-r">
          <p className="kick">{book.date}　全{book.pages.length}ページ</p>
          <p className="q">{book.title}</p>
          <p className="b">{book.say}</p>
          <span className="peek" aria-hidden="true">
            {book.peek.map((n) => <img key={n} src={`${dir}/t${String(n).padStart(2, '0')}.webp`} alt="" width="240" height="340" loading="lazy" decoding="async" />)}
          </span>
          <p className="role">{book.made}<br /><u>詳しく見る</u></p>
        </div>
      </Link>
    );
  });
}

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { workPages } from '@/content/work-pages';
import { works } from '@/content/works';
import { frontHrefOfWork } from '@/features/front';

const titleOf = (id: string) => works.find((w) => w.id === id)?.title ?? id;

// 全ページに共通するのは、戻る、前後の作品、足元だけ
export default function Shell({ id, className, children }: { id: string; className: string; children: ReactNode }) {
    const index = workPages.findIndex((p) => p.id === id);
    const back = frontHrefOfWork(id);
    return (
        <div className={`wk ${className}`}>
            <Link className="wk-back" href={back}>トップへ戻る</Link>
            <main>{children}</main>
            <nav className="wk-np" aria-label="前後の作品">
                <Neighbor label="前の作品" none="最初の作品です" i={index - 1} back={back} />
                <Neighbor label="次の作品" none="最後の作品です" i={index + 1} back={back} />
            </nav>
            <footer className="wk-foot">© {new Date().getFullYear()} Taisei Shiroishi</footer>
        </div>
    );
}

function Neighbor({ label, none, i, back }: { label: string; none: string; i: number; back: string }) {
    const item = workPages[i];
    if (!item) return <Link href={back}><small>{none}</small><b>トップへ戻る</b></Link>;
    return (
        <Link href={`/works/${item.id}`}>
            <small>{label}</small>
            <b>{titleOf(item.id)}</b>
            <Image src={item.thumb} alt="" width={340} height={227} sizes="200px" />
        </Link>
    );
}

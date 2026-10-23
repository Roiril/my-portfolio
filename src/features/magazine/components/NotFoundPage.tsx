import Image from 'next/image';
import NextLink from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import { art } from '@/content/magazine-art';
import { issue } from '@/content/magazine';
import '../magazine.css';

// 見つからないページ。誌面と同じ紙・書体・差し色で、乱丁のページとして組む。
// 案内役の手（どうぞ）が表紙への行き先を差し出す
export default function NotFoundPage() {
    return (
        <div className="mag">
            <SiteHeader />
            <main id="main-content" tabIndex={-1} className="mag-404">
                <p className="mag-cover__issue">
                    <span>{issue.issueLine}</span>
                    <span>乱丁のページ</span>
                </p>
                <h1 className="mag-404__title" data-plate="404">404</h1>
                <div className="mag-404__body">
                    <p className="mag-404__lead">このページは見つかりませんでした。</p>
                    <p>URL が変わったか、ページを移した可能性があります。表紙から探してください。</p>
                    <div className="mag-404__links">
                        <NextLink href="/" className="mag-404__primary">表紙へ戻る<span aria-hidden="true"> →</span></NextLink>
                        <NextLink href="/#gallery">作品のページ<span aria-hidden="true"> →</span></NextLink>
                        <NextLink href="/resume">経歴<span aria-hidden="true"> →</span></NextLink>
                    </div>
                </div>
                <Image src={art.guideDozo.src} alt="" width={art.guideDozo.width} height={art.guideDozo.height} sizes="(max-width: 600px) 50vw, 320px" className="mag-spot mag-404__hand" />
            </main>
        </div>
    );
}

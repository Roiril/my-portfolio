import Link from 'next/link';
import { frontFonts } from './fonts';
import './front.css';

export default function NotFoundPage() {
  return (
    <div className={`front ${frontFonts}`}>
      <main className="front-404">
        <div className="front-404__num"><h1>404</h1></div>
        <div className="front-404__body">
          <p className="lead">このページは見つかりませんでした。</p>
          <p className="txt">URL が変わったか、ページを移した可能性があります。</p>
          <p className="links">
            <Link className="link" href="/">トップへ戻る</Link>
            <Link className="link" href="/#small">小さな作品</Link>
            <Link className="link" href="/resume">経歴</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

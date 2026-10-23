import ArtIcon from '@/components/ui/ArtIcon';

export default function Footer({ topHref = '#main-content' }: { topHref?: string }) {
    return (
        <footer className="site-footer">
            <div className="site-container site-footer__inner">
                <p>© {new Date().getFullYear()} Taisei Shiroishi</p>
                {/* このページの先頭へ（トップの表紙ではない）。本文の頭にフォーカスも移す */}
                <a href={topHref}>このページの先頭へ <ArtIcon name="arrow" size={16} className="art-icon--up" /></a>
            </div>
        </footer>
    );
}

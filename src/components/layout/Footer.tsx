import Link from 'next/link';
import ArtIcon from '@/components/ui/ArtIcon';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-container site-footer__inner">
                <p>© {new Date().getFullYear()} Taisei Shiroishi</p>
                <Link href="/#top">ページの先頭へ <ArtIcon name="arrow" size={16} className="art-icon--up" /></Link>
            </div>
        </footer>
    );
}

import Link from 'next/link';
import ArtIcon from '@/components/ui/ArtIcon';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-container site-footer__inner">
                <p>(c) {new Date().getFullYear()} Taisei Shiroishi (Roil). All rights reserved.</p>
                <Link href="/#top">Back to top <ArtIcon name="arrow" size={16} className="art-icon--up" /></Link>
            </div>
        </footer>
    );
}

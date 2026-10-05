import NextLink from 'next/link';
import { works } from '@/content/works';
import type { Work, WorkCategory } from '@/features/works/types';
import { Tag, Link } from '@/components/ui';
import ArtIcon, { type ArtIconName } from '@/components/ui/ArtIcon';
import { WorkCardMedia } from './WorkCardMedia';

const CATEGORY_GROUPS: { key: WorkCategory; label: string; englishLabel: string; sublabel: string; icon: ArtIconName }[] = [
    { key: 'research', label: '研究', englishLabel: 'Research', sublabel: 'HCI・XRの研究プロジェクト', icon: 'research' },
    { key: 'personal', label: '個人開発', englishLabel: 'Personal', sublabel: '暮らしと研究のためのアプリ・ゲーム', icon: 'personal' },
    { key: 'internship', label: '実務', englishLabel: 'Internship', sublabel: '実務で開発・運用したもの', icon: 'internship' },
    { key: 'creative', label: '制作', englishLabel: 'Creative', sublabel: '映像・3D・サウンド・クリエイティブコーディング', icon: 'creative' },
];

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

function WorkCard({ work }: { work: Work }) {
    const detailHref = work.detail ? '/works/' + work.id : undefined;
    const imageHref = detailHref ?? work.links[0]?.url;
    const imageIsExternal = imageHref ? isExternalHref(imageHref) : false;
    const media = work.image ? (
        <WorkCardMedia src={work.image} alt={work.title} fit={work.imageFit} />
    ) : (
        <span className="work-placeholder">Image coming soon</span>
    );

    return (
        <article id={'work-' + work.id} className={'work-card' + (work.featured ? ' work-card--featured' : '') + (work.id === 'mawarimi' ? ' work-card--lead' : '')}>
            {imageHref ? (
                <a href={imageHref} className="work-media work-media--linked"
                    aria-label={detailHref ? work.title + ' の詳細を見る' : work.title}
                    target={imageIsExternal ? '_blank' : undefined} rel={imageIsExternal ? 'noopener noreferrer' : undefined}>
                    {media}
                    <span className="work-image-arrow" aria-hidden="true"><ArtIcon name="arrow" size={18} /></span>
                </a>
            ) : <div className="work-media">{media}</div>}
            <div className="work-content">
                <div className="work-meta">
                    {work.featured && <span className="work-featured">Featured project</span>}
                    {(work.period || work.role) && <p>{[work.period, work.role].filter(Boolean).join('　/　')}</p>}
                </div>
                <h4 className="work-title">
                    {detailHref ? (
                        <NextLink href={detailHref}>{work.title}</NextLink>
                    ) : imageHref ? (
                        <a href={imageHref} target={imageIsExternal ? '_blank' : undefined} rel={imageIsExternal ? 'noopener noreferrer' : undefined}>{work.title}</a>
                    ) : work.title}
                </h4>
                <p className="work-description">{work.description}</p>
                <div className="work-tags">{work.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                <div className="work-bottom">
                    {work.isCurrent && <p className="work-current">進行中</p>}
                    {work.links.length > 0 && (
                        <div className="work-links">
                            {work.links.map((link) => (
                                <Link key={link.url} href={link.url} isExternal size="sm">
                                    {link.label || (link.type === 'launch' ? 'Launch' : link.type === 'paper' ? 'Paper' : 'Video')}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {work.credits && work.credits.length > 0 && (
                <div className="work-credits">
                    <p>{work.id === 'mawarimi' ? '廻リ視クレジット' : 'クレジット'}</p>
                    <ul>{work.credits.map((credit) => <li key={credit}>{credit}</li>)}</ul>
                </div>
            )}
        </article>
    );
}

export default function Works() {
    const groups = CATEGORY_GROUPS.map((group) => ({
        ...group,
        items: works.filter((work) => (work.category ?? 'creative') === group.key && !work.hidden),
    })).filter((group) => group.items.length > 0);

    return (
        <section id="works" className="works-section" aria-labelledby="works-title">
            <div className="site-container">
                <header className="works-heading">
                    <div className="works-heading__title">
                        <p className="section-kicker">01 / SELECTED WORKS</p>
                        <h2 id="works-title">Works<span aria-hidden="true">({groups.reduce((total, group) => total + group.items.length, 0)})</span></h2>
                        <p className="section-subtitle">研究と制作</p>
                    </div>
                    <p>研究から日々のものづくりまで。公開できる{groups.reduce((total, group) => total + group.items.length, 0)}の成果物をまとめています。</p>
                </header>
                <nav className="work-index" aria-label="Works">
                    {groups.map((group, index) => (
                        <a key={group.key} href={'#works-' + group.key}>
                            <ArtIcon name={group.icon} size={28} />
                            <span>{group.label} / {group.englishLabel}</span>
                            <span className="work-index__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            <ArtIcon name="arrow" size={24} className="art-icon--down" />
                        </a>
                    ))}
                </nav>
                {groups.map((group, index) => (
                    <section key={group.key} id={'works-' + group.key} className={'work-group work-group--' + group.key} aria-labelledby={'title-' + group.key}>
                        <header className="work-group-heading">
                            <div className="work-group-heading__title">
                                <ArtIcon name={group.icon} size={40} />
                                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                <h3 id={'title-' + group.key}>{group.label}</h3>
                                <span>{group.englishLabel}</span>
                            </div>
                            <p>{group.sublabel}</p>
                        </header>
                        <div className="work-grid">{group.items.map((work) => <WorkCard key={work.id} work={work} />)}</div>
                    </section>
                ))}
            </div>
        </section>
    );
}

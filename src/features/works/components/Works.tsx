import NextLink from 'next/link';
import { works } from '@/content/works';
import type { Work, WorkCategory } from '@/features/works/types';
import { Tag, Link } from '@/components/ui';
import ArtIcon from '@/components/ui/ArtIcon';
import { WorkCardMedia } from './WorkCardMedia';
import { WorkFilters } from './WorkFilters';
import './works-showcase.css';

const CATEGORY_GROUPS: { key: WorkCategory; label: string; englishLabel: string; sublabel: string }[] = [
    { key: 'research', label: '研究', englishLabel: 'Research', sublabel: 'HCI・XRの研究プロジェクト' },
    { key: 'personal', label: '個人開発', englishLabel: 'Personal', sublabel: '暮らしと研究のためのアプリ・ゲーム' },
    { key: 'internship', label: '実務', englishLabel: 'Internship', sublabel: '実務で開発・運用したもの' },
    { key: 'creative', label: '制作', englishLabel: 'Creative', sublabel: '映像・3D・サウンド・クリエイティブコーディング' },
];

const isExternalHref = (href: string) => /^https?:\/\//.test(href);

function WorkCard({ work }: { work: Work }) {
    const detailHref = work.detail ? '/works/' + work.id : undefined;
    const imageHref = detailHref ?? work.links[0]?.url;
    const imageIsExternal = imageHref ? isExternalHref(imageHref) : false;
    const isLead = work.id === 'mawarimi' || work.id === 'whiteout';
    const media = work.image ? (
        <WorkCardMedia src={work.image} alt={work.title} fit={work.imageFit} wide={isLead} />
    ) : (
        <span className="work-placeholder">Image coming soon</span>
    );

    return (
        <article id={'work-' + work.id} className={'work-card' + (work.featured ? ' work-card--featured' : '') + (isLead ? ' work-card--lead' : '')}>
            {imageHref ? (
                <a href={imageHref} className="work-media work-media--linked"
                    data-reveal="media"
                    aria-label={detailHref ? work.title + ' の詳細を見る' : work.title}
                    target={imageIsExternal ? '_blank' : undefined} rel={imageIsExternal ? 'noopener noreferrer' : undefined}>
                    {media}
                    <span className="work-image-arrow" aria-hidden="true"><ArtIcon name="arrow" size={18} /></span>
                </a>
            ) : <div className="work-media" data-reveal="media">{media}</div>}
            <div className="work-content">
                <div className="work-meta">
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
                <details className="work-credits">
                    <summary>
                        <span>{work.id === 'mawarimi' ? '廻リ視クレジット' : 'クレジット'}</span>
                        <span>{work.credits.length}項目 <span aria-hidden="true">＋</span></span>
                    </summary>
                    <ul>{work.credits.map((credit) => <li key={credit}>{credit}</li>)}</ul>
                </details>
            )}
        </article>
    );
}

export default function Works() {
    const groups = CATEGORY_GROUPS.map((group) => ({
        ...group,
        items: works.filter((work) => (work.category ?? 'creative') === group.key && !work.hidden),
    })).filter((group) => group.items.length > 0);
    const workCount = groups.reduce((total, group) => total + group.items.length, 0);
    const filters = [
        { key: 'all' as const, label: 'すべて', count: workCount },
        ...groups.map((group) => ({ key: group.key, label: group.label, count: group.items.length })),
    ];

    return (
        <section id="works" className="works-section" aria-labelledby="works-title" data-scroll-section>
            <div className="site-container">
                <header className="works-heading" data-scroll-rule>
                    <div className="works-heading__title">
                        <p className="section-kicker">01 / PROJECTS</p>
                        <h2 id="works-title">Works</h2>
                    </div>
                    <p>研究のプロトタイプからWebアプリやゲームまで。{workCount}件の制作を掲載しています。</p>
                </header>
                <WorkFilters filters={filters}>
                    {groups.map((group, index) => (
                        <section
                            key={group.key}
                            id={'works-' + group.key}
                            className={'work-group work-group--' + group.key}
                            aria-labelledby={'title-' + group.key}
                            data-work-category={group.key}
                            data-scroll-section
                        >
                            <header className="work-group-heading" data-scroll-rule>
                                <div className="work-group-heading__title">
                                    <p>{group.englishLabel}</p>
                                    <div className="work-group-heading__title-line">
                                        <span className="work-group-heading__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                        <h3 id={'title-' + group.key}>{group.label}</h3>
                                    </div>
                                </div>
                                <p>{group.sublabel}</p>
                            </header>
                            <div className="work-grid">{group.items.map((work) => <WorkCard key={work.id} work={work} />)}</div>
                        </section>
                    ))}
                </WorkFilters>
            </div>
        </section>
    );
}

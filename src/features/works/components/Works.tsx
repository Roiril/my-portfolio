import NextLink from 'next/link';
import { works } from '@/content/works';
import type { Work, WorkCategory } from '@/features/works/types';
import { Tag, Link } from '@/components/ui';
import { WorkCardMedia } from './WorkCardMedia';

const CATEGORY_GROUPS: { key: WorkCategory; label: string; sublabel: string }[] = [
    { key: 'research', label: '研究 / Research', sublabel: 'HCI・XRの研究プロジェクト' },
    { key: 'internship', label: 'インターン / Internship', sublabel: '実務で開発・運用したもの' },
    { key: 'personal', label: '個人開発 / Personal', sublabel: '自分の生活と研究のために作ったツール' },
    { key: 'creative', label: '制作 / Creative', sublabel: '映像・3D・サウンド・クリエイティブコーディング' },
];

function WorkCard({ work }: { work: Work }) {
    const detailHref = work.detail ? '/works/' + work.id : undefined;
    const imageHref = detailHref ?? work.links[0]?.url;
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
                    target={detailHref ? undefined : '_blank'} rel={detailHref ? undefined : 'noopener noreferrer'}>
                    {media}
                    <span className="work-image-arrow" aria-hidden="true">↗</span>
                </a>
            ) : <div className="work-media">{media}</div>}
            <div className="work-content">
                <div className="work-meta">
                    {work.featured && <span className="work-featured">Featured</span>}
                    {(work.period || work.role) && <p>{[work.period, work.role].filter(Boolean).join('　/　')}</p>}
                </div>
                <h4 className="work-title">
                    {detailHref ? <NextLink href={detailHref}>{work.title}</NextLink> : work.title}
                </h4>
                <p className="work-description">{work.description}</p>
                <div className="work-tags">{work.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
                <div className="work-bottom">
                    {work.isCurrent && <p className="work-current">Currently in development</p>}
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
                {work.credits && work.credits.length > 0 && (
                    <div className="work-credits">
                        <p>クレジット</p>
                        <ul>{work.credits.map((credit) => <li key={credit}>{credit}</li>)}</ul>
                    </div>
                )}
            </div>
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
                    <h2 id="works-title">Works<span aria-hidden="true">({groups.reduce((total, group) => total + group.items.length, 0)})</span></h2>
                    <p>研究，趣味，授業，インターンなどの公開可能な成果物をまとめています．</p>
                </header>
                <nav className="work-index" aria-label="Works">
                    {groups.map((group, index) => (
                        <a key={group.key} href={'#works-' + group.key}>
                            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                            {group.label}
                            <span aria-hidden="true">↘</span>
                        </a>
                    ))}
                </nav>
                {groups.map((group, index) => (
                    <section key={group.key} id={'works-' + group.key} className={'work-group work-group--' + group.key} aria-labelledby={'title-' + group.key}>
                        <header className="work-group-heading">
                            <h3 id={'title-' + group.key}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{group.label}</h3>
                            <p>{group.sublabel}</p>
                        </header>
                        <div className="work-grid">{group.items.map((work) => <WorkCard key={work.id} work={work} />)}</div>
                    </section>
                ))}
            </div>
        </section>
    );
}

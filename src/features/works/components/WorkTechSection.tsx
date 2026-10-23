import type { WorkTech } from '../types';
import './work-case.css';

// 詳細ページの「技術」の章。作品ごとのページ（汎用・couple-sync 専用）の両方に差し込む。
// 色は親が渡す --case-paper / --case-ink / --case-accent に従う
export default function WorkTechSection({ tech, id = 'tech', index = '02' }: { tech: WorkTech; id?: string; index?: string }) {
    const titleId = id + '-title';
    return (
        <section id={id} className="case-tech" aria-labelledby={titleId}>
            <header className="case-tech__head">
                <p className="case-chapter-no" aria-hidden="true">{index}</p>
                <h2 id={titleId} className="case-chapter-title">技術</h2>
                <p className="case-tech__summary">{tech.summary}</p>
            </header>

            {tech.numbers && tech.numbers.length > 0 && (
                <dl className="case-tech__numbers">
                    {tech.numbers.map((n) => (
                        <div key={n.label}>
                            <dt>{n.label}</dt>
                            <dd><span className="case-tech__value">{n.value}</span>{n.unit && <span className="case-tech__unit">{n.unit}</span>}</dd>
                        </div>
                    ))}
                </dl>
            )}

            <div className="case-tech__block">
                <h3 className="case-tech__label">使った技術</h3>
                <dl className="case-tech__stack">
                    {tech.stack.map((row) => (
                        <div key={row.label}>
                            <dt>{row.label}</dt>
                            <dd>
                                <ul>
                                    {row.items.map((item) => <li key={item} translate="no">{item}</li>)}
                                </ul>
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>

            {tech.flow && tech.flow.length > 0 && (
                <div className="case-tech__block">
                    <h3 className="case-tech__label">しくみ</h3>
                    <ol className="case-tech__flow" style={{ '--steps': tech.flow.length } as React.CSSProperties}>
                        {tech.flow.map((step) => (
                            <li key={step.title}>
                                <h4>{step.title}</h4>
                                <p>{step.body}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            <div className="case-tech__block">
                <h3 className="case-tech__label">工夫したところ</h3>
                <ol className="case-tech__points">
                    {tech.points.map((point) => (
                        <li key={point.title}>
                            <h4>{point.title}</h4>
                            <p>{point.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

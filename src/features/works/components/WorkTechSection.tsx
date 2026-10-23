import type { WorkTech } from '../types';
import ArchitectureDiagram from './ArchitectureDiagram';
import './work-case.css';

// 詳細ページの「技術」の章。雑誌の解説記事の組み方にする：
//   扉（番号・題・要約）→ 構成図 → 本文の段（しくみ・工夫）と、脇の囲み（数字・使った技術）。
// 大きく組むのは題だけ。数字は囲みの中で本文より一段大きい程度に留める。
// 色は親が渡す --case-paper / --case-ink / --case-accent に従う。汎用の詳細ページと couple-sync の専用ページの両方で使う
export default function WorkTechSection({ tech, id = 'tech', index = '02', figureId = 'work' }: { tech: WorkTech; id?: string; index?: string; figureId?: string }) {
    const titleId = id + '-title';
    return (
        <section id={id} className="case-tech" aria-labelledby={titleId}>
            <header className="case-chapter">
                <p className="case-chapter__no">{index}</p>
                <h2 id={titleId} className="case-chapter__title">技術</h2>
                <p className="case-chapter__standfirst">{tech.summary}</p>
            </header>

            {tech.diagram && <ArchitectureDiagram diagram={tech.diagram} id={figureId + '-diagram'} />}

            <div className="case-tech__body">
                <div className="case-tech__main">
                    {tech.flow && tech.flow.length > 0 && (
                        <section aria-labelledby={id + '-flow'}>
                            <h3 id={id + '-flow'} className="case-label">しくみ</h3>
                            <ol className="case-flow">
                                {tech.flow.map((step, i) => (
                                    <li key={step.title}>
                                        <span className="case-flow__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                                        <h4>{step.title}</h4>
                                        <p>{step.body}</p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}

                    <section aria-labelledby={id + '-points'}>
                        <h3 id={id + '-points'} className="case-label">工夫したところ</h3>
                        <div className="case-points">
                            {tech.points.map((point, i) => (
                                <section key={point.title} className="case-point">
                                    <h4><span className="case-point__no">{String(i + 1).padStart(2, '0')}</span>{point.title}</h4>
                                    <p>{point.body}</p>
                                </section>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="case-tech__side" aria-label="数字と使った技術">
                    {tech.numbers && tech.numbers.length > 0 && (
                        <section className="case-box" aria-labelledby={id + '-numbers'}>
                            <h3 id={id + '-numbers'} className="case-box__title">数字</h3>
                            <dl className="case-numbers">
                                {tech.numbers.map((n) => (
                                    <div key={n.label}>
                                        <dt>{n.label}</dt>
                                        <dd>{n.value}{n.unit && <small>{n.unit}</small>}</dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    )}
                    <section className="case-box" aria-labelledby={id + '-stack'}>
                        <h3 id={id + '-stack'} className="case-box__title">使った技術</h3>
                        <dl className="case-spec">
                            {tech.stack.map((row) => (
                                <div key={row.label}>
                                    <dt>{row.label}</dt>
                                    {row.items.map((item) => <dd key={item} translate="no">{item}</dd>)}
                                </div>
                            ))}
                        </dl>
                    </section>
                </aside>
            </div>
        </section>
    );
}

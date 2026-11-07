import { workDiagrams } from '@/content/work-diagrams';

// 図は PC 用の横長とスマートフォン用の縦長の 2 枚を持ち、CSS で切り替える。文字の大きさがそれぞれの幅で読めるように作ってある
export default function WorkFigure({ name, caption }: { name: string; caption: string }) {
    const svg = workDiagrams[name];
    if (!svg) throw new Error(`図がありません: ${name}`);
    return (
        <figure className="wp-fig">
            <div className="wp-fig__wide" dangerouslySetInnerHTML={{ __html: svg.wide }} />
            <div className="wp-fig__tall" dangerouslySetInnerHTML={{ __html: svg.tall }} />
            <figcaption>{caption}</figcaption>
        </figure>
    );
}

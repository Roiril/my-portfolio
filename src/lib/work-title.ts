// 作品の題の組み方。トップの誌面と詳細ページの両方で使う

// 「廻リ視 — Mawarimi」のような題を、日本語の題と英語の副題に分ける
export function splitTitle(title: string): { main: string; sub?: string } {
    const [main, sub] = title.split(' — ');
    return { main, sub };
}

// 英字だけの題は詰まった英字書体で、日本語を含む題は日本語の極太で組む
const isLatin = (text: string) => !/[぀-ヿ㐀-鿿]/.test(text);

// 長い題は一段小さく組む。日本語は 1 字が英字のおよそ 2 字分の幅なので、6 字から長いとみなす
// （「AI業務ツール」が大きいまま組まれて「ツー／ル」で折れていた）
export function titleClass(main: string): string {
    const latin = isLatin(main);
    const long = latin ? main.length > 9 : main.length > 5;
    return [latin ? 'is-latin' : 'is-ja', long ? 'is-long' : ''].filter(Boolean).join(' ');
}

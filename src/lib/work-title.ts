// 作品の題の組み方。トップの誌面と詳細ページの両方で使う

// 「廻リ視 — Mawarimi」のような題を、日本語の題と英語の副題に分ける
export function splitTitle(title: string): { main: string; sub?: string } {
    const [main, sub] = title.split(' — ');
    return { main, sub };
}

// 英字だけの題は詰まった英字書体で、日本語を含む題は日本語の極太で組む
const isLatin = (text: string) => !/[぀-ヿ㐀-鿿]/.test(text);

export function titleClass(main: string): string {
    return [isLatin(main) ? 'is-latin' : 'is-ja', main.length > 9 ? 'is-long' : ''].filter(Boolean).join(' ');
}

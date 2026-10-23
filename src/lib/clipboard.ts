/**
 * 指定されたテキストをクリップボードにコピーします。
 * Clipboard API が無いときだけでなく、権限で断られたとき（埋め込み表示・一部のブラウザ）も
 * 古い方式（execCommand）で試し直します。
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // 下の古い方式で試し直す
        }
    }
    return copyWithSelection(text);
}

function copyWithSelection(text: string): boolean {
    const active = document.activeElement as HTMLElement | null;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    try {
        textarea.select();
        return document.execCommand('copy');
    } catch {
        return false;
    } finally {
        document.body.removeChild(textarea);
        // 押したボタンにフォーカスを戻す（キーボードで操作している人が位置を見失わないように）
        active?.focus({ preventScroll: true });
    }
}

'use client';

// 印刷ダイアログを開くボタン。ページ本体をサーバー側に残すため、押す部分だけをクライアントに切り出している
export default function PrintButton({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <button type="button" onClick={() => window.print()} className={className}>
            {children}
        </button>
    );
}

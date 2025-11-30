import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ▼▼▼ Google検索＆SNSシェア用の設定 ▼▼▼
export const metadata: Metadata = {
  // サイトのベースURL（自分のVercelのURLに書き換えてください）
  metadataBase: new URL("https://my-portfolio-ruby-delta-87.vercel.app"), 

  title: "Roil's Portfolio | 白石大晴 明治大学 FMS",
  description: "Roil (白石大晴) のポートフォリオサイト。明治大学FMSでHCIを研究中。Unity, Next.js, Blenderなどの作品を公開しています。",
  
  // 検索キーワード（Googleへのヒント）
  keywords: ["白石大晴","白石","大晴","Roil", "Shiroishi", "明治大学", "FMS", "HCI", "Unity", "Portfolio", "個人開発"],

  // SNSでシェアされた時の表示設定（OGP）
  openGraph: {
    title: "Roil's Portfolio",
    description: "白石大晴 / 明治大学FMS / HCI研究 / 面白いと思ったものを作る。",
    url: "https://my-portfolio-ruby-delta-87.vercel.app",
    siteName: "Roil's Portfolio",
    images: [
      {
        url: "/images/Roil_hci_icon.png", // シェア時に表示される画像
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },

  // Twitterカードの設定
  twitter: {
    card: "summary_large_image",
    title: "Roil's Portfolio",
    description: "白石大晴 / 明治大学FMS / HCI研究 / 面白いと思ったものを作る。",
    images: ["/images/Roil_hci_icon.png"], // Twitter用の画像
  },

  // ▼▼▼ Google Search Consoleの所有権確認 ▼▼▼
  verification: {
    // ⚠️重要: Google Search Consoleの <meta ... content="ここの文字列" /> をコピーして貼り付けてください
    google: "N7ViILHjllx9qexJlKXjneaofKTxnPU18dXtkSJetRs", 
  },
};
// ▲▲▲ ここまで ▲▲▲

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
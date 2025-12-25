import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ▼▼▼ Google検索＆SNSシェア用の設定 ▼▼▼
export const metadata: Metadata = {
  // サイトのベースURL（自分のVercelのURLに書き換えてください）
  metadataBase: new URL("https://my-portfolio-ruby-delta-87.vercel.app"), 

  title: "白石大晴 明治大学 FMS | Roil's Portfolio",
  description: "白石大晴のポートフォリオサイト。明治大学FMSでHCIを研究中。Unity, Next.js, Blenderなどの作品を公開しています。",
  
  // 検索キーワード（Googleへのヒント）
  keywords: ["白石大晴","白石","大晴","Roil", "Shiroishi", "明治大学", "FMS", "HCI", "Unity", "Portfolio", "個人開発"],

  // SNSでシェアされた時の表示設定（OGP）
  openGraph: {
    title: "白石大晴 Portfolio",
    description: "白石大晴 / 明治大学FMS / HCI研究 / 面白いと思ったものを作る。",
    url: "https://my-portfolio-ruby-delta-87.vercel.app",
    siteName: "白石大晴 Portfolio",
    images: [
      {
        url: "/images/Roil_hci_icon.png", // シェア時に表示される画像
        width: 1024,
        height: 1024,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },

  // Twitterカードの設定
  twitter: {
    card: "summary_large_image",
    title: "白石大晴 Portfolio",
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
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://my-portfolio-ruby-delta-87.vercel.app/#person",
        "name": "白石大晴",
        "alternateName": ["Roil", "Taisei Shiroishi"],
        "url": "https://my-portfolio-ruby-delta-87.vercel.app",
        "description": "明治大学FMSでHCIを研究中。Unity, Next.js, Blenderを使った個人開発やポートフォリオを公開しています。",
        "jobTitle": "学生 / 研究者 / クリエイター",
        "affiliation": {
          "@type": "EducationalOrganization",
          "name": "明治大学",
          "url": "https://www.meiji.ac.jp"
        },
        "image": "https://my-portfolio-ruby-delta-87.vercel.app/images/Roil_hci_icon.png",
        "sameAs": [
          "https://twitter.com/roil_hci"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://my-portfolio-ruby-delta-87.vercel.app/#website",
        "url": "https://my-portfolio-ruby-delta-87.vercel.app",
        "name": "白石大晴 Portfolio",
        "description": "白石大晴のポートフォリオサイト。HCI研究と個人開発の作品を公開しています。",
        "creator": {
          "@id": "https://my-portfolio-ruby-delta-87.vercel.app/#person"
        }
      }
    ]
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
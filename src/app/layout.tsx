// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ??
  "https://my-portfolio-ruby-delta-87.vercel.app").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // 検索結果で「白石大晴」を先頭に寄せる
  title: "白石大晴 | 明治大学FMS・HCI | Portfolio",
  description:
    "白石大晴のポートフォリオ。明治大学FMSでHCIを研究。Unity、Next.js、Blenderなどの制作物と研究活動を掲載。",

  // Googleの順位には直結しにくいが、補助情報としては無害
  keywords: [
    "白石大晴",
    "白石",
    "大晴",
    "Roil",
    "Taisei Shiroishi",
    "明治大学",
    "FMS",
    "HCI",
    "Mixed Reality",
    "Unity",
    "Next.js",
    "Blender",
    "Portfolio",
    "個人開発",
  ],

  openGraph: {
    title: "白石大晴 | Portfolio",
    description: "白石大晴（明治大学FMS / HCI）。研究と制作の記録。",
    url: SITE_URL,
    siteName: "白石大晴 Portfolio",
    images: [
      {
        url: "/images/Roil_hci_icon.png",
        width: 1024,
        height: 1024,
        alt: "白石大晴 Portfolio",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "白石大晴 | Portfolio",
    description: "白石大晴（明治大学FMS / HCI）。研究と制作の記録。",
    images: ["/images/Roil_hci_icon.png"],
  },

  verification: {
    google: "N7ViILHjllx9qexJlKXjneaofKTxnPU18dXtkSJetRs",
  },

  // ありがちなノイズを減らす（任意）
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

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
        "@id": `${SITE_URL}/#person`,
        name: "白石大晴",
        alternateName: ["Roil", "Taisei Shiroishi"],
        url: SITE_URL,
        description:
          "明治大学FMSでHCIを研究。Unity、Next.js、Blenderを用いた制作と研究活動を公開。",
        jobTitle: "学生",
        affiliation: {
          "@type": "EducationalOrganization",
          name: "明治大学",
          url: "https://www.meiji.ac.jp",
        },
        knowsAbout: ["HCI", "Mixed Reality", "Unity", "Next.js", "Blender"],
        image: `${SITE_URL}/images/Roil_hci_icon.png`,
        sameAs: [
          "https://twitter.com/roil_hci",
          // あるなら追加（無いなら消してOK）
          // "https://github.com/xxxx",
          // "https://www.youtube.com/@Roil_HCI",
          // "https://www.linkedin.com/in/xxxx",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "白石大晴 Portfolio",
        description: "白石大晴のポートフォリオサイト。HCI研究と制作物を公開。",
        publisher: { "@id": `${SITE_URL}/#person` },
        creator: { "@id": `${SITE_URL}/#person` },
        inLanguage: "ja",
      },
    ],
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

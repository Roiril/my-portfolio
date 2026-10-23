// src/app/layout.tsx
import type { Metadata } from "next";
import { Anton, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { MotionProvider } from '@/components/motion/MotionProvider';
import RevealObserver from '@/components/motion/RevealObserver';
import ScrollChoreography from '@/components/motion/ScrollChoreography';
import { SITE_URL, SOCIAL_LINKS } from '@/constants/site';

// 誌面の見出し用（英字の詰まった太字）と、日本語の本文・見出し用
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const notoSansJp = Noto_Sans_JP({ weight: ["400", "700", "900"], subsets: ["latin"], variable: "--font-jp", display: "swap", preload: false });

const PERSON_NAME = "白石大晴";
const PERSON_NAME_KANA = "しろいしたいせい";
const PERSON_NAME_ROMAJI = "Taisei Shiroishi";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${PERSON_NAME}（${PERSON_NAME_KANA}） | HCI / Portfolio`,
  description:
    `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオ。明治大学大学院でHCIを研究しています。IVRC2026で総合優勝したVR作品「廻リ視」、研究、Webアプリ、ゲーム、3DCGの制作を掲載しています。`,
  keywords: [
    PERSON_NAME,
    PERSON_NAME_KANA,
    PERSON_NAME_ROMAJI,
    "白石",
    "大晴",
    "Roil",
    "明治大学",
    "総合数理学部",
    "FMS",
    "HCI",
    "Mixed Reality",
    "Unity",
    "Next.js",
    "Blender",
    "Portfolio",
    "ポートフォリオ",
  ],
  authors: [{ name: PERSON_NAME, url: SITE_URL }],
  creator: PERSON_NAME,
  publisher: PERSON_NAME,
  openGraph: {
    title: `${PERSON_NAME}（${PERSON_NAME_KANA}） | Portfolio`,
    description:
      `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオ。HCIの研究と制作をまとめています。`,
    url: SITE_URL,
    siteName: `${PERSON_NAME} Portfolio`,
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: `${PERSON_NAME} Portfolio`,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PERSON_NAME}（${PERSON_NAME_KANA}） | Portfolio`,
    description:
      `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオ。HCIの研究と制作をまとめています。`,
    images: ["/images/og.png"],
  },
  verification: {
    google: "N7ViILHjllx9qexJlKXjneaofKTxnPU18dXtkSJetRs",
  },
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
        name: PERSON_NAME,
        alternateName: [PERSON_NAME_KANA, PERSON_NAME_ROMAJI, "Roil"],
        url: SITE_URL,
        description:
          `${PERSON_NAME}（${PERSON_NAME_KANA}）。明治大学大学院でHCIを研究し、Unity・React・Blenderなどで制作と開発をしています。`,
        jobTitle: "大学院生（修士課程）",
        affiliation: {
          "@type": "EducationalOrganization",
          name: "明治大学大学院 先端数理科学研究科",
          url: "https://www.meiji.ac.jp",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: "明治大学 総合数理学部 先端メディアサイエンス学科",
        },
        award: ["IVRC2026 総合優勝", "IVRC2026 DCEXPO賞"],
        knowsAbout: [
          "HCI",
          "Human-Computer Interaction",
          "Human-Agent Interaction",
          "Virtual Reality",
          "Mixed Reality",
          "Unity",
          "React",
          "Next.js",
          "Blender",
        ],
        sameAs: SOCIAL_LINKS.map((link) => link.url),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${PERSON_NAME} Portfolio`,
        description:
          `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオサイト。HCIの研究と制作を紹介しています。`,
        publisher: { "@id": `${SITE_URL}/#person` },
        creator: { "@id": `${SITE_URL}/#person` },
        inLanguage: "ja",
      },
    ],
  };

  return (
    <html lang="ja" data-scroll-behavior="smooth" className={`${anton.variable} ${notoSansJp.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.motion=(!matchMedia('(prefers-reduced-motion: reduce)').matches&&localStorage.getItem('roil-motion')!=='off')?'on':'off'}catch{document.documentElement.dataset.motion=matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'}" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body><MotionProvider><RevealObserver /><ScrollChoreography />{children}</MotionProvider></body>
    </html>
  );
}

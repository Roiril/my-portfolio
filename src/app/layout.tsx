// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ??
  "https://my-portfolio-ruby-delta-87.vercel.app").replace(/\/+$/, "");

const PERSON_NAME = "白石大晴";
const PERSON_NAME_KANA = "しろいしたいせい";
const PERSON_NAME_ROMAJI = "Taisei Shiroishi";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${PERSON_NAME}（${PERSON_NAME_KANA}） | HCI / Portfolio`,
  description:
    `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオ。明治大学総合数理学部FMSでHCIを研究し、Unity・Next.js・Blenderなどの制作・開発を掲載。`,
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
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${PERSON_NAME}（${PERSON_NAME_KANA}） | Portfolio`,
    description:
      `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオ。HCI研究と制作物をまとめています。`,
    url: SITE_URL,
    siteName: `${PERSON_NAME} Portfolio`,
    images: [
      {
        url: "/images/Roil_hci_icon.png",
        width: 1024,
        height: 1024,
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
      `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオ。HCI研究と制作物をまとめています。`,
    images: ["/images/Roil_hci_icon.png"],
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
          `${PERSON_NAME}（${PERSON_NAME_KANA}）。明治大学総合数理学部FMSでHCIを研究し、Unity・Next.js・Blenderなどで制作・開発を行っています。`,
        jobTitle: "学生",
        affiliation: {
          "@type": "EducationalOrganization",
          name: "明治大学 総合数理学部",
          url: "https://www.meiji.ac.jp",
        },
        knowsAbout: [
          "HCI",
          "Human-Computer Interaction",
          "Mixed Reality",
          "Unity",
          "Next.js",
          "Blender",
        ],
        image: `${SITE_URL}/images/Roil_hci_icon.png`,
        sameAs: [
          "https://x.com/Roil_HCI",
          "https://www.youtube.com/@Roil_HCI",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${PERSON_NAME} Portfolio`,
        description:
          `${PERSON_NAME}（${PERSON_NAME_KANA}）のポートフォリオサイト。HCI研究と制作物を紹介しています。`,
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
      <body>{children}</body>
    </html>
  );
}

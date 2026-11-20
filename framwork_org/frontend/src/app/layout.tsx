import type { Metadata } from "next";
import { fetchPublicSiteConfigs } from "@/lib/api";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const configs = await fetchPublicSiteConfigs();
  const title = configs.seo_title || "표준 기업 홈페이지";
  const description = configs.seo_description || "전문적인 상담과 맞춤형 솔루션을 제공합니다.";
  const keywords = configs.seo_keywords || "";
  const ogImage = configs.seo_og_image || "/uploads/public/default-og.webp";

  const otherMeta: Record<string, string> = {};
  if (configs.naver_site_verification) {
    otherMeta["naver-site-verification"] = configs.naver_site_verification;
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
    },
    verification: configs.google_site_verification
      ? { google: configs.google_site_verification }
      : undefined,
    other: otherMeta,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configs = await fetchPublicSiteConfigs();
  const primaryColor = configs.brand_primary_color || "#4F46E5";

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body style={{ "--primary": primaryColor } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}

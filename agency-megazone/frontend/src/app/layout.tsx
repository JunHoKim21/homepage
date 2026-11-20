import type { Metadata } from "next";
import { fetchPublicSiteConfigs } from "@/lib/api";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const configs = await fetchPublicSiteConfigs();
  const title = configs.seo_title || "엘레브웹 (eleveWeb) | 월 임대료 0원 독립형 홈페이지 제작";
  const description = configs.seo_description || "추가 유지비 부담 없는 투명한 정찰제, 100% 고객 소유형 기업·병의원 홈페이지 제작 에이전시입니다.";
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
  const primaryColor = configs.brand_primary_color || "#1D4ED8";

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

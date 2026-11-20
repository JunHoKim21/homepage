import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "제작 샘플 쇼케이스 | 엘레브웹 (eleveWeb)",
  description: "실제 납품 수준의 업종별 독립 웹사이트 샘플입니다.",
};

export default function SamplesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {children}

      {/* 에이전시 복귀용 플로팅 배지 (좌측 하단) */}
      <div className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-stone-300/80 bg-white/95 px-3.5 py-2 text-xs font-medium text-stone-700 shadow-lg backdrop-blur-md">
        <Link
          href="/"
          className="truncate transition-colors hover:text-stone-950"
        >
          엘레브웹 (eleveWeb) 제작 샘플 | 에이전시 홈 →
        </Link>
        <span className="hidden text-stone-300 sm:inline" aria-hidden="true">
          |
        </span>
        <Link
          href="/inquiries"
          className="hidden shrink-0 font-semibold text-stone-900 underline decoration-stone-400 underline-offset-2 transition-colors hover:text-stone-600 sm:inline"
        >
          무료 견적
        </Link>
      </div>
    </div>
  );
}

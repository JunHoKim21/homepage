"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, MessageCircle, MessageSquarePlus } from "lucide-react";

interface QuickFloatingBarProps {
  configs: Record<string, string>;
}

export default function QuickFloatingBar({ configs }: QuickFloatingBarProps) {
  const [mergedConfigs, setMergedConfigs] = useState<Record<string, string>>(configs);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("demo_site_configs_override");
      if (raw) {
        const override = JSON.parse(raw) as Record<string, string>;
        setMergedConfigs({ ...configs, ...override });
        return;
      }
    } catch {
      // ignore
    }
    setMergedConfigs(configs);
  }, [configs]);

  useEffect(() => {
    function handleScroll() {
      setShowTop(window.scrollY > 300);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rightEnabled = mergedConfigs.floating_right_enabled !== "false";
  const kakaoUrl = (
    mergedConfigs.quick_kakao_url || "https://pf.kakao.com/_AqlvX/chat"
  ).trim();

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!rightEnabled) {
    return null;
  }

  return (
    <>
      {/* 1. 데스크톱 우측 하단 미니멀 플로팅 그룹 (3개 핵심 액션) */}
      <aside
        aria-label="빠른 상담 및 이동 메뉴"
        className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-2.5 lg:flex"
      >
        <Link
          href="/inquiries"
          className="group inline-flex items-center gap-2 rounded-full bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800"
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0 transition group-hover:scale-105" />
          <span>30초 견적 문의</span>
        </Link>

        {kakaoUrl && (
          <a
            href={kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-[#E5CE00] bg-[#FEE500] px-5 py-2.5 text-sm font-bold text-[#3C1E1E] shadow-md transition hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4 shrink-0 transition group-hover:scale-105" />
            <span>카카오톡 상담</span>
          </a>
        )}

        {showTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-md transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="최상단으로 이동"
            title="맨 위로"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </aside>

      {/* 2. 모바일 하단 슬림 빠른 메뉴 (동일 3개 액션) */}
      <nav
        aria-label="모바일 하단 빠른 메뉴"
        className="fixed bottom-3 left-1/2 z-40 flex w-full max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur-md lg:hidden"
      >
        {kakaoUrl && (
          <a
            href={kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#FEE500] px-3.5 py-2.5 text-xs font-bold text-[#3C1E1E]"
            aria-label="카카오톡 상담"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            <span>카톡 상담</span>
          </a>
        )}

        <Link
          href="/inquiries"
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-3 py-2.5 text-xs font-bold text-white"
        >
          <MessageSquarePlus className="h-4 w-4 shrink-0" />
          <span className="truncate">30초 무료 견적 문의</span>
        </Link>

        {showTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-700 hover:bg-slate-100"
            aria-label="최상단으로 이동"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </nav>
    </>
  );
}

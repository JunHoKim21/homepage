"use client";

import Link from "next/link";
import { ArrowUp, CalendarCheck, MessageCircle, MessageSquarePlus, Phone, Youtube, Instagram, BookOpen } from "lucide-react";
import { useState } from "react";

interface QuickFloatingBarProps {
  configs: Record<string, string>;
}

export default function QuickFloatingBar({ configs }: QuickFloatingBarProps) {
  const [wechatCopied, setWechatCopied] = useState(false);

  const leftEnabled = configs.floating_left_enabled !== "false";
  const rightEnabled = configs.floating_right_enabled !== "false";

  const kakaoUrl = (configs.quick_kakao_url || "").trim();
  const wechatId = (configs.quick_wechat_id || "").trim();
  const instaUrl = (configs.sns_instagram_url || "").trim();
  const blogUrl = (configs.sns_blog_url || "").trim();
  const youtubeUrl = (configs.sns_youtube_url || "").trim();
  const reservationMode = configs.reservation_mode || "BOTH";

  let phone = "";
  try {
    const company = JSON.parse(configs.footer_company_info || "{}") as { phone?: string };
    phone = (company.phone || "").trim();
  } catch {
    phone = "";
  }

  function handleCopyWechat() {
    if (!wechatId) return;
    navigator.clipboard.writeText(wechatId);
    setWechatCopied(true);
    setTimeout(() => setWechatCopied(false), 2000);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {/* 1. 좌측 상담 플로팅 바 (데스크톱: 좌측 중앙 고정) */}
      {leftEnabled && (phone || kakaoUrl || wechatId) && (
        <aside
          aria-label="빠른 상담 채널"
          className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur md:flex"
        >
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100"
              title={`전화 상담: ${phone}`}
            >
              <Phone className="h-4 w-4 text-primary" />
              <span>전화</span>
            </a>
          )}
          {kakaoUrl && (
            <a
              href={kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-xl bg-[#FEE500]/90 px-2.5 py-2 text-[11px] font-bold text-[#3C1E1E] transition hover:bg-[#FEE500]"
              title="카카오톡 채널 상담"
            >
              <MessageCircle className="h-4 w-4" />
              <span>카톡</span>
            </a>
          )}
          {wechatId && (
            <button
              type="button"
              onClick={handleCopyWechat}
              className="flex flex-col items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-2 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
              title={`WeChat ID 복사: ${wechatId}`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{wechatCopied ? "복사됨" : "WeChat"}</span>
            </button>
          )}
        </aside>
      )}

      {/* 2. 우측 플로팅 사이드바 (데스크톱: 우측 중앙 고정) */}
      {rightEnabled && (
        <aside
          aria-label="빠른 메뉴 및 SNS"
          className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur md:flex"
        >
          {reservationMode !== "OFF" && (
            <Link
              href="/reservations"
              className="flex flex-col items-center gap-1 rounded-xl btn-primary px-2.5 py-2 text-[11px] font-semibold transition"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>예약</span>
            </Link>
          )}
          <Link
            href="/inquiries"
            className="flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <MessageSquarePlus className="h-4 w-4 text-primary" />
            <span>문의</span>
          </Link>

          {instaUrl && (
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-semibold text-pink-600 transition hover:bg-pink-50"
              title="인스타그램"
            >
              <Instagram className="h-4 w-4" />
              <span>인스타</span>
            </a>
          )}
          {blogUrl && (
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-semibold text-emerald-600 transition hover:bg-emerald-50"
              title="네이버 블로그"
            >
              <BookOpen className="h-4 w-4" />
              <span>블로그</span>
            </a>
          )}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-semibold text-red-600 transition hover:bg-red-50"
              title="유튜브"
            >
              <Youtube className="h-4 w-4" />
              <span>유튜브</span>
            </a>
          )}

          <button
            type="button"
            onClick={scrollToTop}
            className="flex flex-col items-center gap-0.5 rounded-xl border-t border-slate-100 px-2.5 pt-2 pb-1 text-[10px] font-bold text-slate-500 transition hover:text-slate-900"
            title="맨 위로"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>TOP</span>
          </button>
        </aside>
      )}

      {/* 3. 모바일 하단 퀵바 (좌측 또는 우측 활성 시 하단 컴팩트 플로팅 버튼) */}
      {(leftEnabled || rightEnabled) && (
        <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2 md:hidden">
          {leftEnabled && phone && (
            <a
              href={`tel:${phone}`}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg"
              aria-label="전화 상담"
            >
              <Phone className="h-5 w-5 text-primary" />
            </a>
          )}
          {leftEnabled && kakaoUrl && (
            <a
              href={kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FEE500] text-[#3C1E1E] shadow-lg"
              aria-label="카카오톡 상담"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          )}
          {rightEnabled && reservationMode !== "OFF" && (
            <Link
              href="/reservations"
              className="flex h-11 items-center gap-1.5 rounded-full btn-primary px-4 text-xs font-bold shadow-lg"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>예약</span>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

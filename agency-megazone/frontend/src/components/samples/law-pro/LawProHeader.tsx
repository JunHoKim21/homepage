"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "센터소개", href: "#intro" },
  { label: "사건자가진단", href: "#diagnosis" },
  { label: "해결사례", href: "#cases" },
  { label: "전담변호사", href: "#attorneys" },
  { label: "방문예약", href: "#reservation" },
] as const;

export default function LawProHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 1. 최상단 데모 안내 띠 */}
      <div className="border-b border-white/10 bg-[#111827] text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2 sm:px-6 lg:px-8">
          <p className="min-w-0 leading-relaxed text-slate-300">
            현재 보고 계신 페이지는 업종별 맞춤형 구축 데모 샘플입니다.
          </p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-medium text-slate-200">
            <Link
              href="/"
              className="underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white"
            >
              에이전시 메인
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <Link
              href="/admin/login"
              className="underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white"
            >
              관리자 체험
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <Link
              href="/admin/inquiries"
              className="underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white"
            >
              문의 확인
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <Link
              href="/admin/reservations"
              className="underline decoration-slate-500 underline-offset-4 transition-colors hover:text-white"
            >
              예약 확인
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 24시 긴급 형사상담 전화 띠지 */}
      <div className="bg-[#0F2952] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2.5 text-xs font-medium tracking-tight text-slate-100 sm:text-[13px]">
            <span
              className="inline-block h-1.5 w-1.5 shrink-0 bg-white"
              aria-hidden="true"
            />
            <span className="min-w-0">
              압수수색 · 긴급체포 · 경찰조사 입회 24시간 즉시 대응
            </span>
          </div>
          <a
            href="tel:02-599-0112"
            className="inline-flex shrink-0 items-center gap-2 text-xs font-extrabold tracking-tight text-white transition-opacity hover:opacity-85 sm:text-sm"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-semibold text-slate-200">긴급 직통</span>
            <span className="tabular-nums tracking-normal text-white">
              02-599-0112
            </span>
          </a>
        </div>
      </div>

      {/* 3. 순백 화이트 고정 네비게이션 바 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-6 lg:px-8">
          {/* 좌측 직각 브랜드 로고 */}
          <a
            href="#intro"
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-[#0F2952] bg-[#0F2952] text-[11px] font-extrabold tracking-[0.16em] text-white sm:h-10 sm:w-10 sm:text-xs"
            >
              SY
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-[15px] leading-none font-extrabold tracking-tight text-[#111827] sm:text-lg">
                법무법인 선율
              </span>
              <span className="mt-1 truncate text-[10px] leading-none font-bold tracking-[0.16em] text-[#0F2952] sm:text-[11px]">
                형사전담센터
              </span>
            </span>
          </a>

          {/* 중앙 5종 메뉴 */}
          <nav
            aria-label="주 메뉴"
            className="hidden items-center gap-7 lg:flex xl:gap-9"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="border-b-2 border-transparent py-1 text-[15px] font-semibold tracking-tight text-[#111827] transition-colors hover:border-[#0F2952] hover:text-[#0F2952]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 우측 직각 CTA + 모바일 메뉴 토글 */}
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="#diagnosis"
              className="inline-flex items-center justify-center rounded-none border border-[#0F2952] bg-[#0F2952] px-3 py-2 text-xs font-bold tracking-tight text-white transition-colors hover:border-[#111827] hover:bg-[#111827] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              긴급 자가진단
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="law-pro-mobile-nav"
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-slate-300 bg-white text-[#111827] transition-colors hover:border-[#0F2952] hover:text-[#0F2952] lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {mobileMenuOpen && (
          <div
            id="law-pro-mobile-nav"
            className="border-t border-slate-200 bg-white lg:hidden"
          >
            <nav
              aria-label="모바일 메뉴"
              className="mx-auto max-w-7xl px-4 py-3 sm:px-6"
            >
              <ul className="divide-y divide-slate-100">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 text-sm font-bold tracking-tight text-[#111827] transition-colors hover:text-[#0F2952]"
                    >
                      <span>{item.label}</span>
                      <span
                        className="text-xs font-normal text-slate-400"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 pb-1 sm:grid-cols-2">
                <a
                  href="tel:02-599-0112"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-none border border-slate-300 bg-[#F5F7FA] px-4 py-3 text-xs font-extrabold text-[#111827] transition-colors hover:border-[#0F2952] hover:text-[#0F2952]"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#0F2952]" />
                  <span className="tabular-nums">24시 긴급 02-599-0112</span>
                </a>
                <a
                  href="#reservation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-none bg-[#0F2952] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#111827]"
                >
                  실시간 방문상담 예약
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

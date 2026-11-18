"use client";

import Link from "next/link";
import {
  ArrowUp,
  Building2,
  CalendarCheck,
  Layers,
  LockKeyhole,
  MessageSquarePlus,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function QuickFloatingBar() {
  const [sampleOpen, setSampleOpen] = useState(false);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 데스크톱 우측 고정 한국형 퀵바 */}
      <aside
        aria-label="우측 빠른 메뉴"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl backdrop-blur-md lg:flex w-[116px]"
      >
        <div className="bg-slate-900 px-2.5 py-2 text-center text-[10px] font-extrabold tracking-wider text-amber-300">
          QUICK MENU
        </div>

        <div className="divide-y divide-slate-100">
          <Link
            href="/inquiries"
            className="group flex flex-col items-center justify-center gap-1 px-2 py-3.5 text-center transition hover:bg-blue-50/80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-800 text-white shadow-xs transition group-hover:scale-105">
              <MessageSquarePlus className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-800">
              빠른 견적문의
            </span>
            <span className="text-[9px] font-semibold text-blue-600">30초 무료산출</span>
          </Link>

          <Link
            href="/reservations"
            className="group flex flex-col items-center justify-center gap-1 px-2 py-3 text-center transition hover:bg-blue-50/80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-100 group-hover:text-blue-800">
              <CalendarCheck className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-blue-800">
              1:1 상담예약
            </span>
          </Link>

          <Link
            href="/admin/login"
            className="group flex flex-col items-center justify-center gap-1 px-2 py-3 text-center transition hover:bg-amber-50/80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800 transition group-hover:bg-amber-200">
              <LockKeyhole className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold text-slate-800 group-hover:text-amber-900">
              관리자 1초 체험
            </span>
            <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-800">
              원클릭 데모
            </span>
          </Link>

          {/* 업종 샘플 전환 */}
          <div className="bg-slate-50/90 px-2 py-2.5">
            <div className="mb-1.5 flex items-center justify-center gap-1 text-[10px] font-extrabold text-slate-700">
              <Layers className="h-3 w-3 text-blue-700" />
              <span>업종 샘플 전환</span>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href="/?preset=AGENCY"
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
              >
                <Sparkles className="h-2.5 w-2.5 text-blue-700" />
                에이전시 홈
              </Link>
              <Link
                href="/?preset=CORP"
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
              >
                <Building2 className="h-2.5 w-2.5 text-amber-600" />
                샘플1 기업형
              </Link>
              <Link
                href="/?preset=CLINIC"
                className="flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-[10px] font-bold text-slate-700 transition hover:border-teal-600 hover:text-teal-700"
              >
                <Stethoscope className="h-2.5 w-2.5 text-teal-600" />
                샘플2 예약형
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center justify-center gap-1 bg-slate-900 py-2.5 text-[11px] font-extrabold text-white transition hover:bg-slate-800"
          aria-label="최상단으로 이동"
        >
          <span>TOP</span>
          <ArrowUp className="h-3 w-3" />
        </button>
      </aside>

      {/* 모바일 우측 하단 컴팩트 플로팅 바 */}
      <div className="fixed right-3 bottom-3 z-40 flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2 lg:hidden">
        {sampleOpen && (
          <div className="mb-1 flex w-full max-w-[300px] flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
            <p className="px-1 text-[11px] font-extrabold text-slate-500">
              업종 샘플 실시간 전환
            </p>
            <Link
              href="/?preset=AGENCY"
              onClick={() => setSampleOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-blue-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-700" />
              모드 0: 웹 에이전시 공식 홈
            </Link>
            <Link
              href="/?preset=CORP"
              onClick={() => setSampleOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-50"
            >
              <Building2 className="h-3.5 w-3.5 text-amber-600" />
              샘플 1: 기업·시공·제조 홍보형
            </Link>
            <Link
              href="/?preset=CLINIC"
              onClick={() => setSampleOpen(false)}
              className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-teal-50"
            >
              <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
              샘플 2: 병의원·로펌·스튜디오 예약형
            </Link>
            <div className="mt-1 grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2">
              <Link
                href="/reservations"
                onClick={() => setSampleOpen(false)}
                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-center text-[11px] font-bold text-slate-700"
              >
                1:1 상담예약
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setSampleOpen(false)}
                className="rounded-lg bg-amber-100 px-2.5 py-1.5 text-center text-[11px] font-bold text-amber-900"
              >
                관리자 체험
              </Link>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/95 p-1.5 shadow-xl backdrop-blur-md">
          <Link
            href="/inquiries"
            className="inline-flex items-center gap-1 rounded-full bg-blue-800 px-3.5 py-2 text-xs font-bold text-white"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            빠른견적
          </Link>
          <button
            type="button"
            onClick={() => setSampleOpen(!sampleOpen)}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800"
          >
            <Layers className="h-3.5 w-3.5 text-blue-700" />
            샘플전환
          </button>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white"
            aria-label="TOP"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}

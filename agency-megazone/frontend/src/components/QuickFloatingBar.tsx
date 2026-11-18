"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUp,
  Building2,
  CalendarCheck,
  MessageSquarePlus,
  MonitorCog,
  Scale,
  Sparkles,
  Stethoscope,
} from "lucide-react";

interface QuickFloatingBarProps {
  floatingRightEnabled?: string;
}

export default function QuickFloatingBar({
  floatingRightEnabled = "true",
}: QuickFloatingBarProps) {
  const [visible, setVisible] = useState(floatingRightEnabled !== "false");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("demo_site_configs_override");
      if (raw) {
        const override = JSON.parse(raw) as Record<string, string>;
        if (override.floating_right_enabled !== undefined) {
          setVisible(override.floating_right_enabled !== "false");
          return;
        }
      }
    } catch {
      // ignore
    }
    setVisible(floatingRightEnabled !== "false");
  }, [floatingRightEnabled]);

  if (!visible) {
    return null;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {/* Desktop Right-Side Fixed Quick Bar */}
      <aside
        aria-label="빠른 메뉴 퀵바"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-md lg:flex"
      >
        <Link
          href="/inquiries"
          className="group flex flex-col items-center gap-1 border-b border-slate-100 px-3 py-3 text-center transition hover:bg-violet-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-700 text-white shadow-xs transition group-hover:scale-105">
            <MessageSquarePlus className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-bold text-slate-800">빠른 견적</span>
        </Link>

        <Link
          href="/reservations"
          className="group flex flex-col items-center gap-1 border-b border-slate-100 px-3 py-3 text-center transition hover:bg-violet-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-violet-100 group-hover:text-violet-700">
            <CalendarCheck className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">1:1 예약</span>
        </Link>

        <Link
          href="/admin/login"
          className="group flex flex-col items-center gap-1 border-b border-slate-100 px-3 py-3 text-center transition hover:bg-violet-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-violet-100 group-hover:text-violet-700">
            <MonitorCog className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">관리자 체험</span>
        </Link>

        <Link
          href="/samples/corp"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 border-b border-slate-100 px-3 py-3 text-center transition hover:bg-violet-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-100">
            <Building2 className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">기업·인테리어 샘플 ↗</span>
        </Link>

        <Link
          href="/samples/clinic"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 border-b border-slate-100 px-3 py-3 text-center transition hover:bg-violet-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
            <Stethoscope className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">병의원·예약 샘플 ↗</span>
        </Link>

        <Link
          href="/samples/skin"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 border-b border-slate-100 px-3 py-3 text-center transition hover:bg-violet-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-700 transition group-hover:bg-rose-100">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">피부과·뷰티 샘플 ↗</span>
        </Link>

        <Link
          href="/samples/law"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-1 border-b border-slate-100 px-3 py-3 text-center transition hover:bg-violet-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700 transition group-hover:bg-amber-100">
            <Scale className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold text-slate-700">법무·세무 샘플 ↗</span>
        </Link>

        <button
          type="button"
          onClick={scrollToTop}
          className="flex flex-col items-center gap-0.5 bg-[#0B0F19] px-3 py-2.5 text-white transition hover:bg-slate-800"
          aria-label="맨 위로 이동"
        >
          <ArrowUp className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-[10px] font-bold tracking-wider">TOP</span>
        </button>
      </aside>

      {/* Mobile Bottom Compact Bar */}
      <nav
        aria-label="모바일 하단 빠른 메뉴"
        className="fixed bottom-3 left-1/2 z-40 flex w-full max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center justify-between gap-1 rounded-2xl border border-white/15 bg-[#0B0F19]/95 px-2 py-1.5 text-white shadow-2xl backdrop-blur-md lg:hidden"
      >
        <Link
          href="/inquiries"
          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl bg-violet-600 px-2 py-2 text-[11px] font-bold text-white"
        >
          <MessageSquarePlus className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">빠른 견적</span>
        </Link>
        <Link
          href="/reservations"
          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
        >
          <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-violet-400" />
          <span className="truncate">1:1 예약</span>
        </Link>
        <Link
          href="/samples/skin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] font-semibold text-rose-300 hover:bg-white/10"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-rose-400" />
          <span className="truncate">피부과·뷰티 샘플 ↗</span>
        </Link>
        <Link
          href="/samples/law"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-[11px] font-semibold text-amber-300 hover:bg-white/10"
        >
          <Scale className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span className="truncate">법무·세무 샘플 ↗</span>
        </Link>
        <Link
          href="/admin/login"
          className="flex min-w-0 flex-1 items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-200 hover:bg-white/10"
        >
          <MonitorCog className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
          <span className="truncate">관리자</span>
        </Link>
        <button
          type="button"
          onClick={scrollToTop}
          className="flex shrink-0 items-center justify-center rounded-xl bg-white/10 px-2.5 py-2 text-[11px] font-bold text-slate-200 hover:bg-white/20"
          aria-label="맨 위로"
        >
          TOP ▲
        </button>
      </nav>
    </>
  );
}

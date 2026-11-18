"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Code2,
  FileCheck2,
  LockKeyhole,
  Menu,
  MessageSquarePlus,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/lib/api";

interface Props {
  menus: MenuItem[];
  brandName: string;
  reservationMode: string;
}

const AGENCY_DEFAULT_MENUS: MenuItem[] = [
  {
    id: 1,
    parentId: null,
    menuType: "PUBLIC",
    menuName: "회사·기술소개",
    routePath: "/about",
    iconName: null,
    sortOrder: 1,
    visible: true,
    isSystem: true,
    requiredPermission: null,
  },
  {
    id: 2,
    parentId: null,
    menuType: "PUBLIC",
    menuName: "포트폴리오·샘플",
    routePath: "/portfolio",
    iconName: null,
    sortOrder: 2,
    visible: true,
    isSystem: true,
    requiredPermission: null,
  },
  {
    id: 3,
    parentId: null,
    menuType: "PUBLIC",
    menuName: "정찰제·공지사항",
    routePath: "/notices",
    iconName: null,
    sortOrder: 3,
    visible: true,
    isSystem: true,
    requiredPermission: null,
  },
  {
    id: 4,
    parentId: null,
    menuType: "PUBLIC",
    menuName: "1:1 상담예약",
    routePath: "/reservations",
    iconName: null,
    sortOrder: 4,
    visible: true,
    isSystem: true,
    requiredPermission: null,
  },
  {
    id: 5,
    parentId: null,
    menuType: "PUBLIC",
    menuName: "무료 견적문의",
    routePath: "/inquiries",
    iconName: null,
    sortOrder: 5,
    visible: true,
    isSystem: true,
    requiredPermission: null,
  },
];

const ROUTE_LABEL_OVERRIDE: Record<string, string> = {
  "/about": "회사·기술소개",
  "/portfolio": "포트폴리오·샘플",
  "/notices": "정찰제·공지사항",
  "/reservations": "1:1 상담예약",
  "/inquiries": "무료 견적문의",
};

export default function PublicHeader({ menus, brandName, reservationMode }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sourceMenus: MenuItem[] =
    menus.length > 0
      ? menus.map((m) => ({
          ...m,
          menuName: ROUTE_LABEL_OVERRIDE[m.routePath] || m.menuName,
        }))
      : AGENCY_DEFAULT_MENUS;

  const visibleMenus = sourceMenus.filter(
    (m) => m.visible !== false && !(reservationMode === "OFF" && m.routePath === "/reservations")
  );

  const displayBrand =
    !brandName || brandName === "Starter Biz" || brandName === "주식회사 스타터"
      ? "스타터웹 스튜디오"
      : brandName;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      {/* 상단 미니 띠배너 (Top Utility Bar) */}
      <div className="bg-slate-950 text-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="inline-flex items-center gap-1 rounded bg-blue-600/20 px-2 py-0.5 text-[11px] font-bold text-blue-300 ring-1 ring-blue-500/30">
              <FileCheck2 className="h-3 w-3" />
              정찰제 공식 에이전시
            </span>
            <span className="font-medium text-slate-200">
              세금계산서·비교견적서 즉시 발행 <span className="mx-1.5 text-slate-600">|</span> 월 고정 임대료 0원 독립형 웹 구축{" "}
              <span className="hidden text-slate-600 md:inline">|</span>{" "}
              <span className="hidden md:inline">초기창업패키지·정부지원사업 수행 전문</span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3 pl-3">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 ring-1 ring-amber-400/30 transition hover:bg-amber-400/25"
            >
              <Sparkles className="h-3 w-3" />
              관리자(CMS) 1초 체험 <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 네비게이션 바 */}
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900 text-white shadow-sm ring-1 ring-blue-700/20 transition group-hover:scale-105">
            <Code2 className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              {displayBrand}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-blue-700">
              JAVA · NEXT.JS AGENCY
            </span>
          </div>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden items-center gap-7 lg:flex">
          {visibleMenus.map((m) => {
            const isActive = pathname === m.routePath;
            return (
              <Link
                key={m.id}
                href={m.routePath}
                className={`relative py-1 text-sm font-bold transition-colors ${
                  isActive
                    ? "text-blue-700"
                    : "text-slate-700 hover:text-blue-700"
                }`}
              >
                {m.menuName}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-blue-700" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 우측 강조 버튼 */}
        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition hover:border-blue-600 hover:bg-blue-50/50 hover:text-blue-800"
          >
            <LockKeyhole className="h-3.5 w-3.5 text-blue-700" />
            관리자 콘솔 체험
          </Link>
          <Link
            href="/inquiries"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-900"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            30초 무료 견적
          </Link>
        </div>

        {/* 모바일 메뉴 토글 버튼 */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="메뉴 열기"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1.5">
            {visibleMenus.map((m) => (
              <Link
                key={m.id}
                href={m.routePath}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                <span>{m.menuName}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5 border-t border-slate-100 pt-4">
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 py-3 text-xs font-bold text-slate-800"
            >
              <LockKeyhole className="h-3.5 w-3.5 text-blue-700" />
              관리자 콘솔 체험
            </Link>
            <Link
              href="/inquiries"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-800 py-3 text-xs font-bold text-white"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              30초 무료 견적
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { Menu, ShieldCheck, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/lib/api";

interface Props {
  menus: MenuItem[];
  brandName: string;
  reservationMode: string;
}

export default function PublicHeader({ menus, brandName, reservationMode }: Props) {
  const [open, setOpen] = useState(false);

  const defaultMenus: MenuItem[] =
    menus.length > 0
      ? menus
      : [
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
            menuName: "구축사례·샘플",
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
            menuName: "정찰제·인사이트",
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

  const visibleMenus = defaultMenus.filter(
    (m) => !(reservationMode === "OFF" && m.routePath === "/reservations")
  );

  const displayBrand = brandName && brandName !== "Starter Biz" ? brandName : "스타터웹 스튜디오";

  return (
    <div className="sticky top-0 z-40 w-full min-w-0">
      {/* Top Slim Dark Utility Bar */}
      <div className="w-full min-w-0 bg-[#0B0F19] text-slate-300 border-b border-white/10">
        <div className="mx-auto flex h-9 max-w-7xl min-w-0 items-center justify-between gap-2 px-3 sm:px-6 text-[11px] sm:text-xs">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-violet-400" />
            <span className="truncate font-medium text-slate-200">
              세금계산서·비교견적서 즉시 발행 | 월 임대료 0원 독립형 구축
            </span>
          </div>
        </div>
      </div>

      {/* Main White/Translucent Header */}
      <header className="w-full min-w-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 text-base font-extrabold tracking-tight text-slate-900 sm:text-lg"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="truncate">{displayBrand}</span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-5 lg:flex">
            {visibleMenus.map((m) => (
              <Link
                key={m.id}
                href={m.routePath}
                className="whitespace-nowrap text-sm font-semibold text-slate-600 transition-colors hover:text-violet-700"
              >
                {m.menuName}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center lg:flex">
            <Link
              href="/inquiries"
              className="whitespace-nowrap rounded-lg bg-gradient-to-r from-violet-700 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:opacity-95"
            >
              30초 무료 견적
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden"
            aria-label="메뉴 열기"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
            <div className="flex flex-col gap-1.5">
              {visibleMenus.map((m) => (
                <Link
                  key={m.id}
                  href={m.routePath}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                >
                  {m.menuName}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800"
                >
                  관리자 체험
                </Link>
                <Link
                  href="/inquiries"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-violet-700 px-3 py-2.5 text-xs font-bold text-white"
                >
                  무료 견적
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/api";

interface Props {
  menus: MenuItem[];
  brandName: string;
  brandLogoUrl?: string;
  reservationMode: string;
}

export default function PublicHeader({ menus, brandName, brandLogoUrl, reservationMode }: Props) {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [brandLogoUrl]);

  const defaultMenus: MenuItem[] =
    menus.length > 0
      ? menus
      : [
          { id: 1, parentId: null, menuType: "PUBLIC", menuName: "회사소개", routePath: "/about", iconName: null, sortOrder: 1, visible: true, isSystem: true, requiredPermission: null },
          { id: 2, parentId: null, menuType: "PUBLIC", menuName: "포트폴리오", routePath: "/portfolio", iconName: null, sortOrder: 2, visible: true, isSystem: true, requiredPermission: null },
          { id: 3, parentId: null, menuType: "PUBLIC", menuName: "공지사항", routePath: "/notices", iconName: null, sortOrder: 3, visible: true, isSystem: true, requiredPermission: null },
          { id: 4, parentId: null, menuType: "PUBLIC", menuName: "온라인 예약", routePath: "/reservations", iconName: null, sortOrder: 4, visible: true, isSystem: true, requiredPermission: null },
          { id: 5, parentId: null, menuType: "PUBLIC", menuName: "상담문의", routePath: "/inquiries", iconName: null, sortOrder: 5, visible: true, isSystem: true, requiredPermission: null },
        ];

  const visibleMenus = defaultMenus.filter(
    (m) => !(reservationMode === "OFF" && m.routePath === "/reservations")
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          {brandLogoUrl && !logoError ? (
            <img
              src={brandLogoUrl}
              alt={brandName}
              onError={() => setLogoError(true)}
              className="h-8 w-auto max-w-[140px] rounded-md object-contain"
            />
          ) : (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg btn-primary text-sm font-extrabold">
              S
            </span>
          )}
          <span>{brandName}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {visibleMenus.map((m) => (
            <Link
              key={m.id}
              href={m.routePath}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {m.menuName}
            </Link>
          ))}
          <Link
            href="/inquiries"
            className="rounded-lg btn-primary px-4 py-2 text-sm font-semibold shadow-xs transition"
          >
            빠른 상담
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-slate-600 md:hidden"
          aria-label="메뉴 열기"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {visibleMenus.map((m) => (
              <Link
                key={m.id}
                href={m.routePath}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {m.menuName}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

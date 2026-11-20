"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/api";

interface Props {
  menus?: MenuItem[];
  brandName: string;
  brandLogoUrl?: string;
  reservationMode: string;
}

const ONEPAGE_NAV_ITEMS = [
  { label: "샘플 보기", href: "/#portfolio-showcase" },
  { label: "핵심 기능", href: "/#what-we-do" },
  { label: "정찰제 요금", href: "/#pricing" },
  { label: "관리자 체험", href: "/#cms-demo" },
  { label: "자주 묻는 질문", href: "/#faq" },
];

export default function PublicHeader({ brandName, brandLogoUrl, reservationMode }: Props) {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [brandLogoUrl]);

  const displayBrand = brandName && brandName !== "Starter Biz" ? brandName : "엘레브웹 (eleveWeb)";

  return (
    <div className="sticky top-0 z-40 w-full min-w-0">
      {/* Main Clean 1-Row Header */}
      <header className="w-full min-w-0 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 shrink-0 items-center gap-2.5 text-base font-extrabold tracking-tight text-slate-900 sm:text-lg"
          >
            {brandLogoUrl && !logoError ? (
              <img
                src={brandLogoUrl}
                alt={displayBrand}
                onError={() => setLogoError(true)}
                className="h-8 w-auto max-w-[140px] shrink-0 rounded-md object-contain"
              />
            ) : (
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1D4ED8] text-xs font-black tracking-tighter text-white shadow-xs">
                eW
              </span>
            )}
            <span className="truncate">{displayBrand}</span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-6 lg:flex">
            {ONEPAGE_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm font-semibold text-slate-600 transition-colors hover:text-blue-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {reservationMode !== "OFF" && (
              <Link
                href="/reservations"
                className="whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                1:1 예약
              </Link>
            )}
            <Link
              href="/inquiries"
              className="whitespace-nowrap rounded-lg bg-gradient-to-r from-sky-500 to-blue-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:opacity-95"
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
              {ONEPAGE_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                {reservationMode !== "OFF" ? (
                  <Link
                    href="/reservations"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800"
                  >
                    1:1 상담예약
                  </Link>
                ) : (
                  <Link
                    href="/admin/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800"
                  >
                    관리자 체험
                  </Link>
                )}
                <Link
                  href="/inquiries"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-blue-700 px-3 py-2.5 text-xs font-bold text-white"
                >
                  30초 무료 견적
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

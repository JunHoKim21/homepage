"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sliders,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "종합 상황판", icon: LayoutDashboard },
  { href: "/admin/configs", label: "디자인·SEO·예약 설정", icon: Sliders },
  { href: "/admin/inquiries", label: "상담문의 관리", icon: Inbox },
  { href: "/admin/reservations", label: "온라인 예약 관리", icon: Calendar },
  { href: "/admin/cms", label: "게시판 · 배너 · 팝업 관리", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }
    const token = localStorage.getItem("admin_access_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLoginPage, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        관리자 인증 상태를 확인하는 중입니다...
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-slate-50 md:flex-row">
      {/* 모바일 상단 헤더 (md 미만) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-[#0B0F19] px-4 text-white md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
            <ShieldCheck className="h-4 w-4 text-white" />
          </span>
          <span className="text-sm font-extrabold tracking-tight">홈페이지 관리자</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
            title="홈페이지로 이동"
          >
            <Home className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-200 hover:bg-slate-800"
            aria-label="관리자 메뉴 열기"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* 모바일 햄버거 드롭다운 메뉴 */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#0B0F19] p-3 text-white md:hidden">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 font-semibold text-white"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>로그아웃</span>
            </button>
          </nav>
        </div>
      )}

      {/* 데스크톱 좌측 딥 네이비 사이드바 (md 이상) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-[#0B0F19] text-white md:flex">
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-white" />
            </span>
            <div>
              <span className="block text-sm font-extrabold tracking-tight text-white">
                홈페이지 관리자
              </span>
              <span className="block text-[11px] text-slate-400">홈페이지 통합 관리 시스템</span>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            title="홈페이지로 이동"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 font-semibold text-white shadow-xs"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-rose-500/15 hover:text-rose-300"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

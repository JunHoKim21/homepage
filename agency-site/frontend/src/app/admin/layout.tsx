"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sliders,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "종합 실무 대시보드", icon: LayoutDashboard },
  { href: "/admin/configs", label: "무코드 SEO·브랜딩 설정", icon: Sliders },
  { href: "/admin/inquiries", label: "상담·견적 문의 관리", icon: Inbox },
  { href: "/admin/reservations", label: "1:1·정원제 예약 관리", icon: Calendar },
  { href: "/admin/cms", label: "포트폴리오·공지 CMS", icon: FileText },
  { href: "/admin/media", label: "미디어(WebP) 라이브러리", icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

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

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-medium text-slate-600">
        관리자 보안 세션 확인 중...
      </div>
    );
  }

  function handleLogout() {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* 3-B 한국 기업 표준 딥 네이비 사이드바 + 인디고 블루 액센트 */}
      <aside className="flex w-68 shrink-0 flex-col bg-slate-900 text-slate-100 shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-extrabold text-white">
              KR
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white">
                스타터웹 관리자 콘솔
              </div>
              <div className="text-[11px] text-slate-400">Enterprise Admin v2.0</div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-2">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            핵심 운영 메뉴
          </span>
        </div>

        <nav className="flex-1 space-y-1.5 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 하단 시스템 상태 & 로그아웃 */}
        <div className="space-y-3 border-t border-slate-800 p-4">
          <div className="rounded-xl bg-slate-800/80 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>시스템 정상 가동 중</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Caddy 자동 SSL · WebP 변환 워커 ON
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-xs font-bold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            <span>관리자 로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 우측 메인 영역 (상단 데모 안내 바 + 본문) */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3.5 shadow-2xs">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-extrabold text-blue-800">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>[데모 체험 모드 동작 중 — 모든 메뉴를 자유롭게 클릭해 보세요]</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/?preset=CORP"
              className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:inline-flex"
            >
              기업형 샘플 보기
            </Link>
            <Link
              href="/?preset=CLINIC"
              className="hidden rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 sm:inline-flex"
            >
              병의원형 샘플 보기
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-blue-600"
            >
              <span>[홈페이지 메인 보기 ↗]</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

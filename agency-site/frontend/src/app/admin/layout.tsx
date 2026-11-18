"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  FileText,
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Sliders,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/configs", label: "SEO·브랜딩·예약 설정", icon: Sliders },
  { href: "/admin/inquiries", label: "상담문의 관리", icon: Inbox },
  { href: "/admin/reservations", label: "예약 관리", icon: Calendar },
  { href: "/admin/cms", label: "CMS 콘텐츠 관리", icon: FileText },
  { href: "/admin/media", label: "미디어(WebP) 관리", icon: ImageIcon },
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
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">인증 확인 중...</div>;
  }

  function handleLogout() {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    router.replace("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
          <span className="text-base font-extrabold text-slate-900">Starter Admin</span>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-900" title="홈페이지로 이동">
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
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-primary font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 sm:p-8">{children}</main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, Inbox, Sliders } from "lucide-react";
import { adminApiFetch } from "@/lib/api";

export default function AdminDashboardPage() {
  const [inquiryCount, setInquiryCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    adminApiFetch<unknown[]>("/api/admin/inquiries")
      .then((list) => setInquiryCount(list.length))
      .catch(() => {});
    adminApiFetch<unknown[]>("/api/admin/reservations")
      .then((list) => setReservationCount(list.length))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">관리자 대시보드</h1>
        <p className="mt-1 text-sm text-slate-500">
          홈페이지 SEO, 상담 문의, 하이브리드 예약 및 미디어를 한 곳에서 관리합니다.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/admin/inquiries" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">전체 상담 문의</span>
            <Inbox className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{inquiryCount}건</p>
        </Link>

        <Link href="/admin/reservations" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">전체 온라인 예약</span>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{reservationCount}건</p>
        </Link>

        <Link href="/admin/configs" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">무코드 SEO·스위치</span>
            <Sliders className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">설정 변경 즉시 반영 (0.1초)</p>
        </Link>
      </div>
    </div>
  );
}

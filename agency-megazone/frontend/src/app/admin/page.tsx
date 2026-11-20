"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Globe,
  Inbox,
  Sparkles,
} from "lucide-react";
import { adminApiFetch } from "@/lib/api";

interface InquirySummary {
  id: number;
  customerName: string;
  title: string;
  category?: string;
  status?: string;
  createdAt: string;
}

interface ReservationSummary {
  id: number;
  customerName: string;
  slotDate?: string;
  slotTime?: string;
  serviceName?: string;
  status?: string;
}

const FALLBACK_INQUIRIES: InquirySummary[] = [
  {
    id: 101,
    customerName: "김도현 대표",
    title: "제조업 B2B 영문/국문 기업 홈페이지 Deluxe 견적 문의",
    category: "견적 문의",
    status: "접수대기",
    createdAt: "오늘 14:20",
  },
  {
    id: 102,
    customerName: "박지연 원장",
    title: "치과 네이버 예약 연동 및 진료 안내 페이지 구축 상담",
    category: "견적 문의",
    status: "상담진행",
    createdAt: "오늘 11:05",
  },
  {
    id: 103,
    customerName: "이준호 팀장",
    title: "기존 회사 소개서 첨부 및 Premium 패키지 일정 확인",
    category: "일반 상담",
    status: "답변완료",
    createdAt: "어제 17:40",
  },
];

const FALLBACK_RESERVATIONS: ReservationSummary[] = [
  {
    id: 201,
    customerName: "최서윤 이사",
    slotDate: "내일",
    slotTime: "10:00",
    serviceName: "1:1 홈페이지 도입 상담",
    status: "예약확정",
  },
  {
    id: 202,
    customerName: "정우성 대표",
    slotDate: "모레",
    slotTime: "14:00",
    serviceName: "방문 · 화상 심층 컨설팅",
    status: "접수대기",
  },
];

export default function AdminDashboardPage() {
  const [inquiries, setInquiries] = useState<InquirySummary[]>(FALLBACK_INQUIRIES);
  const [reservations, setReservations] = useState<ReservationSummary[]>(FALLBACK_RESERVATIONS);
  const [inquiryCount, setInquiryCount] = useState<number>(FALLBACK_INQUIRIES.length);
  const [reservationCount, setReservationCount] = useState<number>(FALLBACK_RESERVATIONS.length);
  const [isOfflineDemo, setIsOfflineDemo] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");
    if (token === "demo-offline-token") {
      setIsOfflineDemo(true);
      return;
    }

    adminApiFetch<InquirySummary[]>("/api/admin/inquiries")
      .then((list) => {
        setInquiryCount(list.length);
        if (list.length > 0) setInquiries(list.slice(0, 3));
      })
      .catch(() => {
        setIsOfflineDemo(true);
      });

    adminApiFetch<ReservationSummary[]>("/api/admin/reservations")
      .then((list) => {
        setReservationCount(list.length);
        if (list.length > 0) setReservations(list.slice(0, 2));
      })
      .catch(() => {
        setIsOfflineDemo(true);
      });
  }, []);

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      {/* 상단 환영 배너 */}
      <div className="rounded-2xl bg-[#0B0F19] p-6 text-white shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>한국형 통합 운영 상황판</span>
            </div>
            <h1 className="mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">
              대표님, 오늘의 홈페이지 운영 현황입니다
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              상담 문의, 온라인 예약, 검색엔진(SEO) 설정과 콘텐츠를 한 화면에서 바로 관리하세요.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700 sm:text-sm"
          >
            <Globe className="h-4 w-4 text-blue-400" />
            <span>내 홈페이지 보기</span>
          </Link>
        </div>

        {isOfflineDemo && (
          <div className="mt-4 rounded-xl border border-blue-400/30 bg-blue-950/60 px-4 py-2.5 text-xs text-blue-200">
            현재 방문 고객 체험 모드(샘플 데이터)로 표시 중입니다. 모든 메뉴를 자유롭게 눌러보실 수 있습니다.
          </div>
        )}
      </div>

      {/* 상단 KPI 카드 4종 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/inquiries"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">전체 상담 문의</span>
            <Inbox className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{inquiryCount}건</p>
          <p className="mt-1 text-xs text-slate-500">실시간 고객 견적·상담 접수</p>
        </Link>

        <Link
          href="/admin/reservations"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">전체 온라인 예약</span>
            <Calendar className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">{reservationCount}건</p>
          <p className="mt-1 text-xs text-slate-500">자체 시간대 · 네이버 연동</p>
        </Link>

        <Link
          href="/admin/cms"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">게시판 · 배너 · 팝업</span>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900">운영 중</p>
          <p className="mt-1 text-xs text-slate-500">포트폴리오 · 공지 · 팝업 관리</p>
        </Link>

        <Link
          href="/admin/configs"
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">홈페이지 · 검색 상태</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-3 text-xl font-extrabold text-emerald-600">정상 가동 중</p>
          <p className="mt-1 text-xs text-slate-500">설정 저장 시 0.1초 즉시 반영</p>
        </Link>
      </div>

      {/* 하단 최근 상담문의(3건) · 예약(2건) 실시간 접수 피드 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 최근 상담문의 3건 */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-slate-900">최근 상담문의 (최신 3건)</h2>
            <Link
              href="/admin/inquiries"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                      {inq.category || "상담문의"}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{inq.customerName}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-slate-700">{inq.title}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {inq.status || "접수"}
                  </span>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {inq.createdAt.includes("T")
                      ? new Date(inq.createdAt).toLocaleDateString("ko-KR")
                      : inq.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 최근 온라인 예약 2건 */}
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-slate-900">최근 온라인 예약 (최신 2건)</h2>
            <Link
              href="/admin/reservations"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              전체 보기 →
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {reservations.slice(0, 2).map((resv) => (
              <div key={resv.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                      {resv.slotDate || "예약일"} {resv.slotTime ? resv.slotTime.slice(0, 5) : ""}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{resv.customerName}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-slate-700">
                    {resv.serviceName || "1:1 맞춤 상담 예약"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  {resv.status || "접수"}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

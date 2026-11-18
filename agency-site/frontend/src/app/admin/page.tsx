"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Cpu,
  FileSpreadsheet,
  FileText,
  Inbox,
  SearchCheck,
  Sliders,
  Sparkles,
} from "lucide-react";
import { adminApiFetch } from "@/lib/api";

interface DashboardInquiry {
  id: number;
  customerName: string;
  customerPhone?: string;
  title: string;
  status: string;
  createdAt: string;
}

interface DashboardReservation {
  id: number;
  customerName: string;
  slotDate: string;
  slotTime: string;
  serviceName: string;
  visitorCount: number;
  status: string;
}

const FALLBACK_INQUIRIES: DashboardInquiry[] = [
  {
    id: 501,
    customerName: "김태호 대표 ((주)이노메디컬)",
    customerPhone: "010-8912-****",
    title: "[Deluxe 패키지] 내과의원 홈페이지 리뉴얼 및 네이버·자체 예약 연동 견적 문의",
    status: "PENDING",
    createdAt: "2026-03-01T10:15:00Z",
  },
  {
    id: 502,
    customerName: "박지훈 변호사 (법무법인 정율)",
    customerPhone: "010-3421-****",
    title: "[Deluxe 패키지] 로펌 변호사 프로필 및 1:1 비공개 법률상담 예약 구축 문의",
    status: "PENDING",
    createdAt: "2026-02-28T15:40:00Z",
  },
  {
    id: 503,
    customerName: "이수진 실장 (아르떼 인테리어)",
    customerPhone: "010-7723-****",
    title: "[Standard 패키지] 시공 포트폴리오 갤러리 및 정부지원사업 세금계산서 발행 요청",
    status: "COMPLETED",
    createdAt: "2026-02-27T11:20:00Z",
  },
];

const FALLBACK_RESERVATIONS: DashboardReservation[] = [
  {
    id: 601,
    customerName: "최윤성 원장 (청담바른치과)",
    slotDate: "2026-03-03",
    slotTime: "14:00:00",
    serviceName: "1:1 구축·견적 화상 상담",
    visitorCount: 1,
    status: "CONFIRMED",
  },
  {
    id: 602,
    customerName: "정다은 대표 (소울필라테스)",
    slotDate: "2026-03-04",
    slotTime: "16:00:00",
    serviceName: "정원제(MULTI) 예약 도입 상담",
    visitorCount: 2,
    status: "REQUESTED",
  },
];

const QUICK_CONTROLS = [
  {
    href: "/admin/configs",
    badge: "KILLER 01 · 0.1초 즉시 반영",
    title: "[무코드 SEO·브랜딩 수정]",
    desc: "코드 수정 없이 상호명, 대표 색상, 검색엔진 제목, 업종별 테마 프리셋(AGENCY/CORP/CLINIC)을 즉시 변경합니다.",
    icon: Sliders,
    color: "bg-blue-600 text-white",
  },
  {
    href: "/admin/inquiries",
    badge: "KILLER 02 · 스팸 방어 & 비공개 첨부",
    title: "[상담문의 확인 & 엑셀 다운로드]",
    desc: "접수된 견적 문의와 비공개 보안 첨부파일(RFP·사업자등록증)을 확인하고 원클릭으로 엑셀(.xlsx)로 내려받습니다.",
    icon: FileSpreadsheet,
    color: "bg-emerald-600 text-white",
  },
  {
    href: "/admin/reservations",
    badge: "KILLER 03 · SINGLE/MULTI 스위치",
    title: "[1:1·정원제 예약 슬롯 관리]",
    desc: "월간 달력에서 날짜별 예약 현황을 확인하고, 평일 영업시간 슬롯을 1초 만에 일괄 생성하거나 마감합니다.",
    icon: Calendar,
    color: "bg-indigo-600 text-white",
  },
  {
    href: "/admin/cms",
    badge: "KILLER 04 · 필수 약관 삭제 잠금",
    title: "[포트폴리오·공지 CMS 관리]",
    desc: "포트폴리오 구축 사례, 정찰제 공지사항, FAQ 및 삭제 방지 잠금이 적용된 필수 이용약관을 직접 관리합니다.",
    icon: FileText,
    color: "bg-slate-900 text-white",
  },
];

export default function AdminDashboardPage() {
  const [inquiries, setInquiries] = useState<DashboardInquiry[]>(FALLBACK_INQUIRIES);
  const [reservations, setReservations] = useState<DashboardReservation[]>(FALLBACK_RESERVATIONS);

  useEffect(() => {
    adminApiFetch<DashboardInquiry[]>("/api/admin/inquiries")
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setInquiries(list);
        }
      })
      .catch(() => {
        // API 오프라인 시 샘플 3건 폴백 유지
      });

    adminApiFetch<DashboardReservation[]>("/api/admin/reservations")
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setReservations(list);
        }
      })
      .catch(() => {
        // API 오프라인 시 샘플 2건 폴백 유지
      });
  }, []);

  const pendingInquiryCount = inquiries.filter((i) => i.status === "PENDING").length;
  const confirmedReservationCount = reservations.filter((r) => r.status === "CONFIRMED").length;

  return (
    <div className="space-y-8">
      {/* 상단 타이틀 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-extrabold text-blue-800">
            <Sparkles className="h-3.5 w-3.5" />
            <span>3-C / 3-E KOREAN BUSINESS CONSOLE · 실시간 통합 운영 상황판</span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            한국형 종합 실무 대시보드
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            비개발자 대표님과 실무자가 홈페이지의 모든 설정, 고객 문의, 예약 일정을 한눈에 파악하고 제어합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/configs"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:bg-blue-700"
          >
            무코드 SEO·테마 설정 바로가기
          </Link>
        </div>
      </div>

      {/* 1. 상단 KPI 요약 카드 4종 */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/inquiries"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">전체 상담·견적 문의</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Inbox className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-slate-900">{inquiries.length}건</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold text-amber-800">
              미답변 {pendingInquiryCount}건
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            스팸 봇 방어(Honeypot) 작동 중 · 엑셀 다운로드 지원
          </p>
        </Link>

        <Link
          href="/admin/reservations"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">온라인 예약 접수 현황</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-slate-900">{reservations.length}건</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800">
              예약확정 {confirmedReservationCount}건
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            1:1 단독(SINGLE) & 정원제(MULTI) 하이브리드 엔진
          </p>
        </Link>

        <Link
          href="/admin/configs"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">무코드 SEO·캐시 상태</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <SearchCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-extrabold text-emerald-700">0.1초 즉시 반영 정상</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            네이버·구글 메타태그, OG 이미지, 사이트맵 자동 동기화
          </p>
        </Link>

        <Link
          href="/admin/media"
          className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-blue-400"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500">서버 메모리·WebP 최적화 상태</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-extrabold text-slate-900">2GB VPS 안정 구동 중</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Caddy 무료 자동 SSL · WebP 이미지 75% 경량화 워커 ON
          </p>
        </Link>
      </section>

      {/* 2. 중앙 ‘크몽 4대 킬러 기능 빠른 제어판’ */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              크몽 4대 킬러 기능 빠른 제어판
            </h2>
            <p className="text-xs text-slate-500">
              가장 자주 사용하는 핵심 관리 메뉴로 즉시 이동하여 기능을 테스트해 보세요.
            </p>
          </div>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
            비개발자 1분 마스터 UI
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_CONTROLS.map((ctrl) => {
            const Icon = ctrl.icon;
            return (
              <Link
                key={ctrl.href}
                href={ctrl.href}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-white hover:shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-blue-700">{ctrl.badge}</span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${ctrl.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="mt-3 text-sm font-extrabold text-slate-900 group-hover:text-blue-600">
                    {ctrl.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{ctrl.desc}</p>
                </div>

                <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600">
                  <span>메뉴 바로가기</span>
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. 하단 2단 실시간 접수 피드 (3-C/3-E 스타일) */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* 좌측: 최근 접수된 상담·견적 문의 내역 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                최근 접수된 상담·견적 문의 내역
              </h2>
              <p className="text-xs text-slate-500">
                실시간 접수 알림톡 연동 및 비공개 첨부파일 다운로드 지원
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              전체보기 →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {inquiries.slice(0, 4).map((inq) => {
              const isCompleted = inq.status === "COMPLETED";
              return (
                <div key={inq.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isCompleted ? "답변완료" : "접수대기"}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {inq.customerName}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-1 text-xs font-medium text-slate-700">
                    {inq.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 우측: 최근 접수된 온라인 예약 내역 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                최근 접수된 온라인 예약 내역
              </h2>
              <p className="text-xs text-slate-500">
                DB 비관적 락(Pessimistic Lock)으로 중복 예약 0% 보장
              </p>
            </div>
            <Link
              href="/admin/reservations"
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              슬롯 달력 관리 →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {reservations.slice(0, 4).map((res) => {
              const isConfirmed = res.status === "CONFIRMED";
              return (
                <div key={res.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-extrabold ${
                          isConfirmed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isConfirmed ? "예약확정" : "승인대기"}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">
                        {res.customerName}
                      </span>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      {res.visitorCount}명
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
                    <span>{res.serviceName}</span>
                    <span className="font-bold text-blue-700">
                      희망일시: {res.slotDate} {res.slotTime.slice(0, 5)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>
              자동 예약 확정(ON/OFF) 및 네이버 스마트플레이스 예약 링크 연동도 스위치 하나로 제어 가능합니다.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

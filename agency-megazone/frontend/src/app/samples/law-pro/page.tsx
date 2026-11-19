import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { fetchPublishedCms } from "@/lib/api";
import LawProHeader from "@/components/samples/law-pro/LawProHeader";
import SelfDiagnosisFunnel from "@/components/samples/law-pro/SelfDiagnosisFunnel";
import CaseArchiveSection from "@/components/samples/law-pro/CaseArchiveSection";
import AttorneyLineupSection from "@/components/samples/law-pro/AttorneyLineupSection";
import LawReservationSection from "@/components/samples/law-pro/LawReservationSection";
import StickyConsultBar from "@/components/samples/law-pro/StickyConsultBar";

export const metadata: Metadata = {
  title: "법무법인 선율 형사전담센터 | 부장검사·판사·수사과장 출신 형사전문",
  description:
    "서울중앙지검 부장검사·서울고등법원 판사·경찰 수사과장 출신 형사 전담팀이 초기 조사 입회부터 무혐의·불송치까지 직접 수행합니다.",
};

const HERO_METRICS = [
  {
    code: "01",
    title: "부장검사·판사·수사과장 협진",
    detail: "경찰·검찰·법원 단계별 전관 교차 검토",
  },
  {
    code: "02",
    title: "초기 경찰조사 100% 변호사 동석",
    detail: "첫 피의자 신문 전 모의조사 및 진술 설계",
  },
  {
    code: "03",
    title: "24시간 긴급체포·영장 대응",
    detail: "압수수색·구속영장 실질심사 즉각 투입",
  },
  {
    code: "04",
    title: "철저한 비밀보장·비공개 상담",
    detail: "변호사법 제26조 준수 · 독립 상담실 운영",
  },
] as const;

export default async function LawProSamplePage() {
  const cmsItems = await fetchPublishedCms("PORTFOLIO");

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-white text-[#111827] antialiased">
      {/* 1. 상단 데모 띠 + 24시 긴급 띠지 + 화이트 네비게이션 */}
      <LawProHeader />

      <main className="min-w-0">
        {/* 2. 히어로 섹션 (법무법인 오현 스타일 순백 에디토리얼 + 하단 밀착 단체 인물) */}
        <section
          id="intro"
          className="border-b border-slate-200 bg-white pt-14 sm:pt-20 lg:pt-24"
        >
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-[11px] font-bold tracking-[0.26em] text-[#0F2952] sm:text-xs">
              SEONYUL CRIMINAL DEFENSE CENTER
            </p>

            <h1 className="mt-5 text-[28px] leading-[1.24] font-extrabold tracking-tight text-[#111827] sm:text-5xl sm:leading-[1.18] lg:text-[52px]">
              골든타임을 놓치지 않는 단 하나의 선택,
              <br />
              법무법인 선율 형사전담센터
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed font-medium text-slate-600 sm:text-base lg:text-[17px]">
              서울중앙지검 부장검사 · 서울고등법원 판사 · 경찰 수사과장 출신
              형사 전담팀이 초기 조사부터 무혐의·불송치까지 직접 수행합니다.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center">
              <a
                href="#diagnosis"
                className="inline-flex items-center justify-center rounded-none border border-[#0F2952] bg-[#0F2952] px-7 py-4 text-sm font-bold tracking-tight text-white transition-colors hover:border-[#111827] hover:bg-[#111827] sm:min-w-[230px] sm:text-[15px]"
              >
                30초 사건 자가진단 시작
              </a>
              <a
                href="#reservation"
                className="inline-flex items-center justify-center rounded-none border border-[#111827] bg-white px-7 py-4 text-sm font-bold tracking-tight text-[#111827] transition-colors hover:bg-[#F5F7FA] sm:min-w-[230px] sm:text-[15px]"
              >
                실시간 방문상담 예약
              </a>
            </div>
          </div>

          {/* 순백 배경에 경계선 없이 하단 바닥선과 정확히 밀착되는 단체 인물 사진 */}
          <div className="mx-auto mt-10 max-w-7xl px-4 sm:mt-14 sm:px-6 lg:px-8">
            <img
              src="/images/samples/law-pro-hero.jpg"
              alt="법무법인 선율 형사전담센터 전담 변호사단"
              className="mx-auto block w-full max-w-5xl object-contain"
            />
          </div>
        </section>

        {/* 2-1. 4단 직각 경계선 핵심 지표 바 */}
        <section
          aria-label="형사전담센터 핵심 원칙"
          className="border-b border-[#0F2952] bg-[#0F2952] text-white"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 divide-y divide-white/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
              {HERO_METRICS.map((item, idx) => {
                const cellBorders =
                  idx === 0
                    ? "sm:border-r sm:border-b lg:border-b-0 lg:border-r border-white/15"
                    : idx === 1
                      ? "sm:border-b lg:border-b-0 lg:border-r border-white/15"
                      : idx === 2
                        ? "sm:border-r lg:border-r border-white/15"
                        : "";
                return (
                  <div
                    key={item.code}
                    className={`min-w-0 px-1 py-6 sm:px-6 sm:py-7 ${cellBorders}`}
                  >
                    <p className="text-[11px] font-bold tracking-[0.2em] text-slate-300">
                      {item.code}
                    </p>
                    <p className="mt-2 text-[15px] leading-snug font-extrabold tracking-tight text-white">
                      {item.title}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. 사건 자가진단 인터랙티브 퍼널 */}
        <SelfDiagnosisFunnel />

        {/* 4. 형사 해결사례 아카이브 (CMS 연동) */}
        <CaseArchiveSection cmsItems={cmsItems} />

        {/* 5. 전담 변호사 3인 라인업 */}
        <AttorneyLineupSection />

        {/* 6. 실시간 방문·비공개 상담 예약 */}
        <LawReservationSection />
      </main>

      {/* 7. 오시는 길 & 로펌 전용 푸터 */}
      <footer
        id="location"
        className="border-t border-slate-800 bg-[#111827] pt-16 pb-28 text-slate-300 sm:pt-20 lg:pb-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 상단: 서초동 오시는 길 + 24시 긴급 직통 데스크 */}
          <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 lg:grid-cols-12 lg:gap-12">
            <div className="min-w-0 lg:col-span-7">
              <p className="text-xs font-bold tracking-[0.22em] text-slate-400">
                SEOCHO HEAD OFFICE · LOCATION
              </p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                법무법인 선율 형사전담센터 오시는 길
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                서울특별시 서초구 서초중앙로 148, 선율 법조타워 8·9층
                <span className="mt-1 block text-xs text-slate-400 sm:text-sm">
                  교대역 10번 출구 도보 2분 · 서울중앙지방법원 · 서울중앙지검
                  맞은편
                </span>
              </p>

              <dl className="mt-7 grid grid-cols-1 border-t border-white/10 sm:grid-cols-2">
                <div className="border-b border-white/10 py-4 sm:border-r sm:pr-6">
                  <dt className="text-[11px] font-bold tracking-[0.16em] text-slate-400">
                    지하철 안내
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-white">
                    2·3호선 교대역 10번 출구 직진 150m
                  </dd>
                </div>
                <div className="border-b border-white/10 py-4 sm:pl-6">
                  <dt className="text-[11px] font-bold tracking-[0.16em] text-slate-400">
                    주차 지원
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-white">
                    건물 지하 1~3층 전용 주차장 2시간 무료
                  </dd>
                </div>
                <div className="border-b border-white/10 py-4 sm:border-r sm:border-b-0 sm:pr-6">
                  <dt className="text-[11px] font-bold tracking-[0.16em] text-slate-400">
                    방문 상담 시간
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-white">
                    평일 09:00 ~ 20:00 · 야간/주말 예약제
                  </dd>
                </div>
                <div className="py-4 sm:pl-6">
                  <dt className="text-[11px] font-bold tracking-[0.16em] text-slate-400">
                    긴급 수사 입회
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-white">
                    압수수색 · 긴급체포 365일 24시간 대응
                  </dd>
                </div>
              </dl>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="flex h-full flex-col justify-between rounded-none border border-white/15 bg-[#0F2952] p-6 sm:p-8">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.22em] text-slate-300">
                    24H EMERGENCY HOTLINE
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    24시간 형사 긴급 직통전화
                  </p>
                  <a
                    href="tel:02-599-0112"
                    className="mt-3 inline-flex items-center gap-3 text-3xl font-extrabold tracking-tight text-white tabular-nums transition-opacity hover:opacity-85 sm:text-4xl"
                  >
                    <Phone className="h-6 w-6 shrink-0 text-white" />
                    <span>02-599-0112</span>
                  </a>
                  <p className="mt-4 text-xs leading-relaxed text-slate-200 sm:text-[13px]">
                    경찰 출석 요구, 압수수색, 구속영장 청구는 초기 대응이
                    결론을 좌우합니다. 모든 통화 및 상담 내용은 변호사법
                    제26조에 따라 철저히 비밀이 보장됩니다.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <a
                    href="#diagnosis"
                    className="inline-flex items-center justify-center rounded-none bg-white px-4 py-3 text-xs font-extrabold tracking-tight text-[#0F2952] transition-colors hover:bg-[#F5F7FA]"
                  >
                    30초 사건 자가진단
                  </a>
                  <a
                    href="#reservation"
                    className="inline-flex items-center justify-center rounded-none border border-white/40 px-4 py-3 text-xs font-bold tracking-tight text-white transition-colors hover:border-white hover:bg-white/10"
                  >
                    방문상담 예약하기
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 하단: 로펌 사업자·광고책임변호사 법정 표기 */}
          <div className="pt-8 text-xs leading-relaxed text-slate-400">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-none border border-white/25 bg-[#0F2952] text-[10px] font-extrabold tracking-[0.14em] text-white">
                  SY
                </span>
                <span className="text-sm font-extrabold tracking-tight text-white">
                  법무법인 선율 형사전담센터
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400">
                <Link
                  href="/"
                  className="transition-colors hover:text-white"
                >
                  에이전시 메인
                </Link>
                <span className="text-slate-600" aria-hidden="true">
                  |
                </span>
                <Link
                  href="/admin/login"
                  className="transition-colors hover:text-white"
                >
                  관리자 체험
                </Link>
                <span className="text-slate-600" aria-hidden="true">
                  |
                </span>
                <Link
                  href="/admin/inquiries"
                  className="transition-colors hover:text-white"
                >
                  문의 확인
                </Link>
                <span className="text-slate-600" aria-hidden="true">
                  |
                </span>
                <Link
                  href="/admin/reservations"
                  className="transition-colors hover:text-white"
                >
                  예약 확인
                </Link>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/10 pt-5 text-slate-400">
              <span>법인명: 법무법인 선율</span>
              <span>대표변호사: 김도현</span>
              <span>광고책임변호사: 김도현</span>
              <span>사업자등록번호: 214-88-50912</span>
              <span>
                주소: 서울특별시 서초구 서초중앙로 148, 선율 법조타워 8·9층
              </span>
              <span className="tabular-nums">
                24시 긴급직통: 02-599-0112 · FAX: 02-599-0113
              </span>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              © 2026 법무법인 선율 형사전담센터. All rights reserved. 본
              페이지는 업종별 독립 홈페이지 구축 시연을 위한 데모 샘플입니다.
            </p>
          </div>
        </div>
      </footer>

      {/* 하단 고정 상담 바 */}
      <StickyConsultBar />
    </div>
  );
}

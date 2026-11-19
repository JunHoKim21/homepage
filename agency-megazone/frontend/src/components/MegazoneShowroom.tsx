"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Globe,
  Image as ImageIcon,
  MessageSquarePlus,
  MonitorCog,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Zap,
} from "lucide-react";
import { isVideoUrl, type CmsContentItem } from "@/lib/api";

type WhatWeDoTab = "SERVICES" | "INDUSTRIES" | "PRODUCTS";

interface Props {
  configs: Record<string, string>;
  portfolios: CmsContentItem[];
  notices: CmsContentItem[];
  heroBanner?: CmsContentItem;
}

export default function MegazoneShowroom({
  configs,
  notices,
  heroBanner,
}: Props) {
  const [activeTab, setActiveTab] = useState<WhatWeDoTab>("SERVICES");

  const reservationMode = configs.reservation_mode || "BOTH";

  return (
    <div className="min-w-0 overflow-x-clip">
      <div>
          {/* 1. Dark Hero + Key Highlights Bar */}
          <section className="relative overflow-hidden bg-[#0B0F19] pb-16 pt-16 text-white sm:pb-24 sm:pt-24">
            {heroBanner?.thumbnailUrl && (
              <div className="pointer-events-none absolute inset-0 opacity-30">
                {isVideoUrl(heroBanner.thumbnailUrl) ? (
                  <video
                    src={heroBanner.thumbnailUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={heroBanner.thumbnailUrl}
                    alt={heroBanner.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            )}
            {/* Violet / Rose Gradient Orbs */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-rose-500/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mx-auto mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-violet-400" />
                  <span className="truncate">
                    월 임대료 0원 · 디자인과 데이터 100% 고객 소유형 구축
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {heroBanner?.title ? (
                    heroBanner.title
                  ) : (
                    <>
                      비즈니스의 디지털 도약,
                      <br />
                      <span className="mz-gradient-text">소유하는 홈페이지</span>로 시작하세요
                    </>
                  )}
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                  {heroBanner?.summary ||
                    "매달 나가는 임대료 없이, 전문 디자인과 맞춤 관리자까지 한 번에 구축합니다."}
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
                  <Link
                    href="/inquiries"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/40 transition hover:opacity-95"
                  >
                    <MessageSquarePlus className="h-4 w-4" />
                    30초 무료 견적 받기
                  </Link>
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/10"
                  >
                    <MonitorCog className="h-4 w-4 text-violet-300" />
                    관리자(CMS) 1초 체험
                  </Link>
                  <a
                    href="#portfolio-showcase"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-400/30 bg-violet-500/10 px-5 py-3.5 text-sm font-bold text-violet-200 backdrop-blur-md transition hover:bg-violet-500/20"
                  >
                    포트폴리오·샘플 바로보기 ↓
                  </a>
                </div>
              </div>

              {/* Bottom 4 Key Highlight Cards */}
              <div className="mt-14 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: Zap,
                    title: "제작사 월 임대료 0원",
                    desc: "초기 1회 구축 후 제작사 월 관리·임대료가 없습니다. (서버·도메인 실비만 고객사 직접 납부)",
                  },
                  {
                    icon: MonitorCog,
                    title: "관리자 페이지 기본 제공",
                    desc: "글·사진·배너·팝업을 담당자가 직접 1분 만에 수정합니다.",
                  },
                  {
                    icon: Search,
                    title: "네이버·구글 검색 최적화",
                    desc: "검색엔진이 잘 읽고 노출하기 좋은 구조로 기본 세팅됩니다.",
                  },
                  {
                    icon: FileCheck2,
                    title: "세금계산서·바우처 즉시 지원",
                    desc: "비교견적서와 전자세금계산서를 빠짐없이 발행해 드립니다.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="mz-glass-dark min-w-0 rounded-2xl p-5 transition hover:border-violet-400/40"
                    >
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-sm font-bold text-white">{item.title}</h2>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 2. Case Stories — 라이브 샘플 쇼케이스 + 업종별 구축 포트폴리오 6선 */}
          <section
            id="portfolio-showcase"
            className="border-b border-slate-200/80 bg-slate-50 py-16 sm:py-24"
          >
            <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
              {/* Live Sample Spotlight (4-Column) */}
              <div className="mb-14">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-violet-700">
                      LIVE SAMPLE SHOWCASE
                    </p>
                    <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      직접 눌러보는 업종별 라이브 샘플 사이트
                    </h2>
                  </div>
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    클릭 시 실제 운영 환경과 동일한 별도 디자인 샘플이 새 탭으로 열립니다
                  </p>
                </div>

                <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Spotlight Card 1: CORP */}
                  <Link
                    href="/samples/corp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 flex-col justify-between rounded-3xl border border-amber-900/20 bg-gradient-to-br from-[#231F1D] via-[#2C2521] to-[#3B2E24] p-6 text-stone-100 shadow-lg transition hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-xl"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                          <Building2 className="h-3.5 w-3.5 shrink-0" />
                          건축 · 인테리어 · 제조형
                        </span>
                        <span className="text-[11px] font-semibold text-stone-400">
                          웜 스톤 · 브론즈
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-extrabold text-white">
                        한빛공간디자인
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-stone-300 sm:text-sm">
                        스톤·브론즈 톤의 건축·인테리어 기업형 디자인에 시공사례 갤러리와 30초 예상 견적 계산기를 결합한 B2B 표준 샘플입니다.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-white/10 pt-4">
                      <span className="truncate text-xs font-medium text-stone-400">/samples/corp</span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-600/90 px-3 py-2 text-xs font-bold text-white transition group-hover:bg-amber-500">
                        <span>샘플 열기 ↗</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>

                  {/* Spotlight Card 2: CLINIC */}
                  <Link
                    href="/samples/clinic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 flex-col justify-between rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50/90 via-white to-cyan-50/70 p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-100/80 px-3 py-1 text-xs font-bold text-teal-800">
                          <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                          내과 · 검진 · 예약형
                        </span>
                        <span className="text-[11px] font-semibold text-teal-700">
                          메디컬 틸 · 화이트
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                        연세바른내과
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        청결한 메디컬 틸·화이트 톤으로 진료과목·의료진 안내와 시간대별 초진 예약, 네이버 예약 연동을 체험할 수 있는 샘플입니다.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-teal-100 pt-4">
                      <span className="truncate text-xs font-medium text-slate-500">/samples/clinic</span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-teal-700 px-3 py-2 text-xs font-bold text-white transition group-hover:bg-teal-600">
                        <span>샘플 열기 ↗</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>

                  {/* Spotlight Card 3: SKIN */}
                  <Link
                    href="/samples/skin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 flex-col justify-between rounded-3xl border border-rose-200/80 bg-gradient-to-br from-[#FFF9F8] via-white to-[#FBF3EE] p-6 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-lg"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-800">
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          피부과 · 뷰티 · 다국어
                        </span>
                        <span className="text-[11px] font-semibold text-rose-700">
                          샴페인 · 로즈
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                        더셀루체 피부과
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        강남 하이엔드 뷰티 톤에 한/영/중/일 다국어 전환과 의료법 준수 전후사진 회원 전용 잠금 기능을 구현한 프리미엄 샘플입니다.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-rose-100 pt-4">
                      <span className="truncate text-xs font-medium text-slate-500">/samples/skin</span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-rose-700 px-3 py-2 text-xs font-bold text-white transition group-hover:bg-rose-600">
                        <span>샘플 열기 ↗</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>

                  {/* Spotlight Card 4: LAW */}
                  <Link
                    href="/samples/law"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 flex-col justify-between rounded-3xl border border-amber-400/30 bg-gradient-to-br from-[#0A1120] via-[#111C33] to-[#172542] p-6 text-slate-100 shadow-lg transition hover:-translate-y-0.5 hover:border-amber-400/70 hover:shadow-xl"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                          <Scale className="h-3.5 w-3.5 shrink-0" />
                          로펌 · 세무 · 전문직형
                        </span>
                        <span className="text-[11px] font-semibold text-amber-200/80">
                          다크 네이비 · 골드
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-extrabold text-white">
                        법무법인 정율
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                        다크 네이비·골드 하이엔드 전문직 톤에 분야별 승소 사례 아카이브와 1:1 비공개 보안 상담 예약을 결합한 샘플입니다.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-white/10 pt-4">
                      <span className="truncate text-xs font-medium text-slate-400">/samples/law</span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950 transition group-hover:bg-amber-400">
                        <span>샘플 열기 ↗</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Other Industries Notice + Portfolio Spec Link */}
              <div className="mt-8 flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white px-5 py-4 shadow-2xs sm:flex-row sm:items-center sm:px-6">
                <p className="min-w-0 text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
                  제조·B2B, 스튜디오·학원, 세무·노무 등 다른 업종도 동일 엔진으로 맞춤 제작됩니다.
                </p>
                <Link
                  href="/portfolio"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-violet-800 sm:text-sm"
                >
                  <span>전체 업종별 제작 스펙 · 모듈 자세히 보기</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>
          </section>

          {/* 3. What We Do — 3-Tab Interactive Section (White Background) */}
          <section className="bg-white py-16 sm:py-24">
            <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-violet-700">
                    WHAT WE DO
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    사장님 비즈니스에 꼭 필요한 기능만 담았습니다
                  </h2>
                  <p className="mt-2.5 text-sm text-slate-600 sm:text-base">
                    복잡한 기술 용어 없이, 매출과 상담으로 바로 이어지는 실전 기능을 확인해 보세요.
                  </p>
                </div>

                {/* 3 Interactive Tabs */}
                <div className="grid min-w-0 shrink-0 grid-cols-3 gap-1.5 sm:flex sm:flex-nowrap sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("SERVICES")}
                    className={`whitespace-nowrap rounded-xl px-2.5 py-2.5 text-center text-[11px] font-bold transition sm:px-4 sm:text-sm ${
                      activeTab === "SERVICES"
                        ? "bg-violet-700 text-white shadow-sm"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    ① 구축 서비스
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("INDUSTRIES")}
                    className={`whitespace-nowrap rounded-xl px-2.5 py-2.5 text-center text-[11px] font-bold transition sm:px-4 sm:text-sm ${
                      activeTab === "INDUSTRIES"
                        ? "bg-violet-700 text-white shadow-sm"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    ② 전문 업종
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("PRODUCTS")}
                    className={`whitespace-nowrap rounded-xl px-2.5 py-2.5 text-center text-[11px] font-bold transition sm:px-4 sm:text-sm ${
                      activeTab === "PRODUCTS"
                        ? "bg-violet-700 text-white shadow-sm"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    ③ 3단 정찰제
                  </button>
                </div>
              </div>

              {/* Tab 1: Services */}
              {activeTab === "SERVICES" && (
                <div className="mt-10 grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      icon: Search,
                      badge: "검색 & 공유 관리",
                      title: "무코드 SEO·카톡 이미지 변경",
                      desc: "네이버·구글 검색 제목과 카카오톡 링크 공유 시 뜨는 대표 이미지를 관리자 화면에서 클릭 몇 번으로 바로 수정할 수 있습니다.",
                    },
                    {
                      icon: ShieldCheck,
                      badge: "영업 기회 보호",
                      title: "자동 스팸 차단 견적폼",
                      desc: "광고성 도배 문의를 자동으로 걸러내어, 실제 계약으로 이어질 진짜 고객의 견적 문의만 깔끔하게 전달받습니다.",
                    },
                    {
                      icon: CalendarCheck,
                      badge: "맞춤 예약 시스템",
                      title: "1:1·정원제·네이버 하이브리드 예약",
                      desc: "1:1 단독 상담부터 시간대별 정원 예약, 기존 네이버 예약 연동까지 업종 운영 방식에 딱 맞게 선택할 수 있습니다.",
                    },
                    {
                      icon: ImageIcon,
                      badge: "모바일 속도 최적화",
                      title: "고화질 사진 자동 압축",
                      desc: "스마트폰이나 카메라로 찍은 무거운 원본 사진을 올려도 자동으로 가볍게 변환되어 고객 화면에서 즉시 열립니다.",
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={card.title}
                        className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
                      >
                        <div className="mb-4 flex items-center justify-between gap-2">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                            {card.badge}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                          {card.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tab 2: Industries */}
              {activeTab === "INDUSTRIES" && (
                <div className="mt-10 grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      icon: Building2,
                      title: "기업·제조·인테리어",
                      desc: "시공사례 갤러리, 회사소개서 다운로드, 30초 예상 견적 계산기로 B2B 신뢰도를 높입니다.",
                      href: "/samples/corp",
                      sampleLabel: "기업·시공 샘플 보기",
                    },
                    {
                      icon: Stethoscope,
                      title: "병의원·클리닉",
                      desc: "진료과목 안내, 의료진 소개, 진료시간표와 간편 초진 예약을 한 화면에 깔끔하게 담습니다.",
                      href: "/samples/clinic",
                      sampleLabel: "병의원 샘플 보기",
                    },
                    {
                      icon: Scale,
                      title: "로펌·세무·전문직",
                      desc: "전문 분야별 성공사례 아카이브와 100% 비대면 온라인 상담 (온라인 접수 후 필요 시 전화·화상 미팅) 예약 시스템을 제공합니다.",
                      href: "/samples/law",
                      sampleLabel: "로펌·세무 샘플 보기",
                    },
                    {
                      icon: Users,
                      title: "스튜디오·아카데미",
                      desc: "정원제 클래스 시간표, 강사진 포트폴리오, 카카오톡 공유 최적화로 지역 신규 회원을 모읍니다.",
                      href: "/samples/corp",
                      sampleLabel: "스튜디오 샘플 보기",
                    },
                  ].map((ind) => {
                    const Icon = ind.icon;
                    return (
                      <Link
                        key={ind.title}
                        href={ind.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-2xs transition hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md"
                      >
                        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 transition group-hover:bg-violet-700 group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{ind.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600">{ind.desc}</p>
                        <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-violet-700">
                          <span>{ind.sampleLabel}</span>
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Tab 3: Products (3-Tier Fixed Price) */}
              {activeTab === "PRODUCTS" && (
                <div className="mt-10 space-y-6">
                  <div className="grid min-w-0 gap-6 lg:grid-cols-3">
                  {[
                    {
                      name: "Standard",
                      price: "49만 원",
                      subtitle: "소상공인·1인 기업 실속형",
                      highlight: false,
                      features: [
                        "반응형 원페이지 + 핵심 서브 3페이지",
                        "모바일·PC 자동 최적화 & 고화질 이미지 압축",
                        "자동 스팸 차단 무료 견적문의 폼",
                        "네이버·구글 기본 검색 등록 세팅",
                        "관리자 페이지 기본 제공 (배너·팝업·공지)",
                      ],
                    },
                    {
                      name: "Deluxe",
                      price: "99만 원",
                      subtitle: "기업·병의원·전문직 표준형 (BEST)",
                      highlight: true,
                      features: [
                        "브랜드 맞춤 디자인 + 전체 페이지 구성",
                        "포트폴리오·시공사례·성공사례 아카이브",
                        "1:1 상담예약 또는 네이버 예약 하이브리드 연동",
                        "검색 제목·카톡 공유 이미지 원클릭 관리",
                        "전자세금계산서·비교견적서 즉시 발행",
                      ],
                    },
                    {
                      name: "Premium",
                      price: "179만 원",
                      subtitle: "맞춤 기능·고도화 예약 전담형",
                      highlight: false,
                      features: [
                        "업종 특화 견적 계산기 또는 정원제 예약 시스템",
                        "전담 디자이너·기획자 1:1 밀착 커스터마이징",
                        "다국어 또는 지점별 통합 관리 구조 지원",
                        "런칭 후 1개월 우선 유지보수 및 운영 교육",
                        "소스·도메인·데이터 100% 고객사 영구 소유",
                      ],
                    },
                  ].map((pkg) => (
                    <div
                      key={pkg.name}
                      className={`relative flex min-w-0 flex-col justify-between rounded-2xl p-7 transition ${
                        pkg.highlight
                          ? "border-2 border-violet-600 bg-[#0B0F19] text-white shadow-xl"
                          : "border border-slate-200 bg-white text-slate-900 shadow-2xs"
                      }`}
                    >
                      {pkg.highlight && (
                        <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-violet-600 to-rose-500 px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
                          가장 많이 선택하는 BEST
                        </span>
                      )}
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="text-lg font-extrabold">{pkg.name}</h3>
                          <span
                            className={`text-xs font-semibold ${
                              pkg.highlight ? "text-violet-300" : "text-slate-500"
                            }`}
                          >
                            VAT 별도
                          </span>
                        </div>
                        <p
                          className={`mt-1 text-xs ${
                            pkg.highlight ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {pkg.subtitle}
                        </p>
                        <div className="mt-5 text-3xl font-black tracking-tight">
                          {pkg.price}
                        </div>
                        <ul className="mt-6 space-y-2.5 text-sm">
                          {pkg.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <CheckCircle2
                                className={`mt-0.5 h-4 w-4 shrink-0 ${
                                  pkg.highlight ? "text-violet-400" : "text-violet-700"
                                }`}
                              />
                              <span
                                className={pkg.highlight ? "text-slate-200" : "text-slate-700"}
                              >
                                {feat}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link
                        href={`/inquiries?package=${encodeURIComponent(pkg.name)}`}
                        className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold transition ${
                          pkg.highlight
                            ? "bg-violet-600 text-white hover:bg-violet-500"
                            : "bg-slate-900 text-white hover:bg-slate-800"
                        }`}
                      >
                        <span>{pkg.name} 패키지 견적 문의</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                  </div>

                  {/* [투명한 별도 실비 안내] */}
                  <div className="rounded-2xl border border-violet-200/80 bg-violet-50/50 p-6 sm:p-7">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-violet-900">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-violet-700" />
                      <span>[투명한 별도 실비 안내]</span>
                    </div>
                    <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                        <span>
                          <strong className="font-bold text-slate-900">도메인·독립 서버:</strong>{" "}
                          도메인(연 약 2만 원대) 및 2GB 독립 클라우드 서버(월 1~2만 원대)는 제작사 마진 없이{" "}
                          <strong className="font-bold text-slate-900">고객사 명의로 직접 결제·소유</strong>
                          합니다. (제작사 월 관리비·플랫폼 임대료 0원)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                        <span>
                          <strong className="font-bold text-slate-900">전자결제(PG) 연동:</strong>{" "}
                          온라인 카드결제 필요 시{" "}
                          <strong className="font-bold text-slate-900">Premium 패키지(또는 별도 옵션)</strong>
                          로 연동되며, PG사(토스·포트원 등) 가맹 심사·가입비 및 결제 수수료는 PG사 기준 실비가 적용됩니다.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600" />
                        <span>
                          <strong className="font-bold text-slate-900">알림톡 발송:</strong>{" "}
                          이메일 기본 알림 외 카카오 알림톡 발송 시 알림톡 대행사 실비(건당 약 8~15원)가 별도 부과됩니다.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* [선택형 추가 유료 옵션 (업셀링) 안내표] */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                        <Sparkles className="h-4 w-4 shrink-0 text-violet-700" />
                        <span>[선택형 추가 유료 옵션 (업셀링) 안내표]</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        VAT 별도 · 필요 시에만 선택 추가
                      </span>
                    </div>
                    <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          name: "전후사진(Before/After) 회원 전용 잠금",
                          price: "+30만 원",
                          note: "의료법 준수 로그인 열람",
                        },
                        {
                          name: "다국어 사이트 확장 (영/중/일 1개 언어당)",
                          price: "+40~60만 원",
                          note: "글로벌 환자·수출 기업용",
                        },
                        {
                          name: "카카오 알림톡 실제 발송 연동",
                          price: "+20만 원",
                          note: "대행사 API 실비 별도",
                        },
                        {
                          name: "전자결제(PG) 실서비스 연동",
                          price: "+40만 원",
                          note: "PG사 심사·수수료 실비 별도",
                        },
                        {
                          name: "상세 시술·제품 페이지 추가 (5P 단위)",
                          price: "+25만 원",
                          note: "고품질 레이아웃 맞춤 구성",
                        },
                      ].map((opt) => (
                        <div
                          key={opt.name}
                          className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-4"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900 sm:text-sm">
                              {opt.name}
                            </p>
                            <p className="mt-1 text-[11px] font-medium text-slate-500">
                              {opt.note}
                            </p>
                          </div>
                          <p className="mt-3 text-base font-black text-violet-700">{opt.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* 3. Comparison Table: 일반 임대형 웹빌더 vs 자체 소유형 맞춤 홈페이지 */}
          <section className="border-y border-slate-200/80 bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto max-w-6xl min-w-0 px-4 sm:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-extrabold uppercase tracking-widest text-violet-700">
                  SMART COMPARISON
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  일반 임대형 웹빌더 vs 자체 소유형 맞춤 홈페이지
                </h2>
                <p className="mt-2.5 text-sm text-slate-600">
                  당장의 초기 비용뿐만 아니라, 3년 뒤 우리 회사의 자산으로 남는지 꼭 비교해 보세요.
                </p>
              </div>

              <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/80 text-xs font-bold uppercase text-slate-600">
                      <th className="px-5 py-4">비교 항목</th>
                      <th className="px-5 py-4">일반 임대형 웹빌더</th>
                      <th className="bg-violet-50/80 px-5 py-4 text-violet-900">
                        스타터웹 자체 소유형 구축
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      [
                        "매달 나가는 비용",
                        "매달 요금제 결제 필수 (미납 시 운영 중단)",
                        "제작사 관리·임대료 0원 (서버 월 1만 원대·도메인 연 2만 원대 실비만 고객사 직접 납부)",
                      ],
                      [
                        "홈페이지 소유권",
                        "임대 기간 동안만 이용 가능 (이전 제한)",
                        "디자인·데이터·도메인 100% 고객사 영구 소유",
                      ],
                      [
                        "3년 누적 유지 비용",
                        "월 이용료 + 유료 기능 추가로 비용 지속 증가",
                        "제작사 월 관리비 없이 서버·도메인 실비만으로 합리적 유지",
                      ],
                      [
                        "관리자 편의성",
                        "복잡한 편집기 학습 필요",
                        "한글 전용 간편 관리자 기본 제공 (1분 수정)",
                      ],
                      [
                        "맞춤 기능 확장",
                        "제공되는 틀 안에서만 제한적 사용",
                        "업종별 견적 계산기·예약·하이브리드 연동 자유",
                      ],
                    ].map(([label, rental, owned]) => (
                      <tr key={label} className="hover:bg-slate-50/60">
                        <td className="px-5 py-4 font-bold text-slate-900">{label}</td>
                        <td className="px-5 py-4 text-slate-500">{rental}</td>
                        <td className="bg-violet-50/30 px-5 py-4 font-semibold text-violet-900">
                          {owned}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 자주 묻는 질문 (실비·결제 연동 투명 안내) */}
              <div className="mt-10 grid min-w-0 gap-4 md:grid-cols-3">
                {[
                  {
                    q: "Q. 정말 매달 나가는 비용이 0원인가요?",
                    a: "제작사에 내는 월 관리비·플랫폼 임대료는 0원입니다. 홈페이지 운영에 필요한 도메인(연 약 2만 원대)과 2GB 독립 클라우드 서버(월 1~2만 원대) 실비만 제작사 마진 없이 고객사 명의로 직접 납부합니다.",
                  },
                  {
                    q: "Q. 온라인 카드결제(PG) 연동 비용은 별도인가요?",
                    a: "온라인 카드결제 기능은 Premium 패키지(또는 별도 옵션)로 연동됩니다. PG사(토스·포트원 등) 가맹 심사·가입비 및 결제 수수료는 PG사 기준 실비가 적용됩니다.",
                  },
                  {
                    q: "Q. 알림톡 발송 시 추가 비용이 발생하나요?",
                    a: "이메일 기본 알림은 무료로 제공됩니다. 고객 대상 카카오 알림톡 발송이 필요한 경우에만 알림톡 대행사 실비(건당 약 8~15원)가 별도 부과됩니다.",
                  },
                ].map((faq) => (
                  <div
                    key={faq.q}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
                  >
                    <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Launch Trust Architecture — 3대 초기 론칭 신뢰 장치 */}
          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
              {/* 신뢰 장치 1: 100% 직접 눌러보는 라이브 데모 & 관리자 체험 */}
              <div className="rounded-3xl bg-[#0B0F19] p-6 text-white sm:p-10 lg:p-12">
                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                  <div className="min-w-0 max-w-2xl">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-violet-400">
                      100% VERIFIABLE DEMO
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
                      허위 후기 대신 100% 직접 눌러보는 라이브 데모 &amp; 관리자 체험
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      작성된 홍보 문구나 이미지 캡처가 아닌, 실제 운영 환경과 동일한 업종별 독립 샘플 4종과
                      관리자 콘솔을 지금 바로 직접 조작해보고 품질을 확인하세요.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Link
                      href="/admin/login"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-95 sm:w-auto"
                    >
                      <MonitorCog className="h-4 w-4 shrink-0" />
                      <span>관리자 1초 원클릭 체험</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </div>
                </div>

                <div className="mt-7 grid min-w-0 grid-cols-1 gap-3 border-t border-white/10 pt-7 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      href: "/samples/corp",
                      title: "한빛공간디자인",
                      tag: "기업 · 건축 · 견적계산기",
                    },
                    {
                      href: "/samples/clinic",
                      title: "연세바른내과",
                      tag: "병의원 · 네이버예약 연동",
                    },
                    {
                      href: "/samples/skin",
                      title: "더셀루체 피부과",
                      tag: "뷰티 · 다국어 · 회원전용",
                    },
                    {
                      href: "/samples/law",
                      title: "법무법인 정율",
                      tag: "로펌 · 전문직 · 보안상담",
                    },
                  ].map((demo) => (
                    <Link
                      key={demo.href}
                      href={demo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition hover:border-violet-400/50 hover:bg-white/10"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-white">{demo.title}</div>
                        <div className="truncate text-[11px] text-slate-400">{demo.tag}</div>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-violet-300 transition group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* 신뢰 장치 2: 리스크 제로 안전 보장 3대 약속 */}
              <div className="mt-10">
                <div className="text-center">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-violet-700">
                    RISK-FREE GUARANTEE
                  </p>
                  <h3 className="mt-1.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    리스크 제로 안전 보장 3대 약속
                  </h3>
                </div>

                <div className="mt-6 grid min-w-0 grid-cols-1 gap-5 md:grid-cols-3">
                  {[
                    {
                      step: "약속 01",
                      icon: ShieldCheck,
                      title: "1차 디자인 시안 불만족 시 100% 전액 환불",
                      desc: "착수 후 1차 시안 단계에서 원하시는 방향과 맞지 않을 경우, 복잡한 절차 없이 착수금 100%를 전액 환불해 드립니다.",
                    },
                    {
                      step: "약속 02",
                      icon: CheckCircle2,
                      title: "납품 후 3개월 무상 하자보수",
                      desc: "사이트 오픈 이후 발생하는 기능 오류, 텍스트·이미지 수정, 모바일 레이아웃 보완을 3개월간 무상으로 책임 지원합니다.",
                    },
                    {
                      step: "약속 03",
                      icon: FileCheck2,
                      title: "전자계약서 · 세금계산서 100% 발행",
                      desc: "구두 약속이나 불투명한 거래 없이 표준 전자계약서를 체결하고, 법인·개인사업자 세금계산서를 100% 발행합니다.",
                    },
                  ].map((promise) => {
                    const Icon = promise.icon;
                    return (
                      <div
                        key={promise.step}
                        className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-6 transition hover:border-violet-300 hover:bg-white hover:shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                              {promise.step}
                            </span>
                          </div>
                          <h4 className="mt-4 text-base font-extrabold text-slate-900">
                            {promise.title}
                          </h4>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                            {promise.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 표준 계약 · 분할 정산 & 유지보수 SLA 카드 */}
              <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12">
                {/* 1. 분할 정산 구조 (3단계 안심 결제) */}
                <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                        <FileCheck2 className="h-4 w-4" />
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">
                        표준 계약 · 3단계 분할 안심 정산
                      </h4>
                    </div>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                      전자계약 · 세금계산서 발행
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    고액 선불 부담 없이 시안 확정과 최종 검수 단계에 맞춰 투명하게 분할 정산합니다.
                  </p>
                  <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      {
                        step: "1단계 · 착수금",
                        ratio: "40%",
                        desc: "전자계약 체결 및 기획 착수",
                      },
                      {
                        step: "2단계 · 중도금",
                        ratio: "30%",
                        desc: "1차 디자인 시안 확정 후",
                      },
                      {
                        step: "3단계 · 잔금",
                        ratio: "30%",
                        desc: "최종 검수 및 납품 완료 후",
                      },
                    ].map((stage) => (
                      <div
                        key={stage.step}
                        className="min-w-0 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5"
                      >
                        <div className="text-[11px] font-bold text-slate-500">{stage.step}</div>
                        <div className="mt-1 text-xl font-black text-indigo-700">{stage.ratio}</div>
                        <div className="mt-1 text-xs leading-snug text-slate-700">{stage.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 유지보수 SLA (신속 대응 보증) */}
                <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-5">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                          <Zap className="h-4 w-4" />
                        </span>
                        <h4 className="text-base font-extrabold text-slate-900">
                          유지보수 SLA (신속 대응 보증)
                        </h4>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                        무상 하자보수 3개월 포함
                      </span>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-slate-900">
                            장애 접수 시 <span className="text-violet-700">당일 우선 대응 (최대 12시간 이내)</span>
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                            원인 파악 및 긴급 복구 착수 (운영 중단 리스크 최소화)
                          </p>
                        </div>
                      </div>
                      <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" />
                        <div className="min-w-0">
                          <div className="text-xs font-extrabold text-slate-900">
                            수정 요청 <span className="text-violet-700">1~2영업일 내 처리</span>
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
                            텍스트/이미지 수정 신속 처리 (납품 후 무상 하자보수 3개월 포함)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 신뢰 장치 3: 선착순 3개사 론칭 파트너 특별 조건 배너 */}
              <div className="mt-10 flex min-w-0 flex-col justify-between gap-6 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-indigo-50/70 to-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center">
                <div className="min-w-0 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-700 px-3 py-1 text-xs font-bold text-white">
                    <Award className="h-3.5 w-3.5 shrink-0" />
                    선착순 3개사 론칭 파트너 특별 조건
                  </span>
                  <h3 className="mt-3 text-xl font-extrabold text-slate-900 sm:text-2xl">
                    초기 파트너 3개사 한정, 정가 대비 <span className="text-violet-700">30~40% 혜택</span>으로 구축합니다
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    초기 론칭 파트너로 함께하며 생생한 후기를 남겨주실 3개사를 모십니다.
                    동일한 100% 독립 소유형 스펙과 관리자 콘솔이 그대로 제공됩니다.
                  </p>
                  <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-violet-900">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-violet-700" />
                    참여 조건: 홈페이지 완성 후 실명 후기 작성 및 포트폴리오 게시 동의
                  </p>
                </div>
                <div className="shrink-0">
                  <Link
                    href="/inquiries"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-violet-800 lg:w-auto"
                  >
                    <span>론칭 파트너 혜택 신청하기</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </div>
              </div>

              {/* Partners / Ecosystem Integration Badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 pt-8">
                <span className="text-xs font-bold text-slate-400">연동 지원 생태계:</span>
                {[
                  "네이버 예약 연동",
                  "실시간 상담·예약 알림",
                  "전자결제 연동 (Premium)",
                  "세금계산서 즉시발행",
                  "네이버·구글 검색등록",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs"
                  >
                    <Globe className="h-3.5 w-3.5 text-violet-600" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* Resources (최신 공지·가이드) */}
              <div className="mt-16 border-t border-slate-100 pt-12">
                <div className="mb-6 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-700">
                      RESOURCES
                    </p>
                    <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                      정찰제 안내 및 비즈니스 인사이트
                    </h3>
                  </div>
                  <Link
                    href="/notices"
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-violet-700 hover:underline"
                  >
                    전체보기 <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid min-w-0 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {notices.slice(0, 4).map((notice) => (
                    <Link
                      key={notice.id}
                      href={`/notices?slug=${encodeURIComponent(notice.slug)}`}
                      className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-violet-300 hover:bg-white hover:shadow-sm"
                    >
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                        <h4 className="mt-1.5 line-clamp-2 text-sm font-bold text-slate-900">
                          {notice.title}
                        </h4>
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs text-slate-500">
                        {notice.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 6. Bottom Full-Width Dark CTA Banner */}
          <section className="relative overflow-hidden bg-[#0B0F19] py-16 text-white sm:py-20">
            <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-indigo-600/25 blur-3xl" />
            <div className="relative mx-auto flex max-w-5xl min-w-0 flex-col items-center justify-between gap-8 px-4 text-center sm:px-6 md:flex-row md:text-left">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
                  CONTACT US
                </p>
                <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  지금 바로 우리 회사에 딱 맞는 견적을 받아보세요
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  비교견적서 즉시 발행 · 100% 비대면 온라인 상담 (온라인 접수 후 필요 시 전화·화상 미팅) · 필요 자료(사진·문구 등) 전달 후 7~14일 완성
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
                <Link
                  href="/inquiries"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-95"
                >
                  <MessageSquarePlus className="h-4 w-4" />
                  무료 견적 문의
                </Link>
                {reservationMode !== "OFF" && (
                  <Link
                    href="/reservations"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    <CalendarCheck className="h-4 w-4 text-violet-300" />
                    1:1 상담 예약
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
    </div>
  );
}

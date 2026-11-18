"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import type { CmsContentItem } from "@/lib/api";

interface PortfolioCase {
  id: number;
  industry: string;
  title: string;
  client: string;
  summary: string;
  impact: string;
  period: string;
  features: string[];
  background: string;
  solution: string;
  thumbnailUrl?: string | null;
}

const INDUSTRIES = ["전체", "기업·제조", "병원·클리닉", "법률·세무", "교육·아카데미"];

const FALLBACK_CASES: PortfolioCase[] = [
  {
    id: 1,
    industry: "기업·제조",
    title: "[건축·인테리어 모델] 현장 갤러리 & 평수별 예상 견적 계산기",
    client: "표준 제작 모델",
    summary: "고화질 시공 현장 갤러리와 평수·예산별 30초 예상 견적 계산기를 결합한 건축·인테리어 업종 표준 모델입니다.",
    impact: "30초 예상 견적 & 초경량 시공 갤러리",
    period: "자료 전달 후 7~14일",
    features: ["30초 예상 견적 계산기", "시공 전/후 갤러리", "초경량 이미지 변환", "관리자 즉시 수정"],
    background: "고용량 현장 사진으로 모바일 로딩이 느려지거나, 고객이 대략적인 공사 예산을 가늠하기 어려워 문의를 망설이는 경우가 많습니다.",
    solution: "이미지 자동 최적화 갤러리와 평수·공간별 30초 예상 견적 계산기를 결합해 빠르고 직관적인 B2B 상담 동선을 설계했습니다.",
    thumbnailUrl: "/images/samples/corp-1.jpg",
  },
  {
    id: 2,
    industry: "병원·클리닉",
    title: "[병의원·검진 모델] 진료시간표 & 네이버·자체 하이브리드 예약",
    client: "표준 제작 모델",
    summary: "진료과목·의료진 안내와 시간대별 자체 초진 예약, 네이버 예약 연동을 한 화면에 구성한 병의원 표준 모델입니다.",
    impact: "네이버 예약 연동 & 시간대별 초진 예약",
    period: "자료 전달 후 7~14일",
    features: ["네이버 예약 연동", "진료과목별 안내", "의료진 프로필 관리", "오시는 길·주차 안내"],
    background: "전화 문의에 의존할 경우 데스크 응대 부담이 커지고 야간·주말 신규 환자 예약이 누락되기 쉽습니다.",
    solution: "실시간 시간대 예약과 네이버 스마트플레이스 연동을 동시에 제공해 24시간 온라인 예약 접수가 가능하도록 설계했습니다.",
    thumbnailUrl: "/images/samples/clinic-hero.jpg",
  },
  {
    id: 3,
    industry: "병원·클리닉",
    title: "[피부과·뷰티 모델] 3×2 시술 쇼케이스 · 이벤트 팝업 · 전후사진 회원제",
    client: "표준 제작 모델",
    summary: "한/영/중/일 다국어 전환과 의료법 준수 전후사진 회원 전용 잠금, 1분 이벤트 팝업 관리를 갖춘 뷰티·피부과 모델입니다.",
    impact: "한·영·중·일 다국어 & 회원 전용 전후사진",
    period: "자료 전달 후 7~14일",
    features: ["전후사진 회원 전용 잠금", "한·영·중·일 다국어", "3×2 시술 쇼케이스", "1분 이벤트 팝업 관리"],
    background: "외국인 환자와 프리미엄 시술 고객을 위한 다국어 안내 및 의료법을 준수한 시술 사례 공개 구조가 필요합니다.",
    solution: "로그인 회원만 전후사진을 열람할 수 있는 보안 갤러리와 다국어 원클릭 전환, 관리자 팝업 교체 기능을 표준 탑재했습니다.",
    thumbnailUrl: "/images/samples/skin-1.jpg",
  },
  {
    id: 4,
    industry: "법률·세무",
    title: "[법무법인·세무 모델] 전문분야·변호사 소개 & 1:1 비밀상담",
    client: "표준 제작 모델",
    summary: "다크 네이비·골드 톤의 전문분야·변호사 프로필과 비공개 파일 첨부 1:1 비밀상담 예약을 제공하는 로펌·세무 모델입니다.",
    impact: "비공개 자료 첨부 & 분야별 승소사례 아카이브",
    period: "자료 전달 후 7~14일",
    features: ["비공개 파일 첨부", "성공사례 필터", "변호사 직접 관리", "자동 스팸 차단"],
    background: "고관여 법률·세무 의뢰인은 사건 자료 보안과 전문 분야별 신뢰감을 한눈에 확인할 수 있는 전용 창구를 원합니다.",
    solution: "분야별 사례 검색 필터와 비공개 자료 첨부 상담 폼을 결합해 신뢰 중심의 전문직 상담 구조를 설계했습니다.",
    thumbnailUrl: "/images/samples/law-hero.jpg",
  },
  {
    id: 5,
    industry: "기업·제조",
    title: "[제조·B2B 기업 모델] 제품 카탈로그 & 비공개 도면 첨부 견적",
    client: "표준 제작 모델",
    summary: "제품 사양 비교표, 영문·국문 전환, 거래처 도면·사양서 파일 첨부 견적 문의를 지원하는 B2B 제조·기업 모델입니다.",
    impact: "제품 스펙 비교표 & 국·영문 B2B 견적 폼",
    period: "자료 전달 후 7~14일",
    features: ["제품 카탈로그 관리", "도면·견적서 파일 첨부", "영문·국문 전환", "네이버·구글 검색 등록"],
    background: "복잡한 제품 사양표를 모바일에서도 깨짐 없이 보여주고, 거래처가 도면 파일을 첨부해 바로 견적을 요청할 수 있어야 합니다.",
    solution: "모바일 360px 완벽 대응 스펙 비교표와 비공개 파일 첨부 견적 폼을 적용해 B2B 바이어 접근성을 높였습니다.",
    thumbnailUrl: "/images/samples/corp-3.jpg",
  },
  {
    id: 6,
    industry: "교육·아카데미",
    title: "[스튜디오·학원 모델] 시간대별 정원제(MULTI) 클래스 예약",
    client: "표준 제작 모델",
    summary: "시간대별 잔여 정원 자동 차감 예약과 강사진 소개, 카카오톡 공유 최적화를 적용한 스튜디오·아카데미 표준 모델입니다.",
    impact: "시간대별 잔여 정원 자동 차감 & 카톡 공유 최적화",
    period: "자료 전달 후 7~14일",
    features: ["정원제 선착순 예약", "커리큘럼 안내", "강사진 포트폴리오", "공지사항 상단 고정"],
    background: "클래스·설명회마다 외부 설문과 전화 확인을 수동으로 대조해야 하는 운영 번거로움을 줄여야 합니다.",
    solution: "시간대별 정원 자동 차감 예약 기능과 공지사항 상단 고정, 카카오톡 미리보기 최적화를 기본 탑재했습니다.",
    thumbnailUrl: "/images/samples/corp-4.jpg",
  },
];

function mapCmsToCase(item: CmsContentItem, index: number): PortfolioCase {
  let parsed: { industry?: string; client?: string; impact?: string; period?: string; features?: string[] } = {};
  try {
    parsed = JSON.parse(item.extraJson || "{}");
  } catch {
    // ignore
  }
  return {
    id: item.id || 1000 + index,
    industry: parsed.industry || "기업·제조",
    title: item.title,
    client: parsed.client || "고객사 구축 사례",
    summary: item.summary || "맞춤형 기업 홈페이지 구축 및 검색엔진 최적화 완료 사례입니다.",
    impact: parsed.impact || "상담 문의 및 브랜드 신뢰도 향상",
    period: parsed.period || "자료 전달 후 7~14일",
    features: parsed.features && parsed.features.length > 0 ? parsed.features : ["반응형 웹", "관리자 콘솔", "SEO 최적화"],
    background: item.summary || "기존 홈페이지의 모바일 불편함과 관리 어려움을 해소하기 위해 전면 개편을 진행했습니다.",
    solution: item.contentHtml
      ? item.contentHtml.replace(/<[^>]*>/g, " ").trim().slice(0, 180)
      : "100% 자체 소유 구조와 쉬운 관리자 콘솔을 적용해 운영 효율을 극대화했습니다.",
    thumbnailUrl: item.thumbnailUrl,
  };
}

function getSampleHref(item: PortfolioCase): string | null {
  const text = `${item.industry} ${item.title} ${item.summary}`;
  if (item.industry === "교육·아카데미" || /제조·B2B|스튜디오·학원/.test(text)) {
    return null;
  }
  if (item.industry === "법률·세무" || /법무|법률|로펌|세무|노무|변호사|정율/.test(text)) {
    return "/samples/law";
  }
  if (/피부|뷰티|에스테틱|미용|셀루체/.test(text)) {
    return "/samples/skin";
  }
  return item.industry === "병원·클리닉" ? "/samples/clinic" : "/samples/corp";
}

export default function PortfolioPage() {
  const [cases, setCases] = useState<PortfolioCase[]>(FALLBACK_CASES);
  const [selectedIndustry, setSelectedIndustry] = useState("전체");
  const [activeCase, setActiveCase] = useState<PortfolioCase | null>(null);

  useEffect(() => {
    fetch("/api/v1/cms/PORTFOLIO")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { success?: boolean; data?: CmsContentItem[] } | null) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map(mapCmsToCase);
          setCases(mapped);
        }
      })
      .catch(() => {
        // 오프라인 시 기본 6건 폴백 유지
      });
  }, []);

  const filteredCases = useMemo(() => {
    if (selectedIndustry === "전체") return cases;
    return cases.filter((c) => c.industry === selectedIndustry);
  }, [cases, selectedIndustry]);

  return (
    <div className="min-w-0 overflow-x-clip bg-white">
      {/* 상단 다크 네이비/바이올렛 2단 컴팩트 배너 헤더 */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-10 text-white sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-violet-600/20" />
        <div className="relative mx-auto max-w-6xl min-w-0 px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            {/* 좌측: 배지 + 제목 + 핵심 설명 */}
            <div className="min-w-0 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
                <Layers className="h-3.5 w-3.5 shrink-0" />
                업종별 제작 모델 · PORTFOLIO
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                업종별 맞춤 제작 모델과
                <br className="hidden sm:block" /> 실제 운영 쇼룸을 직접 체험하세요
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                기업·제조, 병원·클리닉, 전문직까지 각 업종에 최적화된 디자인과 관리자 기능을
                실제 화면으로 확인하실 수 있습니다.
              </p>
            </div>

            {/* 우측: 글래스모피즘 쇼룸 & 관리자 원클릭 요약 카드 */}
            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-200">
                    4대 업종 쇼룸 원클릭 바로가기
                  </span>
                  <span className="text-[11px] text-slate-400">새 탭 실행 ↗</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { href: "/samples/corp", label: "기업 · 건축 ↗" },
                    { href: "/samples/clinic", label: "내과 · 검진 ↗" },
                    { href: "/samples/skin", label: "피부과 · 뷰티 ↗" },
                    { href: "/samples/law", label: "법무 · 전문직 ↗" },
                  ].map((chip) => (
                    <Link
                      key={chip.href}
                      href={chip.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center justify-between gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:border-indigo-400/50 hover:bg-white/10"
                    >
                      <span className="truncate">{chip.label}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 text-indigo-300" />
                    </Link>
                  ))}
                </div>
                <Link
                  href="/admin/login"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-95 sm:text-sm"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>관리자 1초 체험 →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상단 4대 쇼룸 배너 */}
      <section className="border-b border-slate-200 bg-slate-50 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl min-w-0 px-4 sm:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-800 sm:text-base">
              실시간 체험 쇼룸 바로가기 (4종)
            </h2>
            <span className="text-xs text-slate-500">클릭 시 새 탭에서 독립 샘플 쇼룸이 열립니다</span>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/samples/corp",
                urlText: "/samples/corp",
                title: "기업 · 건축 · 인테리어",
                desc: "웜 스톤·브론즈 톤의 한빛공간디자인 B2B 기업 쇼룸을 확인하세요.",
                image: "/images/samples/corp-hero.jpg",
                icon: Building2,
                dark: false,
                badgeClass: "bg-blue-50 text-blue-600",
                borderHover: "hover:border-blue-400",
              },
              {
                href: "/samples/clinic",
                urlText: "/samples/clinic",
                title: "내과 · 검진 · 클리닉",
                desc: "메디컬 틸·화이트 톤과 네이버 예약 연동 연세바른내과 쇼룸을 확인하세요.",
                image: "/images/samples/clinic-hero.jpg",
                icon: Stethoscope,
                dark: false,
                badgeClass: "bg-emerald-50 text-emerald-600",
                borderHover: "hover:border-emerald-400",
              },
              {
                href: "/samples/skin",
                urlText: "/samples/skin",
                title: "피부과 · 뷰티 · 다국어",
                desc: "하이엔드 뷰티·다국어·전후사진 회원제 더셀루체 피부과 쇼룸을 확인하세요.",
                image: "/images/samples/skin-hero.jpg",
                icon: Sparkles,
                dark: false,
                badgeClass: "bg-rose-50 text-rose-600",
                borderHover: "hover:border-rose-400",
              },
              {
                href: "/samples/law",
                urlText: "/samples/law",
                title: "법무법인 · 세무 · 전문직",
                desc: "다크 네이비·골드 하이엔드 전문직형 법무법인 정율 쇼룸을 확인하세요.",
                image: "/images/samples/law-hero.jpg",
                icon: Scale,
                dark: true,
                badgeClass: "bg-amber-400/15 text-amber-300",
                borderHover: "hover:border-amber-400",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border shadow-2xs transition hover:-translate-y-0.5 hover:shadow-md ${
                    card.dark
                      ? "border-amber-400/30 bg-[#0A1120] text-white"
                      : "border-slate-200 bg-white text-slate-900"
                  } ${card.borderHover}`}
                >
                  {/* 미니 브라우저 목업 바 */}
                  <div
                    className={`flex items-center justify-between gap-2 border-b px-3 py-2 ${
                      card.dark
                        ? "border-white/10 bg-[#070C17] text-slate-400"
                        : "border-slate-200/80 bg-slate-100/80 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="truncate font-mono text-[10px]">{card.urlText}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-70 transition group-hover:opacity-100" />
                  </div>

                  {/* 로컬 이미지 썸네일 스트립 */}
                  <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                    <img
                      src={card.image}
                      alt={card.title}
                      onError={(e) => {
                        e.currentTarget.src = "/images/samples/fallback.svg";
                      }}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    <span
                      className={`absolute bottom-2.5 left-3 inline-flex h-8 w-8 items-center justify-center rounded-lg shadow-sm backdrop-blur-xs ${card.badgeClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>

                  {/* 카드 본문 */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3
                      className={`text-sm font-bold sm:text-base ${
                        card.dark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        card.dark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {card.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 업종별 핵심 기능 명세 & 제작 가이드 */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl min-w-0 px-4 sm:px-6">
          <div className="mb-6">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
              INDUSTRY SPEC &amp; FEATURE GUIDE
            </p>
            <h2 className="mt-1.5 text-xl font-extrabold text-slate-900 sm:text-2xl">
              업종별 핵심 기능 명세 &amp; 제작 가이드
            </h2>
            <p className="mt-1 text-xs text-slate-600 sm:text-sm">
              업종별 실제 상담·예약·운영 흐름에 맞춰 설계되는 표준 기능 명세입니다. 카드를 클릭하면 상세 스펙을 확인할 수 있습니다.
            </p>
          </div>

          {/* 필터 탭 */}
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => {
              const active = selectedIndustry === ind;
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setSelectedIndustry(ind)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-[#0B0F19] text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {ind}
                </button>
              );
            })}
          </div>

          {/* 카드 그리드 */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCases.map((item) => {
              const sampleHref = getSampleHref(item);
              return (
                <article
                  key={item.id}
                  onClick={() => setActiveCase(item)}
                  className="group flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.thumbnailUrl || "/images/samples/fallback.svg"}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = "/images/samples/fallback.svg";
                      }}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/20" />
                    <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
                      <span className="rounded-full border border-white/15 bg-slate-950/75 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                        {item.industry}
                      </span>
                      <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-800 backdrop-blur-xs">
                        {item.period}
                      </span>
                    </div>
                    <div className="absolute inset-x-4 bottom-3 flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.impact}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {item.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.features.slice(0, 3).map((feat) => (
                        <span
                          key={feat}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold">
                      {sampleHref ? (
                        <Link
                          href={sampleHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600"
                        >
                          <span>샘플 보기</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <Link
                          href="/inquiries"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-600"
                        >
                          <span>이 업종으로 견적 문의하기</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                      <span className="inline-flex items-center gap-1 text-blue-600">
                        <span>모델 상세 보기</span>
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 상세 모달 */}
      {activeCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs"
          onClick={() => setActiveCase(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {activeCase.industry}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {activeCase.client} · {activeCase.period}
                  </span>
                </div>
                <h2 className="mt-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {activeCase.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="상세 창 닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-xs font-semibold text-emerald-700">핵심 탑재 기능</div>
              <div className="mt-0.5 text-base font-extrabold text-emerald-900">
                {activeCase.impact}
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <h4 className="font-bold text-slate-900">업종별 주요 고민</h4>
                <p className="mt-1 leading-relaxed text-slate-600">{activeCase.background}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">표준 모델 설계 방향</h4>
                <p className="mt-1 leading-relaxed text-slate-600">{activeCase.solution}</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">주요 적용 기능</h4>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {activeCase.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                닫기
              </button>
              {getSampleHref(activeCase) && (
                <Link
                  href={getSampleHref(activeCase)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <span>샘플 화면 보기</span>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/inquiries"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <span>이 구성으로 상담 문의하기</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

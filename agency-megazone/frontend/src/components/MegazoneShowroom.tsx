"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Calculator,
  CalendarCheck,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  LayoutDashboard,
  MessageSquarePlus,
  MonitorCog,
  Scale,
  Server,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { isVideoUrl, type CmsContentItem } from "@/lib/api";

type SampleCategory = "ALL" | "PRO" | "CORP" | "MEDICAL";
type HeroPreviewKey = "LAW" | "TAX" | "CORP" | "ADMIN";

interface Props {
  configs: Record<string, string>;
  portfolios: CmsContentItem[];
  notices: CmsContentItem[];
  faqs?: CmsContentItem[];
  heroBanner?: CmsContentItem;
}

interface LiveSampleItem {
  id: string;
  category: Exclude<SampleCategory, "ALL">;
  href: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  heroImage: string;
  mobileTag: string;
  features: string[];
  accentColor: string;
  icon: typeof Building2;
}

const LIVE_SAMPLES: LiveSampleItem[] = [
  {
    id: "law",
    category: "PRO",
    href: "/samples/law",
    badge: "변호사 · 법무법인",
    title: "법무법인 정율",
    subtitle: "승소사례 필터 DB + 1:1 비밀상담 예약",
    desc: "형사·기업자문·가사 사건별 승소 사례 아카이브와 비밀보장 상담 예약을 결합한 전문직 표준 샘플입니다.",
    heroImage: "/images/samples/law-hero.jpg",
    mobileTag: "비밀보장 1:1 상담",
    features: ["분야별 승소사례 필터 DB", "비밀보장 1:1 상담예약", "1분 한글 관리자 연동"],
    accentColor: "bg-amber-600",
    icon: Scale,
  },
  {
    id: "tax",
    category: "PRO",
    href: "/samples/tax",
    badge: "세무사 · 노무사 · 행정사",
    title: "세무법인 한결",
    subtitle: "기장·절세 아카이브 + 네이버/1:1 예약",
    desc: "법인전환·병의원 세무·상속증여 절세 사례와 간편 기장 진단을 한눈에 보여주는 전문직 샘플입니다.",
    heroImage: "/images/samples/tax-hero.jpg",
    mobileTag: "기장 · 절세 무료진단",
    features: ["업종별 절세사례 아카이브", "간편 기장·서류 접수 폼", "네이버 예약 하이브리드"],
    accentColor: "bg-sky-600",
    icon: Calculator,
  },
  {
    id: "corp",
    category: "CORP",
    href: "/samples/corp",
    badge: "인테리어 · 건축 · 시공",
    title: "한빛공간디자인",
    subtitle: "고화질 시공 갤러리 + 30초 견적 계산기",
    desc: "수십 장의 시공 사진을 WebP 자동 경량화로 빠르게 보여주고, 평수별 예상 견적 계산기를 탑재한 샘플입니다.",
    heroImage: "/images/samples/corp-hero.jpg",
    mobileTag: "30초 예상 견적",
    features: ["평형·공간별 시공사례 DB", "30초 자동 견적 계산기", "고화질 사진 WebP 압축"],
    accentColor: "bg-amber-700",
    icon: Building2,
  },
  {
    id: "clinic",
    category: "MEDICAL",
    href: "/samples/clinic",
    badge: "내과 · 검진 · 병의원",
    title: "연세바른내과",
    subtitle: "진료과목·의료진 안내 + 초진 예약",
    desc: "검진 프로그램 안내와 시간대별 초진 예약·네이버 예약 연동을 깔끔하게 구현한 메디컬 샘플입니다.",
    heroImage: "/images/samples/clinic-hero.jpg",
    mobileTag: "초진·검진 예약",
    features: ["진료과목·의료진 소개", "시간대별 초진·네이버 예약", "모바일 원클릭 오시는길"],
    accentColor: "bg-teal-600",
    icon: Stethoscope,
  },
  {
    id: "skin",
    category: "MEDICAL",
    href: "/samples/skin",
    badge: "피부과 · 뷰티 · 다국어",
    title: "더셀루체 피부과",
    subtitle: "다국어 전환 + 전후사진 회원 잠금",
    desc: "한/영/중/일 다국어 전환과 의료광고법을 준수하는 전후사진 로그인 잠금 모듈을 탑재한 샘플입니다.",
    heroImage: "/images/samples/skin-hero.jpg",
    mobileTag: "다국어 · 전후사진 잠금",
    features: ["한/영/중/일 다국어 전환", "전후사진 회원전용 잠금", "시술별 상담예약 연동"],
    accentColor: "bg-rose-500",
    icon: Sparkles,
  },
];

const HERO_PREVIEWS: Record<
  HeroPreviewKey,
  {
    tabLabel: string;
    title: string;
    badge: string;
    image: string;
    href: string;
    summary: string;
    pills: string[];
  }
> = {
  LAW: {
    tabLabel: "법무법인",
    title: "법무법인 정율",
    badge: "승소사례 DB · 비밀상담",
    image: "/images/samples/law-hero.jpg",
    href: "/samples/law",
    summary: "형사·기업·가사 승소사례 필터링과 1:1 비밀보장 상담 예약",
    pills: ["승소사례 아카이브", "비밀상담 예약", "모바일 반응형"],
  },
  TAX: {
    tabLabel: "세무·노무",
    title: "세무법인 한결",
    badge: "절세 아카이브 · 기장진단",
    image: "/images/samples/tax-hero.jpg",
    href: "/samples/tax",
    summary: "법인전환·병의원 절세 사례 및 1:1 기장 상담 자동 접수",
    pills: ["절세사례 DB", "네이버 예약 연동", "SEO 자동화"],
  },
  CORP: {
    tabLabel: "인테리어",
    title: "한빛공간디자인",
    badge: "시공갤러리 · 30초 견적",
    image: "/images/samples/corp-hero.jpg",
    href: "/samples/corp",
    summary: "WebP 자동 경량화 시공 갤러리와 평수별 예상 견적 계산기",
    pills: ["30초 견적 계산기", "시공사례 필터", "WebP 자동압축"],
  },
  ADMIN: {
    tabLabel: "한글 관리자",
    title: "eleveWeb 전용 관리자(CMS)",
    badge: "비개발자 1분 직접 수정",
    image: "/images/samples/tax-office.jpg",
    href: "/admin/login",
    summary: "사례·칼럼·배너·팝업·네이버 SEO까지 클릭 몇 번으로 즉시 반영",
    pills: ["예약·문의 통합관리", "카톡 OG 교체", "무제한 콘텐츠 등록"],
  },
};

const QUICK_INDUSTRIES = [
  { value: "LAW_TAX", label: "전문직 (변호사·세무·노무)" },
  { value: "CORP", label: "인테리어 · 건축 · 기업" },
  { value: "CLINIC", label: "병의원 · 피부과 · 클리닉" },
  { value: "ETC", label: "기타 업종" },
];

export default function MegazoneShowroom({
  configs,
  portfolios,
  notices,
  faqs,
  heroBanner,
}: Props) {
  const router = useRouter();
  const [heroTab, setHeroTab] = useState<HeroPreviewKey>("LAW");
  const [sampleFilter, setSampleFilter] = useState<SampleCategory>("ALL");
  const [quickIndustry, setQuickIndustry] = useState("LAW_TAX");
  const [quickMemo, setQuickMemo] = useState("");

  void configs;
  void portfolios;
  void notices;
  void faqs;

  const activePreview = HERO_PREVIEWS[heroTab];
  const filteredSamples =
    sampleFilter === "ALL"
      ? LIVE_SAMPLES
      : LIVE_SAMPLES.filter((s) => s.category === sampleFilter);

  function handleQuickInquiry(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("industry", quickIndustry);
    if (quickMemo.trim()) {
      params.set("memo", quickMemo.trim());
    }
    router.push(`/inquiries?${params.toString()}`);
  }

  return (
    <div className="min-w-0 overflow-x-clip bg-white text-slate-900">
      {/* =====================================================================
          SECTION 1. 다크 부티크 히어로 (딥 네이비 + 좌측 강약 타이포 + 우측 실사 프리뷰)
         ===================================================================== */}
      <section className="relative overflow-hidden bg-[#0B0F19] pb-14 pt-12 text-white sm:pb-20 sm:pt-16">
        {/* 은은한 블루 글로우 & 그리드 배경 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#0EA5E9]/20 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-[#1D4ED8]/20 blur-[100px]"
        />
        {heroBanner?.thumbnailUrl && (
          <div className="pointer-events-none absolute inset-0 opacity-15">
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

        <div className="relative mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* 좌측: 권위 배지 + 강약 타이포 + CTA */}
            <div className="min-w-0 lg:col-span-6">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1.5 text-xs font-bold text-sky-300">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <span className="truncate">
                  14년 차 현업 기업 시스템 개발 총괄 직접 제작 · 하청 0%
                </span>
              </div>

              <h1 className="mt-6 text-3xl leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-[48px]">
                {heroBanner?.title ? (
                  <span className="font-black">{heroBanner.title}</span>
                ) : (
                  <>
                    <span className="block font-light text-slate-300">
                      매달 나가는 임대료 없이,
                    </span>
                    <span className="mt-1 block font-black">
                      <span className="bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#60A5FA] bg-clip-text text-transparent">
                        문의가 쌓이는
                      </span>{" "}
                      평생 소유형 홈페이지
                    </span>
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {heroBanner?.summary ||
                  "변호사·세무사·인테리어·병의원 맞춤 설계부터 5분 설문지 기반 카피 초안 세팅, 비개발자용 1분 한글 관리자까지 거품 없는 정찰제로 직접 구축합니다."}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/inquiries"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#1D4ED8] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-900/40 transition hover:opacity-95 sm:text-base"
                >
                  <MessageSquarePlus className="h-4 w-4 shrink-0" />
                  <span>30초 무료 견적 받기</span>
                </Link>
                <a
                  href="#portfolio-showcase"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition hover:border-sky-400/50 hover:bg-white/10 sm:text-base"
                >
                  <span>업종별 샘플 직접 체험</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-sky-400" />
                </a>
              </div>
            </div>

            {/* 우측: 인터랙티브 실사 PC+모바일 프리뷰 */}
            <div className="min-w-0 lg:col-span-6">
              <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-md sm:p-5">
                {/* 프리뷰 전환 탭 */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(HERO_PREVIEWS) as HeroPreviewKey[]).map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setHeroTab(key)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                          heroTab === key
                            ? "bg-gradient-to-r from-[#0EA5E9] to-[#1D4ED8] text-white shadow-xs"
                            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {HERO_PREVIEWS[key].tabLabel}
                      </button>
                    ))}
                  </div>
                  <Link
                    href={activePreview.href}
                    target={heroTab === "ADMIN" ? undefined : "_blank"}
                    rel={heroTab === "ADMIN" ? undefined : "noopener noreferrer"}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 transition hover:text-sky-200"
                  >
                    <span>실제 화면 열기</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* 실사 브라우저 프리뷰 프레임 */}
                <div className="overflow-hidden rounded-xl border border-white/15 bg-slate-950">
                  <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-3.5 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-300">
                      {activePreview.title} · 반응형 실구동 샘플
                    </span>
                    <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                      LIVE
                    </span>
                  </div>

                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={activePreview.image}
                      alt={activePreview.title}
                      className="h-full w-full object-cover opacity-55 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="inline-block rounded-full bg-sky-500/25 px-2.5 py-0.5 text-[11px] font-bold text-sky-200 backdrop-blur-xs">
                        {activePreview.badge}
                      </span>
                      <h2 className="mt-2 text-lg font-extrabold text-white sm:text-xl">
                        {activePreview.title}
                      </h2>
                      <p className="mt-1 text-xs leading-relaxed text-slate-200 sm:text-sm">
                        {activePreview.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {activePreview.pills.map((pill) => (
                          <span
                            key={pill}
                            className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white"
                          >
                            ✓ {pill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 히어로 하단 4칸 핵심 팩트 바 (floweb 강점 결합) */}
          <div className="mt-12 grid min-w-0 grid-cols-2 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-md lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            {[
              { label: "제작사 월 임대료", value: "0원", sub: "소스·DB 100% 영구 소유" },
              { label: "Standard (원페이지)", value: "69만 원", sub: "5분 설문지 카피·관리자 포함" },
              { label: "Deluxe ★ BEST", value: "129만 원", sub: "서브 5~7P · 사례 DB · 예약" },
              { label: "개발 주체 (하청 0%)", value: "14년 차 총괄", sub: "일반과세자 세금계산서 100%" },
            ].map((stat) => (
              <div key={stat.label} className="px-5 py-4 text-center sm:py-5">
                <div className="text-[11px] font-bold text-slate-400 sm:text-xs">{stat.label}</div>
                <div className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium text-sky-300">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2. 고통 공감 — "혹시 이런 고민 하고 계신가요?" (Warm Off-White)
         ===================================================================== */}
      <section className="border-b border-slate-200/80 bg-[#FAF9F6] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
              WHY ELEVEWEB
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              혹시 홈페이지 때문에 이런 고민 하고 계신가요?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              싸게 만들면 티가 나고, 에이전시에 맡기자니 수백만 원이 부담되는 현실을 해결했습니다.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-3">
            {[
              {
                num: "PAIN 01",
                title: "20~30만 원대 복붙 템플릿의 가벼움",
                desc: "클릭하는 순간 저가 템플릿 티가 나면, 전문직과 기업의 생명인 '첫인상 신뢰도'가 오히려 떨어집니다.",
              },
              {
                num: "PAIN 02",
                title: "매달 빠져나가는 웹빌더 임대료",
                desc: "임대형 플랫폼은 매달 요금제와 옵션 비용이 쌓이고, 해지하면 공들인 사이트와 데이터도 함께 사라집니다.",
              },
              {
                num: "PAIN 03",
                title: "영업 따로 하청 따로, 불투명한 견적",
                desc: "300~500만 원대 에이전시는 하청 위탁이 많고, 작은 문구 하나 고칠 때마다 추가 비용과 대기 시간이 생깁니다.",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs"
              >
                <span className="inline-block rounded-md bg-rose-50 px-2.5 py-1 text-[11px] font-extrabold text-rose-600">
                  {item.num}
                </span>
                <h3 className="mt-3 text-base font-extrabold text-slate-950 sm:text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3. 실사 기반 업종별 라이브 쇼케이스 (2열 와이드 PC+모바일 목업)
         ===================================================================== */}
      <section
        id="portfolio-showcase"
        className="border-b border-slate-200/80 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
                01 · LIVE PORTFOLIO SHOWCASE
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                직접 눌러보고 결정하는 업종별 실제 데모
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                정적 이미지가 아닙니다. 카드를 클릭하면 PC·모바일 반응형 실제 운영 화면이 새 탭으로 열립니다.
              </p>
            </div>

            {/* 업종 필터 탭 */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "ALL", label: "전체 (5)" },
                { key: "PRO", label: "전문직 (법무·세무)" },
                { key: "CORP", label: "인테리어·기업" },
                { key: "MEDICAL", label: "병의원·뷰티" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSampleFilter(tab.key as SampleCategory)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    sampleFilter === tab.key
                      ? "bg-slate-950 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid min-w-0 gap-7 lg:grid-cols-2">
            {filteredSamples.map((sample) => {
              const Icon = sample.icon;
              return (
                <Link
                  key={sample.id}
                  href={sample.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
                >
                  {/* 상단 실사 PC + 모바일 겹침 목업 */}
                  <div className="relative bg-slate-100 p-4 pb-0 sm:p-5 sm:pb-0">
                    <div className="grid grid-cols-12 items-end gap-3">
                      {/* PC 프레임 */}
                      <div className="col-span-9 overflow-hidden rounded-t-xl border border-b-0 border-slate-300/80 bg-slate-900 shadow-md">
                        <div className="flex items-center justify-between bg-slate-950 px-3 py-1.5">
                          <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          </div>
                          <span className="truncate text-[10px] font-medium text-slate-400">
                            {sample.title} · PC
                          </span>
                          <span className="w-4" />
                        </div>
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <img
                            src={sample.heroImage}
                            alt={`${sample.title} PC 화면`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                          <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                            <span
                              className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold text-white ${sample.accentColor}`}
                            >
                              {sample.badge}
                            </span>
                            <div className="mt-1 text-sm font-black tracking-tight sm:text-base">
                              {sample.title}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 모바일 프레임 */}
                      <div className="col-span-3 overflow-hidden rounded-t-2xl border-2 border-b-0 border-slate-800 bg-slate-900 shadow-lg">
                        <div className="bg-slate-900 py-1 text-center text-[8px] font-bold text-slate-400">
                          MOBILE
                        </div>
                        <div className="relative aspect-[9/14] w-full overflow-hidden">
                          <img
                            src={sample.heroImage}
                            alt={`${sample.title} 모바일 화면`}
                            className="h-full w-full object-cover opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                          <div className="absolute inset-x-1.5 bottom-2 text-center">
                            <span className="block truncate rounded bg-white/15 px-1 py-0.5 text-[8px] font-bold text-white backdrop-blur-xs">
                              {sample.mobileTag}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 하단 설명 & 특징 */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-blue-700">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <h3 className="text-lg font-extrabold text-slate-950 transition group-hover:text-blue-700">
                              {sample.title}
                            </h3>
                            <p className="text-xs font-semibold text-blue-700">{sample.subtitle}</p>
                          </div>
                        </div>
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition group-hover:bg-blue-700">
                          <span>체험</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{sample.desc}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      {sample.features.map((feat) => (
                        <span
                          key={feat}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4. 5분 설문지 + 카피 초안 세팅 (floweb 진입장벽 제거 흡수)
         ===================================================================== */}
      <section
        id="what-we-do"
        className="border-b border-slate-200/80 bg-[#FAF9F6] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
              02 · ZERO WRITING STRESS
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              홈페이지에 들어갈 글,{" "}
              <span className="bg-sky-100 px-1.5 py-0.5 text-blue-800">
                직접 다 써오지 않으셔도 됩니다
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              원고 작성 때문에 제작이 몇 주씩 밀리는 일이 없도록, 5분 설문지 방식과 카피 초안 세팅을 기본 제공합니다.
            </p>
          </div>

          <div className="mt-10 grid min-w-0 gap-5 md:grid-cols-3">
            {[
              {
                step: "STEP 01",
                title: "5분 설문지 & 3줄 메모",
                desc: "상호명, 연락처, 대표 약력 그리고 우리 회사만의 자랑거리 3줄만 메모해서 보내주세요.",
              },
              {
                step: "STEP 02",
                title: "사진 전달 (없으면 무료 대체)",
                desc: "보유하신 매장·시공·대표 사진을 보내주시거나, 없으시면 상업용 고화질 무료 이미지로 세팅합니다.",
              },
              {
                step: "STEP 03",
                title: "세일즈 카피 초안 무료 세팅",
                desc: "업종별 검증된 레이아웃에 맞춰 고객이 문의 버튼까지 누르게 만드는 헤드라인·CTA 초안을 완성합니다.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <span className="text-xs font-black tracking-wider text-blue-700">{item.step}</span>
                <h3 className="mt-2 text-lg font-extrabold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            ※ 기본 카피라이팅 초안은 제작사에서 무료로 잡아드리나, 의료법·변호사법·표시광고법 등 업종별 법적 심의 및 최종 문구 검수 책임은 고객사에 있습니다.
          </p>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5. 비개발자용 1분 한글 관리자(CMS) 1초 체험
         ===================================================================== */}
      <section id="cms-demo" className="border-b border-slate-200/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
          <div className="grid min-w-0 items-center gap-10 lg:grid-cols-12">
            {/* 좌측: 카피 + 1초 체험 CTA */}
            <div className="min-w-0 lg:col-span-5">
              <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
                03 · NO-CODE ADMIN CMS
              </p>
              <h2 className="mt-2 text-2xl font-extrabold leading-snug tracking-tight text-slate-950 sm:text-3xl">
                수정할 때마다 돈 내는 시대는 끝났습니다.
                <br />
                <span className="text-blue-700">한글 관리자(CMS)</span>로 1분 만에 직접 수정하세요.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                복잡한 외국어 빌더나 개발자 도움 없이, 네이버 블로그 쓰듯 직관적인 전용 한글
                관리자 콘솔을 기본으로 드립니다.
              </p>

              <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6 text-sm text-slate-700">
                {[
                  "승소사례·시공사례·공지·팝업 클릭 몇 번으로 무제한 등록",
                  "네이버·구글 검색 제목(SEO) 및 카톡 공유 이미지(OG) 즉시 교체",
                  "스마트폰 원본 사진 업로드 시 자동 WebP 압축 최적화",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
                    <span className="font-medium leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/admin/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
                >
                  <MonitorCog className="h-4 w-4 shrink-0" />
                  <span>관리자(CMS) 1초 직접 체험하기</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </div>
            </div>

            {/* 우측: 실제 관리자 대시보드 UI 목업 */}
            <div className="min-w-0 lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 bg-[#0B0F19] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="rounded bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-300">
                    eleveWeb 전용 한글 관리자 콘솔
                  </div>
                  <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                    실제 화면 구성
                  </span>
                </div>

                <div className="grid min-w-0 bg-slate-50 sm:grid-cols-12">
                  <div className="hidden border-r border-slate-200 bg-[#0F172A] p-4 text-slate-300 sm:col-span-4 sm:block">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-extrabold text-white">
                      <LayoutDashboard className="h-4 w-4 text-sky-400" />
                      <span>통합 관리자 센터</span>
                    </div>
                    <div className="mt-3 space-y-1 text-xs">
                      {[
                        { label: "종합 현황판", active: true },
                        { label: "견적 문의 관리", active: false },
                        { label: "1:1 예약 스케줄", active: false },
                        { label: "사례 · 칼럼 등록", active: false },
                        { label: "배너 · 팝업 제어", active: false },
                        { label: "검색(SEO) · OG 설정", active: false },
                      ].map((menu) => (
                        <div
                          key={menu.label}
                          className={`rounded-lg px-2.5 py-2 font-medium ${
                            menu.active
                              ? "bg-gradient-to-r from-[#0EA5E9] to-[#1D4ED8] font-bold text-white"
                              : "text-slate-400"
                          }`}
                        >
                          {menu.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-4 p-5 sm:col-span-8">
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { label: "신규 견적·예약", value: "5건" },
                        { label: "등록된 사례", value: "28건" },
                        { label: "이미지 최적화", value: "WebP" },
                      ].map((k) => (
                        <div
                          key={k.label}
                          className="rounded-xl border border-slate-200 bg-white p-3"
                        >
                          <div className="text-[11px] font-semibold text-slate-500">{k.label}</div>
                          <div className="mt-1 text-lg font-black text-slate-950">{k.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs font-bold text-slate-800">
                        <span>실시간 문의 · 예약 접수</span>
                        <span className="text-[11px] text-blue-700">원클릭 상태 변경</span>
                      </div>
                      <div className="mt-3 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                          <span className="truncate font-semibold text-slate-800">
                            [법무] 형사·기업자문 비밀상담 예약
                          </span>
                          <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            신규접수
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
                          <span className="truncate font-semibold text-slate-800">
                            [인테리어] 42평 아파트 실측 견적 요청
                          </span>
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            상담확정
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6. 투명 정찰제 (69 / 129 ★BEST / 219만 원 + 하단 각주)
         ===================================================================== */}
      <section id="pricing" className="border-b border-slate-200/80 bg-[#FAF9F6] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
              04 · TRANSPARENT PRICING
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              추가 비용 없는 100% 투명 정찰제
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              상담할 때마다 달라지는 견적 대신, 기능과 페이지 기준의 명확한 정찰제로 구축합니다.
            </p>
          </div>

          <div className="mt-12 grid min-w-0 gap-6 lg:grid-cols-3">
            {[
              {
                name: "Standard",
                price: "69만 원",
                subtitle: "소상공인·1인 개업 실속 원페이지형 (납기 7일)",
                highlight: false,
                features: [
                  "반응형 원페이지 (5~6섹션) + 스팸차단 견적폼",
                  "5분 설문지 기반 핵심 세일즈 카피 초안 세팅",
                  "자체 한글 관리자(공지·배너·팝업) 기본 제공",
                  "네이버·구글 SEO 및 카톡 공유(OG) 세팅",
                  "맞춤 시안 1종 + 수정 2회 / 무상 하자보수 1개월",
                ],
              },
              {
                name: "Deluxe",
                price: "129만 원",
                subtitle: "전문직·기업·병의원 표준형 (★BEST · 납기 14일)",
                highlight: true,
                features: [
                  "메인 + 서브 5~7페이지 맞춤 UI/UX 구성",
                  "업종별 아카이브(승소·시공·포트폴리오) DB",
                  "1:1 상담예약 또는 네이버 예약 하이브리드 연동",
                  "5분 설문지 기반 카피 초안 + 전체 한글 관리자",
                  "맞춤 시안 1종 + 수정 3회 / 무상 하자보수 2개월",
                  "일반과세자 전자세금계산서·비교견적서 100% 발행",
                ],
              },
              {
                name: "Premium",
                price: "219만 원",
                subtitle: "업종 특화 모듈·고도화 전담형 (납기 21일)",
                highlight: false,
                features: [
                  "메인 + 서브 10페이지 내외 풀 커스텀 구성",
                  "업종 특화 모듈 1종 기본 탑재 (계산기/전후사진 잠금/정원제 택1)",
                  "고급 기능 1종 기본 포함 (알림톡/PG결제/다국어 1언어 택1)",
                  "5분 설문지 기반 카피 초안 + 전체 한글 관리자",
                  "맞춤 시안 1종 + 수정 5회 / 무상 하자보수 3개월 (12h SLA)",
                ],
              },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={`relative flex min-w-0 flex-col justify-between rounded-2xl p-7 transition ${
                  pkg.highlight
                    ? "border-2 border-[#0EA5E9] bg-[#0B0F19] text-white shadow-xl"
                    : "border border-slate-200 bg-white text-slate-900 shadow-2xs"
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#1D4ED8] px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
                    ★ BEST 표준형
                  </span>
                )}
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-lg font-extrabold">{pkg.name}</h3>
                    <span
                      className={`text-xs font-semibold ${
                        pkg.highlight ? "text-sky-300" : "text-slate-500"
                      }`}
                    >
                      VAT 별도 (세금계산서 발행)
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      pkg.highlight ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    {pkg.subtitle}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-xs font-bold text-sky-500">정찰제</span>
                    <span className="text-3xl font-black tracking-tight">{pkg.price}</span>
                  </div>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            pkg.highlight ? "text-sky-400" : "text-blue-700"
                          }`}
                        />
                        <span className={pkg.highlight ? "text-slate-200" : "text-slate-700"}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/inquiries?package=${encodeURIComponent(pkg.name.toUpperCase())}`}
                  className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    pkg.highlight
                      ? "bg-gradient-to-r from-[#0EA5E9] to-[#1D4ED8] text-white hover:opacity-95"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  <span>{pkg.name} 패키지 견적 문의</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* 추가 옵션 & 실비 안내 각주 (1~2줄 텍스트로 간결 처리) */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4 text-xs leading-relaxed text-slate-600">
            <p>
              ※ <strong className="text-slate-900">인프라 실비(제작사 마진 0원):</strong> 도메인(연 약 2만 원) 및 2GB 독립 클라우드 서버(월 1~2만 원대)는 고객사 명의로 직접 결제·소유하며, 무중단 자동 복구 및 평생 무료 SSL 인증서 자동 갱신까지 모두 세팅해 드립니다.
            </p>
            <p className="mt-1.5">
              ※ <strong className="text-slate-900">선택형 추가 확장 옵션:</strong> 전후사진 회원 잠금(+30만), 다국어 1언어당(+50만), 카카오 알림톡 연동(+20만), PG 실연동(+50만), 서브 5P 추가(+25만 원) · 전 패키지 사전 레퍼런스 협의 후 맞춤 시안 1종으로 착수합니다.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7. 계약 전 4대 안심 보장 + 웹빌더 비교표 + FAQ
         ===================================================================== */}
      <section id="faq" className="border-b border-slate-200/80 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">
              05 · ZERO-RISK GUARANTEE
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              계약 전에 걸리는 점, 먼저 확실히 보장합니다
            </h2>
          </div>

          {/* 4대 안심 보장 카드 */}
          <div className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "개발 착수 전 100% 환불",
                desc: "사전 협의된 레퍼런스·기획 방향과 명백히 다를 경우 개발 착수 전 100% 전액 환불해 드립니다.",
              },
              {
                icon: Server,
                title: "서버 관리 걱정 제로",
                desc: "무중단 자동 복구 구성 및 평생 무료 SSL 보안 인증서 자동 갱신까지 모두 세팅해 드립니다.",
              },
              {
                icon: MonitorCog,
                title: "14년 차 총괄 직접 제작",
                desc: "하청·재위탁 없이 14년간 기업 시스템을 구축·운영해 온 현업 개발 총괄이 직접 설계합니다.",
              },
              {
                icon: FileCheck2,
                title: "일반과세자 100% 증빙",
                desc: "전자세금계산서, 비교견적서, 거래명세서 발행 및 원본 소스·도메인 100% 영구 소유권 이관.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1D4ED8] text-white shadow-xs">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 웹빌더 비교표 */}
          <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-600">
                  <th className="px-6 py-4">비교 항목</th>
                  <th className="px-6 py-4">일반 임대형 웹빌더</th>
                  <th className="bg-sky-50/80 px-6 py-4 text-blue-950">
                    eleveWeb 자체 소유형 구축
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  [
                    "월 고정 비용",
                    "매월 요금제 결제 (미납 시 운영 중단)",
                    "제작사 월 관리비 0원 (서버·도메인 실비만 납부)",
                  ],
                  [
                    "자산 소유권",
                    "임대 기간 내 이용 (플랫폼 이전 불가)",
                    "디자인·소스·도메인 100% 고객사 영구 소유",
                  ],
                  [
                    "관리자 편의성",
                    "복잡한 편집기 별도 학습 필요",
                    "한글 전용 간편 관리자 (클릭 1분 수정)",
                  ],
                  [
                    "맞춤 기능 확장",
                    "제공 템플릿 내 제한적 수정만 가능",
                    "승소사례 DB·견적 계산기·예약·API 자유 확장",
                  ],
                ].map(([label, rental, owned]) => (
                  <tr key={label} className="hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-bold text-slate-900">{label}</td>
                    <td className="px-6 py-4 text-slate-500">{rental}</td>
                    <td className="bg-sky-50/30 px-6 py-4 font-bold text-blue-950">{owned}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 핵심 FAQ 3선 */}
          <div className="mt-10 grid min-w-0 gap-4 md:grid-cols-3">
            {[
              {
                q: "Q. 오픈 후 서버 관리를 제가 직접 해야 하나요?",
                a: "아니요. 무중단 자동 복구 구성 및 평생 무료 SSL 보안 인증서 자동 갱신까지 모두 세팅해 드리므로, 오픈 후 대표님이 서버를 직접 관리하실 일은 전혀 없습니다.",
              },
              {
                q: "Q. 시안은 몇 개가 제공되나요?",
                a: "전 패키지 사전 레퍼런스 협의 후 고객사에 딱 맞춘 전용 시안 1종을 정교하게 제작하며, 패키지별 수정 횟수(2/3/5회) 내에서 완성도를 높입니다.",
              },
              {
                q: "Q. 비대면으로도 소통이 원활할까요?",
                a: "네, 100% 비대면 온라인 진행으로 전국 어디서나 가능하며, 문의 접수 시 전담 총괄 검토 후 맞춤 제안서와 샘플을 안내해 드립니다.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
              >
                <h3 className="text-sm font-extrabold text-slate-950 sm:text-base">{faq.q}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 8. 하단 '1줄 초간편 견적' 다크 CTA (floweb 전환 장치 결합)
         ===================================================================== */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-16 text-white sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#0EA5E9]/20 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-[#1D4ED8]/20 blur-[90px]"
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-sky-400">
            START YOUR PROJECT
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">
            하고 싶은 일, 한 문장만 적어주세요
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            업종과 필요한 기능 한 줄만 남겨주시면, 14년 차 전담 총괄이 검토 후 맞춤 샘플과
            투명 정찰제 견적을 안내해 드립니다.
          </p>

          <form
            onSubmit={handleQuickInquiry}
            className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/15 bg-white/[0.06] p-4 text-left backdrop-blur-md sm:p-6"
          >
            <div className="flex flex-wrap gap-2">
              {QUICK_INDUSTRIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setQuickIndustry(item.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    quickIndustry === item.value
                      ? "bg-gradient-to-r from-[#0EA5E9] to-[#1D4ED8] text-white shadow-xs"
                      : "border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={quickMemo}
                onChange={(e) => setQuickMemo(e.target.value)}
                placeholder="예: 개업 변호사 홈페이지, 승소사례와 비밀상담 예약 넣고 싶습니다"
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:border-sky-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#1D4ED8] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-900/40 transition hover:opacity-95"
              >
                <span>무료 견적 받기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <Link
              href="/reservations"
              className="inline-flex items-center gap-1.5 font-semibold text-sky-300 transition hover:text-sky-200"
            >
              <CalendarCheck className="h-4 w-4" />
              <span>1:1 사전 예약 상담 바로가기</span>
            </Link>
            <span>·</span>
            <span>일반과세자 전자세금계산서 100% 발행</span>
          </div>
        </div>
      </section>
    </div>
  );
}

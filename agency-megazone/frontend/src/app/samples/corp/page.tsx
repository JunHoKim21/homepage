"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { clientApiFetch } from "@/lib/api";
import {
  ArrowRight,
  Award,
  Building2,
  Calculator,
  CheckCircle2,
  Clock,
  Compass,
  Layers,
  MapPin,
  Menu,
  ParkingCircle,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type SpaceCategory = "전체" | "주거 리모델링" | "상업·오피스" | "신축·건축";
type QuoteSpaceType = "주거 리모델링" | "상업·오피스" | "신축·건축";
type QuoteGrade = "스탠다드" | "프리미엄";

interface PortfolioItem {
  id: number;
  title: string;
  category: Exclude<SpaceCategory, "전체">;
  location: string;
  area: string;
  year: string;
  summary: string;
  image: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "한남동 유엔빌리지 펜트하우스",
    category: "주거 리모델링",
    location: "서울 용산구 한남동",
    area: "78평",
    year: "2026",
    summary: "천연 트래버틴 스톤과 월넛 무늬목이 어우러진 미니멀 럭셔리 주거 공간",
    image: "/images/samples/corp-1.jpg",
  },
  {
    id: 2,
    title: "청담동 아뜰리에 플래그십 쇼룸",
    category: "상업·오피스",
    location: "서울 강남구 청담동",
    area: "54평",
    year: "2026",
    summary: "브론즈 헤어라인 금속과 간접 라인 조명으로 브랜드 아이덴티티를 극대화한 공간",
    image: "/images/samples/corp-2.jpg",
  },
  {
    id: 3,
    title: "판교 운중동 모던 단독주택 신축",
    category: "신축·건축",
    location: "경기 성남시 분당구",
    area: "92평",
    year: "2025",
    summary: "노출 콘크리트와 라임스톤 파사드, 중정을 품은 3층 규모 패시브 하우스",
    image: "/images/samples/corp-3.jpg",
  },
  {
    id: 4,
    title: "반포 래미안 원베일리 전체 시공",
    category: "주거 리모델링",
    location: "서울 서초구 반포동",
    area: "46평",
    year: "2026",
    summary: "히든 도어와 무몰딩 도장 마감, 시스템 에어컨·조명 통합 스마트 홈 구축",
    image: "/images/samples/corp-4.jpg",
  },
  {
    id: 5,
    title: "성수동 크리에이티브 스튜디오 사옥",
    category: "상업·오피스",
    location: "서울 성동구 성수동",
    area: "68평",
    year: "2025",
    summary: "개방형 라운지와 방음 미팅 포드를 조화시킨 하이브리드 워크스페이스",
    image: "/images/samples/corp-5.jpg",
  },
  {
    id: 6,
    title: "양평 서종면 프라이빗 풀빌라",
    category: "신축·건축",
    location: "경기 양평군 서종면",
    area: "85평",
    year: "2025",
    summary: "자연 채광을 극대화한 커튼월과 원목 루버가 돋보이는 휴양형 건축",
    image: "/images/samples/corp-6.jpg",
  },
];

const CATEGORIES: SpaceCategory[] = [
  "전체",
  "주거 리모델링",
  "상업·오피스",
  "신축·건축",
];

const SPACE_RATE_PER_PYEONG: Record<
  QuoteSpaceType,
  Record<QuoteGrade, { min: number; max: number }>
> = {
  "주거 리모델링": {
    스탠다드: { min: 220, max: 270 },
    프리미엄: { min: 340, max: 430 },
  },
  "상업·오피스": {
    스탠다드: { min: 190, max: 250 },
    프리미엄: { min: 310, max: 400 },
  },
  "신축·건축": {
    스탠다드: { min: 680, max: 790 },
    프리미엄: { min: 880, max: 1080 },
  },
};

function formatKoreanPrice(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rest = manwon % 10000;
    if (rest === 0) return `${eok}억 원`;
    return `${eok}억 ${rest.toLocaleString("ko-KR")}만 원`;
  }
  return `${manwon.toLocaleString("ko-KR")}만 원`;
}

export default function HanbitSpaceCorpSamplePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<SpaceCategory>("전체");

  // 견적 계산기 상태
  const [spaceType, setSpaceType] =
    useState<QuoteSpaceType>("주거 리모델링");
  const [pyeong, setPyeong] = useState<number>(34);
  const [grade, setGrade] = useState<QuoteGrade>("프리미엄");
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [consultError, setConsultError] = useState("");

  // 무료 방문실측 신청 모달 상태
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitName, setVisitName] = useState("");
  const [visitPhone, setVisitPhone] = useState("");
  const [visitAddress, setVisitAddress] = useState("");
  const [visitDone, setVisitDone] = useState(false);

  const filteredPortfolio = useMemo(() => {
    if (selectedCategory === "전체") return PORTFOLIO_ITEMS;
    return PORTFOLIO_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const estimate = useMemo(() => {
    const unit = SPACE_RATE_PER_PYEONG[spaceType][grade];
    return {
      min: unit.min * pyeong,
      max: unit.max * pyeong,
    };
  }, [spaceType, grade, pyeong]);

  const submitSampleInquiry = async (payload: {
    title: string;
    customerName: string;
    customerPhone: string;
    content: string;
    customFields: Record<string, unknown>;
  }) => {
    const body = {
      category: "ESTIMATE",
      customerName: payload.customerName.trim() || "샘플 체험 고객",
      customerPhone: payload.customerPhone.trim() || "010-0000-0000",
      customerEmail: null,
      title: payload.title,
      content: payload.content,
      customFieldsJson: JSON.stringify(payload.customFields),
      attachmentMediaId: null,
      privacyAgreed: true,
      websiteUrl: "",
    };
    try {
      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch {
      if (typeof window !== "undefined") {
        const existing = JSON.parse(
          localStorage.getItem("demo_sample_inquiries") || "[]"
        );
        existing.unshift({
          id: Date.now(),
          ...body,
          status: "NEW",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("demo_sample_inquiries", JSON.stringify(existing));
      }
    }
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultPhone.trim()) {
      setConsultError("성함과 연락처를 모두 입력해 주세요.");
      return;
    }
    setConsultError("");
    await submitSampleInquiry({
      title: `[샘플체험-건축인테리어] ${spaceType} ${pyeong}평 (${grade}) 맞춤 견적 상담`,
      customerName: consultName,
      customerPhone: consultPhone,
      content: `공간유형: ${spaceType} / 면적: ${pyeong}평 / 마감등급: ${grade} / 예상견적: ${formatKoreanPrice(estimate.min)} ~ ${formatKoreanPrice(estimate.max)}`,
      customFields: {
        sampleSource: "corp",
        spaceType,
        pyeong,
        grade,
        estimateRange: `${formatKoreanPrice(estimate.min)} ~ ${formatKoreanPrice(estimate.max)}`,
      },
    });
    setConsultSubmitted(true);
  };

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitName.trim() || !visitPhone.trim()) return;
    await submitSampleInquiry({
      title: `[샘플체험-건축인테리어] 무료 방문실측 신청 (${visitName.trim()})`,
      customerName: visitName,
      customerPhone: visitPhone,
      content: `방문실측 신청 현장 주소: ${visitAddress.trim() || "미입력"}`,
      customFields: {
        sampleSource: "corp-visit",
        visitAddress: visitAddress.trim() || "미입력",
      },
    });
    setVisitDone(true);
  };

  const resetVisitModal = () => {
    setVisitModalOpen(false);
    setVisitDone(false);
    setVisitName("");
    setVisitPhone("");
    setVisitAddress("");
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F5F5F4] text-[#1C1917] antialiased selection:bg-[#B45309] selection:text-white">
      {/* 최상단 데모 안내 띠 */}
      <div className="bg-slate-950 px-4 py-2 text-xs text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
          <p className="min-w-0 text-slate-300">
            현재 보고 계신 페이지는 업종별 맞춤형 구축 데모 샘플입니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-semibold">
            <Link
              href="/"
              className="text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:text-amber-300"
            >
              에이전시 메인으로 돌아가기
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/login"
              className="text-amber-300 underline decoration-amber-500/60 underline-offset-4 transition-colors hover:text-amber-200"
            >
              관리자(/admin) 체험하기
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/inquiries"
              className="text-emerald-300 underline decoration-emerald-500/60 underline-offset-4 transition-colors hover:text-emerald-200"
            >
              관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
            </Link>
          </div>
        </div>
      </div>

      {/* 1. 자체 상단 헤더 */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#F5F5F4]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="flex min-w-0 items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#1C1917] text-[#F5F5F4]">
              <Compass className="h-5 w-5 text-[#D97706]" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold tracking-[0.14em] text-[#1C1917] sm:text-base">
                HANBIT SPACE
              </div>
              <div className="truncate text-[11px] font-medium text-stone-500">
                한빛공간디자인
              </div>
            </div>
          </a>

          {/* 데스크톱 내비게이션 */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-stone-700 lg:flex">
            <a
              href="#philosophy"
              className="transition-colors hover:text-[#B45309]"
            >
              브랜드 철학
            </a>
            <a
              href="#portfolio"
              className="transition-colors hover:text-[#B45309]"
            >
              시공사례
            </a>
            <a
              href="#calculator"
              className="transition-colors hover:text-[#B45309]"
            >
              간편 견적계산기
            </a>
            <a
              href="#process"
              className="transition-colors hover:text-[#B45309]"
            >
              시공 프로세스
            </a>
            <a
              href="#location"
              className="transition-colors hover:text-[#B45309]"
            >
              오시는 길
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setVisitModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#1C1917] px-3.5 py-2 text-xs font-semibold text-[#F5F5F4] transition-colors hover:bg-[#B45309] sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <Ruler className="h-3.5 w-3.5 text-[#F59E0B]" />
              <span>무료 방문실측 신청</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="메뉴 열기"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-stone-300 bg-white text-stone-800 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 내비게이션 드로어 */}
        {mobileMenuOpen && (
          <div className="border-t border-stone-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-stone-800">
              {[
                { label: "브랜드 철학", href: "#philosophy" },
                { label: "시공사례", href: "#portfolio" },
                { label: "간편 견적계산기", href: "#calculator" },
                { label: "시공 프로세스", href: "#process" },
                { label: "오시는 길", href: "#location" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-sm px-2 py-1.5 hover:bg-stone-100"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* 2. 풀블리드 인테리어 히어로 */}
      <section
        id="top"
        className="relative flex min-h-[600px] items-end overflow-hidden bg-[#1C1917] sm:min-h-[680px]"
      >
        <img
          src="/images/samples/corp-hero.jpg"
          alt="한빛공간디자인 하이엔드 인테리어 시공 전경"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/samples/fallback.svg";
          }}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/55 to-[#1C1917]/30" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-6 sm:pb-16 lg:px-8">
          <div className="max-w-3xl min-w-0">
            <span className="inline-flex items-center gap-2 border border-[#B45309]/60 bg-[#1C1917]/70 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#FBBF24] uppercase backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Architectural Interior Studio
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl lg:text-6xl">
              공간의 가치를 높이는
              <br />
              하이엔드 주거·상업 인테리어
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-stone-300 sm:text-base">
              설계부터 자재 선정, 직영 시공 및 3년 책임 하자보증까지.
              한빛공간디자인은 보이지 않는 마감의 디테일로 삶의 품격을
              완성합니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 rounded-sm bg-[#B45309] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#92400E]"
              >
                <span>실시간 예상 견적 확인</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#portfolio"
                className="inline-flex items-center gap-2 rounded-sm border border-stone-400/50 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <span>시공사례 갤러리</span>
              </a>
            </div>
          </div>

          {/* 하단 핵심 지표 4종 */}
          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-white/15 pt-8 sm:grid-cols-4 sm:gap-6">
            {[
              { label: "누적 시공 실적", value: "1,280건+" },
              { label: "책임 하자보증", value: "하자보증 3년" },
              { label: "재시공·소개율 기준", value: "고객 만족도 99.2%" },
              { label: "외주 없는 책임 감리", value: "직영 시공팀 100%" },
            ].map((stat) => (
              <div key={stat.value} className="min-w-0">
                <div className="text-lg font-bold text-white sm:text-2xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-stone-300 sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 브랜드 철학 섹션 */}
      <section id="philosophy" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="min-w-0 lg:col-span-5">
              <p className="text-xs font-bold tracking-[0.2em] text-[#B45309] uppercase">
                Brand Philosophy
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-snug text-[#1C1917] sm:text-4xl">
                타협 없는 자재와 투명한 공정으로 신뢰를 짓습니다
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-600 sm:text-base">
                인테리어 현장의 불투명한 추가 비용과 하청 시공 관행을
                배제합니다. 한빛공간디자인은 계약 전 3D 렌더링과 상세 내역서를
                100% 공개하고, 본사 소속 현장 소장이 매일 공정을 검수합니다.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              {[
                {
                  icon: ShieldCheck,
                  title: "100% 정품 자재 실명제",
                  desc: "친환경 E0 등급 목재, 유럽산 천연 석재 등 모든 자재 스펙과 원산지를 계약서에 명시합니다.",
                },
                {
                  icon: Layers,
                  title: "사전 3D 시뮬레이션",
                  desc: "착공 전 실제와 동일한 조명·동선·마감재를 3D로 검증하여 오차 없는 시공을 보장합니다.",
                },
                {
                  icon: Building2,
                  title: "전담 감리 & 주간 리포트",
                  desc: "본사 정규직 현장 소장이 매일 사진·영상과 함께 공정 진행률을 실시간으로 공유합니다.",
                },
                {
                  icon: Award,
                  title: "준공 후 3년 무상 A/S",
                  desc: "공사 완료 후에도 전담 유지보수팀이 3년간 설비·마감 하자를 신속하게 책임 관리합니다.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="min-w-0 rounded-sm border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#F5F5F4] text-[#B45309]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[#1C1917]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 카테고리 필터링 시공사례 갤러리 */}
      <section
        id="portfolio"
        className="border-y border-stone-200 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-[0.2em] text-[#B45309] uppercase">
                Selected Works
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#1C1917] sm:text-4xl">
                한빛공간디자인 시공사례
              </h2>
            </div>

            {/* 필터 탭 */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-sm px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      active
                        ? "bg-[#1C1917] text-white"
                        : "border border-stone-200 bg-[#F5F5F4] text-stone-700 hover:border-stone-400"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPortfolio.map((project) => (
              <article
                key={project.id}
                className="group min-w-0 overflow-hidden rounded-sm border border-stone-200 bg-[#F5F5F4] transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/samples/fallback.svg";
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-[#1C1917]/85 px-2.5 py-1 text-[11px] font-semibold text-[#FBBF24] backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                    <span className="truncate">{project.location}</span>
                    <span className="shrink-0 font-semibold text-[#B45309]">
                      {project.area} · {project.year}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-[#1C1917]">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {project.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 실시간 평수·옵션 예상 견적 계산기 */}
      <section id="calculator" className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-[#B45309] uppercase">
              Instant Estimate
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#1C1917] sm:text-4xl">
              실시간 평수·옵션 예상 견적 계산기
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-stone-600 sm:text-base">
              공간 유형과 면적, 시공 등급을 선택하시면 한빛공간디자인의
              평균 공사비 범위를 즉시 확인하실 수 있습니다.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-12">
              {/* 좌측 옵션 선택 */}
              <div className="min-w-0 space-y-7 p-6 sm:p-8 lg:col-span-7">
                {/* 공간 유형 */}
                <div>
                  <label className="block text-sm font-bold text-[#1C1917]">
                    1. 공간 유형 선택
                  </label>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {(
                      [
                        "주거 리모델링",
                        "상업·오피스",
                        "신축·건축",
                      ] as QuoteSpaceType[]
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSpaceType(type)}
                        className={`rounded-sm border px-3 py-3 text-xs font-semibold transition-all sm:text-sm ${
                          spaceType === type
                            ? "border-[#B45309] bg-[#B45309]/10 text-[#B45309]"
                            : "border-stone-200 bg-[#F5F5F4] text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 평수 슬라이더 */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="pyeong-slider"
                      className="text-sm font-bold text-[#1C1917]"
                    >
                      2. 시공 면적 (공급면적 기준)
                    </label>
                    <span className="rounded-sm bg-[#1C1917] px-3 py-1 text-sm font-bold text-[#FBBF24]">
                      {pyeong}평 ({Math.round(pyeong * 3.3058)}㎡)
                    </span>
                  </div>
                  <input
                    id="pyeong-slider"
                    type="range"
                    min={15}
                    max={100}
                    step={1}
                    value={pyeong}
                    onChange={(e) => setPyeong(Number(e.target.value))}
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-[#B45309]"
                  />
                  <div className="mt-2 flex justify-between text-xs text-stone-500">
                    <span>15평</span>
                    <span>40평</span>
                    <span>70평</span>
                    <span>100평</span>
                  </div>
                </div>

                {/* 시공 등급 */}
                <div>
                  <label className="block text-sm font-bold text-[#1C1917]">
                    3. 시공 등급 선택
                  </label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        {
                          key: "스탠다드",
                          desc: "친환경 실크벽지·강마루·국산 브랜드 수전 및 합리적 맞춤 가구",
                        },
                        {
                          key: "프리미엄",
                          desc: "무몰딩 도장·원목마루·천연대리석·수입 주방/바스 및 3D 특화설계",
                        },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setGrade(opt.key)}
                        className={`rounded-sm border p-4 text-left transition-all ${
                          grade === opt.key
                            ? "border-[#B45309] bg-[#B45309]/5 ring-1 ring-[#B45309]"
                            : "border-stone-200 bg-[#F5F5F4] hover:border-stone-400"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[#1C1917]">
                            {opt.key}
                          </span>
                          {grade === opt.key && (
                            <CheckCircle2 className="h-4 w-4 text-[#B45309]" />
                          )}
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 우측 결과 + 상담 접수 */}
              <div className="min-w-0 bg-[#1C1917] p-6 text-white sm:p-8 lg:col-span-5">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#FBBF24] uppercase">
                  <Calculator className="h-4 w-4" />
                  Estimated Budget
                </div>

                <div className="mt-4 rounded-sm border border-white/15 bg-white/5 p-5">
                  <div className="text-xs text-stone-300">
                    {spaceType} · {pyeong}평 · {grade} 등급
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    {formatKoreanPrice(estimate.min)}
                    <span className="mx-1.5 text-stone-400">~</span>
                    <br className="sm:hidden" />
                    {formatKoreanPrice(estimate.max)}
                  </div>
                  <p className="mt-2 text-[11px] text-stone-400">
                    * 현장 철거 범위 및 구조 변경 여부에 따라 실측 후 정확한
                    정밀 견적서를 제공해 드립니다.
                  </p>
                </div>

                {consultSubmitted ? (
                  <div className="mt-6 rounded-sm border border-[#B45309] bg-[#B45309]/20 p-5 text-sm">
                    <div className="flex items-center gap-2 font-bold text-[#FBBF24]">
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                      <span>맞춤 견적 상담이 접수되었습니다</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-stone-200">
                      {consultName}님({consultPhone}), 선택하신{" "}
                      <strong>
                        {spaceType} {pyeong}평({grade})
                      </strong>{" "}
                      조건을 바탕으로 전담 책임 디자이너가 영업시간 내 빠르게
                      연락드리겠습니다.
                    </p>
                    <div className="mt-2.5 space-y-2 rounded-sm border border-amber-400/30 bg-slate-950/60 px-3 py-2 text-[11px] leading-relaxed text-amber-200">
                      <p>
                        ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가
                        기록되었습니다.
                      </p>
                      <Link
                        href="/admin/inquiries"
                        className="inline-block font-bold text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
                      >
                        관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setConsultSubmitted(false);
                        setConsultName("");
                        setConsultPhone("");
                      }}
                      className="mt-4 text-xs font-semibold text-[#FBBF24] underline underline-offset-4"
                    >
                      다른 조건으로 다시 문의하기
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleConsultSubmit} className="mt-6 space-y-3">
                    <div className="text-sm font-semibold text-stone-100">
                      이 견적으로 무료 상세 상담 받기
                    </div>
                    <input
                      type="text"
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      placeholder="성함 또는 업체명"
                      className="w-full rounded-sm border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-400 focus:border-[#F59E0B] focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={consultPhone}
                      onChange={(e) => setConsultPhone(e.target.value)}
                      placeholder="연락처 (예: 010-1234-5678)"
                      className="w-full rounded-sm border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-stone-400 focus:border-[#F59E0B] focus:outline-none"
                    />
                    {consultError && (
                      <p className="text-xs text-amber-400">{consultError}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full rounded-sm bg-[#B45309] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#92400E]"
                    >
                      무료 방문실측 및 상세 견적 신청
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 시공 프로세스 */}
      <section
        id="process"
        className="border-t border-stone-200 bg-white py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#B45309] uppercase">
              Work Process
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#1C1917] sm:text-4xl">
              체계적인 4단계 책임 시공 프로세스
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "무료 방문실측 & 니즈 분석",
                desc: "전문 디자이너가 현장을 직접 방문해 구조·설비 상태를 진단하고 라이프스타일에 맞춘 방향을 제안합니다.",
              },
              {
                step: "02",
                title: "3D 설계 & 투명 견적 확정",
                desc: "실물 자재 샘플링과 3D 투시도 확정 후, 추가 비용 없는 상세 내역서 기반으로 계약을 진행합니다.",
              },
              {
                step: "03",
                title: "직영 시공 & 주간 리포트",
                desc: "본사 직영 시공팀과 전담 소장이 공정표를 준수하며 매주 현장 사진과 검수 리포트를 발송합니다.",
              },
              {
                step: "04",
                title: "준공 검수 & 3년 하자보증",
                desc: "입주 전 42개 항목 정밀 체크리스트 검수를 완료하고 3년 무상 A/S 보증서를 발급합니다.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="min-w-0 rounded-sm border border-stone-200 bg-[#F5F5F4] p-6"
              >
                <div className="text-2xl font-bold text-[#B45309]">
                  {item.step}
                </div>
                <h3 className="mt-3 text-base font-bold text-[#1C1917]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. 오시는 길 */}
      <section
        id="location"
        className="border-t border-stone-200 bg-[#F5F5F4] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="min-w-0 space-y-6 lg:col-span-6">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-[#B45309] uppercase">
                  Showroom & Office
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#1C1917] sm:text-4xl">
                  한빛공간디자인 본사 쇼룸
                </h2>
                <p className="mt-3 text-sm text-stone-600 sm:text-base">
                  300여 종의 프리미엄 마감재와 실제 주방·욕실 목업을 직접
                  확인하고 1:1 설계 상담을 받아보실 수 있습니다.
                </p>
              </div>

              <div className="space-y-4 rounded-sm border border-stone-200 bg-white p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-500">
                      본사 쇼룸 주소
                    </div>
                    <div className="mt-0.5 text-sm font-bold text-[#1C1917]">
                      서울특별시 강남구 논현로 718 한빛빌딩 2F·3F
                    </div>
                    <div className="mt-1 text-xs text-stone-500">
                      7호선·수인분당선 강남구청역 3번 출구 도보 4분
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ParkingCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-500">
                      주차 안내
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-[#1C1917]">
                      쇼룸 건물 내 전용 발렛 및 무료 주차 2시간 지원
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-500">
                      영업시간
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-[#1C1917]">
                      평일 09:30 ~ 18:30 · 토요일 10:00 ~ 17:00 (예약제)
                    </div>
                    <div className="mt-0.5 text-xs text-stone-500">
                      일요일 및 법정 공휴일 휴무
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-stone-500">
                      대표 상담 전화
                    </div>
                    <div className="mt-0.5 text-base font-bold text-[#1C1917]">
                      02-514-7780
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-0 lg:col-span-6">
              <div className="relative aspect-[16/11] overflow-hidden rounded-sm border border-stone-200 bg-stone-200">
                <img
                  src="/images/samples/corp-showroom.jpg"
                  alt="한빛공간디자인 논현 쇼룸 내부"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/samples/fallback.svg";
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-sm bg-[#1C1917]/85 p-4 text-white backdrop-blur-sm">
                  <div className="text-xs font-semibold text-[#FBBF24]">
                    NONHYEON FLAGSHIP SHOWROOM
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    사전 예약 시 건축가·수석 디자이너 1:1 전담 상담 진행
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. 자체 기업 푸터 */}
      <footer className="bg-[#1C1917] pb-20 pt-12 text-stone-400 sm:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-stone-800 pb-8 md:flex-row md:items-center">
            <div>
              <div className="text-base font-bold tracking-[0.14em] text-white">
                HANBIT SPACE
              </div>
              <p className="mt-1 text-xs text-stone-400">
                주식회사 한빛공간디자인 | 하이엔드 주거·상업 인테리어 &amp; 건축
              </p>
            </div>
            <div className="flex flex-wrap gap-5 text-xs">
              <a href="#philosophy" className="hover:text-white">
                브랜드 철학
              </a>
              <a href="#portfolio" className="hover:text-white">
                시공사례
              </a>
              <a href="#calculator" className="hover:text-white">
                견적계산기
              </a>
              <a href="#location" className="hover:text-white">
                오시는 길
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-stone-500 sm:flex-row">
            <div className="space-y-1">
              <p>
                상호: (주)한빛공간디자인 | 대표자: 정우성 | 사업자등록번호:
                211-88-90432 | 실내건축공사업 면허 보유
              </p>
              <p>
                주소: 서울특별시 강남구 논현로 718 한빛빌딩 2F·3F | 대표번호:
                02-514-7780 | 이메일: contact@hanbitspace.co.kr
              </p>
            </div>
            <p className="shrink-0">
              © 2026 HANBIT SPACE DESIGN. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 무료 방문실측 신청 모달 */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-sm border border-stone-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-bold text-[#1C1917]">
                무료 방문실측 신청
              </h3>
              <button
                type="button"
                onClick={resetVisitModal}
                aria-label="닫기"
                className="rounded-sm p-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {visitDone ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#B45309]" />
                <h4 className="mt-3 text-base font-bold text-[#1C1917]">
                  방문실측 신청이 완료되었습니다
                </h4>
                <p className="mt-2 text-sm text-stone-600">
                  {visitName}님, 담당 실측 팀장이 확인 후 일정을 조율해
                  연락드리겠습니다.
                </p>
                <div className="mt-3 space-y-1.5 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs leading-relaxed text-amber-900">
                  <p>
                    ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가
                    기록되었습니다.
                  </p>
                  <Link
                    href="/admin/inquiries"
                    className="inline-block font-bold text-teal-700 underline underline-offset-4 hover:text-teal-900"
                  >
                    관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={resetVisitModal}
                  className="mt-5 w-full rounded-sm bg-[#1C1917] py-2.5 text-sm font-semibold text-white hover:bg-[#B45309]"
                >
                  확인
                </button>
              </div>
            ) : (
              <form onSubmit={handleVisitSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700">
                    성함 *
                  </label>
                  <input
                    type="text"
                    required
                    value={visitName}
                    onChange={(e) => setVisitName(e.target.value)}
                    placeholder="홍길동"
                    className="mt-1 w-full rounded-sm border border-stone-300 px-3 py-2 text-sm focus:border-[#B45309] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={visitPhone}
                    onChange={(e) => setVisitPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="mt-1 w-full rounded-sm border border-stone-300 px-3 py-2 text-sm focus:border-[#B45309] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700">
                    현장 주소 (지역명)
                  </label>
                  <input
                    type="text"
                    value={visitAddress}
                    onChange={(e) => setVisitAddress(e.target.value)}
                    placeholder="예: 서초구 반포동"
                    className="mt-1 w-full rounded-sm border border-stone-300 px-3 py-2 text-sm focus:border-[#B45309] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-sm bg-[#B45309] py-3 text-sm font-bold text-white transition-colors hover:bg-[#92400E]"
                >
                  실측 예약 접수하기
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

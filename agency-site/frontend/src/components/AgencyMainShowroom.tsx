"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Calculator,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Gauge,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Lock,
  LockKeyhole,
  MapPin,
  MessageSquarePlus,
  PhoneCall,
  RefreshCw,
  Scale,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Subtitles,
  ThumbsUp,
  Train,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CmsContentItem } from "@/lib/api";

export type ShowroomPreset = "AGENCY" | "CORP" | "CLINIC";

interface Props {
  configs: Record<string, string>;
  portfolios: CmsContentItem[];
  notices: CmsContentItem[];
  heroBanner?: CmsContentItem;
  initialPreset?: string;
}

interface PortfolioExtra {
  industry?: string;
  samplePreset?: ShowroomPreset;
  period?: string;
  plan?: string;
  client?: string;
  tags?: string[];
}

function normalizePreset(raw?: string | null): ShowroomPreset {
  const upper = (raw || "").toUpperCase();
  if (upper === "CORP") return "CORP";
  if (upper === "CLINIC") return "CLINIC";
  return "AGENCY";
}

export default function AgencyMainShowroom({
  configs,
  portfolios,
  notices,
  heroBanner,
  initialPreset,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPreset = searchParams.get("preset");

  const [activePreset, setActivePreset] = useState<ShowroomPreset>(() =>
    normalizePreset(urlPreset || initialPreset || configs.site_theme_preset)
  );

  useEffect(() => {
    if (urlPreset) {
      setActivePreset(normalizePreset(urlPreset));
    }
  }, [urlPreset]);

  const switchPreset = (nextPreset: ShowroomPreset) => {
    setActivePreset(nextPreset);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    router.replace(`/?preset=${nextPreset}`, { scroll: false });
  };

  // 포트폴리오 필터 상태 (모드 0)
  const [industryFilter, setIndustryFilter] = useState<string>("전체");

  // FAQ 아코디언 상태 (모드 0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // 샘플 1 (CORP) 30초 무료 견적 계산기 상태
  const [corpType, setCorpType] = useState<"상업·오피스 시공" | "주거·아파트 인테리어" | "제조·설비 발주">(
    "상업·오피스 시공"
  );
  const [corpArea, setCorpArea] = useState<number>(35);
  const [corpGrade, setCorpGrade] = useState<"실속 스탠다드" | "비즈니스 프리미엄" | "하이엔드 VIP">(
    "비즈니스 프리미엄"
  );

  const estimatedCorpPrice = useMemo(() => {
    const basePerPyeong =
      corpGrade === "실속 스탠다드" ? 140 : corpGrade === "비즈니스 프리미엄" ? 195 : 270;
    const typeMultiplier =
      corpType === "상업·오피스 시공" ? 1.0 : corpType === "주거·아파트 인테리어" ? 0.95 : 1.15;
    const min = Math.round(corpArea * basePerPyeong * typeMultiplier * 0.9);
    const max = Math.round(corpArea * basePerPyeong * typeMultiplier * 1.08);
    return { min, max };
  }, [corpType, corpArea, corpGrade]);

  // 샘플 2 (CLINIC) 빠른 예약 바 상태
  const [clinicDept, setClinicDept] = useState<string>("건강검진·내과 클리닉");
  const [clinicTime, setClinicTime] = useState<string>("오전 10:30 (잔여 1석)");

  const parsedPortfolios = useMemo(() => {
    return portfolios.map((item) => {
      let extra: PortfolioExtra = {};
      try {
        extra = JSON.parse(item.extraJson || "{}") as PortfolioExtra;
      } catch {
        extra = {};
      }
      const industry = extra.industry || "기업·시공";
      const samplePreset: ShowroomPreset =
        extra.samplePreset ||
        (industry.includes("병의원") || industry.includes("로펌") || industry.includes("스튜디오")
          ? "CLINIC"
          : "CORP");
      return {
        ...item,
        industry,
        samplePreset,
        period: extra.period || "5~7일 구축",
        plan: extra.plan || "DELUXE",
        client: extra.client || "구축 고객사",
        tags:
          extra.tags && extra.tags.length > 0
            ? extra.tags
            : ["반응형 웹", "맞춤 관리자", "사진 자동 최적화", "검색 노출 최적화"],
      };
    });
  }, [portfolios]);

  const filteredPortfolios = useMemo(() => {
    if (industryFilter === "전체") return parsedPortfolios;
    return parsedPortfolios.filter((p) => p.industry === industryFilter);
  }, [parsedPortfolios, industryFilter]);

  const naverBookingUrl = configs.naver_booking_url || "https://booking.naver.com/";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-white">
      {/* =====================================================================
          상단 라이브 테마·샘플 스위처 바 (크몽·숨고 의뢰인 실시간 쇼룸 컨트롤러)
      ===================================================================== */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:flex-row">
          <div className="flex min-w-0 flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2.5 sm:text-left">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-black text-slate-950 shadow-2xs">
              <Sparkles className="h-3 w-3" />
              LIVE 쇼룸 스위처
            </span>
            <p className="text-xs font-semibold text-slate-200 sm:text-sm">
              클릭 한 번으로 <strong className="text-amber-300">에이전시 공식 홈</strong>과{" "}
              <strong className="text-white">업종별 납품 샘플 1·2</strong>를 실시간 전환해 보세요!
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-1.5 sm:w-auto sm:gap-2">
            <button
              type="button"
              onClick={() => switchPreset("AGENCY")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-extrabold transition sm:px-3.5 sm:text-xs ${
                activePreset === "AGENCY"
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-300"
                  : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5 shrink-0" />
              <span>모드 0: 웹 에이전시 공식 홈</span>
            </button>

            <button
              type="button"
              onClick={() => switchPreset("CORP")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-extrabold transition sm:px-3.5 sm:text-xs ${
                activePreset === "CORP"
                  ? "bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-200"
                  : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>샘플 1: 기업·시공·제조형</span>
            </button>

            <button
              type="button"
              onClick={() => switchPreset("CLINIC")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-extrabold transition sm:px-3.5 sm:text-xs ${
                activePreset === "CLINIC"
                  ? "bg-teal-500 text-slate-950 shadow-sm ring-2 ring-teal-200"
                  : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5 shrink-0" />
              <span>샘플 2: 병의원·로펌·예약형</span>
            </button>

            <Link
              href="/admin/login"
              className="hidden items-center gap-1 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs font-extrabold text-amber-300 transition hover:bg-amber-400/20 xl:inline-flex"
            >
              <LockKeyhole className="h-3.5 w-3.5" />
              CMS 관리자 1초 체험
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================================
          [모드 0: AGENCY] 우리 웹 에이전시 공식 홈페이지 (7단 고전환 구조)
      ===================================================================== */}
      {activePreset === "AGENCY" && (
        <div>
          {/* 섹션 1: 다크 네이비&블루 히어로 + 4대 핵심 지표 카운터 */}
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 py-20 text-white sm:py-28">
            {heroBanner?.thumbnailUrl && (
              <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url('${heroBanner.thumbnailUrl}')` }}
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.12),transparent_45%)]" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-blue-400/30 bg-blue-900/40 px-4 py-1.5 text-xs font-bold text-blue-200 backdrop-blur-xs">
                  <BadgeCheck className="h-4 w-4 text-amber-400" />
                  <span>
                    사업자 세금계산서 즉시 발행 | 월 고정 임대료 0원 · 100% 고객사 자체 소유 구축
                  </span>
                </div>

                {heroBanner?.title ? (
                  <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-[52px]">
                    {heroBanner.title}
                  </h1>
                ) : (
                  <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-[52px]">
                    <span className="block text-amber-300">
                      “매달 나가는 홈페이지 월 임대료, 아직도 내고 계십니까?”
                    </span>
                    <span className="mt-3 block">
                      100% 귀사 소유로 구축하는 초고속 반응형 홈페이지 &amp; 맞춤 관리자
                    </span>
                  </h1>
                )}

                {heroBanner?.summary ? (
                  <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                    {heroBanner.summary}
                  </p>
                ) : (
                  <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                    일반 임대형 웹빌더처럼 매달 플랫폼 이용료나 기능 추가 비용을 계속 내야 하는 방식과 다릅니다.{" "}
                    <strong className="font-bold text-white">초고속 검색 최적화 구조와 맞춤 관리자 기능</strong>으로
                    제작하여 원본 파일과 데이터를 100% 귀사 자산으로 이관해 드립니다.
                  </p>
                )}

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/inquiries"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 sm:w-auto sm:px-7 sm:py-4 sm:text-base"
                  >
                    <MessageSquarePlus className="h-5 w-5 shrink-0" />
                    <span>30초 무료 제작 견적 받기</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                  <Link
                    href="/admin/login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-400/50 bg-amber-400/15 px-5 py-3.5 text-sm font-extrabold text-amber-300 backdrop-blur-xs transition hover:bg-amber-400/25 sm:w-auto sm:px-7 sm:py-4 sm:text-base"
                  >
                    <LockKeyhole className="h-5 w-5 shrink-0" />
                    <span>관리자 화면 1초 원클릭 체험</span>
                  </Link>
                </div>

                {/* 업종별 샘플 즉시 전환 서브 버튼 */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400">납품 화면 미리보기:</span>
                  <button
                    type="button"
                    onClick={() => switchPreset("CORP")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-bold text-amber-300 transition hover:border-amber-400"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    샘플 1: 기업·시공·제조 홍보형 보기 →
                  </button>
                  <button
                    type="button"
                    onClick={() => switchPreset("CLINIC")}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-bold text-teal-300 transition hover:border-teal-400"
                  >
                    <Stethoscope className="h-3.5 w-3.5" />
                    샘플 2: 병의원·로펌·스튜디오 예약형 보기 →
                  </button>
                </div>
              </div>

              {/* 4대 핵심 지표 카드 */}
              <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-blue-500/20 px-2.5 py-1 text-xs font-extrabold text-blue-300">
                      COST ZERO
                    </span>
                    <Award className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="mt-4 text-2xl font-black text-white">월 고정 임대료 0원</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    100% 자체 소유형 원본 파일 이관으로 제작사 월 관리비·임대료 부담 해방
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-300">
                      SEARCH READY
                    </span>
                    <Search className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="mt-4 text-2xl font-black text-white">네이버·구글 검색 최적화</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    초고속 검색 최적화 구조와 사이트맵·카톡 공유 썸네일 직접 설정 기본 탑재
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-extrabold text-amber-300">
                      SPEED 3X
                    </span>
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <p className="mt-4 text-2xl font-black text-white">사진 용량 자동 최적화</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    고화질 사진을 그대로 올려도 자동으로 용량을 줄여 모바일 로딩속도 3배 향상
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-purple-500/20 px-2.5 py-1 text-xs font-extrabold text-purple-300">
                      FAST DELIVERY
                    </span>
                    <Clock className="h-5 w-5 text-purple-300" />
                  </div>
                  <p className="mt-4 text-2xl font-black text-white">평균 구축 5~7일</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    검증된 업종별 맞춤 모듈로 기획부터 오픈까지 빠르고 정확하게 안심 납품
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 2: 일반 임대형 웹빌더 vs 당사 자체 소유형 맞춤 홈페이지 비교표 */}
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold text-blue-800">
                  WHY STARTERWEB STUDIO
                </span>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  일반 임대형 웹빌더 vs 당사 자체 소유형 맞춤 홈페이지 비교
                </h2>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  매달 나가는 플랫폼 유지 비용과 홈페이지 소유권, 우리 회사 맞춤 기능 범위를 한눈에 비교해 보세요.
                </p>
              </div>

              <div className="mt-12 w-full max-w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-900 text-white">
                        <th className="w-1/4 px-6 py-5 font-extrabold">비교 항목</th>
                        <th className="w-3/8 px-6 py-5 font-bold text-slate-300">
                          일반 임대형 웹빌더 · 구독형 노코드 플랫폼
                        </th>
                        <th className="w-3/8 bg-blue-800 px-6 py-5 font-extrabold text-white">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-300" />
                            <span>당사 자체 소유형 맞춤 홈페이지</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr className="hover:bg-slate-50/70">
                        <td className="px-6 py-5 font-extrabold text-slate-900">1. 매달 나가는 비용</td>
                        <td className="px-6 py-5 text-slate-600">
                          매월 플랫폼 임대료·기능 추가비 지속 발생
                        </td>
                        <td className="bg-blue-50/40 px-6 py-5 font-bold text-blue-950">
                          <span className="inline-flex items-center gap-1.5 text-blue-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-700" />
                            제작사 관리비·월 임대료 0원 (100% 자체 소유)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/70">
                        <td className="px-6 py-5 font-extrabold text-slate-900">2. 홈페이지 소유권</td>
                        <td className="px-6 py-5 text-slate-600">
                          플랫폼 정책에 따라 서버 이전 제한
                        </td>
                        <td className="bg-blue-50/40 px-6 py-5 font-bold text-blue-950">
                          <span className="inline-flex items-center gap-1.5 text-blue-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-700" />
                            원본 파일·데이터 100% 고객사 귀속 (원하는 서버로 자유 이전)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/70">
                        <td className="px-6 py-5 font-extrabold text-slate-900">3. 우리 회사 맞춤 기능</td>
                        <td className="px-6 py-5 text-slate-600">
                          정해진 템플릿 외 맞춤 기능 추가 제한
                        </td>
                        <td className="bg-blue-50/40 px-6 py-5 font-bold text-blue-950">
                          <span className="inline-flex items-center gap-1.5 text-blue-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-700" />
                            1:1·정원제 예약, 견적 계산기, 실시간 알림 등 맞춤 기능 기본 탑재
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/70">
                        <td className="px-6 py-5 font-extrabold text-slate-900">4. 네이버·구글 검색 노출</td>
                        <td className="px-6 py-5 text-slate-600">
                          검색엔진 세부 구조 직접 수정 제한
                        </td>
                        <td className="bg-blue-50/40 px-6 py-5 font-bold text-blue-950">
                          <span className="inline-flex items-center gap-1.5 text-blue-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-700" />
                            초고속 페이지 로딩 + 관리자 화면에서 검색 제목·카톡 공유 이미지 직접 설정
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/70">
                        <td className="px-6 py-5 font-extrabold text-slate-900">5. 스팸 및 개인정보 보호</td>
                        <td className="px-6 py-5 text-slate-600">
                          공용 플러그인 방식 및 기본 스팸 방어
                        </td>
                        <td className="bg-blue-50/40 px-6 py-5 font-bold text-blue-950">
                          <span className="inline-flex items-center gap-1.5 text-blue-800">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-700" />
                            자동 스팸 차단 + 고객 견적서·첨부파일 비공개 안전 보관
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 3: 납품 시 기본 제공되는 4대 핵심 관리자 기능 쇼케이스 */}
          <section className="border-y border-slate-200 bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-extrabold text-amber-900">
                  4 EASY ADMIN FEATURES
                </span>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  개발자 없이 대표님이 직접 운영하는 ‘4대 맞춤 관리자 기능’ 기본 탑재
                </h2>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  문구 하나 바꾸려고 건당 3~5만 원씩 수정 비용을 지불하지 마세요. 지금 바로 관리자 화면에서 직접 눌러보실 수 있습니다.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {/* 기능 1 */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition hover:border-blue-400 hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-800">
                        <Globe className="h-6 w-6" />
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
                        FEATURE 01 · 쉬운 검색·브랜드 설정
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-black text-slate-900">
                      ① 검색 노출 제목 · 카톡 공유 썸네일 · 브랜드 색상 즉시 변경
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      네이버·구글 검색 제목, 소개 문구, 카카오톡 공유 썸네일 이미지, 대표 브랜드 색상, 하단 사업자 정보를
                      복잡한 작업 없이 관리자 화면에서 저장 즉시 0.1초 만에 홈페이지 전체에 반영합니다.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-blue-700" /> 네이버·구글 검색 등록 인증코드 빈칸 입력만으로 간편 연동
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-blue-700" /> 상단 메뉴 이름 · 노출 순서 · 숨김 여부 마우스 클릭 제어
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Link
                      href="/admin/login"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900"
                    >
                      관리자 화면에서 직접 눌러보기 <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* 기능 2 */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition hover:border-blue-400 hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
                        <FileSpreadsheet className="h-6 w-6" />
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                        FEATURE 02 · 고객 문의 &amp; 엑셀 관리
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-black text-slate-900">
                      ② 자동 스팸 차단 견적·상담 문의폼 + 원클릭 엑셀(.xlsx) 다운로드
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      자동 스팸 방지 기능으로 광고성 도배 문의를 깔끔하게 걸러냅니다. 접수된 고객 문의 내역은 진행 상태별(신규/상담중/완료)로
                      메모하며 관리하고 클릭 한 번에 한글 깨짐 없는 엑셀 파일로 내려받습니다.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-700" /> 업종별 맞춤 입력 항목(예산/평수/희망일) 자유 추가 가능
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-700" /> 영업·상담 정리용 기간별·상태별 엑셀(.xlsx) 즉시 다운로드
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Link
                      href="/admin/login"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900"
                    >
                      관리자 화면에서 직접 눌러보기 <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* 기능 3 */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition hover:border-blue-400 hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-800">
                        <CalendarCheck className="h-6 w-6" />
                      </span>
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-extrabold text-purple-700">
                        FEATURE 03 · 업종별 맞춤 예약
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-black text-slate-900">
                      ③ 하이브리드 예약 시스템 (1:1 단독 / N명 정원제 / 네이버 예약 스위치)
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      로펌·세무사처럼 한 타임에 1명만 받는 ‘1:1 단독 예약’부터 클리닉·필라테스처럼 시간대별 ‘N명 정원제 예약’,
                      그리고 ‘네이버 스마트플레이스 예약’ 병행까지 관리자 스위치 하나로 전환됩니다.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-purple-700" /> 날짜·시간대별 잔여석 자동 마감 및 중복 예약 방지
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-purple-700" /> 예약 기능이 필요 없는 기업형은 ‘사용 안 함’ 선택 시 메뉴 자동 숨김
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Link
                      href="/admin/login"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900"
                    >
                      관리자 화면에서 직접 눌러보기 <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* 기능 4 */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs transition hover:border-blue-400 hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                        <ImageIcon className="h-6 w-6" />
                      </span>
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-800">
                        FEATURE 04 · 사진 최적화 &amp; 안전 보관
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-black text-slate-900">
                      ④ 고화질 사진 용량 자동 최적화 &amp; 고객 첨부파일 비공개 안전 보관
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      10MB짜리 스마트폰·카메라 원본 시공 사진을 그대로 올려도 서버가 자동으로 용량을 줄여 모바일 로딩 속도를
                      높여주며, 고객이 올린 견적서·첨부파일은 외부에서 볼 수 없는 비공개 폴더에 안전하게 보관합니다.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-xs font-semibold text-slate-700">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-amber-700" /> 포토샵 크기 조절 없이 원본 사진 그대로 등록 → 용량 80% 자동 절감
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-amber-700" /> 고객 계약서·사건/진료 첨부자료는 로그인한 관리자만 안전 열람
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Link
                      href="/admin/login"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:text-blue-900"
                    >
                      관리자 화면에서 직접 눌러보기 <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 4: 업종별 구축 포트폴리오 쇼케이스 & 라이브 샘플 미리보기 */}
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold text-blue-800">
                    PORTFOLIO &amp; LIVE DEMO
                  </span>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    업종별 구축 포트폴리오 &amp; 라이브 샘플 쇼룸
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    포트폴리오 카드 하단의 <strong>[이 업종 샘플 디자인 체험하기]</strong> 버튼을 누르면 실제 작동하는 샘플 홈 화면으로 즉시 전환됩니다.
                  </p>
                </div>

                {/* 업종 필터 탭 */}
                <div className="flex flex-wrap gap-1.5">
                  {["전체", "기업·시공", "병의원·클리닉", "로펌·세무", "스튜디오·학원"].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setIndustryFilter(tab)}
                      className={`rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                        industryFilter === tab
                          ? "bg-blue-800 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPortfolios.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          PORTFOLIO PREVIEW
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="rounded-lg bg-slate-950/85 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur-xs">
                          {item.industry}
                        </span>
                        <span className="rounded-lg bg-blue-700/90 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur-xs">
                          {item.plan} · {item.period}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <p className="text-xs font-bold text-slate-400">{item.client}</p>
                        <h3 className="mt-1 text-lg font-extrabold text-slate-900 group-hover:text-blue-800">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                          {item.summary}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => switchPreset(item.samplePreset)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-xs font-extrabold text-white transition hover:bg-blue-800"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-300" />
                          이 업종 샘플 디자인 체험하기 (
                          {item.samplePreset === "CORP" ? "샘플 1: 기업·시공형" : "샘플 2: 병의원·로펌 예약형"})
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-10 text-center">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-extrabold text-slate-800 transition hover:border-blue-600 hover:text-blue-800"
                >
                  전체 구축 사례 및 업종별 상세 기능 더보기 <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* 섹션 5: 크몽·숨고 동일 3단 정찰제 가격 패키지 표 */}
          <section className="border-t border-slate-200 bg-slate-950 py-20 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3.5 py-1 text-xs font-extrabold text-amber-300 ring-1 ring-amber-400/30">
                  TRANSPARENT PRICING
                </span>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
                  크몽·숨고 동일 3단 정찰제 가격 패키지
                </h2>
                <p className="mt-3 text-sm text-slate-300 sm:text-base">
                  상담 후 금액이 2~3배씩 뛰는 낚시성 견적은 일절 없습니다. 전 등급{" "}
                  <strong className="text-amber-300">월 임대료 0원 · 세금계산서 즉시 발행 · 원본 소스 100% 이관</strong>이 기본 포함됩니다.
                </p>
              </div>

              <div className="mt-12 grid gap-7 lg:grid-cols-3">
                {/* STANDARD */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-extrabold text-slate-300">
                        STANDARD
                      </span>
                      <span className="text-xs font-semibold text-slate-400">제작기간 3~5일</span>
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold text-white">실속 홍보·문의형 패키지</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      스타트업 · 소상공인 · 세무/컨설팅 빠른 브랜드 런칭 및 고객 문의 DB 확보용
                    </p>
                    <div className="mt-6 flex items-baseline gap-1 border-b border-slate-800 pb-6">
                      <span className="text-4xl font-black text-white">490,000</span>
                      <span className="text-sm font-bold text-slate-400">원 (VAT 별도)</span>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                        <span>PC · 태블릿 · 모바일 완벽 반응형 5페이지 구성</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                        <span>스팸방어 고객 상담·견적 문의폼 + 관리자 콘솔</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                        <span>포트폴리오 · 공지사항 게시판 CMS 무제한 등록</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                        <span>네이버 · 구글 검색엔진 최적화(SEO) 기본 세팅</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                        <span>월 고정 임대료 0원 &amp; 원본 소스코드 100% 제공</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/inquiries?plan=STANDARD"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 py-3.5 text-sm font-extrabold text-white transition hover:border-blue-500 hover:bg-blue-700"
                    >
                      이 패키지로 견적 문의 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* DELUXE (BEST) */}
                <div className="relative flex flex-col justify-between rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 p-8 shadow-2xl shadow-blue-900/40">
                  <div className="absolute -top-3.5 right-6 rounded-full bg-amber-400 px-3.5 py-1 text-[11px] font-black text-slate-950 shadow-sm">
                    BEST 인기 · 의뢰인 78% 선택
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-extrabold text-white">
                        DELUXE
                      </span>
                      <span className="text-xs font-semibold text-blue-300">제작기간 5~7일</span>
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold text-white">
                      비즈니스·자체예약·CMS 풀패키지
                    </h3>
                    <p className="mt-1 text-xs text-slate-300">
                      기업·인테리어·병의원·로펌·스튜디오를 위한 고전환 메인 + 예약 + 엑셀 DB 통합형
                    </p>
                    <div className="mt-6 flex items-baseline gap-1 border-b border-slate-800 pb-6">
                      <span className="text-4xl font-black text-amber-300">990,000</span>
                      <span className="text-sm font-bold text-slate-300">원 (VAT 별도)</span>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-slate-200">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                        <span className="font-bold text-white">STANDARD 전 기능 포함 + 맞춤 메인·서브 8~10P</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>하이브리드 예약 시스템 (1:1 단독 / N명 정원제 / 네이버예약)</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>문의·예약 고객 DB 원클릭 엑셀(.xlsx) 다운로드</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>고화질 사진 용량 자동 최적화 &amp; 고객 첨부파일 비공개 안전 보관</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>검색 제목·카톡 공유 이미지·브랜드 색상·메뉴 직접 설정 관리자 제공</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>도메인·보안인증서(SSL) 연결 및 네이버·구글 검색등록 대행</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/inquiries?plan=DELUXE"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-3.5 text-sm font-black text-slate-950 shadow-lg transition hover:bg-amber-300"
                    >
                      이 패키지로 견적 문의 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* PREMIUM */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-indigo-900/80 px-3 py-1 text-xs font-extrabold text-indigo-300 ring-1 ring-indigo-500/30">
                        PREMIUM
                      </span>
                      <span className="text-xs font-semibold text-slate-400">제작기간 7~14일</span>
                    </div>
                    <h3 className="mt-4 text-xl font-extrabold text-white">
                      기업 맞춤·정부지원·고급 확장형
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      초기창업패키지·정부지원사업 수행, 다국어, 알림톡/결제/외부 기능 맞춤 연동
                    </p>
                    <div className="mt-6 flex items-baseline gap-1 border-b border-slate-800 pb-6">
                      <span className="text-4xl font-black text-white">1,790,000</span>
                      <span className="text-sm font-bold text-slate-400">원~ (VAT 별도)</span>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span className="font-bold text-white">DELUXE 전 기능 포함 + 페이지·기능 맞춤 설계</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span>정부지원사업 필수 행정서류 (비교견적·과업지시·완료보고서) 완비</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span>대표 관리자 / 실무 담당자 등급별 권한 분리 및 작업 내역 기록</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span>카카오 알림톡 / 이메일 자동 알림 / 다국어(영·일·중) 선택 연동</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
                        <span>원클릭 서버 설치 패키지 제공 및 고객사 전용 클라우드 서버 구축 지원</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/inquiries?plan=PREMIUM"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 py-3.5 text-sm font-extrabold text-white transition hover:border-indigo-500 hover:bg-indigo-700"
                    >
                      이 패키지로 견적 문의 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 6: 5단계 안심 구축 프로세스 & 자주 묻는 질문 FAQ 아코디언 */}
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              {/* 5단계 안심 구축 프로세스 */}
              <div className="mx-auto max-w-3xl text-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-extrabold text-blue-800">
                  5-STEP PROCESS
                </span>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  처음 제작하셔도 막막하지 않은 5단계 안심 구축 프로세스
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  기획서나 원고가 완벽하지 않아도 괜찮습니다. 업종별 체크리스트로 알아서 정리해 드립니다.
                </p>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    step: "STEP 01",
                    title: "상담·체크리스트",
                    desc: "업종·예산·참고 사이트 파악 및 1페이지 간편 제작 체크리스트 전달",
                  },
                  {
                    step: "STEP 02",
                    title: "업종 맞춤 설계",
                    desc: "전환율 높은 소개 문구 다듬기 및 브랜드 색상·화면 구성 확정",
                  },
                  {
                    step: "STEP 03",
                    title: "반응형 웹·관리자 구축",
                    desc: "PC·모바일 반응형 제작 및 예약·문의폼·사진 자동 최적화 연동",
                  },
                  {
                    step: "STEP 04",
                    title: "검색등록·보안 적용",
                    desc: "도메인 연결, 보안인증서(SSL) 적용, 네이버·구글 검색 노출 등록",
                  },
                  {
                    step: "STEP 05",
                    title: "원본 납품·가이드북",
                    desc: "100% 원본 파일·데이터 이관, 쉬운 한글 관리자 가이드북 및 무상 A/S",
                  },
                ].map((item, idx) => (
                  <div
                    key={item.step}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-blue-800 px-2 py-0.5 text-[11px] font-extrabold text-white">
                        {item.step}
                      </span>
                      <span className="text-xs font-black text-slate-300">0{idx + 1}</span>
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-slate-900">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* 자주 묻는 질문 FAQ 5문 5답 아코디언 */}
              <div className="mx-auto mt-20 max-w-4xl">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-extrabold text-slate-700">
                    <HelpCircle className="h-3.5 w-3.5 text-blue-700" />
                    FREQUENTLY ASKED QUESTIONS
                  </span>
                  <h3 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                    의뢰인분들이 가장 자주 묻는 핵심 질문 5가지
                  </h3>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    {
                      q: "Q1. 일반 임대형 웹빌더나 구독형 플랫폼과 어떤 차이가 있나요?",
                      a: "일반 임대형 웹빌더나 구독형 노코드 플랫폼은 제작 후에도 매월 플랫폼 임대료나 기능 추가 비용이 지속적으로 발생하며, 플랫폼 정책에 따라 다른 서버로 이전이 제한될 수 있습니다. 반면 당사는 홈페이지를 100% 고객사 자체 소유 방식으로 제작하여 원본 파일과 데이터를 모두 귀사에 넘겨드리므로 제작사에 내시는 월 고정 임대료가 0원입니다.",
                    },
                    {
                      q: "Q2. 제작사 월 고정 임대료가 0원이면 실제 서버(호스팅) 비용은 어떻게 되나요?",
                      a: "당사에 내시는 월 관리비·임대료가 0원입니다! 실제 홈페이지가 운영되는 서버(클라우드 또는 웹호스팅)는 대표님 명의 계정으로 투명하게 연결해 드리며, 선택하시는 서버 사양에 따라 서버 제공사에 실비(월 약 5,000원~1만 원대 또는 사내 보유 서버 활용 시 0원)만 직접 납부하시면 됩니다.",
                    },
                    {
                      q: "Q3. 홈페이지에 들어갈 문구(원고)나 전문 사진이 없는데 제작이 가능한가요?",
                      a: "네, 전혀 걱정하지 마십시오! 업종별(기업·인테리어·병원·로펌·학원 등)로 검증된 맞춤형 한글 소개 문구 초안과 상업적 무료 고화질 라이선스 이미지를 기본 배치해 드립니다. 납품 후에도 관리자 화면에서 언제든 사진과 문구를 직접 교체하실 수 있습니다.",
                    },
                    {
                      q: "Q4. 사업자 전자세금계산서 발행과 정부지원사업(초기창업패키지 등) 서류 지원이 되나요?",
                      a: "100% 가능합니다. 전자세금계산서 즉시 발행은 물론, 정부지원사업·창업진흥원·소상공인 바우처 집행에 필수적인 비교견적서, 과업지시서, 완료보고서, 산출물 내역서, 검수조서를 원스톱으로 완벽하게 준비해 드립니다.",
                    },
                    {
                      q: "Q5. 납품 후 수정이나 유지보수는 어떻게 진행되나요?",
                      a: "최종 납품일로부터 1개월간 기능 점검 및 문구·배너 미세 조정을 무상으로 책임 보증합니다. 또한 공지사항, 포트폴리오, 예약 시간표, 검색 노출 제목, 카톡 공유 썸네일, 브랜드 색상, 하단 사업자 정보는 제공해 드리는 관리자 화면에서 평생 무료로 직접 수정하실 수 있습니다.",
                    },
                  ].map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={faq.q}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                        >
                          <span className="text-sm font-extrabold text-slate-900 sm:text-base">
                            {faq.q}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                              isOpen ? "rotate-180 text-blue-700" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 7: 최신 공지사항 테이블 프리뷰 & 하단 즉시 상담/예약 배너 */}
          <section className="border-t border-slate-200 bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid gap-10 lg:grid-cols-12">
                {/* 좌측 7컬럼: 최신 공지사항 테이블 프리뷰 */}
                <div className="min-w-0 lg:col-span-7">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-blue-700">NOTICE &amp; NEWS</span>
                      <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                        정찰제 안내 및 최신 기술 공지사항
                      </h2>
                    </div>
                    <Link
                      href="/notices"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-blue-600 hover:text-blue-700"
                    >
                      전체보기 <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
                    {notices.slice(0, 5).map((n) => (
                      <Link
                        key={n.id}
                        href={`/notices?slug=${encodeURIComponent(n.slug)}`}
                        className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-blue-50/40"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          {n.isPinned ? (
                            <span className="shrink-0 rounded-md bg-blue-800 px-2 py-0.5 text-[11px] font-extrabold text-white">
                              필독
                            </span>
                          ) : (
                            <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                              안내
                            </span>
                          )}
                          <span className="truncate text-xs font-bold text-slate-900 sm:text-sm">
                            {n.title}
                          </span>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 우측 5컬럼: 즉시 상담/예약 & CMS 체험 배너 */}
                <div className="flex min-w-0 flex-col justify-between rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-6 text-white shadow-xl sm:p-8 lg:col-span-5">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-extrabold text-amber-300">
                      <Sparkles className="h-3.5 w-3.5" />
                      FREE CONSULTATION
                    </span>
                    <h3 className="mt-4 text-2xl font-black leading-snug">
                      우리 회사에 딱 맞는 홈페이지,
                      <br />
                      30초 만에 무료 견적을 받아보세요.
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-blue-100 sm:text-sm">
                      불필요한 영업 전화 없이 남겨주신 요구사항을 분석하여 당일 내 정확한 정찰제 견적서와
                      업종 맞춤 샘플 링크를 보내드립니다.
                    </p>
                  </div>

                  <div className="mt-8 space-y-2.5">
                    <Link
                      href="/inquiries"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-sm font-black text-slate-950 shadow-sm transition hover:bg-amber-300"
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                      30초 무료 제작 견적 신청하기
                    </Link>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        href="/reservations"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                      >
                        <CalendarCheck className="h-4 w-4 text-amber-300" />
                        1:1 상담 예약
                      </Link>
                      <Link
                        href="/admin/login"
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                      >
                        <LockKeyhole className="h-4 w-4 text-amber-300" />
                        관리자 1초 체험
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          [모드 1: CORP] 샘플 1: 한국형 기업·제조·인테리어·시공 홍보형 메인 데모
      ===================================================================== */}
      {activePreset === "CORP" && (
        <div className="bg-white">
          {/* 상단 샘플 안내 배너 */}
          <div className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-slate-900">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row sm:px-2">
              <p className="text-xs font-bold sm:text-sm">
                <span className="mr-2 rounded bg-amber-500 px-2 py-0.5 text-[11px] font-black text-slate-950">
                  SAMPLE 01
                </span>
                현재 <strong>[샘플 1: 기업·인테리어·제조 홍보형 (Standard/Deluxe)]</strong> 데모 화면을 보고 계십니다. 납품 시 귀사의 로고·색상·문구로 100% 맞춤 변경됩니다.
              </p>
              <button
                type="button"
                onClick={() => switchPreset("AGENCY")}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-extrabold text-white transition hover:bg-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-amber-300" />
                에이전시 본진으로 돌아가기
              </button>
            </div>
          </div>

          {/* 1. 중후한 다크 차콜&골드/블루 와이드 시공·기업 비주얼 히어로 + 우측 30초 빠른 무료 견적 계산 위젯 */}
          <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-24">
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/75" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12">
              {/* 좌측 기업 히어로 카피 */}
              <div className="min-w-0 lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-extrabold text-amber-300">
                  <Award className="h-3.5 w-3.5" />
                  PREMIUM SPACE &amp; ENGINEERING PARTNER
                </div>
                <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                  공간의 가치를 높이는 정밀 시공,
                  <br />
                  <span className="text-amber-400">다가올 스페이스 &amp; 엔지니어링</span>
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  상업 공간·기업 오피스·클린룸·특수 설비까지 15년 경력의 직영 기술진이 설계부터 시공,
                  3년 무상 책임 보증(A/S)까지 원스톱으로 완성합니다.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/inquiries?plan=DELUXE"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg transition hover:bg-amber-400"
                  >
                    무료 방문실측 및 견적 신청 <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xs transition hover:bg-white/20"
                  >
                    시공·납품 포트폴리오 보기
                  </Link>
                </div>
              </div>

              {/* 우측: 30초 빠른 무료 견적 계산·문의 위젯 */}
              <div className="min-w-0 rounded-3xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md sm:p-7 lg:col-span-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-amber-400" />
                    <h2 className="text-base font-extrabold text-white">
                      30초 빠른 무료 견적 계산기
                    </h2>
                  </div>
                  <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                    실시간 산출
                  </span>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300">1. 시공·발주 분야 선택</label>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {(
                        [
                          "상업·오피스 시공",
                          "주거·아파트 인테리어",
                          "제조·설비 발주",
                        ] as const
                      ).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCorpType(t)}
                          className={`rounded-xl border px-2 py-2.5 text-center font-bold transition ${
                            corpType === t
                              ? "border-amber-400 bg-amber-400/20 text-amber-300"
                              : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-300">2. 예상 면적 (평수)</label>
                      <span className="text-sm font-black text-amber-400">
                        {corpArea}평 ({Math.round(corpArea * 3.3)}㎡)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={150}
                      step={5}
                      value={corpArea}
                      onChange={(e) => setCorpArea(Number(e.target.value))}
                      className="mt-2 w-full accent-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300">3. 마감재·사양 등급</label>
                    <div className="mt-2 grid grid-cols-3 gap-1.5">
                      {(["실속 스탠다드", "비즈니스 프리미엄", "하이엔드 VIP"] as const).map(
                        (g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setCorpGrade(g)}
                            className={`rounded-xl border px-2 py-2 text-center font-bold transition ${
                              corpGrade === g
                                ? "border-amber-400 bg-amber-400/20 text-amber-300"
                                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600"
                            }`}
                          >
                            {g}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-400/30 bg-slate-950 p-4">
                    <p className="text-[11px] font-semibold text-slate-400">
                      AI 예상 시공·발주 견적 범위 (VAT 별도)
                    </p>
                    <p className="mt-1 text-xl font-black text-amber-300 sm:text-2xl">
                      약 {estimatedCorpPrice.min.toLocaleString()}만 원 ~{" "}
                      {estimatedCorpPrice.max.toLocaleString()}만 원
                    </p>
                  </div>

                  <Link
                    href={`/inquiries?type=${encodeURIComponent(corpType)}&area=${corpArea}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-black text-slate-950 transition hover:bg-amber-400"
                  >
                    이 조건으로 상세 견적서 받기 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 기업 핵심 실적 숫자 카운터 */}
          <section className="border-b border-slate-200 bg-slate-900 py-10 text-white">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center sm:px-6 lg:grid-cols-4">
              <div>
                <p className="text-3xl font-black text-amber-400 sm:text-4xl">1,280건+</p>
                <p className="mt-1 text-xs font-bold text-slate-300">누적 시공·납품 완료 실적</p>
              </div>
              <div>
                <p className="text-3xl font-black text-amber-400 sm:text-4xl">99.2%</p>
                <p className="mt-1 text-xs font-bold text-slate-300">준공 후 고객 만족도 및 재의뢰율</p>
              </div>
              <div>
                <p className="text-3xl font-black text-amber-400 sm:text-4xl">24건</p>
                <p className="mt-1 text-xs font-bold text-slate-300">보유 특허·실내건축 면허·ISO 인증</p>
              </div>
              <div>
                <p className="text-3xl font-black text-amber-400 sm:text-4xl">3년 보증</p>
                <p className="mt-1 text-xs font-bold text-slate-300">하자보수이행증권 발행 및 책임 A/S</p>
              </div>
            </div>
          </section>

          {/* 3. 4대 핵심 사업 영역 (고화질 이미지 타일 그리드) */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="text-center">
                <span className="text-xs font-extrabold tracking-widest text-amber-600 uppercase">
                  BUSINESS AREAS
                </span>
                <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  4대 핵심 시공·엔지니어링 사업 영역
                </h2>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "기업 오피스·사옥 구축",
                    desc: "IT·스타트업·중견기업 맞춤형 스마트 오피스 및 임원실·회의실 특화 시공",
                    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    title: "상업 공간·쇼룸·클리닉",
                    desc: "브랜드 아이덴티티를 극대화하는 플래그십 스토어, 병의원, 프리미엄 학원 인테리어",
                    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    title: "제조 클린룸·연구시설 설비",
                    desc: "정밀 제조라인, 바이오 연구소, 항온항습 공조 및 산업 안전 규격 완벽 준수",
                    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
                  },
                  {
                    title: "리모델링·외장 파사드 특화",
                    desc: "노후 빌딩 가치 상승(Value-up)을 위한 내·외장 전면 리모델링 및 에너지 효율화",
                    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
                  },
                ].map((area) => (
                  <div
                    key={area.title}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-lg"
                  >
                    <div className="h-44 overflow-hidden bg-slate-100">
                      <img
                        src={area.img}
                        alt={area.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-extrabold text-slate-900">{area.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">{area.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. 최근 시공·납품 포트폴리오 갤러리 & 고객 후기 */}
          <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xs font-extrabold text-amber-600">RECENT PROJECTS</span>
                  <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                    최근 시공·납품 완료 포트폴리오 &amp; 고객사 평판
                  </h2>
                </div>
                <Link
                  href="/portfolio"
                  className="text-xs font-extrabold text-blue-800 hover:underline"
                >
                  전체 포트폴리오 보기 →
                </Link>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {parsedPortfolios.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs"
                  >
                    {p.thumbnailUrl && (
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-5">
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                        {p.industry}
                      </span>
                      <h3 className="mt-2 font-extrabold text-slate-900">{p.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-600">{p.summary}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 고객 후기 2단 */}
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-2 text-xs font-bold text-slate-700">
                      강남 테헤란로 IT 기업 사옥 120평 시공
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    “홈페이지의 30초 견적 계산기로 예산을 먼저 가늠해 보고 상담을 신청했는데, 실제 실측 견적도
                    거의 차이가 없어 신뢰가 갔습니다. 납기일도 정확히 맞춰주셨습니다.”
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-2 text-xs font-bold text-slate-700">
                      판교 반도체 정밀장비 클린룸 납품
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    “전담 소장님이 매일 공정 사진을 공유해 주시고, 세금계산서와 하자보수증권까지 당일 처리해 주셔서
                    내부 품의가 정말 수월했습니다.”
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. 한국형 오시는 길 & 하단 즉시 견적 문의 CTA */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <span className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-extrabold text-amber-300">
                    LOCATION &amp; CONTACT
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">
                    본사 쇼룸 및 제1공장 오시는 길 안내
                  </h2>
                  <div className="space-y-2.5 text-xs text-slate-700 sm:text-sm">
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span>
                        <strong>본사 쇼룸:</strong> 서울특별시 강남구 테헤란로 152 강남파이낸스센터 18층
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Train className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span>
                        <strong>지하철·주차:</strong> 2호선 역삼역 2번 출구 직결 / 방문 고객 지하주차장 2시간 무료 지원
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <span>
                        <strong>대표전화:</strong> 02-558-7942 (평일 09:00~18:30 / 토요일 사전예약제 실측 가능)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center rounded-2xl bg-slate-950 p-6 text-white lg:col-span-5">
                  <h3 className="text-lg font-extrabold text-amber-300">
                    이런 기업·시공형 홈페이지가 필요하신가요?
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    지금 보고 계신 [샘플 1: 기업·시공형] 디자인과 30초 견적 계산기, 포트폴리오 CMS를 귀사 브랜드에 맞춰 5일 만에 구축해 드립니다.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    <Link
                      href="/inquiries?sample=CORP"
                      className="flex-1 rounded-xl bg-amber-400 px-4 py-3 text-center text-xs font-black text-slate-950 transition hover:bg-amber-300"
                    >
                      이 샘플 스타일로 제작 문의하기
                    </Link>
                    <button
                      type="button"
                      onClick={() => switchPreset("AGENCY")}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-bold text-white hover:bg-slate-700"
                    >
                      ← 에이전시 홈
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* =====================================================================
          [모드 2: CLINIC] 샘플 2: 한국형 병의원·로펌/세무·스튜디오 예약형 메인 데모
      ===================================================================== */}
      {activePreset === "CLINIC" && (
        <div className="bg-white">
          {/* 상단 샘플 안내 배너 */}
          <div className="border-b border-teal-300 bg-teal-50 px-4 py-3 text-slate-900">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row sm:px-2">
              <p className="text-xs font-bold sm:text-sm">
                <span className="mr-2 rounded bg-teal-600 px-2 py-0.5 text-[11px] font-black text-white">
                  SAMPLE 02
                </span>
                현재 <strong>[샘플 2: 병의원·로펌·세무·스튜디오 예약형 (Deluxe/Pro)]</strong> 데모 화면을 보고 계십니다.
              </p>
              <button
                type="button"
                onClick={() => switchPreset("AGENCY")}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-extrabold text-white transition hover:bg-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5 text-teal-300" />
                에이전시 본진으로 돌아가기
              </button>
            </div>
          </div>

          {/* 1. 신뢰감 있는 메디컬/전문직 히어로 배너 + 하단 플로팅 실시간 빠른 예약 & 네이버 예약 바 */}
          <section className="relative bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 pt-16 pb-24 text-white sm:pt-20 sm:pb-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-500/15 px-3.5 py-1 text-xs font-extrabold text-teal-200">
                    <Stethoscope className="h-3.5 w-3.5" />
                    UNIVERSITY HOSPITAL SPECIALIST CLINIC &amp; ADVISORY
                  </span>
                  <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                    대학병원 교수진 출신의 정밀 진단,
                    <br />
                    <span className="text-teal-300">연세송 프리미엄 클리닉 &amp; 센터</span>
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                    복잡한 대기 없이 모바일로 원하는 시간대를 지정하는 1:1 사전예약제와 네이버 스마트플레이스
                    동시 연동으로 환자·의뢰인 한 분 한 분께 깊이 있는 진료를 약속합니다.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href="/reservations"
                      className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg transition hover:bg-teal-400"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      시간대별 온라인 예약하기
                    </Link>
                    <a
                      href={naverBookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#03C75A] px-6 py-3.5 text-sm font-black text-white shadow-lg transition hover:opacity-95"
                    >
                      <span>N 네이버 예약 바로가기</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-3xl border border-teal-400/30 bg-white/10 p-3 backdrop-blur-md">
                    <img
                      src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80"
                      alt="프리미엄 클리닉 내부"
                      className="h-64 w-full rounded-2xl object-cover sm:h-72"
                    />
                  </div>
                </div>
              </div>

              {/* 히어로 하단 플로팅 ‘실시간 빠른 예약 & 네이버 예약 바로가기 바’ */}
              <div className="mt-10 rounded-3xl border border-teal-200 bg-white p-5 text-slate-900 shadow-2xl sm:p-6">
                <div className="grid items-center gap-4 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <span className="text-[11px] font-extrabold text-teal-700">
                      QUICK RESERVATION
                    </span>
                    <p className="text-base font-black text-slate-900">
                      실시간 빠른 진료·상담 예약
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">
                        진료·상담 분야 선택
                      </label>
                      <select
                        value={clinicDept}
                        onChange={(e) => setClinicDept(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800"
                      >
                        <option>건강검진·내과 클리닉</option>
                        <option>수면 위·대장 내시경 센터</option>
                        <option>만성질환·초음파 정밀진단</option>
                        <option>1:1 프라이빗 VIP 상담</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500">
                        희망 시간대 (실시간 잔여석)
                      </label>
                      <select
                        value={clinicTime}
                        onChange={(e) => setClinicTime(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800"
                      >
                        <option>오전 10:30 (잔여 1석)</option>
                        <option>오전 11:30 (잔여 2석)</option>
                        <option>오후 02:30 (잔여 1석)</option>
                        <option>오후 04:00 (잔여 3석)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 md:col-span-4">
                    <Link
                      href="/reservations"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-3 text-xs font-black text-white transition hover:bg-teal-800"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      홈페이지 즉시 예약
                    </Link>
                    <a
                      href={naverBookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1 rounded-xl bg-[#03C75A] px-4 py-3 text-xs font-black text-white transition hover:opacity-90"
                    >
                      N 네이버 예약
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 주요 진료·자문·프로그램 과목 4단 아이콘 카드 */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="text-center">
                <span className="text-xs font-extrabold tracking-wider text-teal-700 uppercase">
                  SPECIALIZED CARE &amp; PROGRAMS
                </span>
                <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  분야별 특화 클리닉 · 전문 프로그램 안내
                </h2>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    badge: "CENTER 01",
                    title: "공단·종합 건강검진 센터",
                    desc: "대학병원급 고해상도 내시경 및 초음파 장비로 당일 용종절제까지 원스톱 시행",
                  },
                  {
                    badge: "CENTER 02",
                    title: "소화기·간·내분비 클리닉",
                    desc: "당뇨·고혈압·고지혈증·갑상선 질환의 체계적인 수치 관리와 1:1 맞춤 처방",
                  },
                  {
                    badge: "CENTER 03",
                    title: "수액·면역·항노화 클리닉",
                    desc: "독립된 1인 프라이빗 회복실에서 편안하게 받는 맞춤 영양수액 및 면역 케어",
                  },
                  {
                    badge: "CENTER 04",
                    title: "기업검진·전문 자문 프로그램",
                    desc: "임직원 단체 검진 및 전담 코디네이터 배정을 통한 신속한 결과 리포트 제공",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 transition hover:border-teal-500 hover:bg-white hover:shadow-md"
                  >
                    <span className="rounded-lg bg-teal-100 px-2.5 py-1 text-[11px] font-extrabold text-teal-800">
                      {c.badge}
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold text-slate-900">{c.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. 대표 원장 / 수석 변호사·세무사 프로필 및 약력 소개 섹션 */}
          <section className="border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                      alt="대표원장 프로필"
                      className="h-80 w-full rounded-2xl object-cover object-top"
                    />
                  </div>
                </div>

                <div className="space-y-5 lg:col-span-7">
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-extrabold text-teal-900">
                    REPRESENTATIVE DIRECTOR PROFILE
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 sm:text-4xl">
                    송 태 현 대표원장 <span className="text-lg font-bold text-teal-700">| 내과 전문의 · 의학박사</span>
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600">
                    “정확한 진단이 가장 빠른 치료입니다. 과잉 진료 없이 가족을 진료하는 마음으로 환자분의 평생 주치의가 되어 드리겠습니다.”
                  </p>

                  <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-xs text-slate-700 sm:grid-cols-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900">주요 학력 및 경력</h3>
                      <ul className="mt-2.5 space-y-1.5">
                        <li>· 연세대학교 의과대학 졸업 및 동 대학원 의학박사</li>
                        <li>· 세브란스병원 내과 전문의 수료 및 외래교수</li>
                        <li>· 대한소화기내시경학회 세부전문의</li>
                        <li>· 전) 강남세브란스 건강증진센터 진료교수</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900">학회 활동 및 인증</h3>
                      <ul className="mt-2.5 space-y-1.5">
                        <li>· 대한내과학회 정회원 / 평생회원</li>
                        <li>· 대한임상초음파학회 인증의</li>
                        <li>· 위·대장 내시경 누적 35,000례 이상 집도</li>
                        <li>· 보건복지부 지정 우수 건강검진기관 총괄원장</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 한국 원장님·전문직 필수 섹션: 진료·상담 운영시간표 + 오시는 길 및 주차 안내 2단 박스 */}
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* 좌측: 진료·상담 운영시간표 */}
                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs sm:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-teal-700">OFFICE HOURS</span>
                      <h3 className="mt-1 text-xl font-black text-slate-900">
                        진료 · 상담 운영시간표 한눈에 보기
                      </h3>
                    </div>
                    <Clock className="h-7 w-7 text-teal-600" />
                  </div>

                  <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs sm:text-sm">
                    <div className="flex items-center justify-between py-3">
                      <span className="font-bold text-slate-800">평일 (월·화·목·금)</span>
                      <span className="font-extrabold text-slate-900">오전 09:00 ~ 오후 06:30</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="flex items-center gap-2 font-bold text-teal-800">
                        수요일 야간진료
                        <span className="rounded bg-teal-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                          야간
                        </span>
                      </span>
                      <span className="font-extrabold text-teal-800">오전 09:00 ~ 오후 08:30</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-bold text-slate-800">토요일 진료 (점심시간 없음)</span>
                      <span className="font-extrabold text-slate-900">오전 09:00 ~ 오후 02:00</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-bold text-slate-600">점심시간 (평일)</span>
                      <span className="font-semibold text-slate-600">오후 01:00 ~ 오후 02:00</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="font-bold text-rose-600">일요일 · 공휴일</span>
                      <span className="font-bold text-rose-600">정기 휴진 (온라인 예약 24시 가능)</span>
                    </div>
                  </div>
                </div>

                {/* 우측: 오시는 길 및 주차 안내 */}
                <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-7 shadow-xs sm:p-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold text-teal-700">
                          DIRECTIONS &amp; PARKING
                        </span>
                        <h3 className="mt-1 text-xl font-black text-slate-900">
                          오시는 길 및 건물 내 무료 주차 안내
                        </h3>
                      </div>
                      <MapPin className="h-7 w-7 text-teal-600" />
                    </div>

                    <div className="mt-6 space-y-3 text-xs text-slate-700 sm:text-sm">
                      <p className="rounded-xl bg-slate-50 p-3.5 font-semibold">
                        📍 <strong>주소:</strong> 서울특별시 강남구 테헤란로 152 메디컬타워 4층 (역삼역 2번 출구 도보 1분)
                      </p>
                      <p className="rounded-xl bg-slate-50 p-3.5">
                        🚗 <strong>주차 안내:</strong> 건물 지하 1~4층 대형 자주식 주차장 완비 (진료·검진 환자 최대 3시간 무료 주차 등록)
                      </p>
                      <p className="rounded-xl bg-slate-50 p-3.5">
                        ☎️ <strong>대표 예약·상담 전화:</strong>{" "}
                        <strong className="text-base font-black text-teal-800">02-558-7942</strong>
                      </p>
                    </div>
                  </div>

                  {/* 5. 온라인 시간대별 예약 바로가기 & 네이버 스마트플레이스 예약 버튼 병행 노출 */}
                  <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Link
                      href="/reservations"
                      className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 text-xs font-black text-white transition hover:bg-teal-800"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      온라인 시간대별 예약 (/reservations)
                    </Link>
                    <a
                      href={naverBookingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#03C75A] py-3.5 text-xs font-black text-white transition hover:opacity-90"
                    >
                      <span>N 네이버 스마트플레이스 예약</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

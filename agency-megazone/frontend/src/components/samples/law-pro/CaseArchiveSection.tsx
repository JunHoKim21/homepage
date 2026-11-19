"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import type { CmsContentItem } from "@/lib/api";

type CaseCategory =
  | "전체"
  | "성범죄"
  | "음주·교통"
  | "사기·횡령·배임"
  | "마약·폭행"
  | "기업형사";

type SpecificCategory = Exclude<CaseCategory, "전체">;
type ResultBadgeType = "불송치" | "혐의없음" | "집행유예";

interface CriminalCaseItem {
  id: string;
  caseCode: string;
  category: SpecificCategory;
  resultBadge: ResultBadgeType;
  title: string;
  authority: string;
  duration: string;
  overview: string;
  issues: string[];
  strategy: string[];
  outcome: string;
}

const CATEGORIES: CaseCategory[] = [
  "전체",
  "성범죄",
  "음주·교통",
  "사기·횡령·배임",
  "마약·폭행",
  "기업형사",
];

const FALLBACK_CRIMINAL_CASES: CriminalCaseItem[] = [
  {
    id: "fallback-1",
    caseCode: "CASE 01",
    category: "성범죄",
    resultBadge: "불송치",
    title:
      "지하철 내 카메라등이용촬영 혐의, 포렌식 정밀분석 및 촬영 각도 검증으로 경찰 불송치",
    authority: "서울강남경찰서",
    duration: "수사 개시 후 7주",
    overview:
      "퇴근길 지하철 객차 안에서 휴대전화를 들고 있던 의뢰인이 불법촬영 의심을 받아 현행범 임의동행 및 휴대전화 압수수색에 직면한 사안입니다.",
    issues: [
      "압수된 휴대전화 디지털 포렌식 참여 과정에서의 별건 탐색 차단 여부",
      "현장 CCTV 및 촬영 각도상 성적 욕망·수치심 유발 촬영 고의성 존재 여부",
      "신고인의 오인 가능성과 당시 메신저 사용 로그의 시간적 일치성 입증",
    ],
    strategy: [
      "포렌식 선별 절차에 형사전문변호사가 직접 입회하여 무관한 파일 압수를 원천 차단했습니다.",
      "통신사 기지국·메신저 타임스탬프와 지하철 객차 CCTV 프레임을 초 단위로 대조해 촬영 행위 자체가 없었음을 입증했습니다.",
      "첫 피의자 신문 전 모의 진술 시뮬레이션을 거쳐 일관된 진술 구조와 변호인 의견서를 제출했습니다.",
    ],
    outcome:
      "담당 수사기관은 객관적 포렌식 결과와 시간대 대조 자료를 전면 수용하여 범죄 혐의를 인정할 증거가 없다고 판단, 경찰 단계에서 최종 불송치(혐의없음) 결정을 내렸습니다.",
  },
  {
    id: "fallback-2",
    caseCode: "CASE 02",
    category: "음주·교통",
    resultBadge: "집행유예",
    title:
      "음주운전 3회 적발 및 인적피해 동반 사고, 체계적 양형 입증으로 실형 방어",
    authority: "서울중앙지방법원",
    duration: "기소 후 4개월",
    overview:
      "과거 2차례 음주운전 전력이 있는 상태에서 혈중알코올농도 0.132% 수치로 추돌 사고를 일으켜 특정범죄가중처벌법(위험운전치상)으로 불구속 기소되어 실형 선고가 유력했던 사안입니다.",
    issues: [
      "동종 전과 누적으로 인한 실형·법정구속 가능성 차단",
      "피해자 상해 정도(전치 3주)에 대한 신속하고 진정성 있는 원만 합의 도출",
      "재범 방지 의지를 객관적으로 증명할 실질적 생활환경 개선 자료 구성",
    ],
    strategy: [
      "초기 조사 직후 전담팀이 피해자 측과 적정 손해배상 합의를 완료하고 처벌불원서를 확보했습니다.",
      "차량 매각 증빙, 알코올 전문 치료 프로그램 이수 확인서, 가족 및 직장 탄원서를 체계적으로 편철했습니다.",
      "공판 과정에서 사고 직후 구호 조치 이행과 위험운전치상 성립 요건의 한계를 법리적으로 변론했습니다.",
    ],
    outcome:
      "재판부는 의뢰인의 실질적인 재범 차단 조치와 피해자와의 원만한 합의를 양형에 적극 반영하여 징역 1년 6개월에 집행유예 3년을 선고, 법정구속과 실형을 방어했습니다.",
  },
  {
    id: "fallback-3",
    caseCode: "CASE 03",
    category: "사기·횡령·배임",
    resultBadge: "혐의없음",
    title:
      "분양대행 투자금 12억 원 특경법 사기 피소, 기망 고의 부재 입증으로 검찰 혐의없음",
    authority: "서울동부지방검찰청",
    duration: "고소 접수 후 5개월",
    overview:
      "부동산 경기 침체로 시행 사업이 지연되자 투자자 6명이 의뢰인을 상대로 12억 원 상당의 특정경제범죄가중처벌법(사기) 및 업무상 횡령 혐의로 고소한 사안입니다.",
    issues: [
      "투자 약정 당시 사업 실현 가능성 및 의뢰인의 편취 범의(기망 행위) 존부",
      "유입된 투자금 12억 원의 실제 사업비 집행 내역과 사적 유용 여부 규명",
      "민사상 채무불이행 사안을 형사 사기로 확대 해석한 고소 논리 탄핵",
    ],
    strategy: [
      "회계 자문과 협업하여 최근 3년간 법인 계좌 자금 흐름 전체를 항목별로 재구성해 사적 유용이 없음을 소명했습니다.",
      "투자 계약 체결 전 고지된 리스크 설명서, 인허가 진행 공문, 시공사 협의 기록을 시간순으로 정리해 의견서에 첨부했습니다.",
      "검찰 보완수사 단계에서 대질신문에 동행하여 고소인 측 주장의 모순을 조목조목 반박했습니다.",
    ],
    outcome:
      "검찰은 사업 지연에 따른 민사상 분쟁일 뿐 기망의 고의나 자금 횡령 사실을 인정하기 어렵다고 판단하여, 특경법 사기 및 횡령 혐의 전부에 대해 최종 혐의없음(증거불충분) 불기소 처분을 내렸습니다.",
  },
  {
    id: "fallback-4",
    caseCode: "CASE 04",
    category: "마약·폭행",
    resultBadge: "불송치",
    title:
      "해외 직구 물품 내 금지성분 혼입 마약류관리법 위반 혐의, 고의성 부인 경찰 불송치",
    authority: "인천국제공항경찰단",
    duration: "압수수색 후 9주",
    overview:
      "해외 온라인 쇼핑몰에서 구매한 수면 보조 젤리 제품에 국내 향정신성의약품 성분이 포함되어 세관 적발 및 마약류 밀수입 혐의로 입건된 사안입니다.",
    issues: [
      "해외 합법 판매 제품의 성분표 확인 가능성 및 마약류 수입 고의성(미필적 고의) 여부",
      "간이시약 및 국립과학수사연구원 모발·소변 정밀감정 결과 대응",
      "초기 조사 시 불리한 추측성 진술 방지 및 결제·검색 이력 소명",
    ],
    strategy: [
      "해외 판매 페이지 원문과 성분 고지 누락 화면을 공증·번역해 의뢰인이 금지 성분을 인지할 수 없었음을 입증했습니다.",
      "휴대전화 검색 이력, 구매 후기 열람 기록, 일반 건강기능식품 동시 결제 내역을 제출해 일상적 소비 목적을 소명했습니다.",
      "국과수 정밀감정 전 음성 소견 확보와 함께 대법원 판례상 미필적 고의 불인정 법리를 의견서로 정리했습니다.",
    ],
    outcome:
      "수사기관은 의뢰인에게 마약류 밀수입의 고의가 인정되지 않으며 투약 정황도 전혀 없다고 판단하여 경찰 단계에서 최종 불송치 결정을 내렸습니다.",
  },
  {
    id: "fallback-5",
    caseCode: "CASE 05",
    category: "기업형사",
    resultBadge: "혐의없음",
    title:
      "중견 IT기업 핵심 인력 영업비밀 침해 및 업무상 배임 고소, 비밀관리성 탄핵 검찰 혐의없음",
    authority: "수원지방검찰청 성남지청",
    duration: "압수수색 후 6개월",
    overview:
      "동종 업계로 이직한 개발 본부장과 신규 법인 대표가 전 직장으로부터 부정경쟁방지법상 영업비밀 누설 및 업무상 배임 혐의로 고소되어 사무실 압수수색을 당한 사안입니다.",
    issues: [
      "고소 회사가 주장하는 소스코드·제안서의 비공지성 및 비밀관리성 요건 충족 여부",
      "신규 개발 산출물의 독자적 설계 근거와 기존 자료 활용 여부 검증",
      "퇴직 직전 사내 클라우드 접속 로그의 정당한 인수인계 업무 해당성",
    ],
    strategy: [
      "압수수색 당일 즉시 현장 입회하여 영장 범위를 벗어난 신규 프로젝트 파일의 무분별한 반출을 제한했습니다.",
      "전 직장의 접근권한 미분리·보안서약 미비 실태를 입증하여 법정 요건인 비밀관리성이 결여되었음을 탄핵했습니다.",
      "외부 기술 감정 의견서를 통해 신규 아키텍처의 독자적 개발 이력과 커밋 로그를 상세 소명했습니다.",
    ],
    outcome:
      "검찰은 고소 대상 자료의 영업비밀성 및 배임 고의를 모두 인정할 수 없다고 판단하여, 피의자 전원에게 최종 혐의없음 불기소 처분을 내렸습니다.",
  },
  {
    id: "fallback-6",
    caseCode: "CASE 06",
    category: "성범죄",
    resultBadge: "혐의없음",
    title:
      "직장 회식 후 준강제추행 고소 사건, CCTV 동선·사후 메신저 대조로 검찰 혐의없음",
    authority: "서울서부지방검찰청",
    duration: "수사 개시 후 4개월",
    overview:
      "부서 회식 이후 귀가 동행 과정에서 항거불능 상태의 동료를 추행했다는 고소가 접수되어 경찰 송치 직후 형사전담센터에 긴급 의뢰된 사안입니다.",
    issues: [
      "사건 당시 고소인의 심신상실·항거불능 상태 존재 여부",
      "고소인 진술과 골목·택시 승차 구간 CCTV 영상 간의 객관적 배치",
      "사건 익일 주고받은 일상적 메신저 대화 내용의 신빙성 평가",
    ],
    strategy: [
      "경찰 송치 기록을 즉시 열람·분석하고, 인근 상가 및 차량 블랙박스 증거보전 신청을 통해 고소인의 정상 보행·대화 장면을 확보했습니다.",
      "사건 직후 고소인이 먼저 보낸 감사 메시지와 업무 대화 내역을 시간대별로 정리해 진술 신빙성을 탄핵했습니다.",
      "검찰 보완수사 과정에서 핵심 모순점 7가지를 도표화한 의견서를 제출하고 담당 검사 면담을 진행했습니다.",
    ],
    outcome:
      "검찰은 고소인의 진술만으로 항거불능 상태 및 추행 사실을 인정하기 어렵다고 판단하여 최종 혐의없음(증거불충분) 처분을 확정했습니다.",
  },
];

const CRIMINAL_KEYWORDS = [
  "불송치",
  "혐의없음",
  "집행유예",
  "무죄",
  "기소유예",
  "성범죄",
  "음주",
  "사기",
  "횡령",
  "배임",
  "마약",
  "폭행",
  "기업형사",
  "압수수색",
  "구속영장",
  "특경법",
];

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function inferCategory(text: string): SpecificCategory {
  if (/성범죄|강제추행|카메라|준강간|통매음/.test(text)) return "성범죄";
  if (/음주|교통|도주치상|뺑소니/.test(text)) return "음주·교통";
  if (/사기|횡령|배임|특경법|투자금/.test(text)) return "사기·횡령·배임";
  if (/마약|폭행|상해|공무집행/.test(text)) return "마약·폭행";
  return "기업형사";
}

function inferBadge(text: string): ResultBadgeType {
  if (text.includes("불송치")) return "불송치";
  if (text.includes("집행유예")) return "집행유예";
  return "혐의없음";
}

function mapCmsToCases(cmsItems: CmsContentItem[]): CriminalCaseItem[] {
  const mapped: CriminalCaseItem[] = [];

  for (const item of cmsItems) {
    if (!item.isPublished) continue;
    let extra: Record<string, unknown> = {};
    try {
      extra = item.extraJson ? JSON.parse(item.extraJson) : {};
    } catch {
      extra = {};
    }

    // 에이전시 표준 제작 모델 폴백 항목 제외
    if (
      item.slug === "law-tax-consulting-model" ||
      extra.client === "표준 제작 모델"
    ) {
      continue;
    }

    const combinedText = `${item.title} ${item.summary ?? ""} ${String(extra.industry ?? "")} ${String(extra.caseCategory ?? "")}`;
    const isLawProTagged =
      extra.sampleSource === "law-pro" || Boolean(extra.resultBadge);
    const hasCriminalKeyword = CRIMINAL_KEYWORDS.some((kw) =>
      combinedText.includes(kw)
    );

    if (!isLawProTagged && !hasCriminalKeyword) {
      continue;
    }

    const rawCategory = String(extra.caseCategory ?? "");
    const validCategories: SpecificCategory[] = [
      "성범죄",
      "음주·교통",
      "사기·횡령·배임",
      "마약·폭행",
      "기업형사",
    ];
    const category: SpecificCategory = validCategories.includes(
      rawCategory as SpecificCategory
    )
      ? (rawCategory as SpecificCategory)
      : inferCategory(combinedText);

    const rawBadge = String(extra.resultBadge ?? "");
    const resultBadge: ResultBadgeType =
      rawBadge === "불송치" ||
      rawBadge === "혐의없음" ||
      rawBadge === "집행유예"
        ? rawBadge
        : inferBadge(combinedText);

    const plainBody = stripHtml(item.contentHtml);
    const overview =
      item.summary?.trim() ||
      plainBody.slice(0, 180) ||
      "법무법인 선율 형사전담센터가 초기 수사 단계부터 밀착 대응한 형사 해결 사례입니다.";

    mapped.push({
      id: `cms-${item.id}`,
      caseCode: `CMS ${String(item.id).padStart(2, "0")}`,
      category,
      resultBadge,
      title: item.title,
      authority:
        typeof extra.authority === "string" && extra.authority.trim()
          ? extra.authority
          : "관할 수사기관·법원",
      duration:
        typeof extra.period === "string" && extra.period.trim()
          ? extra.period
          : "전담팀 수행 완료",
      overview,
      issues: Array.isArray(extra.issues)
        ? extra.issues.map(String)
        : [
            "초기 수사 단계 사실관계 정리 및 법리적 구성요건 검토",
            "객관적 물증 확보와 진술 신빙성 검증",
          ],
      strategy: Array.isArray(extra.strategy)
        ? extra.strategy.map(String)
        : [
            "형사전담 변호사 조사 동행 및 단계별 변호인 의견서 제출",
            "사건 쟁점에 부합하는 증거 자료 및 양형·반증 패키지 구성",
          ],
      outcome:
        typeof extra.outcome === "string" && extra.outcome.trim()
          ? extra.outcome
          : plainBody || `${resultBadge} 처분을 이끌어내며 사건을 종결했습니다.`,
    });
  }

  return mapped;
}

function getBadgeStyle(badge: ResultBadgeType): string {
  if (badge === "불송치") {
    return "border border-[#0F2952] bg-[#0F2952] text-white";
  }
  if (badge === "혐의없음") {
    return "border border-[#111827] bg-[#111827] text-white";
  }
  return "border border-[#0F2952] bg-white text-[#0F2952]";
}

export default function CaseArchiveSection({
  cmsItems = [],
}: {
  cmsItems?: CmsContentItem[];
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<CaseCategory>("전체");
  const [activeCase, setActiveCase] = useState<CriminalCaseItem | null>(null);

  const allCases = useMemo(() => {
    const cmsMapped = mapCmsToCases(cmsItems);
    const seenTitles = new Set(cmsMapped.map((c) => c.title));
    const mergedFallbacks = FALLBACK_CRIMINAL_CASES.filter(
      (c) => !seenTitles.has(c.title)
    );
    return [...cmsMapped, ...mergedFallbacks];
  }, [cmsItems]);

  const filteredCases = useMemo(() => {
    if (selectedCategory === "전체") return allCases;
    return allCases.filter((item) => item.category === selectedCategory);
  }, [allCases, selectedCategory]);

  useEffect(() => {
    if (!activeCase) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCase(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCase]);

  function handleJumpToDiagnosis() {
    setActiveCase(null);
    const el = document.getElementById("diagnosis");
    el?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="cases"
      className="overflow-x-clip bg-[#F5F7FA] py-16 text-[#111827] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className="h-[2px] w-7 bg-[#0F2952]"
                aria-hidden="true"
              />
              <span className="text-xs font-bold tracking-[0.2em] text-[#0F2952]">
                CRIMINAL CASE ARCHIVE
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
              형사 해결·불송치 사례 아카이브
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            각 사건 카드를 클릭하시면 사건 개요, 수사·재판 핵심 쟁점, 법무법인
            선율의 대응 전략과 최종 처분 결과를 확인하실 수 있습니다.
          </p>
        </div>

        {/* 분야별 직각 탭 필터 */}
        <div
          className="mt-8 flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="형사 사례 분야 필터"
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            const count =
              category === "전체"
                ? allCases.length
                : allCases.filter((c) => c.category === category).length;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-none border px-3.5 py-2.5 text-xs font-bold transition-colors sm:px-4 sm:text-sm ${
                  isActive
                    ? "border-[#0F2952] bg-[#0F2952] text-white"
                    : "border-slate-200 bg-white text-[#111827] hover:border-[#0F2952] hover:text-[#0F2952]"
                }`}
              >
                <span>{category}</span>
                <span
                  className={`ml-1.5 text-[11px] font-semibold ${
                    isActive ? "text-white/75" : "text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2열/3열 직각 경계선 카드 리스트 */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveCase(item)}
              className="group flex min-w-0 flex-col justify-between rounded-none border border-slate-200 bg-white p-6 text-left transition-colors hover:border-[#0F2952] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2952]"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-none px-2.5 py-1 text-xs font-extrabold tracking-tight ${getBadgeStyle(
                      item.resultBadge
                    )}`}
                  >
                    {item.resultBadge}
                  </span>
                  <span className="text-[11px] font-bold tracking-[0.12em] text-slate-400">
                    {item.caseCode}
                  </span>
                </div>

                <div className="mt-4 text-xs font-bold text-[#0F2952]">
                  {item.category}
                </div>

                <h3 className="mt-2 text-base font-extrabold leading-snug tracking-tight text-[#111827] transition-colors group-hover:text-[#0F2952] sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {item.overview}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs">
                <span className="truncate font-medium text-slate-500">
                  {item.authority} · {item.duration}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 font-bold text-[#0F2952]">
                  <span>상세 보기</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 직각 사건 상세 모달 */}
      {activeCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/75 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-modal-title"
          onClick={() => setActiveCase(null)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-2xl flex-col rounded-none border border-slate-300 bg-white text-[#111827]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 상단 바 */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-[#F5F7FA] px-5 py-5 sm:px-7">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded-none px-2.5 py-1 text-xs font-extrabold ${getBadgeStyle(
                      activeCase.resultBadge
                    )}`}
                  >
                    {activeCase.resultBadge}
                  </span>
                  <span className="text-xs font-bold text-[#0F2952]">
                    {activeCase.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    | {activeCase.authority} · {activeCase.duration}
                  </span>
                </div>
                <h3
                  id="case-modal-title"
                  className="mt-3 text-lg font-extrabold leading-snug text-[#111827] sm:text-xl"
                >
                  {activeCase.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                aria-label="모달 닫기"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none border border-slate-300 bg-white text-[#111827] transition-colors hover:border-[#0F2952] hover:bg-[#0F2952] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
              {/* 1. 사건 개요 */}
              <div>
                <h4 className="text-xs font-extrabold tracking-[0.14em] text-[#0F2952]">
                  01. 사건 개요
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {activeCase.overview}
                </p>
              </div>

              {/* 2. 수사/재판 쟁점 */}
              <div className="border-t border-slate-200 pt-5">
                <h4 className="text-xs font-extrabold tracking-[0.14em] text-[#0F2952]">
                  02. 수사·재판 핵심 쟁점
                </h4>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                  {activeCase.issues.map((issue, idx) => (
                    <li key={issue} className="flex items-start gap-2.5">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center border border-slate-300 bg-[#F5F7FA] text-[11px] font-bold text-[#111827]">
                        {idx + 1}
                      </span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. 법무법인 선율의 대응 전략 */}
              <div className="border-t border-slate-200 pt-5">
                <h4 className="text-xs font-extrabold tracking-[0.14em] text-[#0F2952]">
                  03. 법무법인 선율의 대응 전략
                </h4>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-700">
                  {activeCase.strategy.map((point) => (
                    <li
                      key={point}
                      className="border-l-2 border-slate-300 pl-3.5"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. 최종 처분 결과 */}
              <div className="border-l-4 border-[#0F2952] bg-[#F5F7FA] p-5">
                <h4 className="text-xs font-extrabold tracking-[0.14em] text-[#0F2952]">
                  04. 최종 처분 결과
                </h4>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-[#111827]">
                  {activeCase.outcome}
                </p>
              </div>
            </div>

            {/* 모달 하단 액션 바 */}
            <div className="flex flex-col-reverse gap-2.5 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                className="rounded-none border border-slate-300 bg-white px-5 py-3 text-xs font-bold text-[#111827] transition-colors hover:border-[#0F2952] sm:text-sm"
              >
                목록으로 닫기
              </button>
              <button
                type="button"
                onClick={handleJumpToDiagnosis}
                className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0F2952] px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-[#111827] sm:text-sm"
              >
                <span>유사 사건 1분 자가진단 신청하기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

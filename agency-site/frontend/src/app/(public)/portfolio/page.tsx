"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Eye,
  Layers,
  Lock,
  MessageSquarePlus,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react";
import { fetchPublishedCms, type CmsContentItem } from "@/lib/api";

interface PortfolioExtra {
  industry?: string;
  client?: string;
  period?: string;
  plan?: "STANDARD" | "DELUXE" | "PREMIUM" | string;
  demoPreset?: "CORP" | "CLINIC" | "AGENCY" | string;
  tags?: string[];
}

const FALLBACK_PORTFOLIOS: CmsContentItem[] = [
  {
    id: 101,
    slug: "portfolio-b2b-tech",
    category: "PORTFOLIO",
    title: "[기업·IT솔루션] (주)엘씨테크놀로지 기업 홍보 및 글로벌 제품 카탈로그 구축",
    summary:
      "반도체·정밀부품 제조 기업의 신뢰도를 높이는 다크 네이비 톤앤매너와 제품 사양서(PDF) 다운로드, 실시간 B2B 견적 요청 시스템을 구축했습니다.",
    contentHtml:
      "<h3>프로젝트 개요</h3><p>기존 노후화된 기업 홈페이지를 초고속 검색 최적화 홈페이지와 전용 관리자 시스템으로 전면 개편하여 모바일 호환성과 구글·네이버 검색 노출 경쟁력을 크게 높였습니다.</p><h3>핵심 구축 기능</h3><ul><li>기업 연혁, 인증 현황, 주요 납품 실적 소개 페이지</li><li>관리자 화면에서 직접 제품 사진(자동 용량 최적화)과 PDF 카탈로그를 등록·수정하는 게시판</li><li>해외 바이어 및 국내 거래처 전용 자동 스팸 차단 B2B 견적 문의 폼</li></ul>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    extraJson: JSON.stringify({
      industry: "기업·시공",
      client: "(주)엘씨테크놀로지",
      period: "6일",
      plan: "DELUXE",
      demoPreset: "CORP",
      tags: ["반응형웹", "제품카탈로그", "검색최적화", "B2B견적문의"],
    }),
    viewCount: 142,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-10T09:00:00Z",
  },
  {
    id: 102,
    slug: "portfolio-interior-arch",
    category: "PORTFOLIO",
    title: "[인테리어·건축] 다가올 공간디자인 시공사례 갤러리 & 실시간 견적 문의 시스템",
    summary:
      "고화질 시공 포트폴리오 사진 수백 장을 화질 저하 없이 빠르게 불러오는 사진 자동 경량화 기능과 평수·예산별 맞춤 견적 폼을 적용했습니다.",
    contentHtml:
      "<h3>프로젝트 개요</h3><p>인테리어·건축 시공 업종의 특성상 고해상도 사진이 많아 일반 임대형 웹빌더 홈페이지에서 겪기 쉬운 사진 로딩 지연 문제를 깔끔하게 해결했습니다.</p><h3>핵심 구축 기능</h3><ul><li>주거·상업·오피스 공간별 필터링 포트폴리오 갤러리</li><li>원본 사진 업로드 시 PC·태블릿·스마트폰 화면에 맞춰 사진을 자동으로 경량화(WebP) 변환</li><li>희망 평수, 시공 예산, 입주 예정일을 선택해 접수하는 맞춤형 견적 상담 및 실시간 알림톡 연동</li></ul>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    extraJson: JSON.stringify({
      industry: "기업·시공",
      client: "다가올 공간디자인",
      period: "5일",
      plan: "STANDARD",
      demoPreset: "CORP",
      tags: ["시공갤러리", "사진자동경량화", "맞춤견적폼", "반응형웹"],
    }),
    viewCount: 118,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-14T09:00:00Z",
    updatedAt: "2026-02-14T09:00:00Z",
  },
  {
    id: 103,
    slug: "portfolio-medical-clinic",
    category: "PORTFOLIO",
    title: "[병의원·검진센터] 연세바른내과의원 진료 시간표·의료진 안내 및 온라인 진료 예약 구축",
    summary:
      "환자분들이 스마트폰에서 3번의 터치만으로 진료 과목과 원장님 일정을 확인하고 네이버 예약 또는 자체 1:1 예약을 선택할 수 있는 하이브리드 병원 홈페이지입니다.",
    contentHtml:
      "<h3>프로젝트 개요</h3><p>어르신부터 직장인까지 누구나 쉽게 진료 시간과 검진 프로그램을 확인하고 즉시 예약할 수 있도록 직관적인 화면 구성과 빠른 페이지 이동을 구현했습니다.</p><h3>핵심 구축 기능</h3><ul><li>의료진 약력, 진료 과목별 안내, 비급여 안내 공지 게시판</li><li>네이버 스마트플레이스 예약과 자체 1:1 시간대별 예약을 동시에 지원하는 하이브리드 예약 시스템</li><li>비회원도 이름과 연락처만으로 예약 접수가 가능한 간편 화면 구성</li></ul>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    extraJson: JSON.stringify({
      industry: "병의원·클리닉",
      client: "연세바른내과의원",
      period: "7일",
      plan: "DELUXE",
      demoPreset: "CLINIC",
      tags: ["병원홈페이지", "하이브리드예약", "의료진안내", "모바일최적화"],
    }),
    viewCount: 165,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-18T09:00:00Z",
    updatedAt: "2026-02-18T09:00:00Z",
  },
  {
    id: 104,
    slug: "portfolio-law-tax",
    category: "PORTFOLIO",
    title: "[로펌·세무·전문직] 법무법인 정의 분야별 변호사 소개 및 1:1 비밀 보장 상담 예약 시스템",
    summary:
      "민사·형사·기업법무 전담 변호사 프로필과 업무 사례를 체계적으로 전달하고, 1:1 단독 예약 모드로 의뢰인의 상담 프라이버시를 철저히 보호합니다.",
    contentHtml:
      "<h3>프로젝트 개요</h3><p>전문직 홈페이지에서 가장 중요한 신뢰감 있는 디자인과 철저한 개인정보 보호, 그리고 동시 접속 시에도 중복 예약을 원천 차단하는 1:1 상담 예약 달력을 구축했습니다.</p><h3>핵심 구축 기능</h3><ul><li>전담 변호사·세무사 프로필 및 주요 업무 사례 게시판</li><li>1:1 단독 예약 모드로 동일 시간대 중복 접수 완벽 방지</li><li>사건 관련 참고 서류(PDF, 사진)를 외부 노출이 차단된 비공개 보안 저장소에 안전하게 첨부</li></ul>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    extraJson: JSON.stringify({
      industry: "로펌·세무",
      client: "법무법인 정의",
      period: "6일",
      plan: "DELUXE",
      demoPreset: "CLINIC",
      tags: ["로펌·세무사", "1:1단독예약", "비공개파일첨부", "업무사례관리"],
    }),
    viewCount: 97,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-22T09:00:00Z",
    updatedAt: "2026-02-22T09:00:00Z",
  },
  {
    id: 105,
    slug: "portfolio-aesthetic-skin",
    category: "PORTFOLIO",
    title: "[피부과·뷰티] 청담엘레브 클리닉 프리미엄 시술 안내 및 네이버·자체 하이브리드 예약",
    summary:
      "감각적인 브랜드 색상 설정과 이벤트 안내 관리, 카카오톡·SNS 공유 대표 이미지 간편 설정을 통해 상담 전환율을 높인 클리닉 웹사이트입니다.",
    contentHtml:
      "<h3>프로젝트 개요</h3><p>매월 바뀌는 프로모션과 시술 안내를 개발자 도움 없이 병원 실장님이 관리자 화면에서 1분 만에 수정하고 즉시 홈페이지에 반영할 수 있도록 구축했습니다.</p><h3>핵심 구축 기능</h3><ul><li>관리자 화면에서 홈페이지 포인트 색상 및 카카오톡·SNS 공유 대표 이미지 실시간 변경</li><li>네이버 예약 연동과 자체 시술 상담 예약을 통합 제공하는 하이브리드 예약 기능</li><li>상담 문의 및 예약 내역 원클릭 엑셀(.xlsx) 다운로드로 고객 관리 지원</li></ul>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    extraJson: JSON.stringify({
      industry: "병의원·클리닉",
      client: "청담엘레브 클리닉",
      period: "7일",
      plan: "PREMIUM",
      demoPreset: "CLINIC",
      tags: ["피부과·클리닉", "브랜드색상변경", "엑셀다운로드", "이벤트관리"],
    }),
    viewCount: 134,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-25T09:00:00Z",
    updatedAt: "2026-02-25T09:00:00Z",
  },
  {
    id: 106,
    slug: "portfolio-studio-academy",
    category: "PORTFOLIO",
    title: "[스튜디오·아카데미] 뉴제스트 렌탈스튜디오 시간대별 정원제 공간 예약 구축",
    summary:
      "시간대별 최대 수용 인원을 설정하여 원데이 클래스와 공간 대관을 동시에 접수받고 잔여 좌석을 실시간으로 표시하는 예약 특화 홈페이지입니다.",
    contentHtml:
      "<h3>프로젝트 개요</h3><p>1:1 상담뿐만 아니라 시간대별 5~10명 정원제 수업이나 스튜디오 공간 대관을 운영하는 사업장을 위해 시간대별 다인원 정원제 예약 기능을 적용했습니다.</p><h3>핵심 구축 기능</h3><ul><li>관리자 설정 하나로 1:1 단독 예약 ↔ 시간대별 다인원 정원제 예약 즉시 전환</li><li>시간대별 잔여 좌석 실시간 표시 및 정원 마감 시 자동 신청 제한 처리</li><li>룸별·클래스별 시설 안내 및 자주 묻는 질문 게시판 제공</li></ul>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    extraJson: JSON.stringify({
      industry: "스튜디오·학원",
      client: "뉴제스트 스튜디오",
      period: "5일",
      plan: "DELUXE",
      demoPreset: "CLINIC",
      tags: ["정원제예약", "원데이클래스", "공간대관", "실시간잔여석"],
    }),
    viewCount: 89,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-28T09:00:00Z",
    updatedAt: "2026-02-28T09:00:00Z",
  },
];

const INDUSTRY_FILTERS = ["전체", "기업·시공", "병의원·클리닉", "로펌·세무", "스튜디오·학원"] as const;

function parseExtra(raw: string): PortfolioExtra {
  try {
    const parsed = JSON.parse(raw || "{}") as PortfolioExtra;
    return {
      industry: parsed.industry || "기업·시공",
      client: parsed.client || "구축 고객사",
      period: parsed.period || "5~7일",
      plan: parsed.plan || "DELUXE",
      demoPreset: parsed.demoPreset || "CORP",
      tags: Array.isArray(parsed.tags) ? parsed.tags : ["반응형웹", "검색최적화"],
    };
  } catch {
    return {
      industry: "기업·시공",
      client: "구축 고객사",
      period: "5~7일",
      plan: "DELUXE",
      demoPreset: "CORP",
      tags: ["반응형웹", "검색최적화"],
    };
  }
}

function getPlanBadgeStyle(plan?: string) {
  switch (plan) {
    case "PREMIUM":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "STANDARD":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
}

export default function PortfolioPage() {
  const [items, setItems] = useState<CmsContentItem[]>(FALLBACK_PORTFOLIOS);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("전체");
  const [activeModalItem, setActiveModalItem] = useState<CmsContentItem | null>(null);

  useEffect(() => {
    fetchPublishedCms("PORTFOLIO")
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setItems(res);
        }
      })
      .catch(() => {
        // 백엔드 오프라인 시 FALLBACK_PORTFOLIOS 6건 유지
      });
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedIndustry === "전체") return items;
    return items.filter((item) => {
      const extra = parseExtra(item.extraJson);
      return extra.industry === selectedIndustry;
    });
  }, [items, selectedIndustry]);

  return (
    <div className="overflow-x-hidden bg-slate-50 pb-20">
      {/* 1. 상단 타이틀 & 3대 실시간 쇼룸 배너 */}
      <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PORTFOLIO & LIVE SHOWROOM · 업종별 구축 사례 및 실시간 데모</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            구축 포트폴리오 & 실시간 샘플 쇼룸
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
            캡처 이미지만 보여주는 포트폴리오가 아닙니다. 아래 <strong>3대 라이브 쇼룸 버튼</strong>을 클릭해
            업종별 실제 작동 화면과 전용 관리자 콘솔을 직접 체험해 보세요.
          </p>

          {/* 3대 쇼룸 배너 */}
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Link
              href="/?preset=CORP"
              className="group flex flex-col justify-between rounded-2xl border-2 border-slate-200 bg-slate-900 p-5 text-white transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-300">
                    <Building2 className="h-3.5 w-3.5" />
                    LIVE SAMPLE 01
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-400" />
                </div>
                <h2 className="mt-3 text-base font-extrabold">
                  [샘플 1: 기업·시공형 메인 데모 바로보기]
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  B2B 제조·IT·인테리어·시공 업종에 최적화된 다크 네이비 기업 홍보 및 견적 수주형 메인 화면
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-400">
                <span>/?preset=CORP 즉시 전환하기</span>
                <span>→</span>
              </div>
            </Link>

            <Link
              href="/?preset=CLINIC"
              className="group flex flex-col justify-between rounded-2xl border-2 border-emerald-200 bg-emerald-950 p-5 text-white transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    <Stethoscope className="h-3.5 w-3.5" />
                    LIVE SAMPLE 02
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-emerald-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <h2 className="mt-3 text-base font-extrabold">
                  [샘플 2: 병의원·로펌 예약형 메인 데모 바로보기]
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-emerald-100/80">
                  병원·클리닉·법무법인·세무사·스튜디오를 위한 진료/상담 시간표 & 온라인 예약 특화 화면
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                <span>/?preset=CLINIC 즉시 전환하기</span>
                <span>→</span>
              </div>
            </Link>

            <Link
              href="/admin/login"
              className="group flex flex-col justify-between rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-blue-700 to-indigo-900 p-5 text-white transition hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-bold text-white">
                    <Lock className="h-3.5 w-3.5" />
                    LIVE SAMPLE 03
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-indigo-200 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </div>
                <h2 className="mt-3 text-base font-extrabold">
                  [샘플 3: 관리자 콘솔 1초 체험]
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-indigo-100">
                  비밀번호 입력 없이 원클릭으로 검색문구 설정, 예약 달력, 엑셀 다운로드를 직접 테스트하세요
                </p>
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                <span>/admin/login 1초 원클릭 입장</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. 업종별 카테고리 필터 & 6건 카드 그리드 */}
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_FILTERS.map((industry) => {
              const active = selectedIndustry === industry;
              const count =
                industry === "전체"
                  ? items.length
                  : items.filter((i) => parseExtra(i.extraJson).industry === industry).length;
              return (
                <button
                  key={industry}
                  type="button"
                  onClick={() => setSelectedIndustry(industry)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition sm:text-sm ${
                    active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{industry}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                      active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-xs font-medium text-slate-500">
            * 모든 포트폴리오는 <strong>월 고정 관리비 0원</strong> · <strong>100% 고객사 독립 소유</strong> 방식으로 구축되었습니다.
          </p>
        </div>

        {/* 포트폴리오 카드 그리드 */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const extra = parseExtra(item.extraJson);
            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                {/* 썸네일 영역 */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">
                      No Thumbnail
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-lg bg-slate-900/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-xs">
                      {extra.industry}
                    </span>
                    <span
                      className={`rounded-lg border px-2.5 py-1 text-xs font-extrabold ${getPlanBadgeStyle(
                        extra.plan
                      )}`}
                    >
                      {extra.plan} 패키지
                    </span>
                  </div>
                </div>

                {/* 본문 영역 */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    {/* 고객사명 & 제작 소요 기간 메타 */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-bold text-slate-700">고객사: {extra.client}</span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">
                        <CalendarClock className="h-3 w-3 text-blue-600" />
                        제작 {extra.period}
                      </span>
                    </div>

                    <h2 className="mt-2.5 line-clamp-2 text-base font-extrabold leading-snug text-slate-900">
                      {item.title}
                    </h2>

                    {item.summary && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
                        {item.summary}
                      </p>
                    )}

                    {/* 해시태그 */}
                    {extra.tags && extra.tags.length > 0 && (
                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {extra.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 하단 액션 버튼 2종 */}
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(item)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5 text-blue-600" />
                      <span>구축 상세보기</span>
                    </button>
                    <Link
                      href="/inquiries"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5" />
                      <span>이 스타일로 견적 문의하기</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 3. 포트폴리오 상세 모달 */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const extra = parseExtra(activeModalItem.extraJson);
              return (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">
                        {extra.industry}
                      </span>
                      <span
                        className={`rounded-lg border px-2.5 py-1 text-xs font-extrabold ${getPlanBadgeStyle(
                          extra.plan
                        )}`}
                      >
                        적용 패키지: {extra.plan}
                      </span>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        소요 기간: {extra.period}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(null)}
                      className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                    {activeModalItem.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    발주 고객사: {extra.client} · 구축 방식: 초고속 검색 최적화 홈페이지 + 전용 관리자 시스템 (Next.js · Spring Boot)
                  </p>

                  {activeModalItem.thumbnailUrl && (
                    <img
                      src={activeModalItem.thumbnailUrl}
                      alt={activeModalItem.title}
                      className="mt-4 h-56 w-full rounded-2xl object-cover"
                    />
                  )}

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    <p className="font-semibold text-slate-900">{activeModalItem.summary}</p>
                    {activeModalItem.contentHtml && (
                      <div
                        className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 [&_h3]:mt-3 [&_h3]:font-bold [&_h3]:text-slate-900 [&_li]:ml-4 [&_li]:list-disc"
                        dangerouslySetInnerHTML={{ __html: activeModalItem.contentHtml }}
                      />
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
                    <Link
                      href={extra.demoPreset === "CLINIC" ? "/?preset=CLINIC" : "/?preset=CORP"}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100"
                    >
                      <Layers className="h-4 w-4 text-blue-600" />
                      <span>
                        연관 샘플 데모 보기 (/?preset={extra.demoPreset || "CORP"})
                      </span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/inquiries"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>이 스타일로 견적 문의하기</span>
                      </Link>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

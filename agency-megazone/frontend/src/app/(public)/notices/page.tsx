"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Megaphone, Sparkles } from "lucide-react";
import type { CmsContentItem } from "@/lib/api";

interface NoticeItem {
  id: number;
  slug: string;
  categoryLabel: string;
  title: string;
  summary: string;
  body: string;
  isPinned: boolean;
  createdAt: string;
  viewCount: number;
}

const PACKAGES = [
  {
    name: "Standard",
    price: "69만 원",
    badge: "실속 원페이지형",
    desc: "반응형 원페이지(5~6섹션) + 5분 설문지 카피 초안 + 한글 관리자 + 맞춤 시안 1종(수정 2회) + 무상 A/S 1개월",
    highlight: false,
  },
  {
    name: "Deluxe",
    price: "129만 원",
    badge: "★ BEST 표준형",
    desc: "메인+서브 5~7P + 아카이브 DB + 1:1/네이버 예약 + 한글 관리자 + 맞춤 시안 1종(수정 3회) + 무상 A/S 2개월",
    highlight: true,
  },
  {
    name: "Premium",
    price: "219만 원",
    badge: "고도화 전담형",
    desc: "메인+서브 10P 내외 + 특화 모듈 1종 + 알림톡/PG/다국어 중 1종 + 맞춤 시안 1종(수정 5회) + 3개월 SLA",
    highlight: false,
  },
];

const FALLBACK_NOTICES: NoticeItem[] = [
  {
    id: 1,
    slug: "pricing-guide-2026",
    categoryLabel: "가격안내",
    title: "[필독] 2026년 투명 정찰제 패키지(69만/129만/219만) 및 제작 범위 안내",
    summary: "추가 비용 없는 100% 정찰제 제작 비용과 5분 설문지 기반 카피 초안 세팅 혜택을 안내해 드립니다.",
    body: "엘레브웹(eleveWeb)은 불투명한 추가 견적이나 매달 나가는 플랫폼 임대료 없이, 처음 안내해 드린 정찰제 금액 그대로 구축해 드립니다.\n\n• Standard (69만 원): 반응형 원페이지(5~6섹션) + 스팸차단 견적폼 + 5분 설문지 카피 초안 + 기본 한글 관리자 (맞춤 시안 1종·수정 2회 / 무상 A/S 1개월)\n• Deluxe (129만 원 · BEST): 메인 + 서브 5~7P 맞춤 UI + 업종별 아카이브 DB + 1:1/네이버 예약 연동 + 전체 한글 관리자 (맞춤 시안 1종·수정 3회 / 무상 A/S 2개월)\n• Premium (219만 원): 메인 + 서브 10P 내외 + 업종 특화 모듈 1종 + 알림톡/PG/다국어 중 1종 포함 (맞춤 시안 1종·수정 5회 / 무상 A/S 3개월 SLA)\n\n※ 자사 홈페이지 직계약은 VAT 별도(일반과세자 전자세금계산서 100% 발행)이며, 기본 카피라이팅 초안은 무료로 세팅해 드리나 업종별 법적 심의 및 최종 문구 검수 책임은 고객사에 있습니다.",
    isPinned: true,
    createdAt: "2026-03-01T09:00:00",
    viewCount: 1284,
  },
  {
    id: 2,
    slug: "ownership-policy",
    categoryLabel: "소유권",
    title: "제작 완료 후 도메인·디자인·데이터 100% 고객사 소유 이관 절차 안내",
    summary: "홈페이지 제작이 끝난 뒤 모든 권한과 원본 자산을 대표님 명의로 온전히 넘겨드립니다.",
    body: "많은 대표님들께서 홈페이지 제작 후 수정이나 이전을 할 때 권한 문제로 어려움을 겪으십니다.\n\n엘레브웹은 구축 완료 시점에 도메인 소유권, 관리자 최고 계정, 이미지 및 소스 코드 일체를 고객사 명의로 100% 이관해 드립니다. 향후 운영 중에도 타 업체 제약 없이 자유롭게 확장하실 수 있습니다.",
    isPinned: true,
    createdAt: "2026-02-20T10:30:00",
    viewCount: 942,
  },
  {
    id: 3,
    slug: "seo-naver-google",
    categoryLabel: "검색등록",
    title: "네이버 서치어드바이저 · 구글 서치콘솔 기본 등록 지원 안내",
    summary: "홈페이지 오픈과 동시에 네이버와 구글 검색 결과에 회사명이 노출되도록 세팅해 드립니다.",
    body: "홈페이지를 예쁘게 만드는 것만큼 검색 결과에 잘 나오는 것이 중요합니다.\n\n구축 과정에서 네이버 서치어드바이저와 구글 서치콘솔 인증 코드 연동, 사이트맵(sitemap.xml) 자동 생성, 카카오톡 공유 시 미리보기 이미지(OG 태그) 설정까지 기본으로 완료해 드립니다.",
    isPinned: false,
    createdAt: "2026-02-12T14:00:00",
    viewCount: 675,
  },
  {
    id: 4,
    slug: "tax-invoice-payment",
    categoryLabel: "결제·증빙",
    title: "전자세금계산서 발행, 법인카드 결제 및 정부지원사업 증빙 서류 안내",
    summary: "기업·병원·기관의 회계 처리에 필요한 모든 증빙 서류를 신속히 발급해 드립니다.",
    body: "일반과세자 정식 사업자로서 계약금 및 잔금 결제 시 전자세금계산서(영수/청구 선택 가능)를 즉시 발행해 드리며, 법인카드 및 계좌이체 결제를 지원합니다.\n\n견적서, 사업자등록증, 통장사본, 완료보고서 등 회사 내부 품의에 필요한 서류가 있으시면 상담 시 말씀해 주세요.",
    isPinned: false,
    createdAt: "2026-01-28T11:15:00",
    viewCount: 518,
  },
  {
    id: 5,
    slug: "warranty-and-support",
    categoryLabel: "유지보수",
    title: "패키지별 최대 3개월 무상 A/S 및 비개발자 대표님 대상 1:1 관리자 가이드 안내",
    summary: "홈페이지 오픈 이후에도 문구 수정이나 기능 오류가 없도록 무상 기술 지원을 제공합니다.",
    body: "홈페이지 오픈 직후 직원이 바뀌거나 문구를 고쳐야 할 때도 걱정하지 마세요.\n\n관리자 콘솔에서 클릭 몇 번으로 전화번호, 주소, 공지사항, 포트폴리오를 직접 바꾸실 수 있도록 가이드를 제공하며, 시스템 기능 오류에 대해서는 패키지에 따라 1~3개월간 무상 A/S를 보장합니다. (장애 접수 시 12시간 이내 우선 대응)",
    isPinned: false,
    createdAt: "2026-01-15T16:40:00",
    viewCount: 439,
  },
];

function mapCmsToNotice(item: CmsContentItem): NoticeItem {
  return {
    id: item.id,
    slug: item.slug || String(item.id),
    categoryLabel: item.isPinned ? "중요공지" : "안내",
    title: item.title,
    summary: item.summary || "",
    body: item.contentHtml
      ? item.contentHtml.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]*>/g, "")
      : item.summary || "상세 안내 내용이 등록되어 있습니다.",
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    viewCount: item.viewCount || 0,
  };
}

function NoticesContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  const [notices, setNotices] = useState<NoticeItem[]>(FALLBACK_NOTICES);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(slugParam || FALLBACK_NOTICES[0].slug);

  useEffect(() => {
    fetch("/api/v1/cms/NOTICE")
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { success?: boolean; data?: CmsContentItem[] } | null) => {
        if (json?.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped = json.data.map(mapCmsToNotice);
          setNotices(mapped);
          if (slugParam) {
            setExpandedSlug(slugParam);
          } else if (mapped[0]) {
            setExpandedSlug(mapped[0].slug);
          }
        }
      })
      .catch(() => {
        // 오프라인 시 기본 5건 폴백 유지
      });
  }, [slugParam]);

  useEffect(() => {
    if (slugParam) {
      setExpandedSlug(slugParam);
    }
  }, [slugParam]);

  function toggleNotice(slug: string) {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  }

  return (
    <div className="overflow-x-hidden bg-white">
      {/* 상단 다크 네이비/바이올렛 2단 컴팩트 배너 헤더 */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-10 text-white sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-blue-600/20" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
                <Megaphone className="h-3.5 w-3.5" />
                공지사항 · 정찰제 안내
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                투명한 정찰제 가격표와
                <br className="hidden sm:block" /> 주요 운영 공지사항을 확인하세요
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                숨겨진 추가 비용이나 매달 나가는 임대료 없이, 한 번의 합리적인 비용으로
                평생 소유하는 홈페이지 기준을 안내합니다.
              </p>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
                <div className="flex items-center justify-between gap-2 text-xs font-bold text-sky-300">
                  <span>정찰제 3종 패키지 한눈에 보기</span>
                  <span className="text-[11px] font-medium text-slate-400">월 임대료 0원</span>
                </div>
                <div className="mt-3 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span className="font-semibold text-slate-200">Standard (실속형)</span>
                    <span className="font-extrabold text-white">69만 원</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-sky-400/40 bg-sky-500/15 px-3 py-2">
                    <span className="font-semibold text-sky-200">Deluxe (표준형 · 추천)</span>
                    <span className="font-extrabold text-white">129만 원</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                    <span className="font-semibold text-slate-200">Premium (맞춤형)</span>
                    <span className="font-extrabold text-white">219만 원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 상단 3단 정찰제 패키지 요약 바 */}
      <section className="border-b border-slate-200 bg-slate-50 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">
              투명 정찰제 패키지 요약 (부가세 별도 · 월 임대료 0원)
            </h2>
            <Link
              href="/inquiries"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline sm:text-sm"
            >
              <span>맞춤 견적 바로 문의하기</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`min-w-0 rounded-2xl border p-5 transition ${
                  pkg.highlight
                    ? "border-sky-500 bg-[#0B0F19] text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-900 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold tracking-tight">{pkg.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      pkg.highlight
                        ? "bg-sky-500/20 text-sky-300"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {pkg.badge}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold">{pkg.price}</span>
                  <span
                    className={`text-xs ${
                      pkg.highlight ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    / 1회 구축 완납
                  </span>
                </div>
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    pkg.highlight ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {pkg.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600 shadow-2xs sm:px-5 sm:py-3.5">
            ※ 제작사 월 관리·임대료 0원 | 단, 도메인(연 약 2만 원)·독립 서버(월 1~2만 원대) 실비는 고객사 명의로 직접 결제·소유하며, 전자결제(PG) 연동 시 PG사 가맹 실비 및 Premium 연동 옵션이 적용됩니다.
          </div>
        </div>
      </section>

      {/* 한국형 번호 테이블 리스트 + 상세 본문 펼침 */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-extrabold text-slate-900">전체 공지사항</h2>
            <span className="text-xs text-slate-500">제목을 클릭하면 상세 내용이 펼쳐집니다</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                  <tr>
                    <th className="w-20 px-4 py-3.5 text-center">번호</th>
                    <th className="w-24 px-3 py-3.5 text-center">구분</th>
                    <th className="px-4 py-3.5">제목</th>
                    <th className="w-28 px-4 py-3.5 text-center">등록일</th>
                    <th className="w-20 px-4 py-3.5 text-center">조회</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {notices.map((notice, idx) => {
                    const isOpen = expandedSlug === notice.slug;
                    const rowNumber = notices.length - idx;
                    return (
                      <tr
                        key={notice.id}
                        onClick={() => toggleNotice(notice.slug)}
                        className={`cursor-pointer transition ${
                          isOpen ? "bg-sky-50/50" : "hover:bg-slate-50"
                        }`}
                      >
                        <td className="px-4 py-4 text-center">
                          {notice.isPinned ? (
                            <span className="inline-flex rounded-md bg-[#0B0F19] px-2 py-0.5 text-[11px] font-bold text-white">
                              공지
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-500">{rowNumber}</span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-center">
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                            {notice.categoryLabel}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-between gap-2 font-semibold text-slate-900">
                            <span className={isOpen ? "text-blue-700" : ""}>{notice.title}</span>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 shrink-0 text-blue-600" />
                            ) : (
                              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center text-xs text-slate-500">
                          {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                        </td>
                        <td className="px-4 py-4 text-center text-xs text-slate-500">
                          {notice.viewCount.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 선택된 공지 상세 본문 패널 */}
          {expandedSlug && (
            <div className="mt-6 rounded-2xl border border-sky-200 bg-slate-50 p-6 sm:p-8">
              {(() => {
                const current = notices.find((n) => n.slug === expandedSlug);
                if (!current) return null;
                return (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-600">
                          {current.categoryLabel}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          {new Date(current.createdAt).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedSlug(null)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        접기
                      </button>
                    </div>
                    <h3 className="mt-4 text-lg font-extrabold text-slate-900 sm:text-xl">
                      {current.title}
                    </h3>
                    {current.summary && (
                      <p className="mt-2 text-sm font-medium text-slate-600">{current.summary}</p>
                    )}
                    <div className="mt-4 whitespace-pre-line rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700">
                      {current.body}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>궁금한 점은 온라인 상담 문의를 통해 바로 확인하실 수 있습니다.</span>
                      </div>
                      <Link
                        href="/inquiries"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 sm:text-sm"
                      >
                        <span>상담 문의하기</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function NoticesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-sm text-slate-500">
          공지사항을 불러오는 중입니다...
        </div>
      }
    >
      <NoticesContent />
    </Suspense>
  );
}

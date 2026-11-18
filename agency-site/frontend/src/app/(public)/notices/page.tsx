"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Megaphone,
  MessageSquarePlus,
  Pin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { fetchPublishedCms, type CmsContentItem } from "@/lib/api";

const PRICING_SUMMARY = [
  {
    tier: "STANDARD",
    name: "Standard 홍보·문의형",
    price: "49만 원",
    desc: "기업·브랜드 소개(5P) + 무코드 SEO 설정 + 스팸방어 견적문의 폼 + CMS 게시판",
    badge: "합리적 시작",
    highlight: false,
  },
  {
    tier: "DELUXE",
    name: "Deluxe 예약·비즈니스형",
    price: "99만 원",
    desc: "Standard 전체 + 1:1·정원제 하이브리드 예약 달력 + 네이버예약 연동 + 엑셀 다운로드",
    badge: "BEST 가장 많은 선택",
    highlight: true,
  },
  {
    tier: "PREMIUM",
    name: "Premium 기업 맞춤·결제 확장형",
    price: "179만 원",
    desc: "Deluxe 전체 + 카카오·네이버 소셜로그인 + PG 예약금 결제 + 관리자 OTP·감사로그",
    badge: "엔터프라이즈",
    highlight: false,
  },
];

const FALLBACK_NOTICES: CmsContentItem[] = [
  {
    id: 201,
    slug: "notice-pricing-guide",
    category: "NOTICE",
    title: "[중요공지] 2026년 투명한 3단 정찰제(Standard 49만 / Deluxe 99만 / Premium 179만) 구축 범위 안내",
    summary:
      "부르는 게 값인 깜깜이 외주 견적 대신, 기능과 페이지 범위에 따른 합리적이고 투명한 3단 정찰제(49만 원 / 99만 원 / 179만 원)를 운영합니다.",
    contentHtml:
      "<h3>투명한 정찰제 홈페이지 구축 안내</h3><p>당사는 검증된 엔터프라이즈 모듈형 아키텍처를 기반으로 개발 기간과 단가를 획기적으로 낮추면서도, 저가형 템플릿과 차원이 다른 순수 독립형 웹(Next.js 15 + Spring Boot 3.4)을 납품합니다.</p><ul><li><strong>Standard (49만 원 · 홍보·문의형)</strong>: 반응형 기업·브랜드 소개(5P 내외), 무코드 SEO·브랜딩 관리자, 스팸 방어 견적문의 폼, 공지사항·포트폴리오 CMS 기본 제공</li><li><strong>Deluxe (99만 원 · 예약·비즈니스형 [인기])</strong>: Standard 전체 포함 + 업종별 맞춤 추가 입력 폼 + 하이브리드 예약 시스템(네이버 예약 & 자체 1:1·정원제 스케줄러) + 알림톡·이메일 발송 연동 + 문의·예약 엑셀(.xlsx) 다운로드</li><li><strong>Premium (179만 원 · 기업 맞춤·결제 확장형)</strong>: Deluxe 전체 포함 + 회원/소셜 로그인(카카오·네이버·구글) + PG 예약금·결제 상태 머신 + 관리자 2FA(Google OTP) 및 데이터 변경 감사 로그(Audit Log)</li></ul><p>모든 플랜은 <strong>월 고정 임대료 0원</strong>이며, 납품 완료 시 원본 소스코드와 DB 소유권을 100% 고객사에 이전해 드립니다.</p>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "중요공지" }),
    viewCount: 342,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-01T09:00:00Z",
  },
  {
    id: 202,
    slug: "notice-gov-voucher",
    category: "NOTICE",
    title: "[중요공지] 정부지원사업(초기창업패키지·소상공인 바우처) 전자세금계산서 및 비교견적서 당일 발행 안내",
    summary:
      "예비·초기창업패키지, 청년창업사관학교, 소상공인 디지털 전환 지원사업 등 정부지원금 집행에 필요한 모든 정식 증빙 서류를 신속히 지원합니다.",
    contentHtml:
      "<h3>정부지원사업 및 기업 법인 계약 완벽 지원</h3><p>정부지원사업이나 사내 품의를 통해 홈페이지를 구축하시는 대표님·담당자님을 위해 행정 절차에 필요한 서류를 당일 발급해 드립니다.</p><ul><li>정식 도장 날인 견적서 및 타사 대비 비교견적서 즉시 제공</li><li>사업자등록증, 통장사본, 국세·지방세 완납증명서 상시 구비</li><li>전자세금계산서 발행 및 법인카드·연구비카드 결제 지원</li><li>과업지시서(RFP) 맞춤형 기능 명세서 및 완료보고서 산출물 제공</li></ul><p>무료 견적문의 또는 1:1 상담예약을 남겨주시면 전담 엔지니어가 2시간 이내에 필요 서류와 일정을 안내해 드립니다.</p>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "중요공지" }),
    viewCount: 245,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-08T09:00:00Z",
    updatedAt: "2026-02-08T09:00:00Z",
  },
  {
    id: 203,
    slug: "notice-seo-aeo",
    category: "NOTICE",
    title: "[안내] 아임웹·노코드 빌더 대신 Next.js + Spring Boot 독립형 웹이 네이버·구글 SEO에 유리한 이유",
    summary:
      "검색 로봇과 AI 검색엔진(ChatGPT·Perplexity)이 가장 선호하는 서버사이드 렌더링(SSR) 및 시맨틱 HTML 구조의 차이를 설명해 드립니다.",
    contentHtml:
      "<h3>왜 열심히 만든 홈페이지가 검색에 잘 안 나올까요?</h3><p>임대형 노코드 웹빌더는 수만 개의 불필요한 중첩 태그와 무거운 자바스크립트 번들로 인해 초기 로딩 속도(LCP)가 느리고 검색 크롤러가 핵심 본문을 파악하기 어렵습니다.</p><h3>무코드 SEO + AEO 엔진의 차별점</h3><ul><li><strong>Next.js 15 서버사이드 렌더링(SSR)</strong>: 검색 로봇이 접속하는 즉시 완성된 HTML과 메타태그, OpenGraph 정보를 0.1초 내에 응답합니다.</li><li><strong>무코드 SEO 콘솔</strong>: 개발자 없이도 관리자 화면에서 페이지 타이틀, 설명문, 키워드, 네이버·구글 소유권 확인 태그, robots.txt를 직접 수정하고 즉시 반영할 수 있습니다.</li><li><strong>자동 사이트맵(sitemap.xml)</strong>: 새로 작성한 공지사항과 포트폴리오가 검색엔진에 빠르게 색인되도록 표준 규격을 기본 내장했습니다.</li></ul>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "안내" }),
    viewCount: 189,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-15T09:00:00Z",
  },
  {
    id: 204,
    slug: "notice-source-ownership",
    category: "NOTICE",
    title: "[안내] 월 고정 임대료 0원 보장 및 납품 후 원본 소스코드·DB 100% 고객사 이전 원칙",
    summary:
      "매달 3~5만 원씩 평생 빠져나가는 임대형 호스팅의 족쇄에서 벗어나, 기업 고유의 디지털 자산으로 영구 소유하실 수 있습니다.",
    contentHtml:
      "<h3>3년이면 180만 원, 아직도 홈페이지를 월세 내고 쓰시나요?</h3><p>많은 제작사가 초기 제작비를 저렴하게 미끼로 내세운 뒤, 매달 관리비·호스팅비 명목으로 고정 비용을 청구하고 타 업체 이전 시 소스코드를 절대 넘겨주지 않습니다.</p><h3>당사의 3대 클린 납품 원칙</h3><ol><li><strong>100% 라이선스 클린</strong>: 상업적 사용과 배포에 아무런 제약이 없는 검증된 오픈소스(Apache 2.0 / MIT / SIL OFL) 기술 스택만 사용합니다.</li><li><strong>원본 소스코드 및 Docker 올인원 패키지 제공</strong>: 프론트엔드, 백엔드, 데이터베이스 마이그레이션 스크립트 전체를 고객사 Git 저장소 또는 압축 패키지로 100% 인도합니다.</li><li><strong>단일 서버 초경량 구동</strong>: 월 5천 원~1만 원대 클라우드 VPS(2GB RAM) 한 대에서도 HTTPS 보안인증서(Caddy 자동 갱신)와 함께 거뜬히 운영됩니다.</li></ol>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "안내" }),
    viewCount: 176,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-20T09:00:00Z",
  },
  {
    id: 205,
    slug: "notice-webp-optimization",
    category: "NOTICE",
    title: "[안내] 고화질 사진 업로드 시 WebP 자동 다이어트 및 0.1초 캐시 즉시 갱신 엔진 기본 탑재",
    summary:
      "스마트폰이나 DSLR로 찍은 대용량 원본 사진을 그대로 올려도 서버가 알아서 용량을 75% 이상 줄인 고화질 WebP로 변환합니다.",
    contentHtml:
      "<h3>사진 용량 줄이느라 포토샵 켜실 필요가 없습니다</h3><p>고객사 담당자분들이 포트폴리오나 공지사항에 사진을 올릴 때 가장 불편해하시던 용량 초과 및 로딩 저하 문제를 기술적으로 해결했습니다.</p><ul><li><strong>Magic Bytes 보안 검사</strong>: 확장자만 바꾼 악성 스크립트나 위변조 파일을 바이트 단위로 즉시 차단합니다.</li><li><strong>3단 해상도 WebP 자동 생성</strong>: 원본 업로드 즉시 백그라운드에서 썸네일(360px), 모바일용(768px), 데스크톱 고화질(1920px) WebP 파일을 자동 생성합니다.</li><li><strong>0.1초 즉시 캐시 무효화</strong>: 관리자 화면에서 설정이나 글을 수정하면 방문객 화면에 새로고침 없이 즉시 반영됩니다.</li></ul>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "안내" }),
    viewCount: 154,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-26T09:00:00Z",
    updatedAt: "2026-02-26T09:00:00Z",
  },
];

function NoticesInner() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  const [notices, setNotices] = useState<CmsContentItem[]>(FALLBACK_NOTICES);
  const [selectedSlug, setSelectedSlug] = useState<string>(
    slugParam || FALLBACK_NOTICES[0].slug
  );

  useEffect(() => {
    fetchPublishedCms("NOTICE")
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setNotices(res);
          if (!slugParam) {
            setSelectedSlug(res[0].slug);
          }
        }
      })
      .catch(() => {
        // 백엔드 오프라인 시 FALLBACK_NOTICES 5건 유지
      });
  }, [slugParam]);

  useEffect(() => {
    if (slugParam) {
      setSelectedSlug(slugParam);
    }
  }, [slugParam]);

  const activeNotice = notices.find((n) => n.slug === selectedSlug) || notices[0];

  return (
    <div className="bg-slate-50 pb-20">
      {/* 1. 상단 타이틀 & 3단 정찰제 패키지 요약 바 */}
      <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
            <Megaphone className="h-3.5 w-3.5" />
            <span>TRANSPARENT PRICING & NOTICES · 투명한 정찰제 및 공식 안내</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            3단 정찰제 안내 & 공지사항
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
            부르는 게 값인 깜깜이 견적을 지양합니다. 구축 범위별 <strong>투명한 3단 정찰제</strong>와
            정부지원사업 증빙, 소스코드 100% 이전 정책을 확인하세요.
          </p>

          {/* 3단 정찰제 패키지 요약 바 (Standard 49만 / Deluxe 99만 / Premium 179만) */}
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm sm:p-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-extrabold">
                  2026 공식 3단 정찰제 패키지 요약 (Standard 49만 / Deluxe 99만 / Premium 179만)
                </span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                전 플랜 월 고정 관리·임대료 0원 · 부가세(VAT) 별도
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {PRICING_SUMMARY.map((plan) => (
                <div
                  key={plan.tier}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition ${
                    plan.highlight
                      ? "border-blue-400 bg-blue-950/80 ring-2 ring-blue-400/30"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold tracking-wider text-blue-300">
                        {plan.tier}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          plan.highlight
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <h2 className="text-base font-bold text-white">{plan.name}</h2>
                      <span className="text-2xl font-extrabold text-amber-300">{plan.price}</span>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-300">{plan.desc}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      소스코드 100% 이전
                    </span>
                    <Link
                      href="/inquiries"
                      className="font-bold text-blue-300 hover:text-white"
                    >
                      이 플랜으로 문의 →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 한국 기업 표준 테이블형 공지사항 리스트 & 상세 본문 뷰 */}
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-extrabold text-slate-900">
                공식 공지사항 및 자주 묻는 정책 안내 (총 {notices.length}건)
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              제목을 클릭하시면 하단에 상세 본문이 펼쳐집니다.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-xs font-bold text-slate-600">
                  <th className="w-20 px-4 py-3.5 text-center">번호</th>
                  <th className="w-28 px-4 py-3.5 text-center">분류</th>
                  <th className="px-4 py-3.5">제목</th>
                  <th className="w-32 px-4 py-3.5 text-center">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {notices.map((notice, idx) => {
                  const isSelected = selectedSlug === notice.slug;
                  const rowNumber = notices.length - idx;
                  const badgeLabel = notice.isPinned ? "중요공지" : "안내";

                  return (
                    <tr
                      key={notice.id}
                      onClick={() =>
                        setSelectedSlug((prev) => (prev === notice.slug ? "" : notice.slug))
                      }
                      className={`cursor-pointer transition ${
                        isSelected
                          ? "bg-blue-50/70"
                          : notice.isPinned
                          ? "bg-slate-50/60 hover:bg-slate-100/70"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                        {notice.isPinned ? (
                          <span className="inline-flex items-center justify-center rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">
                            <Pin className="mr-1 h-3 w-3 text-amber-400" />
                            공지
                          </span>
                        ) : (
                          String(rowNumber).padStart(2, "0")
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${
                            notice.isPinned
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {badgeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <Link
                            href={`/notices?slug=${encodeURIComponent(notice.slug)}`}
                            scroll={false}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSlug((prev) =>
                                prev === notice.slug ? "" : notice.slug
                              );
                            }}
                            className={`text-sm font-bold transition ${
                              isSelected ? "text-blue-700" : "text-slate-900 hover:text-blue-600"
                            }`}
                          >
                            {notice.title}
                          </Link>
                          {isSelected ? (
                            <ChevronUp className="h-4 w-4 shrink-0 text-blue-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                          )}
                        </div>
                        {notice.summary && (
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {notice.summary}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-medium text-slate-500">
                        {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 선택된 공지사항 본문 상세 영역 */}
        {activeNotice && selectedSlug && (
          <article className="mt-6 rounded-3xl border-2 border-blue-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                  {activeNotice.isPinned ? "중요공지 상세" : "공지·안내 상세"}
                </span>
                <span className="text-xs text-slate-500">
                  등록일: {new Date(activeNotice.createdAt).toLocaleDateString("ko-KR")} · 조회수{" "}
                  {activeNotice.viewCount}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400">?slug={activeNotice.slug}</span>
            </div>

            <h3 className="mt-4 text-xl font-extrabold text-slate-900 sm:text-2xl">
              {activeNotice.title}
            </h3>

            {activeNotice.summary && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-800">
                {activeNotice.summary}
              </div>
            )}

            {activeNotice.contentHtml && (
              <div
                className="mt-6 space-y-3 text-sm leading-relaxed text-slate-700 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-extrabold [&_h3]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_strong]:font-bold [&_strong]:text-slate-900"
                dangerouslySetInnerHTML={{ __html: activeNotice.contentHtml }}
              />
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>궁금하신 점은 무료 견적문의 또는 1:1 상담예약을 통해 즉시 확인하실 수 있습니다.</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/inquiries"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                  <span>맞춤 견적 문의하기</span>
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

export default function NoticesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-slate-500">
          공지사항을 불러오는 중입니다...
        </div>
      }
    >
      <NoticesInner />
    </Suspense>
  );
}

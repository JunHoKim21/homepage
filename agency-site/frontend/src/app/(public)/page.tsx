import Link from "next/link";
import { ArrowRight, CalendarCheck, MessageSquarePlus, ShieldCheck, Sparkles } from "lucide-react";
import { fetchPublicSiteConfigs, fetchPublishedCms } from "@/lib/api";

export default async function HomePage() {
  const [configs, portfolios, notices] = await Promise.all([
    fetchPublicSiteConfigs(),
    fetchPublishedCms("PORTFOLIO"),
    fetchPublishedCms("NOTICE"),
  ]);

  const reservationMode = configs.reservation_mode || "BOTH";

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            신뢰할 수 있는 맞춤형 비즈니스 파트너
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {configs.seo_title || "정확하고 빠른 비즈니스 파트너"}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {configs.seo_description || "전문적인 상담과 맞춤형 솔루션을 제공합니다."}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/inquiries"
              className="inline-flex items-center gap-2 rounded-xl btn-primary px-6 py-3.5 text-sm font-semibold shadow-sm transition"
            >
              <MessageSquarePlus className="h-4 w-4" />
              무료 상담 및 견적 문의
            </Link>
            {reservationMode !== "OFF" && (
              <Link
                href="/reservations"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50"
              >
                <CalendarCheck className="h-4 w-4 text-primary" />
                온라인 예약 바로가기
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Core Strengths */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">투명하고 신속한 상담</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                접수된 모든 문의는 담당 전문가에게 실시간으로 전달되어 24시간 내 정확한 피드백을 제공합니다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <CalendarCheck className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">유연한 온라인 예약</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                1:1 단독 상담부터 시간대별 정원 예약, 네이버 스마트플레이스 연동까지 간편하게 예약할 수 있습니다.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
              <Sparkles className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">검증된 포트폴리오</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                다양한 산업군의 성공 사례와 표준화된 프로세스로 최상의 결과물을 약속드립니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio & Notices Preview */}
      <section className="border-t border-slate-100 bg-slate-50/70 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">주요 포트폴리오</h2>
              <Link href="/portfolio" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                전체보기 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {portfolios.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                  등록된 포트폴리오가 없습니다. 관리자 콘솔에서 추가해 주세요.
                </div>
              ) : (
                portfolios.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.summary}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">최근 공지사항</h2>
              <Link href="/notices" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                전체보기 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {notices.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                  등록된 공지사항이 없습니다.
                </div>
              ) : (
                notices.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={`/notices?slug=${encodeURIComponent(item.slug)}`}
                    className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-900">{item.title}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

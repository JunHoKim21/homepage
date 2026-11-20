"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, Clock, Send, ShieldCheck } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

const CONTACT_METHODS = [
  { value: "카카오톡 상담", label: "카카오톡 상담" },
  { value: "유선 통화 (사전 조율)", label: "유선 통화 (사전 조율)" },
  { value: "화상 미팅 (화면 공유)", label: "화상 미팅 (화면 공유)" },
];

export default function ReservationsPage() {
  const [contactMethod, setContactMethod] = useState("카카오톡 상담");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify({
          category: "GENERAL",
          customerName,
          customerPhone,
          customerEmail: null,
          title: `[1:1 상담 신청] ${contactMethod}`,
          content: memo.trim() || `${contactMethod}으로 1:1 상담을 요청합니다.`,
          customFieldsJson: JSON.stringify({ contactMethod }),
          attachmentMediaId: null,
          privacyAgreed,
          websiteUrl,
        }),
      });
      setDone(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "상담 신청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="overflow-x-hidden bg-white">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            1:1 상담 신청이 접수되었습니다.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            접수 순서대로 <strong>24시간 이내</strong>에 입력하신 연락처로 회신드리겠습니다.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDone(false);
                setMemo("");
              }}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              추가 신청하기
            </button>
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-slate-50">
      {/* 컴팩트 상단 헤더 */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-10 text-white sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/15 via-blue-600/15 to-indigo-600/15" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
            <CalendarCheck className="h-3.5 w-3.5" />
            1:1 비대면 상담 신청
          </span>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            간단히 남겨주시면 24시간 내 순차 회신드립니다
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            복잡한 일정 조율 없이 연락처만 남겨주시면 확인 후 순서대로 연락드립니다.
          </p>
        </div>
      </section>

      {/* 본문: 초간편 신청 폼 + 핵심 안내 */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-7"
              >
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website_url_resv">Website</label>
                  <input
                    id="website_url_resv"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    선호하는 상담 방식
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {CONTACT_METHODS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setContactMethod(m.value)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                          contactMethod === m.value
                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600/30"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      성함 *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="예: 김대표"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      연락처 *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    간단 상담 내용 (선택)
                  </label>
                  <textarea
                    rows={3}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="업종, 참고 사이트, 통화 편하신 시간대 등을 가볍게 적어주세요."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    required
                    className="mt-0.5"
                  />
                  <span>상담 안내를 위한 연락처 수집·이용에 동의합니다. (필수)</span>
                </label>

                {errorMsg && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "접수 중..." : "1:1 상담 신청하기"}
                </button>
              </form>
            </div>

            <aside className="min-w-0 space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 text-white">
                <div className="flex items-center gap-2 text-sm font-bold text-sky-300">
                  <Clock className="h-4 w-4" />
                  <span>접수 및 회신 안내</span>
                </div>
                <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-slate-300">
                  <li>• 온라인 접수: 24시간 상시 가능</li>
                  <li>• 회신 기준: 접수 순서대로 24시간 이내 회신</li>
                  <li>• 유선·화상 미팅: 회신 시 편한 시간으로 조율</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>상세한 견적이 필요하신가요?</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  패키지·업종·참고 파일 첨부가 필요하면 견적 문의를 이용해 주세요.
                </p>
                <Link
                  href="/inquiries"
                  className="mt-3 inline-flex text-xs font-bold text-blue-600 hover:underline"
                >
                  30초 무료 견적 폼으로 이동 →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

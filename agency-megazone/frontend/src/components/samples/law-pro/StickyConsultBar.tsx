"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUp, Calendar, Check, ClipboardCheck, Phone } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

const CASE_TYPES = [
  "성범죄",
  "음주·교통",
  "사기·횡령·배임",
  "마약·폭행",
  "기업형사",
] as const;

export default function StickyConsultBar() {
  const [caseType, setCaseType] = useState<string>(CASE_TYPES[0]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("성함과 연락처를 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setNotice("");

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const title = `[선율 빠른상담] ${caseType} 24시 긴급 비밀상담`;
    const content = `사건유형: ${caseType}\n접수경로: 하단 고정 빠른 비밀상담 바\n신청자: ${trimmedName} (${trimmedPhone})`;
    const customFieldsJson = JSON.stringify({
      sampleSource: "law-pro-sticky",
      caseType,
    });

    const payload = {
      category: "GENERAL",
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      customerEmail: null,
      title,
      content,
      customFieldsJson,
      attachmentMediaId: null,
      privacyAgreed: true,
      websiteUrl,
    };

    try {
      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      if (typeof window !== "undefined" && websiteUrl.trim() === "") {
        try {
          const raw = localStorage.getItem("demo_sample_inquiries");
          const existing = raw ? JSON.parse(raw) : [];
          const list = Array.isArray(existing) ? existing : [];
          list.unshift({
            id: Date.now(),
            category: payload.category,
            customerName: payload.customerName,
            customerPhone: payload.customerPhone,
            customerEmail: null,
            title: payload.title,
            content: payload.content,
            customFieldsJson: payload.customFieldsJson,
            attachmentMediaId: null,
            status: "PENDING",
            adminMemo: null,
            clientIp: "127.0.0.1",
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("demo_sample_inquiries", JSON.stringify(list));
        } catch {
          // localStorage 접근 불가 환경 무시
        }
      }
    } finally {
      setSubmitting(false);
    }

    setCustomerName("");
    setCustomerPhone("");
    setNotice(
      `[${caseType}] ${trimmedName}님 빠른 비밀상담이 접수되었습니다. 전담팀이 곧 연락드립니다.`
    );
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      {/* 데스크톱 하단 고정 1줄 빠른 비밀상담 바 */}
      <div
        role="region"
        aria-label="24시 긴급 형사 빠른 비밀상담 바"
        className="fixed bottom-0 inset-x-0 z-40 hidden lg:block bg-[#0F2952] text-white border-t border-white/10"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          {/* 좌측 라벨 & 직통 번호 */}
          <div className="flex shrink-0 items-center gap-4 border-r border-white/15 pr-5">
            <div className="min-w-0">
              <div className="text-[11px] font-bold tracking-[0.12em] text-white/75">
                24시 긴급 형사 비밀상담
              </div>
              <a
                href="tel:02-599-0112"
                className="mt-0.5 inline-flex items-center gap-1.5 text-lg font-extrabold tracking-tight text-white hover:text-white/85"
              >
                <Phone className="h-4 w-4 shrink-0" />
                <span>02-599-0112</span>
              </a>
            </div>
          </div>

          {/* 우측 인라인 접수 폼 또는 접수 완료 알림 */}
          {notice ? (
            <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-white">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center border border-white/40 bg-white/10">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="truncate">{notice}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href="/admin/inquiries"
                  className="rounded-none border border-white/40 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#0F2952]"
                >
                  관리자 확인 →
                </Link>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  className="rounded-none bg-[#111827] px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#111827]"
                >
                  추가 접수
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleQuickSubmit}
              className="flex min-w-0 flex-1 items-center gap-2"
            >
              {/* Honeypot 숨김 필드 */}
              <input
                type="text"
                name="websiteUrl"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="hidden"
              />

              <label htmlFor="sticky-case-type" className="sr-only">
                사건유형
              </label>
              <select
                id="sticky-case-type"
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="h-10 w-40 shrink-0 rounded-none border border-white/20 bg-white px-3 text-xs font-semibold text-[#111827] outline-none focus:border-white"
              >
                {CASE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label htmlFor="sticky-name" className="sr-only">
                성함
              </label>
              <input
                id="sticky-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="성함 (가명 가능)"
                className="h-10 w-36 min-w-0 rounded-none border border-white/20 bg-white px-3 text-xs text-[#111827] placeholder:text-slate-400 outline-none focus:border-white"
              />

              <label htmlFor="sticky-phone" className="sr-only">
                연락처
              </label>
              <input
                id="sticky-phone"
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="연락처 (010-0000-0000)"
                className="h-10 min-w-0 flex-1 rounded-none border border-white/20 bg-white px-3 text-xs text-[#111827] placeholder:text-slate-400 outline-none focus:border-white"
              />

              <button
                type="submit"
                disabled={submitting}
                className="h-10 shrink-0 rounded-none border border-white/25 bg-[#111827] px-5 text-xs font-extrabold tracking-tight text-white transition-colors hover:bg-white hover:text-[#0F2952] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "접수 중..." : "즉시 상담 신청"}
              </button>

              {errorMsg && (
                <span className="shrink-0 text-xs font-semibold text-white/90">
                  {errorMsg}
                </span>
              )}
            </form>
          )}
        </div>
      </div>

      {/* 데스크톱 우측 세로형 퀵 바 */}
      <aside
        aria-label="빠른 이동 메뉴"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col bg-[#111827] text-white border-l border-y border-white/15 divide-y divide-white/15"
      >
        <a
          href="tel:02-599-0112"
          className="flex h-[70px] w-[72px] flex-col items-center justify-center gap-1.5 px-1 text-center transition-colors hover:bg-[#0F2952]"
        >
          <Phone className="h-4 w-4 shrink-0" />
          <span className="text-[11px] font-bold tracking-tight">24시 전화</span>
        </a>
        <a
          href="#diagnosis"
          className="flex h-[70px] w-[72px] flex-col items-center justify-center gap-1.5 px-1 text-center transition-colors hover:bg-[#0F2952]"
        >
          <ClipboardCheck className="h-4 w-4 shrink-0" />
          <span className="text-[11px] font-bold tracking-tight">자가진단</span>
        </a>
        <a
          href="#reservation"
          className="flex h-[70px] w-[72px] flex-col items-center justify-center gap-1.5 px-1 text-center transition-colors hover:bg-[#0F2952]"
        >
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="text-[11px] font-bold tracking-tight">방문예약</span>
        </a>
        <button
          type="button"
          onClick={scrollToTop}
          className="flex h-[58px] w-[72px] flex-col items-center justify-center gap-1 px-1 text-center transition-colors hover:bg-[#0F2952]"
        >
          <ArrowUp className="h-4 w-4 shrink-0" />
          <span className="text-[11px] font-bold tracking-[0.12em]">TOP</span>
        </button>
      </aside>
    </>
  );
}

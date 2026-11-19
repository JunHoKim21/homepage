"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Check, Clock, MapPin, Phone } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

interface ReservationPolicy {
  reservationMode: "OFF" | "NAVER" | "INTERNAL" | "BOTH";
  reservationCapacityMode: "SINGLE" | "MULTI";
  defaultCapacity: number;
  naverBookingUrl: string;
  autoConfirm?: boolean;
}

interface SlotView {
  slotId: number;
  slotDate: string;
  slotTime: string;
  serviceName: string;
  available: boolean;
  maxCapacity: number | null;
  remainingCapacity: number | null;
}

interface CompletedReservation {
  date: string;
  time: string;
  serviceName: string;
  caseType: string;
  customerName: string;
  customerPhone: string;
  memo: string;
  mode: "LIVE" | "FALLBACK";
}

const CASE_TYPES = [
  "성범죄",
  "음주·교통",
  "사기·횡령·배임",
  "마약·폭행",
  "기업형사",
  "기타 형사사건",
] as const;

const FALLBACK_TIMES = [
  { id: -101, time: "10:00:00", serviceName: "오전 1:1 방문 비밀상담" },
  { id: -102, time: "11:30:00", serviceName: "오전 1:1 방문 비밀상담" },
  { id: -103, time: "14:00:00", serviceName: "오후 형사전담 방문상담" },
  { id: -104, time: "16:00:00", serviceName: "오후 형사전담 방문상담" },
  { id: -105, time: "19:30:00", serviceName: "야간 긴급 방문 비밀상담" },
];

function formatLocalYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysYmd(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return formatLocalYmd(d);
}

function buildFallbackSlots(dateStr: string): SlotView[] {
  return FALLBACK_TIMES.map((item) => ({
    slotId: item.id,
    slotDate: dateStr,
    slotTime: item.time,
    serviceName: item.serviceName,
    available: true,
    maxCapacity: 1,
    remainingCapacity: 1,
  }));
}

export default function LawReservationSection() {
  const todayYmd = useMemo(() => addDaysYmd(0), []);
  const quickDates = useMemo(
    () => [
      { label: "오늘", ymd: addDaysYmd(0) },
      { label: "내일", ymd: addDaysYmd(1) },
      { label: "모레", ymd: addDaysYmd(2) },
    ],
    []
  );

  const [policy, setPolicy] = useState<ReservationPolicy | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(todayYmd);
  const [liveSlots, setLiveSlots] = useState<SlotView[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true);
  const [backendOffline, setBackendOffline] = useState<boolean>(false);

  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [caseType, setCaseType] = useState<string>(CASE_TYPES[0]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [memo, setMemo] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState<CompletedReservation | null>(null);

  useEffect(() => {
    let active = true;
    clientApiFetch<ReservationPolicy>("/api/v1/reservations/policy")
      .then((data) => {
        if (active) setPolicy(data);
      })
      .catch(() => {
        if (active) {
          setPolicy({
            reservationMode: "INTERNAL",
            reservationCapacityMode: "SINGLE",
            defaultCapacity: 1,
            naverBookingUrl: "https://booking.naver.com/",
            autoConfirm: false,
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const loadSlots = useCallback(async (dateStr: string) => {
    setLoadingSlots(true);
    setSelectedSlotId(null);
    setErrorMsg("");
    try {
      const data = await clientApiFetch<SlotView[]>(
        `/api/v1/reservations/slots?date=${dateStr}`
      );
      setLiveSlots(Array.isArray(data) ? data : []);
      setBackendOffline(false);
    } catch {
      setLiveSlots([]);
      setBackendOffline(true);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    void loadSlots(selectedDate);
  }, [selectedDate, loadSlots]);

  const isFallbackMode = !loadingSlots && liveSlots.length === 0;
  const displayedSlots = useMemo(
    () => (liveSlots.length > 0 ? liveSlots : buildFallbackSlots(selectedDate)),
    [liveSlots, selectedDate]
  );

  const selectedSlot = useMemo(
    () =>
      displayedSlots.find((slot) => slot.slotId === selectedSlotId) ?? null,
    [displayedSlots, selectedSlotId]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg("방문 상담 희망 시간대를 먼저 선택해 주세요.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("예약자 성함과 연락처를 입력해 주세요.");
      return;
    }
    if (!privacyAgreed) {
      setErrorMsg("개인정보 수집·이용에 동의해 주세요.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
    const trimmedMemo = memo.trim();

    if (isFallbackMode) {
      setSubmitting(false);
      setCompleted({
        date: selectedDate,
        time: selectedSlot.slotTime.slice(0, 5),
        serviceName: selectedSlot.serviceName,
        caseType,
        customerName: trimmedName,
        customerPhone: trimmedPhone,
        memo: trimmedMemo,
        mode: "FALLBACK",
      });
      return;
    }

    try {
      await clientApiFetch("/api/v1/reservations", {
        method: "POST",
        body: JSON.stringify({
          slotId: selectedSlot.slotId,
          customerName: trimmedName,
          customerPhone: trimmedPhone,
          customerEmail: null,
          visitorCount: 1,
          customFieldsJson: JSON.stringify({
            sampleSource: "law-pro",
            caseType,
            memo: trimmedMemo,
          }),
        }),
      });
      setCompleted({
        date: selectedDate,
        time: selectedSlot.slotTime.slice(0, 5),
        serviceName: selectedSlot.serviceName,
        caseType,
        customerName: trimmedName,
        customerPhone: trimmedPhone,
        memo: trimmedMemo,
        mode: "LIVE",
      });
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "예약 접수 중 오류가 발생했습니다. 다른 시간대를 선택해 주세요."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setCompleted(null);
    setCustomerName("");
    setCustomerPhone("");
    setMemo("");
    setErrorMsg("");
    void loadSlots(selectedDate);
  }

  return (
    <section
      id="reservation"
      className="overflow-x-clip border-t border-slate-200 bg-[#F5F7FA] py-16 text-[#111827] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="flex flex-col justify-between gap-5 border-b border-slate-300 pb-8 lg:flex-row lg:items-end">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className="h-[2px] w-7 bg-[#0F2952]"
                aria-hidden="true"
              />
              <span className="text-xs font-bold tracking-[0.2em] text-[#0F2952]">
                PRIVATE VISIT RESERVATION
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
              방문 비밀상담 실시간 예약
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            원하시는 날짜와 시간대를 선택해 서초동 본사 독립 상담실 1:1
            방문상담을 예약하세요. 예약 현황은 관리자 시스템과 실시간
            연동됩니다.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* 좌측: 실시간 방문 예약 패널 */}
          <div className="min-w-0 border border-slate-200 bg-white lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-[#111827] px-5 py-4 text-white sm:px-7">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>실시간 방문상담 일정 예약</span>
              </div>
              <span className="text-xs font-medium text-white/75">
                {policy?.reservationCapacityMode === "MULTI"
                  ? "시간대별 정원제 운영"
                  : "1:1 단독 독립 상담실 배정"}
              </span>
            </div>

            <div className="p-5 sm:p-8">
              {completed ? (
                /* 예약 완료 화면 */
                <div className="space-y-7">
                  <div className="border-l-4 border-[#0F2952] bg-[#F5F7FA] p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] text-[#0F2952]">
                      <Check className="h-4 w-4" />
                      <span>RESERVATION CONFIRMED</span>
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold text-[#111827] sm:text-2xl">
                      방문 비밀상담 예약이 접수되었습니다.
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {completed.mode === "LIVE"
                        ? "실시간 예약 시스템에 정상 저장되었습니다. 담당 변호사 배정 및 서초동 상담실 안내 문자가 곧 발송됩니다."
                        : "체험용 기본 시간대 폴백 모드로 예약 흐름 시연이 완료되었습니다. 관리자에서 실제 슬롯을 오픈하면 즉시 실데이터로 저장됩니다."}
                    </p>
                  </div>

                  <div className="border border-slate-200">
                    <div className="border-b border-slate-200 bg-[#F5F7FA] px-5 py-3 text-xs font-bold tracking-wider text-[#111827]">
                      예약 확정 요약
                    </div>
                    <dl className="divide-y divide-slate-200 text-sm">
                      <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                        <dt className="font-semibold text-slate-500">
                          예약 일시
                        </dt>
                        <dd className="font-bold text-[#0F2952] sm:col-span-3">
                          {completed.date} {completed.time} (
                          {completed.serviceName})
                        </dd>
                      </div>
                      <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                        <dt className="font-semibold text-slate-500">
                          상담 분야
                        </dt>
                        <dd className="font-bold text-[#111827] sm:col-span-3">
                          {completed.caseType}
                        </dd>
                      </div>
                      <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                        <dt className="font-semibold text-slate-500">
                          예약자 / 연락처
                        </dt>
                        <dd className="text-[#111827] sm:col-span-3">
                          {completed.customerName} ({completed.customerPhone})
                        </dd>
                      </div>
                      {completed.memo && (
                        <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                          <dt className="font-semibold text-slate-500">
                            상담 메모
                          </dt>
                          <dd className="text-slate-700 sm:col-span-3">
                            {completed.memo}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href="/admin/reservations"
                      className="inline-flex items-center justify-center rounded-none bg-[#0F2952] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#111827]"
                    >
                      관리자(/admin/reservations)에서 예약 현황 확인하기 →
                    </Link>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center justify-center rounded-none border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-[#111827] transition-colors hover:border-[#0F2952] hover:text-[#0F2952]"
                    >
                      다른 일정 예약하기
                    </button>
                  </div>
                </div>
              ) : (
                /* 예약 신청 폼 */
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* 1. 날짜 선택 */}
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor="law-res-date"
                        className="text-xs font-extrabold tracking-wider text-[#111827]"
                      >
                        01. 방문 날짜 선택 *
                      </label>
                      <div className="flex items-center gap-1.5">
                        {quickDates.map((d) => {
                          const active = selectedDate === d.ymd;
                          return (
                            <button
                              key={d.label}
                              type="button"
                              onClick={() => setSelectedDate(d.ymd)}
                              className={`rounded-none border px-2.5 py-1 text-xs font-bold transition-colors ${
                                active
                                  ? "border-[#0F2952] bg-[#0F2952] text-white"
                                  : "border-slate-300 bg-white text-slate-700 hover:border-[#0F2952]"
                              }`}
                            >
                              {d.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <input
                        id="law-res-date"
                        type="date"
                        min={todayYmd}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-[#111827] outline-none transition-colors focus:border-[#0F2952]"
                      />
                      <div className="flex items-center border border-slate-200 bg-[#F5F7FA] px-3.5 py-3 text-xs text-slate-600">
                        {loadingSlots
                          ? "선택 날짜의 예약 가능 시간대를 조회 중입니다..."
                          : isFallbackMode
                            ? backendOffline
                              ? "체험용 기본 시간대 모드 (예약 서버 미연결)"
                              : "선택일 등록 슬롯 없음 · 체험용 기본 시간대 표시 중"
                            : `실시간 예약 가능 슬롯 ${liveSlots.length}건 연동됨`}
                      </div>
                    </div>
                  </div>

                  {/* 2. 시간대 슬롯 선택 */}
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-xs font-extrabold tracking-wider text-[#111827]">
                        02. 상담 시간대 선택 *
                      </span>
                      <span className="text-xs text-slate-500">
                        {isFallbackMode
                          ? "체험용 기본 시간대 (10:00 · 11:30 · 14:00 · 16:00 · 19:30)"
                          : "실시간 백엔드 슬롯 기준"}
                      </span>
                    </div>

                    {loadingSlots ? (
                      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="h-20 border border-slate-200 bg-[#F5F7FA]"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-5">
                        {displayedSlots.map((slot) => {
                          const isSelected = selectedSlotId === slot.slotId;
                          return (
                            <button
                              key={slot.slotId}
                              type="button"
                              disabled={!slot.available}
                              onClick={() => {
                                setSelectedSlotId(slot.slotId);
                                setErrorMsg("");
                              }}
                              className={`flex min-w-0 flex-col justify-between rounded-none border p-3.5 text-left transition-colors ${
                                !slot.available
                                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                  : isSelected
                                    ? "border-[#0F2952] bg-[#0F2952] text-white"
                                    : "border-slate-200 bg-white text-[#111827] hover:border-[#0F2952] hover:bg-[#F5F7FA]"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-base font-extrabold tabular-nums">
                                  {slot.slotTime.slice(0, 5)}
                                </span>
                                {isSelected && (
                                  <Check
                                    className="h-3.5 w-3.5 shrink-0"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                              <div
                                className={`mt-1 truncate text-[11px] ${
                                  !slot.available
                                    ? "text-slate-400"
                                    : isSelected
                                      ? "text-white/80"
                                      : "text-slate-500"
                                }`}
                              >
                                {slot.serviceName}
                              </div>
                              <div
                                className={`mt-2 text-[11px] font-bold ${
                                  !slot.available
                                    ? "text-slate-400"
                                    : isSelected
                                      ? "text-white"
                                      : "text-[#0F2952]"
                                }`}
                              >
                                {!slot.available
                                  ? "예약 마감"
                                  : policy?.reservationCapacityMode ===
                                        "MULTI" &&
                                      slot.remainingCapacity !== null &&
                                      slot.maxCapacity !== null
                                    ? `잔여 ${slot.remainingCapacity}/${slot.maxCapacity}`
                                    : "예약 가능"}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. 상담 정보 입력 */}
                  <div className="space-y-4 border-t border-slate-200 pt-6">
                    <div className="text-xs font-extrabold tracking-wider text-[#111827]">
                      03. 예약자 정보 입력
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="min-w-0">
                        <label
                          htmlFor="law-res-case"
                          className="mb-1.5 block text-xs font-bold text-[#111827]"
                        >
                          사건 분야 *
                        </label>
                        <select
                          id="law-res-case"
                          value={caseType}
                          onChange={(e) => setCaseType(e.target.value)}
                          className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#0F2952]"
                        >
                          {CASE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="min-w-0">
                        <label
                          htmlFor="law-res-name"
                          className="mb-1.5 block text-xs font-bold text-[#111827]"
                        >
                          예약자 성함 *
                        </label>
                        <input
                          id="law-res-name"
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="성함 (가명 가능)"
                          className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#0F2952]"
                        />
                      </div>

                      <div className="min-w-0">
                        <label
                          htmlFor="law-res-phone"
                          className="mb-1.5 block text-xs font-bold text-[#111827]"
                        >
                          연락처 *
                        </label>
                        <input
                          id="law-res-phone"
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="010-0000-0000"
                          className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#0F2952]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="law-res-memo"
                        className="mb-1.5 block text-xs font-bold text-[#111827]"
                      >
                        사전 전달 메모 (선택)
                      </label>
                      <input
                        id="law-res-memo"
                        type="text"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="예: 경찰 출석요구서 지참 예정, 가족 동반 방문 등"
                        className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#0F2952]"
                      />
                    </div>

                    <label className="flex cursor-pointer items-start gap-2.5 border border-slate-200 bg-[#F5F7FA] p-3.5 text-xs leading-relaxed text-slate-700">
                      <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                        required
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F2952]"
                      />
                      <span>
                        방문 상담 일정 확정 및 안내를 위한 개인정보 수집·이용에
                        동의합니다. (필수 · 100% 비공개 처리)
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <p className="border-l-2 border-[#111827] bg-[#F5F7FA] px-4 py-2.5 text-xs font-semibold text-[#111827]">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-none bg-[#0F2952] py-4 text-sm font-bold text-white transition-colors hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>
                      {submitting
                        ? "방문 예약 접수 중..."
                        : selectedSlot
                          ? `${selectedDate} ${selectedSlot.slotTime.slice(0, 5)} 방문 비밀상담 예약하기`
                          : "시간대를 선택하고 방문 상담 예약하기"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* 우측: 서초동 본사 방문상담 운영 안내 */}
          <aside className="min-w-0 space-y-5 lg:col-span-4">
            <div className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-4 text-sm font-extrabold text-[#111827]">
                <Clock className="h-4 w-4 shrink-0 text-[#0F2952]" />
                <span>방문상담 운영시간 안내</span>
              </div>
              <dl className="mt-4 divide-y divide-slate-200 text-sm">
                <div className="flex items-center justify-between gap-2 py-3">
                  <dt className="text-slate-600">평일 정규 상담</dt>
                  <dd className="font-bold text-[#111827]">09:00 ~ 20:00</dd>
                </div>
                <div className="flex items-center justify-between gap-2 py-3">
                  <dt className="text-slate-600">야간 사전예약</dt>
                  <dd className="font-bold text-[#0F2952]">19:30 ~ 22:00</dd>
                </div>
                <div className="flex items-center justify-between gap-2 py-3">
                  <dt className="text-slate-600">주말·공휴일</dt>
                  <dd className="font-bold text-[#111827]">사전예약 · 긴급당직</dd>
                </div>
              </dl>
              <p className="mt-4 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-600">
                모든 대면 상담은 타 의뢰인과 동선이 겹치지 않는 독립 비밀
                상담실에서 형사전담 변호사가 직접 진행합니다.
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-4 text-sm font-extrabold text-[#111827]">
                <MapPin className="h-4 w-4 shrink-0 text-[#0F2952]" />
                <span>법무법인 선율 서초 본사</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#111827]">
                서울특별시 서초구 서초중앙로 148, 선율 법조타워 8·9층
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                교대역 10번 출구 도보 2분 · 서울중앙지방법원·서울중앙지검 맞은편
                / 건물 지하 1~3층 전용 주차장 2시간 무료 지원
              </p>
            </div>

            <div className="border border-[#0F2952] bg-[#0F2952] p-6 text-white">
              <div className="text-[11px] font-bold tracking-[0.18em] text-white/75">
                24H EMERGENCY DESK
              </div>
              <div className="mt-2 text-lg font-extrabold">
                체포·압수수색 긴급 직통
              </div>
              <a
                href="tel:02-599-0112"
                className="mt-3 inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
              >
                <Phone className="h-5 w-5 shrink-0" />
                <span>02-599-0112</span>
              </a>
              <p className="mt-3 text-xs leading-relaxed text-white/80">
                현행범 체포, 압수수색, 구속영장 청구 등 즉각 입회가 필요한
                경우 24시간 당직 형사변호사가 직통 연결됩니다.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

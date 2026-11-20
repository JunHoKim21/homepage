"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, ExternalLink, Users } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

interface ReservationPolicy {
  reservationMode: "OFF" | "NAVER" | "INTERNAL" | "BOTH";
  reservationCapacityMode: "SINGLE" | "MULTI";
  defaultCapacity: number;
  naverBookingUrl: string;
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

export default function ReservationsPage() {
  const [policy, setPolicy] = useState<ReservationPolicy | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<SlotView[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [visitorCount, setVisitorCount] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    clientApiFetch<ReservationPolicy>("/api/v1/reservations/policy")
      .then(setPolicy)
      .catch(() =>
        setPolicy({
          reservationMode: "BOTH",
          reservationCapacityMode: "SINGLE",
          defaultCapacity: 1,
          naverBookingUrl: "https://booking.naver.com/",
        })
      );
  }, []);

  useEffect(() => {
    if (!policy) return;
    if (policy.reservationMode === "INTERNAL" || policy.reservationMode === "BOTH") {
      setSelectedSlotId(null);
      clientApiFetch<SlotView[]>(`/api/v1/reservations/slots?date=${selectedDate}`)
        .then(setSlots)
        .catch(() => setSlots([]));
    }
  }, [policy, selectedDate]);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlotId) {
      setErrorMsg("예약하실 시간대를 먼저 선택해 주세요.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    try {
      await clientApiFetch("/api/v1/reservations", {
        method: "POST",
        body: JSON.stringify({
          slotId: selectedSlotId,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          visitorCount: policy?.reservationCapacityMode === "SINGLE" ? 1 : visitorCount,
          customFieldsJson: JSON.stringify(memo ? { memo } : {}),
        }),
      });
      setDone(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "예약 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!policy) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500">예약 정보를 불러오는 중...</div>;
  }

  if (policy.reservationMode === "OFF") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">현재 온라인 예약 기능이 비활성화되어 있습니다.</h1>
        <p className="mt-2 text-sm text-slate-600">상담 문의 페이지를 이용해 주시기 바랍니다.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">예약이 성공적으로 접수되었습니다.</h1>
        <p className="mt-2 text-sm text-slate-600">예약 확정 안내가 입력하신 연락처로 발송됩니다.</p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold"
        >
          다른 시간대 예약하기
        </button>
      </div>
    );
  }

  const showNaver = policy.reservationMode === "NAVER" || policy.reservationMode === "BOTH";
  const showInternal = policy.reservationMode === "INTERNAL" || policy.reservationMode === "BOTH";

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">온라인 예약</h1>
          <p className="mt-1 text-sm text-slate-600">
            {policy.reservationCapacityMode === "SINGLE"
              ? "1:1 단독 예약 모드로 운영 중입니다."
              : "시간대별 정원제 예약 모드로 운영 중입니다."}
          </p>
        </div>

        {showNaver && (
          <a
            href={policy.naverBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#03C75A] px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:opacity-90"
          >
            <span>네이버로 간편 예약하기</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {showInternal && (
        <form onSubmit={handleBook} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">예약 날짜 선택</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            {policy.reservationCapacityMode === "MULTI" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">방문 인원</label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={visitorCount}
                    onChange={(e) => setVisitorCount(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-700">예약 가능 시간대</label>
            {slots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">
                선택한 날짜에 등록된 예약 슬롯이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.slotId;
                  return (
                    <button
                      key={slot.slotId}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlotId(slot.slotId)}
                      className={`rounded-xl border p-3 text-left transition ${
                        !slot.available
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                          : isSelected
                          ? "border-primary bg-indigo-50/70 ring-2 ring-indigo-500/30"
                          : "border-slate-200 bg-white hover:border-slate-400"
                      }`}
                    >
                      <div className="text-sm font-bold text-slate-900">{slot.slotTime.slice(0, 5)}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{slot.serviceName}</div>
                      <div className="mt-1 text-[11px] font-semibold">
                        {!slot.available ? (
                          <span className="text-red-500">예약 마감</span>
                        ) : policy.reservationCapacityMode === "MULTI" ? (
                          <span className="text-emerald-600">
                            잔여 {slot.remainingCapacity} / {slot.maxCapacity}석
                          </span>
                        ) : (
                          <span className="text-emerald-600">예약 가능</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">예약자 성함 *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">연락처 *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">요청사항 (선택)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="방문 전 전달하실 내용을 적어주세요."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {errorMsg && (
            <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">{errorMsg}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl btn-primary py-3 text-sm font-semibold disabled:opacity-50"
          >
            <CalendarCheck className="h-4 w-4" />
            {submitting ? "예약 접수 중..." : "선택한 시간으로 예약 확정하기"}
          </button>
        </form>
      )}
    </div>
  );
}

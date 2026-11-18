"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  PhoneCall,
  Users,
} from "lucide-react";
import { clientApiFetch } from "@/lib/api";

interface ReservationPolicy {
  reservationMode: "OFF" | "NAVER" | "INTERNAL" | "BOTH";
  reservationCapacityMode: "SINGLE" | "MULTI";
  defaultCapacity: number;
  naverBookingUrl: string;
}

interface SlotView {
  slotId: number;
  slotTime: string;
  slotDate: string;
  serviceName: string;
  available: boolean;
  maxCapacity: number | null;
  remainingCapacity: number | null;
}

const GUIDE_STEPS = [
  {
    step: "STEP 01",
    title: "날짜·시간 선택",
    desc: "원하시는 상담 날짜와 비어 있는 시간대를 클릭하세요.",
  },
  {
    step: "STEP 02",
    title: "연락처 입력",
    desc: "성함과 연락처, 간단한 상담 주제를 남겨주세요.",
  },
  {
    step: "STEP 03",
    title: "담당자 확정 안내",
    desc: "확인 즉시 알림을 보내드리고 약속된 시간에 연락드립니다.",
  },
];

function buildSampleSlots(dateStr: string): SlotView[] {
  return [
    {
      slotId: 9001,
      slotDate: dateStr,
      slotTime: "19:30:00",
      serviceName: "사전 예약 전화·화상 미팅",
      available: true,
      maxCapacity: 2,
      remainingCapacity: 2,
    },
    {
      slotId: 9002,
      slotDate: dateStr,
      slotTime: "20:30:00",
      serviceName: "사전 예약 전화·화상 미팅",
      available: false,
      maxCapacity: 2,
      remainingCapacity: 0,
    },
    {
      slotId: 9003,
      slotDate: dateStr,
      slotTime: "21:30:00",
      serviceName: "온라인 1:1 심층 상담",
      available: true,
      maxCapacity: 2,
      remainingCapacity: 1,
    },
  ];
}

export default function ReservationsPage() {
  const [policy, setPolicy] = useState<ReservationPolicy | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<SlotView[]>([]);
  const [isOfflineSlots, setIsOfflineSlots] = useState(false);
  const [previewSampleSlots, setPreviewSampleSlots] = useState(false);
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
        .then((data) => {
          setSlots(data);
          setIsOfflineSlots(false);
        })
        .catch(() => {
          setSlots([]);
          setIsOfflineSlots(true);
        });
    }
  }, [policy, selectedDate]);

  const displayedSlots =
    slots.length > 0 ? slots : previewSampleSlots ? buildSampleSlots(selectedDate) : [];

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlotId) {
      setErrorMsg("예약하실 시간대를 먼저 선택해 주세요.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");

    // 샘플 시간대 미리보기 모드인 경우 체험 완료 처리
    if (slots.length === 0 && previewSampleSlots) {
      setTimeout(() => {
        setSubmitting(false);
        setDone(true);
      }, 300);
      return;
    }

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
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-sm text-slate-500">
        예약 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (policy.reservationMode === "OFF") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">
          현재 온라인 예약 기능이 비활성화되어 있습니다.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          상담 문의 페이지를 이용해 주시면 빠르게 안내해 드리겠습니다.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="overflow-x-hidden bg-white">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            예약이 성공적으로 접수되었습니다.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {slots.length === 0 && previewSampleSlots
              ? "샘플 시간대 미리보기 체험이 완료되었습니다. 실제 운영 시 입력하신 연락처로 확정 안내가 발송됩니다."
              : "예약 확정 안내가 입력하신 연락처로 신속히 발송됩니다."}
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            다른 시간대 예약하기
          </button>
        </div>
      </div>
    );
  }

  const showNaver = policy.reservationMode === "NAVER" || policy.reservationMode === "BOTH";
  const showInternal = policy.reservationMode === "INTERNAL" || policy.reservationMode === "BOTH";

  return (
    <div className="overflow-x-hidden bg-slate-50">
      {/* 상단 다크 네이비/바이올렛 2단 컴팩트 배너 헤더 */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-10 text-white sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-violet-600/20" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
                <CalendarCheck className="h-3.5 w-3.5" />
                온라인 상담 예약 · RESERVATIONS
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                원하시는 날짜와 시간에
                <br className="hidden sm:block" /> 1:1 맞춤 상담을 예약하세요
              </h1>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                {policy.reservationCapacityMode === "SINGLE"
                  ? "1:1 단독 예약 모드로 운영 중입니다."
                  : "시간대별 정원제 예약 모드로 운영 중입니다."}
              </p>
              {showNaver && (
                <div className="mt-4">
                  <a
                    href={policy.naverBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#03C75A] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:opacity-90 sm:text-sm"
                  >
                    <span>네이버로 간편 예약하기</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
                <div className="text-xs font-bold text-blue-300">100% 비대면 온라인 진행 안내</div>
                <dl className="mt-3 space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <dt className="text-slate-300">회신 속도</dt>
                    <dd className="font-bold text-white">접수 후 최대 24시간 이내</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <dt className="text-slate-300">온라인 접수</dt>
                    <dd className="font-bold text-white">24시간 상시 가능</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <dt className="text-slate-300">전화·화상 미팅</dt>
                    <dd className="text-right font-bold text-white">평일 19:30~22:30 · 주말 10:00~20:00</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className="text-slate-300">3단계 분할 정산</dt>
                    <dd className="font-bold text-emerald-300">40% → 30% → 30%</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3단계 예약 가이드 */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {GUIDE_STEPS.map((g) => (
              <div
                key={g.step}
                className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <span className="inline-block rounded-md bg-[#0B0F19] px-2 py-0.5 text-[11px] font-bold text-white">
                  {g.step}
                </span>
                <h2 className="mt-2 text-sm font-bold text-slate-900">{g.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 본문: 예약 폼 + 우측 상담 운영시간표 */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 좌측: 자체 예약 폼 */}
            <div className="min-w-0 lg:col-span-2">
              {showInternal ? (
                <form
                  onSubmit={handleBook}
                  className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-8"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        예약 날짜 선택
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                      />
                    </div>

                    {policy.reservationCapacityMode === "MULTI" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                          참여 인원
                        </label>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={visitorCount}
                            onChange={(e) => setVisitorCount(Math.max(1, Number(e.target.value)))}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-700">
                        예약 가능 시간대
                      </label>
                      {slots.length === 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewSampleSlots((prev) => !prev);
                            setSelectedSlotId(null);
                          }}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                            previewSampleSlots
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>
                            {previewSampleSlots ? "샘플 시간대 미리보기 켜짐" : "샘플 시간대 미리보기"}
                          </span>
                        </button>
                      )}
                    </div>

                    {displayedSlots.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-xs leading-relaxed text-slate-500">
                        {isOfflineSlots
                          ? "현재 예약 서버와 연결되지 않았습니다. 우측 상단 '샘플 시간대 미리보기' 버튼을 눌러 화면을 체험해 보세요."
                          : "선택한 날짜에 등록된 예약 슬롯이 없습니다. 다른 날짜를 선택하거나 '샘플 시간대 미리보기'를 눌러보세요."}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {displayedSlots.map((slot) => {
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
                                  ? "border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30"
                                  : "border-slate-200 bg-white hover:border-slate-400"
                              }`}
                            >
                              <div className="text-sm font-bold text-slate-900">
                                {slot.slotTime.slice(0, 5)}
                              </div>
                              <div className="mt-0.5 truncate text-[11px] text-slate-500">
                                {slot.serviceName}
                              </div>
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
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        예약자 성함 *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="홍길동"
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
                      이메일 (선택)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      요청사항 (선택)
                    </label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="희망하시는 화상·전화 미팅 방식이나 참고 사이트 등을 적어주세요."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>

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
                    <CalendarCheck className="h-4 w-4" />
                    {submitting ? "예약 접수 중..." : "선택한 시간으로 예약 확정하기"}
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                  <p className="text-sm text-slate-600">
                    현재 네이버 스마트플레이스를 통해 예약을 접수하고 있습니다. 상단 네이버 예약 버튼을 이용해 주세요.
                  </p>
                </div>
              )}
            </div>

            {/* 우측: 상담 운영시간표 */}
            <aside className="min-w-0 space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>상담 운영시간표</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  온라인 접수: 24시간 상시 | 접수 후 최대 24시간 이내 순차 회신
                </p>

                <dl className="mt-5 divide-y divide-slate-100 text-sm">
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="font-semibold text-slate-700">온라인 예약 접수</dt>
                    <dd className="font-bold text-blue-600">24시간 상시</dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="font-semibold text-slate-700">평일 야간 미팅</dt>
                    <dd className="font-bold text-slate-900">19:30 ~ 22:30</dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="font-semibold text-slate-700">주말 전화·화상 미팅</dt>
                    <dd className="font-bold text-slate-900">10:00 ~ 20:00</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 text-white">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-300">
                  <PhoneCall className="h-5 w-5" />
                  <span>100% 비대면 온라인 진행</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  1차 온라인 상담·견적 접수 → 필요 시 사전 예약 전화·화상 미팅 순서로
                  진행됩니다. 오프라인 이동 없이 화면 공유로 편리하게 상담받으세요.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

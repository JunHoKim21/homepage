"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BellRing,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserCheck,
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
  slotDate: string;
  slotTime: string;
  serviceName: string;
  available: boolean;
  maxCapacity: number | null;
  remainingCapacity: number | null;
}

const PROCESS_STEPS = [
  {
    step: "STEP 01",
    title: "① 날짜·시간 선택",
    desc: "달력에서 희망 날짜와 실시간 예약 가능 시간대 슬롯을 선택합니다.",
    icon: CalendarCheck,
  },
  {
    step: "STEP 02",
    title: "② 업체명·연락처 입력",
    desc: "비회원도 복잡한 회원가입 없이 성함(업체명)과 연락처만으로 즉시 신청합니다.",
    icon: UserCheck,
  },
  {
    step: "STEP 03",
    title: "③ 알림톡/이메일 확정 안내",
    desc: "접수 즉시 담당 엔지니어 배정 및 확정 안내 메시지가 발송됩니다.",
    icon: BellRing,
  },
];

const DEMO_PREVIEW_SLOTS: SlotView[] = [
  {
    slotId: 9001,
    slotDate: "",
    slotTime: "10:00:00",
    serviceName: "1:1 구축·견적 상담",
    available: true,
    maxCapacity: 1,
    remainingCapacity: 1,
  },
  {
    slotId: 9002,
    slotDate: "",
    slotTime: "11:00:00",
    serviceName: "1:1 구축·견적 상담",
    available: false,
    maxCapacity: 1,
    remainingCapacity: 0,
  },
  {
    slotId: 9003,
    slotDate: "",
    slotTime: "14:00:00",
    serviceName: "1:1 구축·견적 상담",
    available: true,
    maxCapacity: 1,
    remainingCapacity: 1,
  },
  {
    slotId: 9004,
    slotDate: "",
    slotTime: "15:00:00",
    serviceName: "1:1 구축·견적 상담",
    available: true,
    maxCapacity: 1,
    remainingCapacity: 1,
  },
  {
    slotId: 9005,
    slotDate: "",
    slotTime: "16:00:00",
    serviceName: "1:1 구축·견적 상담",
    available: true,
    maxCapacity: 1,
    remainingCapacity: 1,
  },
  {
    slotId: 9006,
    slotDate: "",
    slotTime: "17:00:00",
    serviceName: "1:1 구축·견적 상담",
    available: true,
    maxCapacity: 1,
    remainingCapacity: 1,
  },
];

export default function ReservationsPage() {
  const [policy, setPolicy] = useState<ReservationPolicy | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<SlotView[]>([]);
  const [usingDemoPreview, setUsingDemoPreview] = useState(false);
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
        .then((res) => {
          setSlots(res);
          setUsingDemoPreview(false);
        })
        .catch(() => {
          setSlots([]);
          setUsingDemoPreview(true);
        });
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
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-slate-500">
        예약 정책 및 시간표 정보를 불러오는 중...
      </div>
    );
  }

  if (policy.reservationMode === "OFF") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          현재 온라인 예약 기능이 비활성화되어 있습니다.
        </h1>
        <p className="mt-2 text-sm text-slate-600">무료 견적문의 페이지를 이용해 주시기 바랍니다.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
          1:1 상담 예약이 성공적으로 접수되었습니다.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          예약 확정 안내 및 화상/방문 미팅 안내가 입력하신 연락처로 발송됩니다.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          다른 시간대 예약하기
        </button>
      </div>
    );
  }

  const showNaver = policy.reservationMode === "NAVER" || policy.reservationMode === "BOTH";
  const showInternal = policy.reservationMode === "INTERNAL" || policy.reservationMode === "BOTH";
  const displaySlots = slots.length > 0 ? slots : usingDemoPreview ? DEMO_PREVIEW_SLOTS : [];

  return (
    <div className="bg-slate-50 pb-20">
      {/* 1. 상단 헤더 & 3단계 예약 프로세스 가이드 */}
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                <span>HYBRID RESERVATION SYSTEM · 병의원·로펌·에이전시 표준 예약</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                1:1 전담 엔지니어 상담 예약
              </h1>
              <p className="mt-1.5 text-sm text-slate-600">
                {policy.reservationCapacityMode === "SINGLE"
                  ? "현재 1:1 단독 예약(SINGLE) 모드로 운영 중입니다. 동일 시간대 중복 예약이 원천 차단됩니다."
                  : "현재 시간대별 정원제 예약(MULTI) 모드로 운영 중입니다. 잔여 좌석 내에서 예약 가능합니다."}
              </p>
            </div>

            {showNaver && (
              <a
                href={policy.naverBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#03C75A] px-5 py-3.5 text-sm font-extrabold text-white shadow-xs transition hover:opacity-90"
              >
                <span>N 네이버 스마트플레이스 간편 예약</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {/* 친절한 예약 프로세스 가이드 3단계 */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {PROCESS_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-blue-600">{item.step}</span>
                    <h2 className="text-sm font-extrabold text-slate-900">{item.title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. 본문 2단 레이아웃: 좌측 예약 폼 + 우측 상담 시간 안내표 박스 */}
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* 좌측: 예약 폼 */}
          <div className="lg:col-span-8">
            {showInternal && (
              <form
                onSubmit={handleBook}
                className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-800">
                      희망 상담 날짜 선택 *
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-semibold text-slate-900"
                    />
                  </div>

                  {policy.reservationCapacityMode === "MULTI" && (
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold text-slate-800">
                        참석 인원 선택
                      </label>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={visitorCount}
                          onChange={(e) => setVisitorCount(Math.max(1, Number(e.target.value)))}
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 시간대 슬롯 영역 */}
                <div>
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-extrabold text-slate-800">
                      예약 가능 시간대 선택 ({selectedDate})
                    </label>
                    {slots.length === 0 && (
                      <button
                        type="button"
                        onClick={() => setUsingDemoPreview((prev) => !prev)}
                        className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100"
                      >
                        {usingDemoPreview ? "실제 슬롯 상태 보기" : "샘플 시간대 UI 미리보기"}
                      </button>
                    )}
                  </div>

                  {slots.length === 0 && (
                    <div className="mb-3 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      <div>
                        <p className="font-bold">
                          선택하신 날짜({selectedDate})에 오픈된 예약 슬롯이 없거나 데모 프리뷰 모드입니다.
                        </p>
                        <p className="mt-0.5 text-amber-800">
                          관리자 콘솔(
                          <Link href="/admin/reservations" className="font-bold underline">
                            /admin/reservations
                          </Link>
                          )에서 1초 일괄 슬롯 생성 기능으로 원하는 요일·시간대를 즉시 오픈하실 수 있습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {displaySlots.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-xs text-slate-500">
                      선택한 날짜에 등록된 예약 슬롯이 없습니다. 우측 상단{" "}
                      <strong>[샘플 시간대 UI 미리보기]</strong> 버튼을 눌러 예약 버튼 UI를 확인해 보세요.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {displaySlots.map((slot) => {
                        const isSelected = selectedSlotId === slot.slotId;
                        return (
                          <button
                            key={slot.slotId}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedSlotId(slot.slotId)}
                            className={`rounded-2xl border p-3.5 text-left transition ${
                              !slot.available
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                                : isSelected
                                ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/30"
                                : "border-slate-200 bg-white hover:border-blue-400"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-base font-extrabold text-slate-900">
                                {slot.slotTime.slice(0, 5)}
                              </span>
                              <span
                                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  !slot.available
                                    ? "bg-red-100 text-red-600"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {!slot.available
                                  ? "예약마감"
                                  : policy.reservationCapacityMode === "MULTI"
                                  ? `잔여 ${slot.remainingCapacity}/${slot.maxCapacity}석`
                                  : "예약가능"}
                              </span>
                            </div>
                            <div className="mt-1 text-xs font-medium text-slate-500">
                              {slot.serviceName}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 예약자 정보 입력 */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      예약자 성함 / 업체명 *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="예: 홍길동 대표 / 연세바른의원"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      연락처 (확정 알림톡 수신번호) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      이메일 (선택)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      사전 요청사항 / 희망 상담 방식 (선택)
                    </label>
                    <input
                      type="text"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="예: 유선 상담 희망 / Zoom 화상 미팅 희망"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <CalendarCheck className="h-4 w-4" />
                  {submitting ? "예약 접수 중..." : "선택한 시간으로 1:1 상담 예약 확정하기"}
                </button>
              </form>
            )}
          </div>

          {/* 우측: 상담 시간 안내표 박스 (병의원·전문직·에이전시 밀도형) */}
          <aside className="space-y-5 lg:col-span-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                <Clock className="h-4 w-4" />
                <span>CONSULTATION HOURS · 상담 시간 안내표</span>
              </div>
              <h2 className="mt-2 text-lg font-extrabold">
                상담 시간 및 하이브리드 예약 안내
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                병의원 진료 시간표·로펌 법률상담·스튜디오 예약에 동일하게 적용되는 모듈입니다.
              </p>

              <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5 text-xs">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-slate-300">평일 정규 상담</span>
                  <span className="font-extrabold text-white">평일 10:00 ~ 18:00</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-slate-300">점심 휴게 시간</span>
                  <span className="font-bold text-amber-300">점심 12:30 ~ 13:30</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-slate-300">주말 · 공휴일</span>
                  <span className="text-slate-300">사전 예약제 (온라인 문의 상시)</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold text-slate-300">외부 채널 연동</span>
                  <span className="font-bold text-emerald-300">
                    네이버 스마트플레이스 예약 병행 지원
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-2.5 rounded-2xl bg-blue-950/70 p-4 text-xs text-blue-100">
                <div className="flex items-center gap-1.5 font-extrabold text-white">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  <span>하이브리드 예약 엔진 핵심 특징</span>
                </div>
                <p className="leading-relaxed">
                  • <strong>SINGLE(1:1 단독)</strong>과 <strong>MULTI(시간대별 N명 정원제)</strong>를 관리자 스위치 하나로 즉시 전환
                </p>
                <p className="leading-relaxed">
                  • 네이버 스마트플레이스 예약 버튼과 홈페이지 자체 예약 폼을 동시 노출(BOTH) 가능
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <PhoneCall className="h-3.5 w-3.5 text-blue-400" />
                  긴급 상담: 02-1234-5678
                </span>
                <Link
                  href="/admin/login"
                  className="font-bold text-amber-300 hover:underline"
                >
                  예약 관리자 체험 →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

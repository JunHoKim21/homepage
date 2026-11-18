"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Lock,
  Plus,
  Trash2,
  Unlock,
} from "lucide-react";
import { adminApiFetch } from "@/lib/api";

interface ReservationItem {
  id: number;
  slotId: number;
  slotDate: string;
  slotTime: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  visitorCount: number;
  status: string;
  createdAt: string;
}

interface AdminSlotItem {
  slotId: number;
  slotDate: string;
  slotTime: string;
  serviceName: string;
  maxCapacity: number;
  reservedCount: number;
  closed: boolean;
}

const WEEK_DAYS_KR = ["일", "월", "화", "수", "목", "금", "토"];
const JAVA_DAYS = [
  { key: "MONDAY", label: "월" },
  { key: "TUESDAY", label: "화" },
  { key: "WEDNESDAY", label: "수" },
  { key: "THURSDAY", label: "목" },
  { key: "FRIDAY", label: "금" },
  { key: "SATURDAY", label: "토" },
  { key: "SUNDAY", label: "일" },
];
const TIME_PRESETS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00",
];

function toYmd(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AdminReservationsPage() {
  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1); // 1~12
  const [selectedDate, setSelectedDate] = useState(() => today.toISOString().slice(0, 10));

  const [monthlySlots, setMonthlySlots] = useState<AdminSlotItem[]>([]);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 생성 모드 탭 ("BATCH" | "SINGLE")
  const [createTab, setCreateTab] = useState<"BATCH" | "SINGLE">("BATCH");

  // 단건 생성 상태
  const [singleTime, setSingleTime] = useState("14:00");
  const [singleService, setSingleService] = useState("기본 상담");
  const [singleCap, setSingleCap] = useState(1);

  // 일괄 생성 상태
  const [batchStart, setBatchStart] = useState(() => today.toISOString().slice(0, 10));
  const [batchEnd, setBatchEnd] = useState(() => {
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return toYmd(end.getFullYear(), end.getMonth() + 1, end.getDate());
  });
  const [batchDays, setBatchDays] = useState<string[]>([
    "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY",
  ]);
  const [batchTimes, setBatchTimes] = useState<string[]>([
    "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  ]);
  const [batchService, setBatchService] = useState("기본 상담");
  const [batchCap, setBatchCap] = useState(1);

  const loadReservations = useCallback(() => {
    adminApiFetch<ReservationItem[]>("/api/admin/reservations").then(setReservations).catch(() => {});
  }, []);

  const loadMonthlySlots = useCallback((year: number, month: number) => {
    adminApiFetch<AdminSlotItem[]>(`/api/admin/reservations/slots?year=${year}&month=${month}`)
      .then(setMonthlySlots)
      .catch(() => setMonthlySlots([]));
  }, []);

  useEffect(() => {
    loadReservations();
    fetch("/api/v1/reservations/policy")
      .then((r) => r.json())
      .then((json: { data?: { autoConfirm?: boolean } }) => {
        if (json.data?.autoConfirm !== undefined) {
          setAutoConfirm(json.data.autoConfirm);
        }
      })
      .catch(() => {});
  }, [loadReservations]);

  async function handleToggleAutoConfirm() {
    const next = !autoConfirm;
    setErrorMsg("");
    try {
      await adminApiFetch("/api/admin/configs", {
        method: "PUT",
        body: JSON.stringify({
          configs: [{ configKey: "reservation_auto_confirm", configValue: String(next) }],
        }),
      });
      setAutoConfirm(next);
      setNotice(
        next
          ? "자동 예약 확정이 켜졌습니다. 이제 고객 예약 시 즉시 확정(CONFIRMED) 처리됩니다."
          : "자동 예약 확정이 꺼졌습니다. 이제 고객 예약 시 접수대기(REQUESTED)로 저장됩니다."
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "자동 확정 설정 변경 실패");
    }
  }

  useEffect(() => {
    loadMonthlySlots(calYear, calMonth);
  }, [calYear, calMonth, loadMonthlySlots]);

  function moveMonth(delta: number) {
    const d = new Date(calYear, calMonth - 1 + delta, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth() + 1);
  }

  async function handleCreateSingle(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");
    setErrorMsg("");
    try {
      await adminApiFetch("/api/admin/reservations/slots", {
        method: "POST",
        body: JSON.stringify({
          slotDate: selectedDate,
          slotTime: singleTime.length === 5 ? `${singleTime}:00` : singleTime,
          serviceName: singleService,
          maxCapacity: singleCap,
          closed: false,
        }),
      });
      setNotice(`${selectedDate} ${singleTime} 슬롯이 추가되었습니다.`);
      loadMonthlySlots(calYear, calMonth);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "슬롯 생성 실패");
    }
  }

  async function handleCreateBatch(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");
    setErrorMsg("");
    if (batchTimes.length === 0) {
      setErrorMsg("최소 1개 이상의 시간대를 선택해 주세요.");
      return;
    }
    try {
      const res = await adminApiFetch<{ createdCount: number; skippedCount: number }>(
        "/api/admin/reservations/slots/batch",
        {
          method: "POST",
          body: JSON.stringify({
            startDate: batchStart,
            endDate: batchEnd,
            daysOfWeek: batchDays,
            times: batchTimes.map((t) => `${t}:00`),
            serviceName: batchService,
            maxCapacity: batchCap,
          }),
        }
      );
      setNotice(`일괄 생성 완료: 신규 ${res.createdCount}개 생성됨 (기존 중복 ${res.skippedCount}개 건너뜀)`);
      loadMonthlySlots(calYear, calMonth);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "일괄 생성 실패");
    }
  }

  async function handleToggleSlot(slotId: number) {
    setErrorMsg("");
    await adminApiFetch(`/api/admin/reservations/slots/${slotId}/toggle`, { method: "PATCH" });
    loadMonthlySlots(calYear, calMonth);
  }

  async function handleDeleteSlot(slotId: number) {
    setErrorMsg("");
    try {
      await adminApiFetch(`/api/admin/reservations/slots/${slotId}`, { method: "DELETE" });
      loadMonthlySlots(calYear, calMonth);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "슬롯 삭제 실패");
    }
  }

  async function handleStatusChange(id: number, status: string) {
    await adminApiFetch(`/api/admin/reservations/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, adminMemo: "" }),
    });
    loadReservations();
    loadMonthlySlots(calYear, calMonth);
  }

  async function downloadExcel() {
    const token = localStorage.getItem("admin_access_token");
    const res = await fetch("/api/admin/export/reservations", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reservations.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }

  // 날짜별 슬롯 맵핑
  const slotsByDate = useMemo(() => {
    const map: Record<string, AdminSlotItem[]> = {};
    for (const s of monthlySlots) {
      if (!map[s.slotDate]) map[s.slotDate] = [];
      map[s.slotDate].push(s);
    }
    return map;
  }, [monthlySlots]);

  const selectedDaySlots = slotsByDate[selectedDate] || [];

  // 달력 셀 계산
  const firstDayWeek = new Date(calYear, calMonth - 1, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const calendarCells: Array<number | null> = [
    ...Array.from({ length: firstDayWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">하이브리드 예약 · 슬롯 달력 관리</h1>
          <p className="mt-1 text-sm text-slate-500">
            달력에서 날짜별 예약 현황을 한눈에 확인하고, 여러 날짜의 시간대 슬롯을 일괄 생성할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAutoConfirm}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              autoConfirm
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                autoConfirm ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            자동 예약 확정: {autoConfirm ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={downloadExcel}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            엑셀 다운로드 (.xlsx)
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {notice}
        </div>
      )}
      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {errorMsg}
        </div>
      )}

      {/* 1. 월간 달력 뷰 + 선택 날짜 슬롯 상세 패널 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 달력 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {calYear}년 {calMonth}월
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalYear(today.getFullYear());
                  setCalMonth(today.getMonth() + 1);
                  setSelectedDate(today.toISOString().slice(0, 10));
                }}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50"
              >
                오늘
              </button>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-slate-500">
            {WEEK_DAYS_KR.map((d, idx) => (
              <div key={d} className={`py-1 ${idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : ""}`}>
                {d}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarCells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="h-14 rounded-lg bg-slate-50/40 sm:h-20 sm:rounded-xl" />;
              const ymd = toYmd(calYear, calMonth, day);
              const daySlots = slotsByDate[ymd] || [];
              const totalReserved = daySlots.reduce((s, item) => s + item.reservedCount, 0);
              const totalCap = daySlots.reduce((s, item) => s + item.maxCapacity, 0);
              const isSelected = selectedDate === ymd;

              return (
                <button
                  key={ymd}
                  type="button"
                  onClick={() => setSelectedDate(ymd)}
                  className={`flex h-14 flex-col items-start justify-between rounded-lg border p-1 text-left transition sm:h-20 sm:rounded-xl sm:p-2 ${
                    isSelected
                      ? "border-primary bg-indigo-50/60 ring-2 ring-indigo-500/20"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className={`text-[11px] font-bold sm:text-xs ${isSelected ? "text-primary" : "text-slate-800"}`}>
                    {day}
                  </span>
                  {daySlots.length > 0 ? (
                    <div className="w-full space-y-0.5">
                      <div className="hidden truncate rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 sm:block">
                        슬롯 {daySlots.length}개
                      </div>
                      <div
                        className={`truncate rounded px-1 py-0.5 text-[9px] font-semibold sm:px-1.5 sm:text-[10px] ${
                          totalReserved > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {totalReserved}/{totalCap}
                      </div>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-300">-</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 선택된 날짜 시간대별 슬롯 상세 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900">{selectedDate} 시간대 슬롯</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            클릭하여 특정 시간대를 마감/열기 하거나 삭제할 수 있습니다.
          </p>

          <div className="mt-4 max-h-[380px] space-y-2 overflow-y-auto pr-1">
            {selectedDaySlots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400">
                이 날짜에 등록된 슬롯이 없습니다.
                <br />
                아래에서 단건 추가 또는 일괄 생성을 이용해 주세요.
              </div>
            ) : (
              selectedDaySlots.map((slot) => {
                const slotBookings = reservations.filter(
                  (r) => r.slotId === slot.slotId && r.status !== "CANCELLED"
                );
                return (
                  <div
                    key={slot.slotId}
                    className={`rounded-xl border p-3 ${
                      slot.closed ? "border-slate-200 bg-slate-100/80 opacity-80" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{slot.slotTime.slice(0, 5)}</span>
                          <span className="text-xs text-slate-500">{slot.serviceName}</span>
                        </div>
                        <div className="mt-0.5 text-[11px] font-semibold text-slate-600">
                          예약 {slot.reservedCount} / 정원 {slot.maxCapacity}명
                          {slot.closed && <span className="ml-2 text-red-500">(마감됨)</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleSlot(slot.slotId)}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                          title={slot.closed ? "예약 열기" : "예약 마감"}
                        >
                          {slot.closed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <Unlock className="h-3 w-3" /> 열기
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600">
                              <Lock className="h-3 w-3" /> 마감
                            </span>
                          )}
                        </button>
                        {slot.reservedCount === 0 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(slot.slotId)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            title="슬롯 삭제"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {slotBookings.length > 0 && (
                      <div className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2">
                        {slotBookings.map((b) => (
                          <div
                            key={b.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-900">{b.customerName}</span>
                              <span className="ml-1.5 text-slate-500">{b.customerPhone}</span>
                              <span className="ml-1.5 text-slate-400">({b.visitorCount}명)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  b.status === "CONFIRMED"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : b.status === "COMPLETED"
                                    ? "bg-slate-200 text-slate-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {b.status === "CONFIRMED"
                                  ? "확정"
                                  : b.status === "COMPLETED"
                                  ? "완료"
                                  : "대기"}
                              </span>
                              {b.status === "REQUESTED" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(b.id, "CONFIRMED")}
                                  className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white hover:bg-emerald-700"
                                >
                                  확정
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleStatusChange(b.id, "CANCELLED")}
                                className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-red-100 hover:text-red-700"
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 2. 슬롯 생성 패널 (일괄 생성 모드 / 단건 추가 모드) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setCreateTab("BATCH")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              createTab === "BATCH" ? "btn-primary" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            일괄 생성 모드 (추천)
          </button>
          <button
            type="button"
            onClick={() => setCreateTab("SINGLE")}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              createTab === "SINGLE" ? "btn-primary" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            선택 날짜({selectedDate}) 1건 추가
          </button>
        </div>

        {createTab === "BATCH" ? (
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">시작 날짜</label>
                <input
                  type="date"
                  required
                  value={batchStart}
                  onChange={(e) => setBatchStart(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">종료 날짜</label>
                <input
                  type="date"
                  required
                  value={batchEnd}
                  onChange={(e) => setBatchEnd(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">서비스명</label>
                <input
                  type="text"
                  value={batchService}
                  onChange={(e) => setBatchService(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">정원 (MULTI 모드 시)</label>
                <input
                  type="number"
                  min={1}
                  value={batchCap}
                  onChange={(e) => setBatchCap(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">적용 요일</span>
                <button
                  type="button"
                  onClick={() => setBatchDays(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"])}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
                >
                  평일만(월~금)
                </button>
                <button
                  type="button"
                  onClick={() => setBatchDays(JAVA_DAYS.map((d) => d.key))}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
                >
                  매일
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {JAVA_DAYS.map((d) => {
                  const active = batchDays.includes(d.key);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() =>
                        setBatchDays((prev) =>
                          prev.includes(d.key) ? prev.filter((x) => x !== d.key) : [...prev, d.key]
                        )
                      }
                      className={`h-9 w-9 rounded-lg border text-xs font-bold transition ${
                        active
                          ? "border-primary bg-indigo-50 text-primary"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">오픈할 시간대 (다중 선택)</span>
                <button
                  type="button"
                  onClick={() => setBatchTimes(["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"])}
                  className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200"
                >
                  영업시간(10~17시, 점심제외)
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TIME_PRESETS.map((t) => {
                  const active = batchTimes.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setBatchTimes((prev) =>
                          prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t].sort()
                        )
                      }
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-indigo-50 text-primary"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              선택한 조건으로 일괄 슬롯 생성하기
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateSingle} className="grid gap-3 sm:grid-cols-4 sm:items-end">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">시간</label>
              <input
                type="time"
                value={singleTime}
                onChange={(e) => setSingleTime(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">서비스명</label>
              <input
                type="text"
                value={singleService}
                onChange={(e) => setSingleService(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">정원 (MULTI 모드 시)</label>
              <input
                type="number"
                min={1}
                value={singleCap}
                onChange={(e) => setSingleCap(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl btn-primary px-4 py-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              슬롯 1건 추가
            </button>
          </form>
        )}
      </div>

      {/* 3. 접수된 예약 목록 */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="px-4 py-3">예약 일시</th>
              <th className="px-4 py-3">서비스</th>
              <th className="px-4 py-3">고객명 / 연락처</th>
              <th className="px-4 py-3">인원</th>
              <th className="px-4 py-3">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">
                  접수된 예약 내역이 없습니다.
                </td>
              </tr>
            ) : (
              reservations.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {item.slotDate} {item.slotTime.slice(0, 5)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.serviceName}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{item.customerName}</div>
                    <div className="text-xs text-slate-500">{item.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3">{item.visitorCount}명</td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium"
                    >
                      <option value="REQUESTED">접수대기</option>
                      <option value="CONFIRMED">예약확정</option>
                      <option value="CANCELLED">취소(좌석반환)</option>
                      <option value="COMPLETED">방문완료</option>
                      <option value="NO_SHOW">노쇼</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

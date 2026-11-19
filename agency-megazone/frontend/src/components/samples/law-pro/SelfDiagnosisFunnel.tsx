"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

type CaseField =
  | "성범죄"
  | "음주·교통"
  | "사기·횡령·배임"
  | "마약·폭행"
  | "기업형사";

type CaseStage =
  | "경찰 조사 연락 받음"
  | "조사 진행 중"
  | "검찰 송치"
  | "1심·항소심 재판 중";

interface FieldOption {
  code: string;
  label: CaseField;
  scope: string;
}

interface StageOption {
  code: string;
  label: CaseStage;
  desc: string;
  guidance: string;
}

interface SubmittedDiagnosis {
  field: CaseField;
  stage: CaseStage;
  customerName: string;
  customerPhone: string;
  situation: string;
  savedOffline: boolean;
}

const FIELD_OPTIONS: FieldOption[] = [
  {
    code: "01",
    label: "성범죄",
    scope: "카메라등이용촬영 · 강제추행 · 준강간 · 통신매체이용음란",
  },
  {
    code: "02",
    label: "음주·교통",
    scope: "음주운전 재범 · 특가법 도주치상(뺑소니) · 교통사고처리특례법",
  },
  {
    code: "03",
    label: "사기·횡령·배임",
    scope: "투자·전세사기 · 업무상 횡령·배임 · 특정경제범죄가중처벌법",
  },
  {
    code: "04",
    label: "마약·폭행",
    scope: "마약류관리법 투약·소지 · 특수폭행 · 상해 · 공무집행방해",
  },
  {
    code: "05",
    label: "기업형사",
    scope: "압수수색 대응 · 영업비밀 침해 · 중대재해처벌법 · 조세범처벌법",
  },
];

const STAGE_OPTIONS: StageOption[] = [
  {
    code: "A",
    label: "경찰 조사 연락 받음",
    desc: "출석 요구서 수령 또는 담당 수사관의 첫 연락을 받은 단계",
    guidance:
      "첫 피의자 신문조서는 수사 전체와 공판까지 핵심 증거로 남습니다. 출석 전 정보공개청구로 고소 요지를 확인하고 진술 방향을 확정해야 합니다.",
  },
  {
    code: "B",
    label: "조사 진행 중",
    desc: "1차 경찰 조사를 마쳤거나 추가 출석·대질조사가 예정된 단계",
    guidance:
      "기존 진술의 모순을 보완하고 객관적 반증(포렌식·CCTV·금융자료)과 변호인 의견서를 불송치 결정 전 신속히 제출해야 하는 시점입니다.",
  },
  {
    code: "C",
    label: "검찰 송치",
    desc: "경찰 송치 결정 이후 검찰 보완수사 및 기소 여부를 앞둔 단계",
    guidance:
      "검사 처분 전 혐의없음·기소유예 또는 보완수사 요구를 이끌어내기 위해 법리적 의견서와 양형·합의 전략을 집중 가동해야 합니다.",
  },
  {
    code: "D",
    label: "1심·항소심 재판 중",
    desc: "공소장을 송달받았거나 공판 기일·항소심 변론을 준비 중인 단계",
    guidance:
      "수사기록 열람·등사를 통해 증거능력을 탄핵하고, 무죄 입증 또는 집행유예·감형을 위한 체계적인 공판 변론 계획이 필요합니다.",
  },
];

const STEPS = [
  { num: 1 as const, code: "STEP 01", title: "사건 분야" },
  { num: 2 as const, code: "STEP 02", title: "진행 단계" },
  { num: 3 as const, code: "STEP 03", title: "비밀상담 접수" },
];

export default function SelfDiagnosisFunnel() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [field, setField] = useState<CaseField | null>(null);
  const [stage, setStage] = useState<CaseStage | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [situation, setSituation] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState<SubmittedDiagnosis | null>(null);

  const selectedStageObj = STAGE_OPTIONS.find((item) => item.label === stage);

  function handleSelectField(nextField: CaseField) {
    setField(nextField);
    setErrorMsg("");
  }

  function handleSelectStage(nextStage: CaseStage) {
    setStage(nextStage);
    setErrorMsg("");
  }

  function goToStep(target: 1 | 2 | 3) {
    if (target === 2 && !field) {
      setErrorMsg("사건 분야를 먼저 선택해 주세요.");
      return;
    }
    if (target === 3 && (!field || !stage)) {
      setErrorMsg("사건 분야와 현재 진행 단계를 모두 선택해 주세요.");
      return;
    }
    setErrorMsg("");
    setStep(target);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!field || !stage) {
      setErrorMsg("사건 분야와 진행 단계를 먼저 선택해 주세요.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg("성함과 연락처를 정확히 입력해 주세요.");
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
    const trimmedSituation = situation.trim();
    const title = `[선율 형사자가진단] ${field} - ${stage}`;
    const content = [
      `사건 분야: ${field}`,
      `진행 단계: ${stage}`,
      `간단 상황: ${trimmedSituation || "상담 시 상세 설명 예정"}`,
    ].join("\n");
    const customFieldsJson = JSON.stringify({
      sampleSource: "law-pro-diagnosis",
      field,
      stage,
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

    let savedOffline = false;

    try {
      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      savedOffline = true;
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

    setSubmitted({
      field,
      stage,
      customerName: trimmedName,
      customerPhone: trimmedPhone,
      situation: trimmedSituation,
      savedOffline,
    });
  }

  function handleReset() {
    setSubmitted(null);
    setStep(1);
    setField(null);
    setStage(null);
    setCustomerName("");
    setCustomerPhone("");
    setSituation("");
    setPrivacyAgreed(true);
    setWebsiteUrl("");
    setErrorMsg("");
  }

  return (
    <section
      id="diagnosis"
      className="overflow-x-clip border-b border-slate-200 bg-white py-16 text-[#111827] sm:py-24"
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
                CRIMINAL SELF-DIAGNOSIS
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
              사건 초기 3단계 형사 자가진단
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            사건 분야와 현재 수사·재판 단계를 선택하시면 형사전담센터
            변호사가 초기 대응 전략과 예상 쟁점을 비공개로 검토해 드립니다.
          </p>
        </div>

        {/* 메인 직각 패널 */}
        <div className="mt-8 border border-slate-200 bg-white">
          {/* 상단 직각 진행 표시 바 */}
          <div
            className="grid grid-cols-3 border-b border-slate-200"
            aria-label="형사 자가진단 진행 단계"
          >
            {STEPS.map((item, idx) => {
              const isCurrent = !submitted && step === item.num;
              const isCompleted = submitted !== null || step > item.num;
              const canClick =
                !submitted &&
                (item.num === 1 ||
                  (item.num === 2 && field !== null) ||
                  (item.num === 3 && field !== null && stage !== null));

              return (
                <button
                  key={item.code}
                  type="button"
                  disabled={!canClick}
                  onClick={() => canClick && goToStep(item.num)}
                  className={`relative min-w-0 px-3 py-4 text-left transition-colors sm:px-6 sm:py-5 ${
                    idx < STEPS.length - 1 ? "border-r border-slate-200" : ""
                  } ${
                    isCurrent
                      ? "bg-[#0F2952] text-white"
                      : isCompleted
                        ? "bg-white text-[#0F2952] hover:bg-[#F5F7FA]"
                        : "cursor-not-allowed bg-[#F5F7FA] text-slate-400"
                  }`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-[3px] ${
                      isCurrent || isCompleted
                        ? "bg-[#0F2952]"
                        : "bg-transparent"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[10px] font-bold tracking-[0.14em] sm:text-xs ${
                        isCurrent
                          ? "text-white/80"
                          : isCompleted
                            ? "text-[#0F2952]"
                            : "text-slate-400"
                      }`}
                    >
                      {item.code}
                    </span>
                    {isCompleted && !isCurrent && (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-[#0F2952]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="mt-1 truncate text-xs font-bold sm:text-base">
                    {item.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 본문 영역 */}
          <div className="p-5 sm:p-8 lg:p-10">
            {submitted ? (
              /* 제출 완료 화면 */
              <div className="space-y-8">
                <div className="border-l-4 border-[#0F2952] bg-[#F5F7FA] p-5 sm:p-6">
                  <p className="text-xs font-bold tracking-[0.16em] text-[#0F2952]">
                    DIAGNOSIS RECEIVED
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold text-[#111827] sm:text-2xl">
                    형사 자가진단 비밀상담이 정상 접수되었습니다.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    법무법인 선율 형사전담팀 변호사가 접수 내역을 즉시 확인한 뒤,
                    입력하신 연락처로 비공개 회신드립니다.
                    {submitted.savedOffline
                      ? " (현재 체험 환경으로 로컬 관리자 목록에 즉시 반영되었습니다.)"
                      : ""}
                  </p>
                </div>

                {/* 접수 요약 테이블 */}
                <div className="border border-slate-200">
                  <div className="border-b border-slate-200 bg-[#F5F7FA] px-5 py-3 text-xs font-bold tracking-wider text-[#111827]">
                    접수 내역 요약
                  </div>
                  <dl className="divide-y divide-slate-200 text-sm">
                    <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                      <dt className="font-semibold text-slate-500">사건 분야</dt>
                      <dd className="font-bold text-[#0F2952] sm:col-span-3">
                        {submitted.field}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                      <dt className="font-semibold text-slate-500">진행 단계</dt>
                      <dd className="font-bold text-[#111827] sm:col-span-3">
                        {submitted.stage}
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                      <dt className="font-semibold text-slate-500">
                        신청자 / 연락처
                      </dt>
                      <dd className="text-[#111827] sm:col-span-3">
                        {submitted.customerName} ({submitted.customerPhone})
                      </dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 px-5 py-3.5 sm:grid-cols-4 sm:gap-4">
                      <dt className="font-semibold text-slate-500">간단 상황</dt>
                      <dd className="whitespace-pre-line text-slate-700 sm:col-span-3">
                        {submitted.situation || "전화 상담 시 상세 설명 예정"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/admin/inquiries"
                    className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0F2952] px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-[#111827]"
                  >
                    <span>
                      관리자(/admin/inquiries)에서 방금 접수된 자가진단 확인하기
                      →
                    </span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center justify-center rounded-none border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-[#111827] transition-colors hover:border-[#0F2952] hover:text-[#0F2952]"
                  >
                    새로운 자가진단 진행하기
                  </button>
                </div>
              </div>
            ) : step === 1 ? (
              /* STEP 01: 사건 분야 선택 */
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-extrabold text-[#111827] sm:text-xl">
                    01. 상담이 필요한 형사 사건 분야를 선택해 주세요.
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    복수 혐의인 경우 가장 핵심 혐의 1가지를 선택하세요.
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {FIELD_OPTIONS.map((option) => {
                    const isSelected = field === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => handleSelectField(option.label)}
                        className={`flex min-w-0 flex-col justify-between rounded-none border p-5 text-left transition-colors ${
                          isSelected
                            ? "border-[#0F2952] bg-[#0F2952] text-white"
                            : "border-slate-200 bg-white text-[#111827] hover:border-[#0F2952] hover:bg-[#F5F7FA]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-bold tracking-[0.14em] ${
                              isSelected ? "text-white/75" : "text-slate-400"
                            }`}
                          >
                            FIELD {option.code}
                          </span>
                          {isSelected && (
                            <Check
                              className="h-4 w-4 shrink-0 text-white"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="mt-4 text-lg font-extrabold tracking-tight">
                          {option.label}
                        </div>
                        <p
                          className={`mt-2 text-xs leading-relaxed ${
                            isSelected ? "text-white/85" : "text-slate-600"
                          }`}
                        >
                          {option.scope}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {errorMsg && (
                  <p className="mt-4 border-l-2 border-[#111827] bg-[#F5F7FA] px-4 py-2.5 text-xs font-semibold text-[#111827]">
                    {errorMsg}
                  </p>
                )}

                <div className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Lock className="h-3.5 w-3.5 shrink-0 text-[#0F2952]" />
                    <span>
                      변호사법 제26조에 따라 모든 진단 내용은 철저히 비밀이
                      보장됩니다.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0F2952] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#111827] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <span>다음 단계: 진행 단계 선택</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : step === 2 ? (
              /* STEP 02: 현재 진행 단계 선택 */
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border border-slate-200 bg-[#F5F7FA] px-4 py-3 text-xs">
                  <span className="text-slate-600">
                    선택한 사건 분야:{" "}
                    <strong className="font-bold text-[#0F2952]">
                      {field}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="font-semibold text-[#111827] underline underline-offset-4 hover:text-[#0F2952]"
                  >
                    분야 변경
                  </button>
                </div>

                <h3 className="mt-6 text-lg font-extrabold text-[#111827] sm:text-xl">
                  02. 현재 사건은 어느 단계에 있습니까?
                </h3>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {STAGE_OPTIONS.map((option) => {
                    const isSelected = stage === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => handleSelectStage(option.label)}
                        className={`flex min-w-0 flex-col justify-between rounded-none border p-5 text-left transition-colors ${
                          isSelected
                            ? "border-[#0F2952] bg-[#0F2952] text-white"
                            : "border-slate-200 bg-white text-[#111827] hover:border-[#0F2952] hover:bg-[#F5F7FA]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-xs font-bold tracking-[0.14em] ${
                              isSelected ? "text-white/75" : "text-slate-400"
                            }`}
                          >
                            STAGE {option.code}
                          </span>
                          {isSelected && (
                            <Check
                              className="h-4 w-4 shrink-0 text-white"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="mt-3 text-base font-extrabold sm:text-lg">
                          {option.label}
                        </div>
                        <p
                          className={`mt-1.5 text-xs leading-relaxed ${
                            isSelected ? "text-white/85" : "text-slate-600"
                          }`}
                        >
                          {option.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {selectedStageObj && (
                  <div className="mt-5 border-l-4 border-[#0F2952] bg-[#F5F7FA] px-5 py-4">
                    <div className="text-xs font-bold tracking-wider text-[#0F2952]">
                      단계별 핵심 대응 포인트
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#111827]">
                      {selectedStageObj.guidance}
                    </p>
                  </div>
                )}

                {errorMsg && (
                  <p className="mt-4 border-l-2 border-[#111827] bg-[#F5F7FA] px-4 py-2.5 text-xs font-semibold text-[#111827]">
                    {errorMsg}
                  </p>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="inline-flex items-center justify-center gap-2 rounded-none border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#111827] transition-colors hover:border-[#0F2952]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>이전 단계</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(3)}
                    className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0F2952] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#111827]"
                  >
                    <span>다음 단계: 비밀상담 접수</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* STEP 03: 비밀상담 접수 폼 */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot 숨김 필드 */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="diagnosis_website_url">Website</label>
                  <input
                    id="diagnosis_website_url"
                    name="websiteUrl"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 border border-slate-200 bg-[#F5F7FA] text-xs sm:grid-cols-2 sm:divide-x sm:divide-slate-200">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 sm:border-b-0">
                    <span className="text-slate-500">선택 분야</span>
                    <strong className="font-bold text-[#0F2952]">
                      {field}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <span className="text-slate-500">진행 단계</span>
                    <strong className="font-bold text-[#111827]">
                      {stage}
                    </strong>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-extrabold text-[#111827] sm:text-xl">
                    03. 비공개 회신받으실 연락처와 상황을 입력해 주세요.
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    접수 즉시 형사전담센터 담당 변호사에게 직통 배정됩니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label
                      htmlFor="diag-name"
                      className="mb-1.5 block text-xs font-bold text-[#111827]"
                    >
                      성함 (가명 가능) *
                    </label>
                    <input
                      id="diag-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="예: 김OO"
                      className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#0F2952]"
                    />
                  </div>
                  <div className="min-w-0">
                    <label
                      htmlFor="diag-phone"
                      className="mb-1.5 block text-xs font-bold text-[#111827]"
                    >
                      연락처 *
                    </label>
                    <input
                      id="diag-phone"
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
                    htmlFor="diag-situation"
                    className="mb-1.5 block text-xs font-bold text-[#111827]"
                  >
                    간단한 사건 상황 (선택)
                  </label>
                  <textarea
                    id="diag-situation"
                    rows={4}
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="경찰 출석 예정일, 혐의 요지, 긴급 대응 필요 여부 등을 간략히 남겨주시면 더욱 정확한 진단이 가능합니다."
                    className="w-full rounded-none border border-slate-300 bg-white px-3.5 py-3 text-sm leading-relaxed text-[#111827] outline-none transition-colors focus:border-[#0F2952]"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-2.5 border border-slate-200 bg-[#F5F7FA] p-4 text-xs leading-relaxed text-slate-700">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#0F2952]"
                  />
                  <span>
                    <strong className="font-bold text-[#111827]">
                      [필수] 개인정보 수집·이용에 동의합니다.
                    </strong>{" "}
                    수집된 성함·연락처·사건 개요는 형사 법률상담 회신 목적
                    외에는 절대 사용되지 않으며, 변호사법 제26조에 따라 엄격히
                    비밀이 유지됩니다.
                  </span>
                </label>

                {errorMsg && (
                  <p className="border-l-2 border-[#111827] bg-[#F5F7FA] px-4 py-2.5 text-xs font-semibold text-[#111827]">
                    {errorMsg}
                  </p>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="inline-flex items-center justify-center gap-2 rounded-none border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-[#111827] transition-colors hover:border-[#0F2952]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>이전 단계</span>
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-none bg-[#0F2952] px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Lock className="h-4 w-4" />
                    <span>
                      {submitting
                        ? "비밀상담 접수 중..."
                        : "형사 자가진단 비밀상담 접수하기"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  FileCheck2,
  Layers,
  Lock,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { clientApiFetch } from "@/lib/api";

const PACKAGE_OPTIONS = [
  "DELUXE 99만 원 - 예약·비즈니스형 (인기)",
  "STANDARD 49만 원 - 홍보·문의형",
  "PREMIUM 179만 원 - 기업 맞춤·결제 확장형",
  "잘 모름 - 상담 후 결정",
] as const;

const INDUSTRY_OPTIONS = [
  "기업·제조·B2B",
  "인테리어·건축·시공",
  "병의원·한의원·클리닉",
  "로펌·세무·노무·전문직",
  "스튜디오·공간대여·학원",
  "기타",
] as const;

const CHECKPOINTS = [
  {
    step: "① 세금계산서·비교견적서 당일 발행 가능",
    desc: "법인·개인사업자 지출증빙 및 정부지원사업(초기창업패키지·바우처) 제출용 정식 견적서·비교견적서를 당일 즉시 발급해 드립니다.",
    icon: FileCheck2,
  },
  {
    step: "② 원고·사진이 없어도 업종별 표준 프리셋으로 초안 먼저 제작",
    desc: "문구와 사진 준비가 막막하셔도 걱정하지 마세요. 업종별 최적화된 레이아웃과 상업용 무료 고화질 이미지로 1차 초안을 먼저 세팅해 드립니다.",
    icon: Layers,
  },
  {
    step: "③ 평균 2시간 이내 담당 엔지니어 직접 회신",
    desc: "영업사원이 아닌 실제 프로젝트를 구축할 시니어 풀스택 엔지니어가 요구사항을 검토하여 정확한 일정과 구축 방향을 안내해 드립니다.",
    icon: Clock,
  },
];

export default function InquiriesPage() {
  const [category, setCategory] = useState("ESTIMATE");
  const [preferredPlan, setPreferredPlan] = useState<string>(PACKAGE_OPTIONS[0]);
  const [industryType, setIndustryType] = useState<string>(INDUSTRY_OPTIONS[0]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState(""); // Honeypot 숨김 필드
  const [attachmentMediaId, setAttachmentMediaId] = useState<number | null>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/inquiries/attachment", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as {
        success: boolean;
        message: string;
        data?: { id: number; originalFilename: string };
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "파일 업로드 실패");
      }
      setAttachmentMediaId(json.data.id);
      setAttachmentName(json.data.originalFilename);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "첨부파일 업로드 중 오류가 발생했습니다.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const customFieldsPayload: Record<string, string> = {
        preferredPlan,
        industryType,
      };
      if (budgetRange) customFieldsPayload.budgetRange = budgetRange;
      if (referenceUrl) customFieldsPayload.referenceUrl = referenceUrl;

      const customFieldsJson = JSON.stringify(customFieldsPayload);

      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify({
          category,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          title,
          content,
          customFieldsJson,
          attachmentMediaId,
          privacyAgreed,
          websiteUrl,
        }),
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "문의 접수 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
          무료 견적·상담 문의가 정상 접수되었습니다.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          선택하신 <strong>[{preferredPlan}]</strong> 및 <strong>[{industryType}]</strong> 기준으로
          담당 엔지니어가 검토 후 평균 2시간 이내에 연락드리겠습니다.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setTitle("");
              setContent("");
              setAttachmentMediaId(null);
              setAttachmentName("");
            }}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            추가 문의 작성하기
          </button>
          <Link
            href="/portfolio"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            업종별 샘플 쇼룸 둘러보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pb-20">
      {/* 상단 헤더 */}
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>FREE ESTIMATE & CONSULTATION · 100% 정찰제 맞춤 견적</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            무료 견적 및 구축 상담 문의
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            복잡한 기획서가 없어도 괜찮습니다. 업종과 희망 패키지만 선택해 주시면 최적의 구축 일정과
            정찰제 견적서를 안내해 드립니다.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* 좌측: 견적 문의 전 체크 포인트 3가지 */}
          <aside className="space-y-5 lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm sm:p-7">
              <span className="inline-block rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300">
                CHECK POINTS
              </span>
              <h2 className="mt-3 text-xl font-extrabold">
                견적 문의 전 체크 포인트 3가지
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                크몽·숨고 의뢰인분들이 가장 만족하시는 당사만의 안심 보장 원칙입니다.
              </p>

              <div className="mt-6 space-y-4">
                {CHECKPOINTS.map((cp) => {
                  const Icon = cp.icon;
                  return (
                    <div
                      key={cp.step}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white">{cp.step}</h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                            {cp.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  월 고정 관리·임대료 0원 보장
                </span>
                <Link href="/notices" className="underline hover:text-white">
                  정찰제 상세 보기 →
                </Link>
              </div>
            </div>

            {/* 보안 안내 박스 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                <Lock className="h-4 w-4 text-blue-600" />
                <span>첨부 자료 및 개인정보 비공개 보안 보호</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                첨부해 주시는 제안요청서(RFP), 사업계획서, 참고 자료는 외부 URL 접근이 완전히 차단된
                비공개 보안 스토리지(Private Storage)에 암호화되어 저장되며, 담당 엔지니어 외에는 열람할 수 없습니다.
              </p>
            </div>
          </aside>

          {/* 우측: 한국 에이전시 맞춤 견적 문의 폼 */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8"
            >
              {/* 스팸 봇 방어용 Honeypot 숨김 필드 (일반 사용자에게 보이지 않음) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_url">Website</label>
                <input
                  id="website_url"
                  name="website_url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>

              {/* 희망 패키지 & 업종 선택 */}
              <div className="grid gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-extrabold text-slate-800">
                    희망 패키지 선택 *
                  </label>
                  <select
                    value={preferredPlan}
                    onChange={(e) => setPreferredPlan(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 sm:text-sm"
                  >
                    {PACKAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-extrabold text-slate-800">
                    고객사 업종 선택 *
                  </label>
                  <select
                    value={industryType}
                    onChange={(e) => setIndustryType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 sm:text-sm"
                  >
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 문의 유형 & 예산 범위 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    문의 유형
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  >
                    <option value="ESTIMATE">신규 제작 · 리뉴얼 견적 문의</option>
                    <option value="GENERAL">기능 · 정부지원사업 일반 상담</option>
                    <option value="PARTNERSHIP">유지보수 · 제휴/협력 문의</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    예상 예산 또는 희망 오픈일 (선택)
                  </label>
                  <input
                    type="text"
                    placeholder="예: 100만 원 내외 / 다음 달 오픈 희망"
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* 성함 & 연락처 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    성함 / 업체(담당자)명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="예: 홍길동 대표 / (주)스타터"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    연락처 (휴대폰 또는 직통번호) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010-1234-5678"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              {/* 이메일 & 벤치마킹 사이트 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    견적서 수신 이메일 (선택)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    참고(벤치마킹) 사이트 주소 (선택)
                  </label>
                  <input
                    type="text"
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    placeholder="예: https://... 또는 포트폴리오 샘플명"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  문의 제목 *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 병원 홈페이지 예약형(Deluxe) 제작 견적 및 일정 문의드립니다."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  상세 문의 내용 *
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="필요하신 메뉴 구성, 예약/결제 기능 여부, 세금계산서·정부지원사업 서류 필요 여부 등을 자유롭게 적어주세요."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  기획안 · 사업자등록증 · 참고 파일 첨부 (비공개 보안 저장)
                </label>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-600 transition hover:border-blue-400 hover:bg-blue-50/40">
                  <Paperclip className="h-4 w-4 shrink-0 text-blue-600" />
                  <span className="truncate text-xs font-medium">
                    {attachmentName
                      ? `첨부 완료: ${attachmentName}`
                      : "PDF, 한글/워드 기획안, 이미지 등 파일 선택 (선택사항)"}
                  </span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  required
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span>
                  견적 산출 및 상담 회신을 위한 개인정보 수집·이용에 동의합니다. (필수)
                </span>
              </label>

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
                <Send className="h-4 w-4" />
                {submitting ? "견적 문의 접수 중..." : "무료 견적 문의 접수하기"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

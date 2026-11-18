"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardCheck, MessageSquarePlus, Paperclip, Send, ShieldCheck } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

const CHECK_POINTS = [
  {
    step: "01",
    title: "추가 월 임대료 0원 · 실비 투명 안내",
    desc: "제작사 월 임대료는 0원이며, 도메인·독립 서버 실비(고객사 직접 소유) 및 전자결제(PG) 연동 범위까지 투명하게 안내해 드립니다.",
  },
  {
    step: "02",
    title: "참고 자료가 있다면 첨부",
    desc: "회사 소개서나 참고하고 싶은 사이트 주소를 적어주시면 훨씬 정확한 견적이 나옵니다.",
  },
  {
    step: "03",
    title: "최대 24시간 이내 순차 회신",
    desc: "100% 비대면 온라인 진행 (1차 온라인 상담·견적 접수 → 필요 시 사전 예약 전화·화상 미팅)으로 안내해 드립니다.",
  },
];

export default function InquiriesPage() {
  const [category, setCategory] = useState("ESTIMATE");
  const [desiredPackage, setDesiredPackage] = useState("DELUXE");
  const [industry, setIndustry] = useState("CORP");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
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
      const customFields: Record<string, string> = {};
      if (desiredPackage) customFields.desiredPackage = desiredPackage;
      if (industry) customFields.industry = industry;
      if (budgetRange) customFields.budgetRange = budgetRange;

      const customFieldsJson = JSON.stringify(customFields);

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
      <div className="overflow-x-hidden bg-white">
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
            상담 문의가 정상 접수되었습니다.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            전담 담당자가 확인 후 입력하신 연락처로 신속하게 연락드리겠습니다.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setTitle("");
              setContent("");
              setAttachmentMediaId(null);
              setAttachmentName("");
            }}
            className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            추가 문의하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-slate-50">
      {/* 상단 다크 네이비/바이올렛 2단 컴팩트 배너 헤더 */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-10 text-white sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-violet-600/20" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
                <MessageSquarePlus className="h-3.5 w-3.5" />
                상담 및 견적 문의 · INQUIRIES
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                대표님의 업종에 꼭 맞는
                <br className="hidden sm:block" /> 맞춤형 홈페이지 견적을 받아보세요
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                부담 없는 무료 상담으로 시작하세요. 불필요한 기능은 빼고, 실제 매출과
                신뢰도 향상에 필요한 구성만 정직하게 제안해 드립니다.
              </p>
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
                    <dd className="font-bold text-white">24시간 상시</dd>
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

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 좌측/메인: 상담 문의 폼 (2컬럼 차지) */}
            <div className="min-w-0 lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-8"
              >
                {/* 자동 입력 봇 방어용 숨김 필드 (일반 방문자에게 보이지 않음) */}
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

                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">상담 신청서 작성</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    * 표시는 필수 입력 항목입니다. 작성하신 내용은 비공개로 안전하게 보호됩니다.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      문의 유형
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="ESTIMATE">홈페이지 제작 견적 문의</option>
                      <option value="GENERAL">일반 상담 및 기능 문의</option>
                      <option value="PARTNERSHIP">제휴 · 협력 문의</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      희망 패키지
                    </label>
                    <select
                      value={desiredPackage}
                      onChange={(e) => setDesiredPackage(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="UNDECIDED">미정 (상담 후 추천받기)</option>
                      <option value="STANDARD">Standard 패키지 (49만 원)</option>
                      <option value="DELUXE">Deluxe 패키지 (99만 원 · 추천)</option>
                      <option value="PREMIUM">Premium 패키지 (179만 원)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      업종 선택
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                    >
                      <option value="CORP">일반 기업 · 제조 · 유통</option>
                      <option value="CLINIC">병원 · 의원 · 클리닉</option>
                      <option value="LAW_TAX">법률 · 세무 · 전문직</option>
                      <option value="IT_STARTUP">IT · 스타트업 · 서비스</option>
                      <option value="EDU">교육 · 아카데미 · 학원</option>
                      <option value="ETC">기타 업종</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      예상 예산 범위 (선택)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 100만 원 내외"
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      성함 / 담당자명 *
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
                    문의 제목 *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 신규 기업 홈페이지 제작 견적 문의드립니다."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    상세 내용 *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="원하시는 분위기, 참고 사이트 주소, 오픈 희망 일정 등을 자유롭게 적어주세요."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    참고 파일 첨부 (비공개 안전 저장)
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
                    <Paperclip className="h-4 w-4 shrink-0 text-blue-600" />
                    <span className="truncate">
                      {attachmentName
                        ? `첨부됨: ${attachmentName}`
                        : "회사소개서, PDF, 이미지, 견적 요청서 등 파일 선택"}
                    </span>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    required
                    className="mt-0.5"
                  />
                  <span>
                    상담 접수 및 답변 안내를 위한 개인정보 수집·이용에 동의합니다. (필수)
                  </span>
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
                  {submitting ? "접수 중..." : "상담 문의 접수하기"}
                </button>
              </form>
            </div>

            {/* 우측: 견적 전 체크 포인트 3가지 안내 */}
            <aside className="min-w-0 space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
                <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  <span>견적 문의 전 체크 포인트 3가지</span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                  문의하시기 전에 아래 3가지만 확인하시면 더욱 빠르고 정확한 상담이 가능합니다.
                </p>

                <div className="mt-5 space-y-4">
                  {CHECK_POINTS.map((cp) => (
                    <div
                      key={cp.step}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-[#0B0F19] px-2 py-0.5 text-[11px] font-bold text-white">
                          {cp.step}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{cp.title}</h3>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{cp.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-[#0B0F19] p-6 text-white">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-300">
                  <ShieldCheck className="h-5 w-5" />
                  <span>100% 자체 소유 보장</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  계약 강요나 불필요한 옵션 추가 없이, 대표님 사업에 꼭 필요한 구성만
                  솔직하게 안내해 드립니다.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CheckCircle2, Paperclip, Send } from "lucide-react";
import { clientApiFetch } from "@/lib/api";

export default function InquiriesPage() {
  const [category, setCategory] = useState("ESTIMATE");
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
      const customFieldsJson = JSON.stringify(
        budgetRange ? { budgetRange } : {}
      );
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
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">상담 문의가 정상 접수되었습니다.</h1>
        <p className="mt-2 text-sm text-slate-600">
          담당자가 확인 후 입력하신 연락처로 신속하게 연락드리겠습니다.
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
          className="mt-6 rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold"
        >
          추가 문의하기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">상담 및 견적 문의</h1>
      <p className="mt-2 text-sm text-slate-600">
        아래 양식을 작성해 주시면 담당자가 빠르게 확인하여 답변드립니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">문의 유형</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="ESTIMATE">견적 문의</option>
              <option value="GENERAL">일반 상담</option>
              <option value="PARTNERSHIP">제휴/협력</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">예상 예산 범위 (선택)</label>
            <input
              type="text"
              placeholder="예: 300만 원 ~ 500만 원"
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">성함 *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="홍길동"
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
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">이메일 (선택)</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">문의 제목 *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="문의 제목을 입력해 주세요"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">상세 내용 *</label>
          <textarea
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상담 원하시는 내용을 상세히 적어주세요."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            참고 파일 첨부 (비공개 보안 저장)
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
            <Paperclip className="h-4 w-4 text-primary" />
            <span>{attachmentName ? `첨부됨: ${attachmentName}` : "PDF, 이미지, 견적 요청서 등 파일 선택"}</span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            required
          />
          <span>상담 접수 및 답변 안내를 위한 개인정보 수집·이용에 동의합니다. (필수)</span>
        </label>

        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl btn-primary py-3 text-sm font-semibold disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitting ? "접수 중..." : "상담 문의 접수하기"}
        </button>
      </form>
    </div>
  );
}

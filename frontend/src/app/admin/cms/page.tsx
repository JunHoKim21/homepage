"use client";

import { useEffect, useState } from "react";
import { Edit2, Lock, Plus, Trash2, Upload, X } from "lucide-react";
import { adminApiFetch, type CmsContentItem } from "@/lib/api";

const CATEGORIES = [
  { key: "NOTICE", label: "공지사항" },
  { key: "PORTFOLIO", label: "포트폴리오 · 사례" },
  { key: "BANNER", label: "배너 (구역별 이미지)" },
  { key: "POPUP", label: "레이어 팝업" },
  { key: "FAQ", label: "자주 묻는 질문" },
  { key: "TERMS", label: "약관 · 방침" },
] as const;

export default function AdminCmsPage() {
  const [category, setCategory] = useState<string>("NOTICE");
  const [items, setItems] = useState<CmsContentItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");

  function load(cat: string) {
    adminApiFetch<CmsContentItem[]>(`/api/admin/cms?category=${cat}`).then(setItems).catch(() => {});
  }

  useEffect(() => {
    resetForm();
    load(category);
  }, [category]);

  function resetForm() {
    setEditingId(null);
    setSlug("");
    setTitle("");
    setSummary("");
    setThumbnailUrl("");
    setIsPublished(true);
  }

  function startEdit(item: CmsContentItem) {
    setEditingId(item.id);
    setSlug(item.slug);
    setTitle(item.title);
    setSummary(item.summary || "");
    setThumbnailUrl(item.thumbnailUrl || "");
    setIsPublished(item.isPublished);
    setNotice(`'${item.title}' 항목을 수정 중입니다.`);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setNotice("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminApiFetch<{ storageKey: string }>("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      setThumbnailUrl(res.storageKey);
      setNotice("이미지가 업로드되어 최적화되었습니다. 등록/저장 버튼을 눌러 반영해 주세요.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "이미지 업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotice("");
    const payload = {
      slug: slug.trim() || `${category.toLowerCase()}-${Date.now()}`,
      category,
      title,
      summary,
      contentHtml: `<p>${summary}</p>`,
      thumbnailUrl: thumbnailUrl || null,
      extraJson: "{}",
      isPinned: false,
      isPublished,
    };

    if (editingId) {
      await adminApiFetch(`/api/admin/cms/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setNotice("수정 사항이 저장되었습니다.");
    } else {
      await adminApiFetch("/api/admin/cms", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setNotice("신규 콘텐츠가 등록되었습니다.");
    }
    resetForm();
    load(category);
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await adminApiFetch(`/api/admin/cms/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    load(category);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">게시판 · 배너 · 팝업 관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          공지사항, 포트폴리오, 구역별 배너 이미지, 레이어 팝업을 등록하고 즉시 수정할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setCategory(cat.key)}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              category === cat.key
                ? "btn-primary"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-xs font-medium text-indigo-700">
          {notice}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            {editingId ? "기존 항목 수정" : "새 항목 등록"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
            >
              <X className="h-3.5 w-3.5" /> 수정 취소
            </button>
          )}
        </div>

        <div className={`grid gap-3 ${category === "BANNER" ? "sm:grid-cols-2" : ""}`}>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">제목 *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={category === "BANNER" ? "예: 메인 상단 히어로 배너" : "제목을 입력하세요"}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {category === "BANNER" && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                배너 위치 코드 (예: hero-main)
              </label>
              <input
                type="text"
                value={slug}
                disabled={editingId !== null}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="hero-main"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
              />
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">내용 / 요약 문구</label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="화면에 표시될 설명 문구를 입력하세요."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt="선택된 사진 미리보기"
                className="h-14 w-20 rounded-lg border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-[11px] text-slate-400">
                사진 없음
              </div>
            )}
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Upload className="h-3.5 w-3.5 text-primary" />
              <span>{uploading ? "업로드 중..." : thumbnailUrl ? "사진 변경" : "사진 선택"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {thumbnailUrl && (
              <button
                type="button"
                onClick={() => setThumbnailUrl("")}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
              >
                제거
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span>홈페이지 공개</span>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl btn-primary px-5 py-2 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" />
              {editingId ? "수정 저장" : "등록하기"}
            </button>
          </div>
        </div>
      </form>

      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">등록된 콘텐츠가 없습니다.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                {item.thumbnailUrl && (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="h-12 w-16 rounded-lg border border-slate-200 object-cover"
                  />
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                      {item.slug}
                    </span>
                    {!item.isPublished && (
                      <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        비공개
                      </span>
                    )}
                    {item.isSystem && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                        <Lock className="h-3 w-3" /> 필수 문서
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{item.summary}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-primary"
                  title="수정"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                {!item.isSystem && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Edit2, Image as ImageIcon, Lock, Plus, Trash2, Upload, X } from "lucide-react";
import { adminApiFetch, deletePublicMedia, isVideoUrl, type CmsContentItem } from "@/lib/api";
import SmartPreviewImage from "@/components/SmartPreviewImage";

const CATEGORIES = [
  { key: "NOTICE", label: "공지사항" },
  { key: "PORTFOLIO", label: "포트폴리오 · 사례" },
  { key: "BANNER", label: "배너 (구역별 이미지)" },
  { key: "POPUP", label: "레이어 팝업" },
  { key: "FAQ", label: "자주 묻는 질문" },
  { key: "TERMS", label: "약관 · 방침" },
] as const;

const BANNER_LOCATIONS = [
  { value: "hero-main", label: "메인 상단 히어로 배너 (hero-main)" },
  { value: "sub-promo", label: "서브 프로모션 배너 (sub-promo)" },
];

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
  const [imgError, setImgError] = useState(false);
  const [notice, setNotice] = useState("");

  function load(cat: string) {
    adminApiFetch<CmsContentItem[]>(`/api/admin/cms?category=${cat}`).then(setItems).catch(() => {});
  }

  useEffect(() => {
    resetForm();
    if (category === "BANNER") {
      setSlug("hero-main");
    }
    load(category);
  }, [category]);

  function resetForm() {
    setEditingId(null);
    setSlug("");
    setTitle("");
    setSummary("");
    setThumbnailUrl("");
    setImgError(false);
    setIsPublished(true);
  }

  function startEdit(item: CmsContentItem) {
    setEditingId(item.id);
    setSlug(item.slug);
    setTitle(item.title);
    setSummary(item.summary || "");
    setThumbnailUrl(item.thumbnailUrl || "");
    setImgError(false);
    setIsPublished(item.isPublished);
    setNotice(`'${item.title}' 항목을 수정 중입니다.`);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setNotice("파일 크기는 최대 20MB 이하만 업로드할 수 있습니다.");
      return;
    }
    setUploading(true);
    setNotice("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await adminApiFetch<{ storageKey: string }>("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      if (thumbnailUrl && thumbnailUrl !== res.storageKey) {
        void deletePublicMedia(thumbnailUrl);
      }
      setThumbnailUrl(res.storageKey);
      setImgError(false);
      setNotice(
        isVideoUrl(res.storageKey)
          ? "동영상이 업로드되었습니다. 등록/저장 버튼을 눌러 반영해 주세요."
          : "이미지가 업로드되어 자동으로 최적화되었습니다. 등록/저장 버튼을 눌러 반영해 주세요."
      );
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
    const targetItem = items.find((it) => it.id === id);
    await adminApiFetch(`/api/admin/cms/${id}`, { method: "DELETE" });
    if (targetItem?.thumbnailUrl) {
      void deletePublicMedia(targetItem.thumbnailUrl);
    }
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
                ? "bg-blue-600 text-white shadow-xs"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-medium text-blue-700">
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
                배너 노출 위치 선택
              </label>
              <select
                value={BANNER_LOCATIONS.some((loc) => loc.value === slug) ? slug : "hero-main"}
                disabled={editingId !== null}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100"
              >
                {BANNER_LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
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

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          {category !== "FAQ" && category !== "TERMS" ? (
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
                {thumbnailUrl ? (
                  isVideoUrl(thumbnailUrl) && !imgError ? (
                    <video
                      src={thumbnailUrl}
                      muted
                      loop
                      playsInline
                      autoPlay
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : !isVideoUrl(thumbnailUrl) ? (
                    <SmartPreviewImage
                      src={thumbnailUrl}
                      alt={title || "선택된 사진"}
                      className="h-full w-full object-cover"
                      iconClassName="h-6 w-6 text-slate-300"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  )
                ) : (
                  <ImageIcon className="h-6 w-6 text-slate-300" />
                )}
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="text-xs font-semibold text-slate-700">
                  {category === "BANNER"
                    ? thumbnailUrl
                      ? "선택된 배너 사진/동영상"
                      : "배너 사진/동영상 (선택, 20MB 이하)"
                    : thumbnailUrl
                    ? "선택된 대표 사진"
                    : "대표 사진 (선택)"}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Upload className="h-3.5 w-3.5" />
                    <span>
                      {uploading
                        ? "업로드 중..."
                        : category === "BANNER"
                        ? thumbnailUrl
                          ? "사진/동영상 변경"
                          : "사진/동영상 선택"
                        : thumbnailUrl
                        ? "사진 변경"
                        : "사진 선택"}
                    </span>
                    <input
                      type="file"
                      accept={
                        category === "BANNER"
                          ? "image/jpeg,image/png,image/webp,video/mp4,video/webm"
                          : "image/jpeg,image/png,image/webp"
                      }
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {thumbnailUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        void deletePublicMedia(thumbnailUrl);
                        setThumbnailUrl("");
                        setImgError(false);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>제거</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              {category === "FAQ"
                ? "자주 묻는 질문은 제목(질문)과 요약(답변)만 입력하면 메인 화면에 바로 반영됩니다."
                : "약관·방침 문서는 텍스트 전용으로 관리됩니다."}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span>홈페이지 공개</span>
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700"
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
                {item.thumbnailUrl &&
                  (isVideoUrl(item.thumbnailUrl) ? (
                    <video
                      src={item.thumbnailUrl}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="h-12 w-16 rounded-lg border border-slate-200 object-cover"
                    />
                  ) : (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-12 w-16 rounded-lg border border-slate-200 object-cover"
                    />
                  ))}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString("ko-KR")}
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

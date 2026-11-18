"use client";

import { useEffect, useState } from "react";
import { Lock, Plus, Trash2 } from "lucide-react";
import { adminApiFetch, type CmsContentItem } from "@/lib/api";

const CATEGORIES = ["NOTICE", "PORTFOLIO", "FAQ", "BANNER", "POPUP", "TERMS"] as const;

export default function AdminCmsPage() {
  const [category, setCategory] = useState<string>("NOTICE");
  const [items, setItems] = useState<CmsContentItem[]>([]);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  function load(cat: string) {
    adminApiFetch<CmsContentItem[]>(`/api/admin/cms?category=${cat}`).then(setItems).catch(() => {});
  }

  useEffect(() => {
    load(category);
  }, [category]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await adminApiFetch("/api/admin/cms", {
      method: "POST",
      body: JSON.stringify({
        slug: slug || `post-${Date.now()}`,
        category,
        title,
        summary,
        contentHtml: `<p>${summary}</p>`,
        thumbnailUrl: thumbnailUrl || null,
        extraJson: "{}",
        isPinned: false,
        isPublished: true,
      }),
    });
    setSlug("");
    setTitle("");
    setSummary("");
    setThumbnailUrl("");
    load(category);
  }

  async function handleDelete(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await adminApiFetch(`/api/admin/cms/${id}`, { method: "DELETE" });
    load(category);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CMS 콘텐츠 관리</h1>
        <p className="mt-1 text-sm text-slate-500">공지사항, 포트폴리오, FAQ, 배너 및 약관을 관리합니다.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
              category === cat ? "btn-primary" : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleCreate} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-4 sm:items-end">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">제목 *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">요약/본문</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">썸네일 URL (선택)</label>
          <input
            type="text"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="/uploads/public/..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-xl btn-primary px-4 py-2 text-sm font-semibold">
          <Plus className="h-4 w-4" /> 등록하기
        </button>
      </form>

      <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {items.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">등록된 콘텐츠가 없습니다.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.title}</span>
                  {item.isSystem && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                      <Lock className="h-3 w-3" /> 필수 문서
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{item.summary}</p>
              </div>
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
          ))
        )}
      </div>
    </div>
  );
}

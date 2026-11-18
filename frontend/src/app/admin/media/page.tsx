"use client";

import { useEffect, useState } from "react";
import { Copy, Upload } from "lucide-react";
import { adminApiFetch } from "@/lib/api";

interface MediaItem {
  id: number;
  originalFilename: string;
  storageKey: string;
  publicUrl: string | null;
  status: string;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");

  function load() {
    adminApiFetch<MediaItem[]>("/api/admin/media").then(setItems).catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setNotice("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      await adminApiFetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      setNotice("이미지 업로드가 접수되었으며 백그라운드에서 WebP(360/768/1920px) 자동 다이어트 중입니다.");
      setTimeout(load, 1000);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">공개 미디어 라이브러리 (WebP 자동 다이어트)</h1>
          <p className="mt-1 text-sm text-slate-500">
            업로드된 고화질 사진은 단일 플랫폼 스레드 풀에서 자동으로 경량 WebP로 변환되며 Caddy가 직접 서빙합니다.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold">
          <Upload className="h-4 w-4" />
          <span>{uploading ? "업로드 중..." : "이미지 업로드"}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {notice && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-medium text-indigo-700">
          {notice}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-slate-900">{item.originalFilename}</span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                {item.status}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <span className="truncate font-mono text-xs text-slate-600">{item.storageKey}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(item.storageKey);
                  setNotice(`URL 복사됨: ${item.storageKey}`);
                }}
                className="shrink-0 text-slate-500 hover:text-primary"
                title="경로 복사"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

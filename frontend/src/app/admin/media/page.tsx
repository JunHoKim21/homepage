"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { adminApiFetch, isVideoUrl } from "@/lib/api";

interface MediaItem {
  id: number;
  originalFilename: string;
  storageKey: string;
  publicUrl: string | null;
  status: string;
  createdAt: string;
}

const STATUS_LABEL: Record<string, string> = {
  READY: "사용 가능",
  PENDING: "최적화 중",
  PROCESSING: "최적화 중",
  FAILED: "변환 실패",
};

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
      setNotice(
        isVideoUrl(res.storageKey)
          ? "동영상이 업로드되었습니다."
          : "이미지가 업로드되었습니다. 홈페이지 속도를 위해 자동으로 용량을 최적화하고 있습니다."
      );
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
          <h1 className="text-2xl font-bold text-slate-900">이미지 보관함</h1>
          <p className="mt-1 text-sm text-slate-500">
            홈페이지에 업로드된 모든 사진 목록을 한눈에 확인할 수 있습니다.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold">
          <Upload className="h-4 w-4" />
          <span>{uploading ? "업로드 중..." : "새 사진/동영상 올리기"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      {notice && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-medium text-indigo-700">
          {notice}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-400">
          아직 업로드된 이미지가 없습니다.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const src = item.publicUrl || item.storageKey;
            const isVideo = isVideoUrl(src) || isVideoUrl(item.originalFilename);
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="h-40 w-full bg-slate-100">
                  {isVideo ? (
                    <video
                      src={src}
                      muted
                      loop
                      playsInline
                      autoPlay
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={src}
                      alt={item.originalFilename}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-3.5">
                  <span className="truncate text-sm font-semibold text-slate-900">{item.originalFilename}</span>
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${
                      item.status === "READY"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {STATUS_LABEL[item.status] || item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { adminApiFetch, isVideoUrl } from "@/lib/api";
import SmartPreviewImage from "@/components/SmartPreviewImage";

interface MediaItem {
  id: number;
  originalFilename: string;
  storageKey: string;
  publicUrl: string | null;
  status: string;
  createdAt: string;
}

const SAMPLE_SVG = (bg: string, accent: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="${accent}"/></linearGradient></defs><rect width="400" height="280" fill="url(#g)"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">${label}</text></svg>`
  )}`;

const FALLBACK_MEDIA: MediaItem[] = [
  {
    id: 1,
    originalFilename: "메인_대표_배너_이미지.jpg",
    storageKey: "",
    publicUrl: SAMPLE_SVG("#0B0F19", "#2563EB", "메인 히어로 배너"),
    status: "READY",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 2,
    originalFilename: "회사_로고_표준.png",
    storageKey: "",
    publicUrl: SAMPLE_SVG("#1E293B", "#4F46E5", "공식 브랜드 로고"),
    status: "READY",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 3,
    originalFilename: "포트폴리오_제조업_사례.jpg",
    storageKey: "",
    publicUrl: SAMPLE_SVG("#0F172A", "#0EA5E9", "구축 사례 썸네일"),
    status: "READY",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 4,
    originalFilename: "신규_이벤트_팝업.png",
    storageKey: "",
    publicUrl: SAMPLE_SVG("#312E81", "#0EA5E9", "공지 · 팝업 이미지"),
    status: "PROCESSING",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
];

function getStatusBadge(status: string): { label: string; className: string } {
  const upper = (status || "").toUpperCase();
  if (upper === "READY" || upper === "COMPLETED" || upper === "DONE") {
    return { label: "사용 가능", className: "bg-emerald-50 text-emerald-700" };
  }
  if (upper === "FAILED" || upper === "ERROR") {
    return { label: "실패", className: "bg-rose-50 text-rose-700" };
  }
  return { label: "최적화 중", className: "bg-blue-50 text-blue-700" };
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [isOfflineDemo, setIsOfflineDemo] = useState(false);
  const [brokenIds, setBrokenIds] = useState<Record<number, boolean>>({});

  function load() {
    const token = localStorage.getItem("admin_access_token");
    if (token === "demo-offline-token") {
      setIsOfflineDemo(true);
      setItems(FALLBACK_MEDIA);
      return;
    }

    adminApiFetch<MediaItem[]>("/api/admin/media")
      .then((list) => {
        setIsOfflineDemo(false);
        setItems(list);
      })
      .catch(() => {
        setIsOfflineDemo(true);
        setItems(FALLBACK_MEDIA);
      });
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

    if (isOfflineDemo) {
      const previewUrl = URL.createObjectURL(file);
      setItems((prev) => [
        {
          id: Date.now(),
          originalFilename: file.name,
          storageKey: "",
          publicUrl: previewUrl,
          status: "READY",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNotice("체험 모드에서 미디어가 보관함에 추가되었습니다.");
      setUploading(false);
      return;
    }

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
          : "이미지가 업로드되었으며 홈페이지에 맞게 자동으로 크기가 최적화되고 있습니다."
      );
      setTimeout(load, 1000);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "업로드 실패");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-slate-900">이미지 보관함</h1>
          <p className="mt-1 text-sm text-slate-500">
            고화질 사진을 올리면 홈페이지가 느려지지 않도록 자동으로 최적화된 크기로 변환해 보관합니다.
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

      {isOfflineDemo && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800 sm:text-sm">
          방문 고객 체험 모드로 샘플 이미지 갤러리를 표시하고 있습니다. 우측 상단 버튼으로 새 사진 미리보기도 체험해 보세요.
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-medium text-indigo-700">
          {notice}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">
          아직 보관함에 등록된 사진이 없습니다. 우측 상단의 &apos;새 사진 올리기&apos;를 눌러 사진을 추가해 보세요.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const imgSrc = item.publicUrl || item.storageKey;
            const badge = getStatusBadge(item.status);
            const isBroken = brokenIds[item.id] || !imgSrc;
            const isVideo = isVideoUrl(imgSrc) || isVideoUrl(item.originalFilename);

            return (
              <div
                key={item.id}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs transition hover:shadow-md"
              >
                <div className="flex h-40 w-full items-center justify-center overflow-hidden bg-slate-100">
                  {!isBroken ? (
                    isVideo ? (
                      <video
                        src={imgSrc}
                        muted
                        loop
                        playsInline
                        autoPlay
                        onError={() => setBrokenIds((prev) => ({ ...prev, [item.id]: true }))}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <SmartPreviewImage
                        src={imgSrc}
                        alt={item.originalFilename}
                        className="h-full w-full object-cover"
                        iconClassName="h-8 w-8 text-slate-300"
                      />
                    )
                  ) : (
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-slate-900">
                      {item.originalFilename}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString("ko-KR")} 등록
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

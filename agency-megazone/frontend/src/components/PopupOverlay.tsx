"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { CmsContentItem } from "@/lib/api";

export default function PopupOverlay({ popups }: { popups: CmsContentItem[] }) {
  const [visiblePopups, setVisiblePopups] = useState<CmsContentItem[]>([]);

  useEffect(() => {
    const now = Date.now();
    const filtered = popups.filter((p) => {
      const hideUntil = localStorage.getItem(`popup_hide_until_${p.id}`);
      return !hideUntil || Number(hideUntil) < now;
    });
    setVisiblePopups(filtered);
  }, [popups]);

  if (visiblePopups.length === 0) {
    return null;
  }

  function closePopup(id: number, hideToday: boolean) {
    if (hideToday) {
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      localStorage.setItem(`popup_hide_until_${id}`, String(midnight.getTime()));
    }
    setVisiblePopups((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-wrap items-center justify-center gap-4 bg-slate-900/45 p-4 backdrop-blur-[1px]">
      {visiblePopups.slice(0, 3).map((popup) => (
        <div
          key={popup.id}
          className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {popup.thumbnailUrl && (
            <img
              src={popup.thumbnailUrl}
              alt={popup.title}
              className="max-h-72 w-full object-cover"
            />
          )}
          <div className="p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">{popup.title}</h3>
              <button
                type="button"
                onClick={() => closePopup(popup.id, false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="팝업 닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {popup.summary && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {popup.summary}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs">
            <button
              type="button"
              onClick={() => closePopup(popup.id, true)}
              className="font-medium text-slate-500 hover:text-slate-800"
            >
              오늘 하루 보지 않기
            </button>
            <button
              type="button"
              onClick={() => closePopup(popup.id, false)}
              className="font-bold text-slate-800 hover:text-primary"
            >
              닫기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

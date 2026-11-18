import { fetchPublishedCms } from "@/lib/api";

export default async function NoticesPage() {
  const notices = await fetchPublishedCms("NOTICE");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">공지사항</h1>
      <p className="mt-2 text-sm text-slate-600">새로운 소식과 안내사항을 전해드립니다.</p>

      <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {notices.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">등록된 공지사항이 없습니다.</div>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {n.isPinned && (
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-primary">
                      고정
                    </span>
                  )}
                  <h2 className="font-semibold text-slate-900">{n.title}</h2>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              {n.summary && <p className="mt-2 text-sm text-slate-600">{n.summary}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

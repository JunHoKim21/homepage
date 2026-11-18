import { fetchPublishedCms } from "@/lib/api";

export default async function PortfolioPage() {
  const items = await fetchPublishedCms("PORTFOLIO");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">포트폴리오</h1>
      <p className="mt-2 text-sm text-slate-600">주요 프로젝트 및 구축 사례를 확인하세요.</p>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-sm text-slate-500">
          등록된 포트폴리오가 없습니다. 관리자 콘솔(`/admin/cms`)에서 포트폴리오를 등록해 주세요.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-slate-100 text-xs text-slate-400">
                  No Image
                </div>
              )}
              <div className="p-5">
                <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                {item.summary && <p className="mt-2 text-sm text-slate-600">{item.summary}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

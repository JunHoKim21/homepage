import { CheckCircle2 } from "lucide-react";
import { fetchPublicSiteConfigs } from "@/lib/api";

export default async function AboutPage() {
  const configs = await fetchPublicSiteConfigs();
  let companyName = "주식회사 스타터";
  try {
    const info = JSON.parse(configs.footer_company_info || "{}") as { name?: string };
    if (info.name) companyName = info.name;
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900">회사소개</h1>
      <p className="mt-4 text-base leading-relaxed text-slate-600">
        {companyName}는 고객의 비즈니스 성장을 최우선으로 생각하는 전문 파트너입니다.
        체계적인 프로세스와 검증된 기술력을 바탕으로 가장 효율적인 솔루션을 제공합니다.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          "고객 맞춤형 1:1 전담 컨설팅",
          "투명한 견적 및 정직한 일정 준수",
          "사후 관리 및 지속적인 유지보수 지원",
          "보안과 안정성을 최우선으로 하는 설계",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
            <span className="text-sm font-medium text-slate-800">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

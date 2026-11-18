import { Suspense } from "react";
import AgencyMainShowroom from "@/components/AgencyMainShowroom";
import { fetchPublicSiteConfigs, fetchPublishedCms } from "@/lib/api";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ preset?: string }>;
}) {
  const [configs, portfolios, notices, resolvedParams] = await Promise.all([
    fetchPublicSiteConfigs(),
    fetchPublishedCms("PORTFOLIO"),
    fetchPublishedCms("NOTICE"),
    searchParams ? searchParams : Promise.resolve({ preset: undefined }),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AgencyMainShowroom
        configs={configs}
        portfolios={portfolios}
        notices={notices}
        initialPreset={resolvedParams?.preset}
      />
    </Suspense>
  );
}

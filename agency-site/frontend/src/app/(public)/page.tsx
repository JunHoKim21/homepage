import { Suspense } from "react";
import AgencyMainShowroom from "@/components/AgencyMainShowroom";
import PopupOverlay from "@/components/PopupOverlay";
import { fetchPublicSiteConfigs, fetchPublishedCms } from "@/lib/api";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ preset?: string }>;
}) {
  const [configs, portfolios, notices, banners, popups, resolvedParams] = await Promise.all([
    fetchPublicSiteConfigs(),
    fetchPublishedCms("PORTFOLIO"),
    fetchPublishedCms("NOTICE"),
    fetchPublishedCms("BANNER"),
    fetchPublishedCms("POPUP"),
    searchParams ? searchParams : Promise.resolve({ preset: undefined }),
  ]);

  const heroBanner = banners.find((b) => b.slug === "hero-main") || banners[0];

  return (
    <>
      <PopupOverlay popups={popups} />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <AgencyMainShowroom
          configs={configs}
          portfolios={portfolios}
          notices={notices}
          heroBanner={heroBanner}
          initialPreset={resolvedParams?.preset}
        />
      </Suspense>
    </>
  );
}

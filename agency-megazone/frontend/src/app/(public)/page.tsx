import MegazoneShowroom from "@/components/MegazoneShowroom";
import PopupOverlay from "@/components/PopupOverlay";
import { fetchPublicSiteConfigs, fetchPublishedCms } from "@/lib/api";

export default async function HomePage() {
  const [configs, portfolios, notices, banners, popups] = await Promise.all([
    fetchPublicSiteConfigs(),
    fetchPublishedCms("PORTFOLIO"),
    fetchPublishedCms("NOTICE"),
    fetchPublishedCms("BANNER"),
    fetchPublishedCms("POPUP"),
  ]);

  const heroBanner = banners.find((b) => b.slug === "hero-main") || banners[0];

  return (
    <div className="min-w-0 overflow-x-clip">
      <PopupOverlay popups={popups} />
      <MegazoneShowroom
        configs={configs}
        portfolios={portfolios}
        notices={notices}
        heroBanner={heroBanner}
      />
    </div>
  );
}

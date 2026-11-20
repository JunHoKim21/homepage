import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import QuickFloatingBar from "@/components/QuickFloatingBar";
import { fetchPublicMenus, fetchPublicSiteConfigs } from "@/lib/api";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [configs, menus] = await Promise.all([
    fetchPublicSiteConfigs(),
    fetchPublicMenus(),
  ]);

  let brandName = "엘레브웹 (eleveWeb)";
  try {
    const info = JSON.parse(configs.footer_company_info || "{}") as { name?: string };
    if (info.name) brandName = info.name;
  } catch {
    // ignore
  }

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-clip bg-white">
      <PublicHeader
        menus={menus}
        brandName={brandName}
        brandLogoUrl={configs.brand_logo_url || ""}
        reservationMode={configs.reservation_mode || "BOTH"}
      />
      <main className="min-w-0 flex-1">{children}</main>
      <QuickFloatingBar configs={configs} />
      <PublicFooter companyInfoJson={configs.footer_company_info || "{}"} />
    </div>
  );
}

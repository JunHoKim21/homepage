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

  let brandName = "Starter Biz";
  try {
    const info = JSON.parse(configs.footer_company_info || "{}") as { name?: string };
    if (info.name) brandName = info.name;
  } catch {
    // ignore
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader
        menus={menus}
        brandName={brandName}
        reservationMode={configs.reservation_mode || "BOTH"}
      />
      <main className="flex-1">{children}</main>
      <QuickFloatingBar configs={configs} />
      <PublicFooter companyInfoJson={configs.footer_company_info || "{}"} />
    </div>
  );
}

export interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface MenuItem {
  id: number;
  parentId: number | null;
  menuType: "PUBLIC" | "ADMIN";
  menuName: string;
  routePath: string;
  iconName: string | null;
  sortOrder: number;
  visible: boolean;
  isSystem: boolean;
  requiredPermission: string | null;
}

export interface CmsContentItem {
  id: number;
  slug: string;
  category: string;
  title: string;
  summary: string | null;
  contentHtml: string | null;
  thumbnailUrl: string | null;
  extraJson: string;
  viewCount: number;
  isPinned: boolean;
  isPublished: boolean;
  isSystem: boolean;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SITE_CONFIGS: Record<string, string> = {
  seo_title: "정확하고 빠른 비즈니스 파트너 | 표준 기업 홈페이지",
  seo_description: "전문적인 상담과 맞춤형 솔루션을 제공합니다.",
  seo_keywords: "기업홈페이지,전문상담,맞춤견적",
  seo_og_image: "/uploads/public/default-og.webp",
  naver_site_verification: "",
  google_site_verification: "",
  brand_primary_color: "#4F46E5",
  brand_logo_url: "/uploads/public/logo.webp",
  footer_company_info: JSON.stringify({
    name: "주식회사 스타터",
    ceo: "홍길동",
    bizNo: "123-45-67890",
    phone: "02-1234-5678",
    address: "서울시 강남구 테헤란로 123",
  }),
  reservation_mode: "BOTH",
  reservation_capacity_mode: "SINGLE",
  reservation_default_capacity: "1",
  naver_booking_url: "https://booking.naver.com/",
  floating_left_enabled: "true",
  floating_right_enabled: "true",
  quick_kakao_url: "https://pf.kakao.com/",
  quick_wechat_id: "",
  sns_instagram_url: "",
  sns_blog_url: "",
  sns_youtube_url: "",
};

function getInternalApiBase(): string {
  return process.env.INTERNAL_API_URL || "http://localhost:8080";
}

export async function fetchPublicSiteConfigs(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${getInternalApiBase()}/api/v1/configs/public`, {
      next: { tags: ["site-configs"], revalidate: 3600 },
    });
    if (!res.ok) return DEFAULT_SITE_CONFIGS;
    const body = (await res.json()) as ApiEnvelope<Record<string, string>>;
    return { ...DEFAULT_SITE_CONFIGS, ...(body.data || {}) };
  } catch {
    return DEFAULT_SITE_CONFIGS;
  }
}

export async function fetchPublicMenus(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${getInternalApiBase()}/api/v1/menus`, {
      next: { tags: ["site-configs"], revalidate: 3600 },
    });
    if (!res.ok) return [];
    const body = (await res.json()) as ApiEnvelope<MenuItem[]>;
    return body.data || [];
  } catch {
    return [];
  }
}

export async function fetchPublishedCms(category: string): Promise<CmsContentItem[]> {
  try {
    const res = await fetch(`${getInternalApiBase()}/api/v1/cms/${category}`, {
      next: { tags: ["site-configs"], revalidate: 60 },
    });
    if (!res.ok) return [];
    const body = (await res.json()) as ApiEnvelope<CmsContentItem[]>;
    return body.data || [];
  } catch {
    return [];
  }
}

export async function clientApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.success) {
    throw new Error(json.message || `API 요청 실패 (${res.status})`);
  }
  return json.data;
}

export async function adminApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_access_token") : null;
  const headers = new Headers(init?.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(path, { ...init, headers });

  if (res.status === 401 && typeof window !== "undefined") {
    const refreshToken = localStorage.getItem("admin_refresh_token");
    if (refreshToken) {
      const refreshRes = await fetch("/api/admin/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const refreshBody = (await refreshRes.json()) as ApiEnvelope<{
          accessToken: string;
          refreshToken: string;
        }>;
        localStorage.setItem("admin_access_token", refreshBody.data.accessToken);
        localStorage.setItem("admin_refresh_token", refreshBody.data.refreshToken);
        headers.set("Authorization", `Bearer ${refreshBody.data.accessToken}`);
        res = await fetch(path, { ...init, headers });
      }
    }
  }

  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.success) {
    throw new Error(json.message || `관리자 요청 실패 (${res.status})`);
  }
  return json.data;
}

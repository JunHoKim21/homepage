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
  seo_title: "스타터웹 스튜디오 | 월 임대료 0원 독립형 홈페이지 구축",
  seo_description: "매달 나가는 임대료 없이, 전문 디자인과 맞춤 관리자까지 한 번에 구축하는 독립형 홈페이지 에이전시입니다.",
  seo_keywords: "독립형홈페이지,기업홈페이지제작,병원홈페이지,정찰제홈페이지,스타터웹스튜디오",
  seo_og_image: "/uploads/public/default-og.webp",
  naver_site_verification: "",
  google_site_verification: "",
  brand_primary_color: "#6D28D9",
  site_theme_preset: "AGENCY",
  demo_bar_enabled: "true",
  brand_logo_url: "/uploads/public/logo.webp",
  footer_company_info: JSON.stringify({
    name: "스타터웹 스튜디오",
    ceo: "김스타터",
    bizNo: "211-88-90123",
    phone: "02-6950-1234",
    address: "100% 비대면 온라인 스튜디오 (전국 화상·화면공유 상담)",
    hours: "온라인 24시간 접수 | 전화·화상 상담: 평일 야간 19:30~22:30 · 주말 10:00~20:00",
  }),
  reservation_mode: "INTERNAL",
  reservation_capacity_mode: "SINGLE",
  reservation_default_capacity: "1",
  naver_booking_url: "https://booking.naver.com/",
  floating_left_enabled: "true",
  floating_right_enabled: "true",
  quick_kakao_url: "https://pf.kakao.com/",
  quick_wechat_id: "thecelluce_kr",
  sns_instagram_url: "https://instagram.com/",
  sns_blog_url: "https://blog.naver.com/",
  sns_youtube_url: "https://youtube.com/",
};

export const FALLBACK_PORTFOLIOS: CmsContentItem[] = [
  {
    id: 9001,
    slug: "architecture-interior-model",
    category: "PORTFOLIO",
    title: "[건축·인테리어 모델] 현장 갤러리 & 평수별 예상 견적 계산기",
    summary: "고화질 시공 현장 갤러리와 평수·예산별 30초 예상 견적 계산기를 결합한 건축·인테리어 업종 표준 제작 모델입니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: JSON.stringify({
      industry: "기업·시공",
      sampleMode: "CORP",
      client: "표준 제작 모델",
      period: "5~7일",
      packageName: "Deluxe",
    }),
    viewCount: 0,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-10T09:00:00Z",
  },
  {
    id: 9002,
    slug: "clinic-hybrid-reservation-model",
    category: "PORTFOLIO",
    title: "[병의원·검진 모델] 진료시간표 & 네이버·자체 하이브리드 예약",
    summary: "진료과목·의료진 안내와 시간대별 자체 초진 예약, 네이버 예약 연동을 한 화면에 구성한 병의원 표준 제작 모델입니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: JSON.stringify({
      industry: "병의원·클리닉",
      sampleMode: "CLINIC",
      client: "표준 제작 모델",
      period: "5~7일",
      packageName: "Premium",
    }),
    viewCount: 0,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-04T09:00:00Z",
    updatedAt: "2026-02-04T09:00:00Z",
  },
  {
    id: 9003,
    slug: "beauty-skin-showcase-model",
    category: "PORTFOLIO",
    title: "[피부과·뷰티 모델] 3×2 시술 쇼케이스 · 이벤트 팝업 · 전후사진 회원제",
    summary: "한·영·중·일 다국어 전환과 의료법 준수 전후사진 회원 전용 잠금, 1분 이벤트 팝업 관리를 갖춘 뷰티·피부과 모델입니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: JSON.stringify({
      industry: "병의원·클리닉",
      sampleMode: "CLINIC",
      client: "표준 제작 모델",
      period: "6~8일",
      packageName: "Premium",
    }),
    viewCount: 0,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-01-28T09:00:00Z",
    updatedAt: "2026-01-28T09:00:00Z",
  },
  {
    id: 9004,
    slug: "law-tax-consulting-model",
    category: "PORTFOLIO",
    title: "[법무법인·세무 모델] 전문분야·변호사 소개 & 1:1 비밀상담",
    summary: "다크 네이비·골드 톤의 전문분야·변호사 프로필과 비공개 자료 첨부 1:1 비밀상담 예약을 제공하는 로펌·세무 모델입니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: JSON.stringify({
      industry: "로펌·세무",
      sampleMode: "CLINIC",
      client: "표준 제작 모델",
      period: "5~7일",
      packageName: "Deluxe",
    }),
    viewCount: 0,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-01-21T09:00:00Z",
    updatedAt: "2026-01-21T09:00:00Z",
  },
  {
    id: 9005,
    slug: "manufacturing-b2b-catalog-model",
    category: "PORTFOLIO",
    title: "[제조·B2B 기업 모델] 제품 카탈로그 & 비공개 도면 첨부 견적",
    summary: "제품 사양 비교표, 영문·국문 전환, 거래처 도면·사양서 파일 첨부 견적 문의를 지원하는 B2B 제조·기업 모델입니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: JSON.stringify({
      industry: "기업·시공",
      sampleMode: "CORP",
      client: "표준 제작 모델",
      period: "5~7일",
      packageName: "Standard",
    }),
    viewCount: 0,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-01-15T09:00:00Z",
  },
  {
    id: 9006,
    slug: "studio-academy-multi-reservation-model",
    category: "PORTFOLIO",
    title: "[스튜디오·학원 모델] 시간대별 정원제(MULTI) 클래스 예약",
    summary: "시간대별 잔여 정원 자동 차감 예약과 강사진 소개, 카카오톡 공유 최적화를 적용한 스튜디오·아카데미 표준 모델입니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: JSON.stringify({
      industry: "스튜디오·학원",
      sampleMode: "CLINIC",
      client: "표준 제작 모델",
      period: "4~6일",
      packageName: "Standard",
    }),
    viewCount: 0,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-01-09T09:00:00Z",
    updatedAt: "2026-01-09T09:00:00Z",
  },
];

export const FALLBACK_NOTICES: CmsContentItem[] = [
  {
    id: 8001,
    slug: "fixed-price-and-tax-invoice-guide",
    category: "NOTICE",
    title: "[안내] 3단 정찰제 패키지 및 전자세금계산서·정부지원 바우처 지원 안내",
    summary: "Standard(49만)·Deluxe(99만)·Premium(179만) 투명 정찰제와 비교견적서 즉시 발행 절차를 안내해 드립니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: "{}",
    viewCount: 512,
    isPinned: true,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-12T09:00:00Z",
    updatedAt: "2026-02-12T09:00:00Z",
  },
  {
    id: 8002,
    slug: "3-year-total-cost-comparison",
    category: "NOTICE",
    title: "[인사이트] 매달 내는 임대형 홈페이지 vs 1회 구축 독립형, 3년 총비용 비교",
    summary: "초기 비용이 저렴해 보여도 매월 누적되는 임대료와 기능 추가 비용을 3년 기준으로 투명하게 비교해 봅니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: "{}",
    viewCount: 428,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-02-06T09:00:00Z",
    updatedAt: "2026-02-06T09:00:00Z",
  },
  {
    id: 8003,
    slug: "kakao-share-and-search-seo-feature",
    category: "NOTICE",
    title: "[업데이트] 카카오톡 공유 이미지·네이버 검색 제목 원클릭 수정 기능 출시",
    summary: "이제 담당자분께서 관리자 페이지에서 직접 검색 소개 문구와 공유 썸네일을 10초 만에 바꾸실 수 있습니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: "{}",
    viewCount: 305,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-01-30T09:00:00Z",
    updatedAt: "2026-01-30T09:00:00Z",
  },
  {
    id: 8004,
    slug: "clinic-reservation-design-guide",
    category: "NOTICE",
    title: "[가이드] 병의원·로펌 온라인 하이브리드 예약 도입 시 동선 설계 기준",
    summary: "영업시간 외 야간·주말 방문 고객의 예약 이탈을 줄이고 데스크 응대 효율을 높이는 예약 플로우 설계 기준을 안내합니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: "{}",
    viewCount: 267,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-01-22T09:00:00Z",
    updatedAt: "2026-01-22T09:00:00Z",
  },
  {
    id: 8005,
    slug: "admin-1sec-demo-open",
    category: "NOTICE",
    title: "[공지] 회원가입 없이 눌러보는 '관리자(CMS) 1초 체험' 상시 오픈",
    summary: "계약 전이라도 실제 홈페이지 문구·포트폴리오·예약 현황을 어떻게 관리하는지 직접 체험해 보실 수 있습니다.",
    contentHtml: null,
    thumbnailUrl: null,
    extraJson: "{}",
    viewCount: 198,
    isPinned: false,
    isPublished: true,
    isSystem: false,
    authorId: "admin",
    createdAt: "2026-01-14T09:00:00Z",
    updatedAt: "2026-01-14T09:00:00Z",
  },
];

function getFallbackCms(category: string): CmsContentItem[] {
  if (category === "PORTFOLIO") return FALLBACK_PORTFOLIOS;
  if (category === "NOTICE") return FALLBACK_NOTICES;
  return [];
}

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
    if (!res.ok) return getFallbackCms(category);
    const body = (await res.json()) as ApiEnvelope<CmsContentItem[]>;
    const items = body.data || [];
    return items.length > 0 ? items : getFallbackCms(category);
  } catch {
    return getFallbackCms(category);
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

export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm");
}

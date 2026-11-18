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
  seo_title: "스타터웹 스튜디오 | 월 임대료 0원 독립형 반응형 홈페이지 & 맞춤 CMS 제작 전문",
  seo_description:
    "Java 21 · Spring Boot 3.4 · Next.js 15 기반 초고속 반응형 홈페이지 제작. 100% 원본 소스 소유, WebP 자동 최적화, 하이브리드 예약 및 스팸방어 견적폼 CMS 기본 제공.",
  seo_keywords:
    "홈페이지제작,반응형웹제작,기업홈페이지,병원홈페이지,로펌홈페이지,Nextjs홈페이지,맞춤형CMS,스타터웹스튜디오",
  seo_og_image: "/uploads/public/default-og.webp",
  naver_site_verification: "",
  google_site_verification: "",
  brand_primary_color: "#1E40AF",
  brand_logo_url: "/uploads/public/logo.webp",
  site_theme_preset: "AGENCY",
  demo_bar_enabled: "true",
  footer_company_info: JSON.stringify({
    name: "스타터웹 스튜디오",
    ceo: "김도현",
    bizNo: "214-88-02941",
    phone: "02-558-7942",
    email: "contact@starterweb.kr",
    kakaoUrl: "https://pf.kakao.com/",
    address: "서울특별시 강남구 테헤란로 152 강남파이낸스센터 18층",
    hours: "평일 09:30 ~ 18:30 (점심 12:30 ~ 13:30 / 주말·공휴일 휴무)",
  }),
  reservation_mode: "BOTH",
  reservation_capacity_mode: "SINGLE",
  reservation_default_capacity: "1",
  naver_booking_url: "https://booking.naver.com/",
};

export const FALLBACK_PORTFOLIOS: CmsContentItem[] = [
  {
    id: 101,
    slug: "dagaol-space-design-corp",
    category: "PORTFOLIO",
    title: "다가올 공간디자인 인테리어·건축 그룹 공식 웹사이트",
    summary:
      "30초 평수별 자동 견적 계산 위젯과 고화질 시공 전·후 비교 갤러리를 탑재해 월 상담 전환율이 240% 상승한 기업·시공형 반응형 웹사이트입니다.",
    contentHtml:
      "<p>상업·주거 프리미엄 인테리어 전문 기업의 브랜드 신뢰도를 높이기 위해 다크 차콜 & 골드 포인트 테마와 WebP 자동 이미지 최적화 갤러리를 구축했습니다.</p>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    extraJson: JSON.stringify({
      industry: "기업·시공",
      samplePreset: "CORP",
      period: "5일 구축",
      plan: "DELUXE",
      client: "(주)다가올아이앤디",
      tags: ["30초 자동견적", "시공 갤러리", "WebP 고속로딩", "네이버 SEO"],
    }),
    viewCount: 1420,
    isPinned: true,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-10-15T09:00:00Z",
    updatedAt: "2026-10-15T09:00:00Z",
  },
  {
    id: 102,
    slug: "yeonsei-song-internal-clinic",
    category: "PORTFOLIO",
    title: "연세송내과·건강검진센터 프리미엄 예약형 홈페이지",
    summary:
      "자체 시간대별 초진·검진 온라인 예약과 네이버 스마트플레이스 예약을 동시 연동하고, 원장님 약력 및 진료시간표를 직관적으로 배치한 메디컬 웹사이트입니다.",
    contentHtml:
      "<p>환자분들이 모바일에서 3번의 터치만으로 진료시간 확인과 검진 예약을 완료할 수 있도록 설계된 병의원 특화 솔루션입니다.</p>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
    extraJson: JSON.stringify({
      industry: "병의원·클리닉",
      samplePreset: "CLINIC",
      period: "6일 구축",
      plan: "DELUXE",
      client: "연세송내과의원",
      tags: ["시간대별 진료예약", "네이버예약 연동", "진료시간표", "모바일 퍼스트"],
    }),
    viewCount: 1185,
    isPinned: true,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-10-22T10:30:00Z",
    updatedAt: "2026-10-22T10:30:00Z",
  },
  {
    id: 103,
    slug: "apex-precision-engineering-b2b",
    category: "PORTFOLIO",
    title: "에이펙스 정밀기계·반도체 장비 글로벌 B2B 홍보웹",
    summary:
      "정부지원사업(초기창업패키지) 수행 프로젝트로, 제품 사양서 보안 다운로드와 해외 바이어 제휴 문의 관리, 엑셀 DB 추출 기능을 완벽 구현했습니다.",
    contentHtml:
      "<p>제조·기술 기업의 핵심 특허와 장비 라인업을 신뢰감 있는 네이비&블루 톤앤매너로 구성하고 구글·네이버 검색엔진 최적화(SEO/AEO)를 100% 적용했습니다.</p>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
    extraJson: JSON.stringify({
      industry: "기업·시공",
      samplePreset: "CORP",
      period: "7일 구축",
      plan: "PREMIUM",
      client: "(주)에이펙스엔지니어링",
      tags: ["제품 카탈로그", "정부지원사업 완수", "B2B 제휴문의", "보안 스토리지"],
    }),
    viewCount: 960,
    isPinned: true,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-10-29T14:15:00Z",
    updatedAt: "2026-10-29T14:15:00Z",
  },
  {
    id: 104,
    slug: "lawfirm-justice-partners",
    category: "PORTFOLIO",
    title: "법무법인 정의 파트너스 기업법무·형사 전문 상담센터",
    summary:
      "의뢰인 비밀보장 1:1 비공개 사건접수 폼(비공개 보안 첨부파일 분리 저장)과 담당 변호사 지정 방문상담 예약 시스템을 구축했습니다.",
    contentHtml:
      "<p>민감한 사건 자료가 외부 URL로 절대 노출되지 않도록 Private 스토리지 토큰 검증 아키텍처를 적용한 로펌 전용 웹 플랫폼입니다.</p>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
    extraJson: JSON.stringify({
      industry: "로펌·세무",
      samplePreset: "CLINIC",
      period: "5일 구축",
      plan: "DELUXE",
      client: "법무법인 정의",
      tags: ["1:1 비밀상담 예약", "변호사 프로필", "승소사례 아카이브", "보안 첨부파일"],
    }),
    viewCount: 890,
    isPinned: false,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-02T11:00:00Z",
    updatedAt: "2026-11-02T11:00:00Z",
  },
  {
    id: 105,
    slug: "lumiere-pilates-studio",
    category: "PORTFOLIO",
    title: "루미에르 프라이빗 필라테스 & 아카데미 스튜디오",
    summary:
      "관리자 콘솔에서 스위치 하나로 전환 가능한 ‘타임당 N명 정원제 그룹 레슨 예약’과 1:1 체험권 신청 시스템을 탑재한 프리미엄 스튜디오 웹입니다.",
    contentHtml:
      "<p>고화질 스튜디오 화보 40여 장을 WebP 자동 다이어트 엔진으로 압축하여 모바일에서도 0.6초 이내에 쾌적하게 로딩됩니다.</p>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    extraJson: JSON.stringify({
      industry: "스튜디오·학원",
      samplePreset: "CLINIC",
      period: "5일 구축",
      plan: "DELUXE",
      client: "루미에르 스튜디오",
      tags: ["N명 정원제 예약", "강사진 소개", "시간표 안내", "초고속 WebP"],
    }),
    viewCount: 780,
    isPinned: false,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-06T16:20:00Z",
    updatedAt: "2026-11-06T16:20:00Z",
  },
  {
    id: 106,
    slug: "tax-firm-hangyeol-platform",
    category: "PORTFOLIO",
    title: "세무법인 한결 법인기장·경정청구 무료진단 플랫폼",
    summary:
      "스팸 봇을 100% 차단하는 30초 세무진단 문의폼과 접수 내역 원클릭 엑셀(.xlsx) 다운로드 기능으로 세무사님의 영업 관리 효율을 극대화했습니다.",
    contentHtml:
      "<p>합리적인 STANDARD 정찰제 패키지로 5일 만에 런칭하여 광고 랜딩페이지 및 공식 브랜드 홈으로 동시 활용 중입니다.</p>",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
    extraJson: JSON.stringify({
      industry: "로펌·세무",
      samplePreset: "CORP",
      period: "5일 구축",
      plan: "STANDARD",
      client: "세무법인 한결",
      tags: ["무료 세무진단 폼", "엑셀 DB 다운로드", "스팸방어 탑재", "가성비 구축"],
    }),
    viewCount: 745,
    isPinned: false,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-10T09:40:00Z",
    updatedAt: "2026-11-10T09:40:00Z",
  },
];

export const FALLBACK_NOTICES: CmsContentItem[] = [
  {
    id: 201,
    slug: "transparent-pricing-and-tax-invoice-guide",
    category: "NOTICE",
    title: "[정찰제 안내] 크몽·숨고 동일 3단 정찰제 패키지 및 세금계산서·비교견적서 즉시 발행 안내",
    summary:
      "스타터웹 스튜디오는 상담 시 부르는 게 값인 깜깜이 견적을 지양합니다. STANDARD(49만) / DELUXE(99만) / PREMIUM(179만) 투명 정찰제로 운영되며 사업자 세금계산서 및 타사 비교견적서를 즉시 발행해 드립니다.",
    contentHtml:
      "<p>모든 제작 패키지는 월 고정 임대료가 없는 100% 독립 소유형으로 구축되며, 계약 즉시 전자세금계산서 및 지출증빙 서류를 발행해 드립니다.</p>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "필독공지", target: "전 고객" }),
    viewCount: 2310,
    isPinned: true,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-01T09:00:00Z",
    updatedAt: "2026-11-01T09:00:00Z",
  },
  {
    id: 202,
    slug: "government-grant-voucher-support-2026",
    category: "NOTICE",
    title: "[정부지원사업] 2026 초기창업패키지·소상공인 디지털전환 수행기관 필수 서류 완벽 지원",
    summary:
      "정부지원사업 및 창업진흥원 바우처 집행에 필요한 과업지시서, 비교견적서, 완료보고서, 검수조서, 산출물 원본 소스 일체를 행정 반려 없이 원스톱으로 지원합니다.",
    contentHtml:
      "<p>다수의 정부지원사업 웹·플랫폼 구축 수행 경험을 바탕으로 전담 PM이 서류 작성부터 최종 검수까지 밀착 지원합니다.</p>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "지원사업", target: "창업·법인" }),
    viewCount: 1540,
    isPinned: true,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-05T10:00:00Z",
    updatedAt: "2026-11-05T10:00:00Z",
  },
  {
    id: 203,
    slug: "webp-auto-diet-and-zero-code-seo-v24",
    category: "NOTICE",
    title: "[엔진 업데이트] 고화질 사진 WebP 자동 다이어트 & 0.1초 무코드 SEO 즉시 반영 엔진 v2.4 적용",
    summary:
      "관리자 콘솔에서 스마트폰·DSLR 원본 사진을 그대로 올려도 서버가 자동으로 초경량 WebP로 변환해 로딩 속도를 3배 이상 높여주며, 검색엔진 타이틀·OG 이미지를 재배포 없이 0.1초 만에 변경할 수 있습니다.",
    contentHtml:
      "<p>네이버 웹마스터도구(서치어드바이저), 구글 서치콘솔 및 AI 검색엔진(AEO/GEO) 구조화 데이터가 기본 탑재됩니다.</p>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "기술업데이트", target: "CMS v2.4" }),
    viewCount: 980,
    isPinned: false,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-09T14:00:00Z",
    updatedAt: "2026-11-09T14:00:00Z",
  },
  {
    id: 204,
    slug: "spring-boot-34-nextjs-15-security-architecture",
    category: "NOTICE",
    title: "[보안 패치] Spring Boot 3.4 & Next.js 15 최신 엔터프라이즈 보안 및 비공개 스토리지 분리 적용",
    summary:
      "저가형 플러그인 조합 웹빌더와 달리 금융·공공 표준 Java 프레임워크와 JWT RBAC 권한 분리, 스팸 방어 Rate-Limit 필터를 기본 내장하여 해킹 및 개인정보 유출을 원천 차단합니다.",
    contentHtml:
      "<p>고객 문의 첨부파일은 외부에서 직접 URL 접근이 불가능한 Private 보안 영역에 격리 저장됩니다.</p>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "보안안내", target: "엔터프라이즈" }),
    viewCount: 840,
    isPinned: false,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-12T11:30:00Z",
    updatedAt: "2026-11-12T11:30:00Z",
  },
  {
    id: 205,
    slug: "100-percent-source-code-handover-and-manual",
    category: "NOTICE",
    title: "[고객지원] 납품 시 100% 원본 소스코드 이관 및 비개발자용 관리자(CMS) 매뉴얼 무상 제공",
    summary:
      "에이전시 종속(Lock-in) 없이 언제든 자체 서버나 클라우드로 이전 가능한 Docker·원본 소스코드를 100% 제공하며, 대표님과 직원이 바로 쓸 수 있는 한글 관리자 가이드북을 함께 드립니다.",
    contentHtml:
      "<p>납품 후 1개월간 무상 하자보수(A/S)를 보증하며, 텍스트·배너·포트폴리오·예약 시간표는 관리자 화면에서 평생 무료로 직접 수정하실 수 있습니다.</p>",
    thumbnailUrl: null,
    extraJson: JSON.stringify({ badge: "고객혜택", target: "납품보증" }),
    viewCount: 790,
    isPinned: false,
    isPublished: true,
    isSystem: true,
    authorId: "admin",
    createdAt: "2026-11-15T15:00:00Z",
    updatedAt: "2026-11-15T15:00:00Z",
  },
];

function getFallbackCmsByCategory(category: string): CmsContentItem[] {
  const upper = category.toUpperCase();
  if (upper === "PORTFOLIO") return FALLBACK_PORTFOLIOS;
  if (upper === "NOTICE") return FALLBACK_NOTICES;
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
    if (!res.ok) return getFallbackCmsByCategory(category);
    const body = (await res.json()) as ApiEnvelope<CmsContentItem[]>;
    if (Array.isArray(body.data) && body.data.length > 0) {
      return body.data;
    }
    return getFallbackCmsByCategory(category);
  } catch {
    return getFallbackCmsByCategory(category);
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

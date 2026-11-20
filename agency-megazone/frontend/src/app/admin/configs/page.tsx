"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Lock, Save, Trash2, Upload } from "lucide-react";
import { adminApiFetch, deletePublicMedia } from "@/lib/api";
import SmartPreviewImage from "@/components/SmartPreviewImage";

interface SiteConfigItem {
  configKey: string;
  configValue: string;
  valueType: string;
  groupName: string;
  description: string;
  isPublic: boolean;
  isSystem: boolean;
}

interface CompanyInfoForm {
  name: string;
  ceo: string;
  bizNo: string;
  phone: string;
  address: string;
}

const GROUP_LABELS: Record<string, string> = {
  COMPANY: "회사 · 사업자 정보",
  BRANDING: "브랜드 · 디자인 · 업종 테마",
  FLOATING: "플로팅 사이드바 · SNS · 빠른상담 링크",
  SEO: "검색엔진 최적화 (SEO)",
  RESERVATION: "온라인 예약 설정",
  NOTIFICATION: "알림 설정",
};

const KEY_LABELS: Record<string, string> = {
  footer_company_info: "푸터 하단 사업자 정보",
  site_theme_preset: "업종별 디자인 테마 프리셋",
  demo_bar_enabled: "상단 체험 쇼룸 안내 바 표시",
  brand_primary_color: "홈페이지 메인 포인트 색상",
  brand_logo_url: "상단 헤더 로고 이미지",
  brand_favicon_url: "브라우저 탭 파비콘",
  seo_title: "홈페이지 제목 (브라우저 탭 · 검색 제목)",
  seo_description: "검색 결과 요약 설명문",
  seo_keywords: "검색 키워드 (쉼표로 구분)",
  seo_og_image: "카카오톡 · SNS 공유 대표 이미지",
  naver_site_verification: "네이버 서치어드바이저 인증 코드",
  google_site_verification: "구글 서치콘솔 인증 코드",
  robots_txt_custom: "검색 로봇 수집 규칙 (robots.txt)",
  reservation_mode: "예약 채널 운영 방식",
  reservation_capacity_mode: "자체 예약 정원 방식",
  reservation_default_capacity: "시간대별 기본 정원 수 (명)",
  reservation_auto_confirm: "예약 접수 시 자동 확정 여부",
  naver_booking_url: "네이버 스마트플레이스 예약 링크",
  floating_left_enabled: "좌측 4색 빠른상담 바 표시",
  floating_right_enabled: "우측 플로팅 퀵 사이드바 표시",
  quick_kakao_url: "카카오톡 상담 채널 URL",
  quick_wechat_id: "위챗(WeChat) 상담 ID",
  sns_instagram_url: "인스타그램 공식 채널 URL",
  sns_blog_url: "네이버 블로그 공식 URL",
  sns_youtube_url: "유튜브 공식 채널 URL",
};

const REQUIRED_CONFIG_KEYS = new Set<string>([
  "footer_company_info",
  "seo_title",
  "brand_primary_color",
  "site_theme_preset",
  "reservation_mode",
]);

// 현재 플로팅 UI(우측 하단 3버튼 통합형)에서 사용하지 않는 레거시 설정 키는 관리자 화면에서 숨김 처리
const HIDDEN_CONFIG_KEYS = new Set<string>([
  "floating_left_enabled",
  "quick_wechat_id",
  "sns_instagram_url",
  "sns_blog_url",
  "sns_youtube_url",
]);

const DEFAULT_FALLBACK_CONFIGS: SiteConfigItem[] = [
  {
    configKey: "footer_company_info",
    configValue: JSON.stringify({
      name: "엘레브웹 (eleveWeb)",
      ceo: "김준호",
      bizNo: "449-14-03005",
      phone: "010-4404-5263",
      address: "100% 비대면 온라인 스튜디오 (전국 온라인 지원)",
    }),
    valueType: "JSON",
    groupName: "COMPANY",
    description: "홈페이지 하단에 표시되는 사업자 정보입니다.",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "site_theme_preset",
    configValue: "AGENCY",
    valueType: "TEXT",
    groupName: "BRANDING",
    description: "업종에 맞는 전체 디자인 분위기와 색상을 선택합니다.",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "demo_bar_enabled",
    configValue: "true",
    valueType: "BOOLEAN",
    groupName: "BRANDING",
    description: "방문 고객이 업종별 쇼룸을 전환해 볼 수 있는 상단 바를 표시합니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "brand_primary_color",
    configValue: "#1D4ED8",
    valueType: "COLOR",
    groupName: "BRANDING",
    description: "버튼과 강조 텍스트에 적용되는 메인 색상입니다.",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "brand_logo_url",
    configValue: "/uploads/public/logo.webp",
    valueType: "IMAGE",
    groupName: "BRANDING",
    description: "상단 헤더 좌측에 표시되는 회사 로고 이미지입니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "seo_title",
    configValue: "월 임대료 0원 평생 소유 기업 홈페이지 | 표준 비즈니스 파트너",
    valueType: "TEXT",
    groupName: "SEO",
    description: "네이버·구글 검색 결과와 브라우저 탭에 표시되는 대표 제목입니다.",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "seo_description",
    configValue: "초기 1회 정찰제 구축으로 평생 100% 자체 소유하는 기업·병원 맞춤형 홈페이지입니다.",
    valueType: "TEXT",
    groupName: "SEO",
    description: "검색 결과 제목 아래에 표시되는 요약 설명문입니다.",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "seo_keywords",
    configValue: "기업홈페이지,병원홈페이지,맞춤견적,반응형웹",
    valueType: "TEXT",
    groupName: "SEO",
    description: "핵심 검색 키워드를 쉼표(,)로 구분해 입력합니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "reservation_mode",
    configValue: "BOTH",
    valueType: "TEXT",
    groupName: "RESERVATION",
    description: "홈페이지 자체 예약과 네이버 예약 연동 방식을 선택합니다.",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "reservation_capacity_mode",
    configValue: "SINGLE",
    valueType: "TEXT",
    groupName: "RESERVATION",
    description: "시간대당 1팀(단독) 또는 여러 명(정원제) 예약 방식을 선택합니다.",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "reservation_auto_confirm",
    configValue: "false",
    valueType: "BOOLEAN",
    groupName: "RESERVATION",
    description: "고객이 예약을 신청했을 때 즉시 확정할지, 관리자 승인 후 확정할지 설정합니다.",
    isPublic: false,
    isSystem: false,
  },
  {
    configKey: "naver_booking_url",
    configValue: "https://booking.naver.com/",
    valueType: "TEXT",
    groupName: "RESERVATION",
    description: "네이버 예약 버튼 클릭 시 연결될 스마트플레이스 주소입니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "floating_left_enabled",
    configValue: "true",
    valueType: "BOOLEAN",
    groupName: "FLOATING",
    description: "좌측 하단 빠른상담(전화·카카오·WeChat·이벤트) 바 노출 여부를 설정합니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "floating_right_enabled",
    configValue: "true",
    valueType: "BOOLEAN",
    groupName: "FLOATING",
    description: "우측 고정 플로팅 퀵 사이드바 노출 여부를 설정합니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "quick_kakao_url",
    configValue: "https://pf.kakao.com/_AqlvX/chat",
    valueType: "TEXT",
    groupName: "FLOATING",
    description: "비워 두면 플로팅 메뉴에서 카카오톡 버튼이 자동으로 숨겨집니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "quick_wechat_id",
    configValue: "",
    valueType: "TEXT",
    groupName: "FLOATING",
    description: "WeChat 상담 ID 설정 항목입니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "sns_instagram_url",
    configValue: "https://instagram.com/",
    valueType: "TEXT",
    groupName: "FLOATING",
    description: "비워 두면 우측 사이드바에서 인스타그램 아이콘이 숨겨집니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "sns_blog_url",
    configValue: "https://blog.naver.com/",
    valueType: "TEXT",
    groupName: "FLOATING",
    description: "비워 두면 우측 사이드바에서 블로그 아이콘이 숨겨집니다.",
    isPublic: true,
    isSystem: false,
  },
  {
    configKey: "sns_youtube_url",
    configValue: "https://youtube.com/",
    valueType: "TEXT",
    groupName: "FLOATING",
    description: "유튜브 공식 채널 연결 주소입니다.",
    isPublic: true,
    isSystem: false,
  },
];

export default function AdminConfigsPage() {
  const [configs, setConfigs] = useState<SiteConfigItem[]>(DEFAULT_FALLBACK_CONFIGS);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    function loadOfflineWithOverride() {
      try {
        const raw = localStorage.getItem("demo_site_configs_override");
        if (raw) {
          const override = JSON.parse(raw) as Record<string, string>;
          setConfigs(
            DEFAULT_FALLBACK_CONFIGS.map((item) =>
              override[item.configKey] !== undefined
                ? { ...item, configValue: override[item.configKey] }
                : item
            )
          );
          return;
        }
      } catch {
        // ignore
      }
      setConfigs(DEFAULT_FALLBACK_CONFIGS);
    }

    const token = localStorage.getItem("admin_access_token");
    if (token === "demo-offline-token") {
      setIsOfflineMode(true);
      loadOfflineWithOverride();
      return;
    }

    adminApiFetch<SiteConfigItem[]>("/api/admin/configs")
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setConfigs(list);
          setIsOfflineMode(false);
        }
      })
      .catch(() => {
        setIsOfflineMode(true);
        loadOfflineWithOverride();
      });
  }, []);

  function updateField(key: string, value: string) {
    setConfigs((prev) =>
      prev.map((c) => (c.configKey === key ? { ...c, configValue: value } : c))
    );
  }

  function parseCompanyInfo(raw: string): CompanyInfoForm {
    try {
      const parsed = JSON.parse(raw || "{}") as Partial<CompanyInfoForm>;
      return {
        name: parsed.name || "",
        ceo: parsed.ceo || "",
        bizNo: parsed.bizNo || "",
        phone: parsed.phone || "",
        address: parsed.address || "",
      };
    } catch {
      return { name: "", ceo: "", bizNo: "", phone: "", address: "" };
    }
  }

  function updateCompanyField(
    configKey: string,
    currentRaw: string,
    field: keyof CompanyInfoForm,
    value: string
  ) {
    const info = parseCompanyInfo(currentRaw);
    info[field] = value;
    updateField(configKey, JSON.stringify(info));
  }

  async function handleImageUpload(configKey: string, file: File) {
    const oldUrl = configs.find((c) => c.configKey === configKey)?.configValue;
    setUploadingKey(configKey);
    setNotice("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await adminApiFetch<{ storageKey: string }>("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      updateField(configKey, result.storageKey);
      if (oldUrl && oldUrl !== result.storageKey) {
        void deletePublicMedia(oldUrl);
      }
      setNotice(
        "이미지가 업로드되어 초경량 최적화 변환이 시작되었습니다. '전체 설정 저장하기'를 눌러 반영해 주세요."
      );
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleSaveAll() {
    setSaving(true);
    setNotice("");
    if (isOfflineMode) {
      try {
        const overrideMap = configs.reduce<Record<string, string>>((acc, item) => {
          acc[item.configKey] = item.configValue;
          return acc;
        }, {});
        localStorage.setItem("demo_site_configs_override", JSON.stringify(overrideMap));
      } catch {
        // ignore storage errors
      }
      setTimeout(() => {
        setSaving(false);
        setNotice(
          "체험 모드에서 설정 변경이 브라우저에 저장되어 즉시 반영되었습니다. 실제 서버 연결 시 DB에도 저장됩니다."
        );
      }, 250);
      return;
    }

    try {
      const updated = await adminApiFetch<SiteConfigItem[]>("/api/admin/configs", {
        method: "PUT",
        body: JSON.stringify({
          configs: configs.map((c) => ({
            configKey: c.configKey,
            configValue: c.configValue,
          })),
        }),
      });
      setConfigs(updated);
      setNotice("설정이 저장되었으며 홈페이지에 즉시 반영되었습니다.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  const grouped = configs.reduce<Record<string, SiteConfigItem[]>>((acc, item) => {
    if (HIDDEN_CONFIG_KEYS.has(item.configKey)) return acc;
    const g = item.groupName || "OTHER";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const groupOrder = ["COMPANY", "BRANDING", "FLOATING", "SEO", "RESERVATION", "NOTIFICATION"];
  const sortedGroups = Object.keys(grouped).sort((a, b) => {
    const idxA = groupOrder.indexOf(a);
    const idxB = groupOrder.indexOf(b);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <div className="min-w-0 space-y-6 overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold text-slate-900">홈페이지 · SEO · 예약 설정</h1>
          <p className="mt-1 text-sm text-slate-500">
            코드 수정 없이 회사 정보, 업종 테마, 색상, 검색엔진 제목, 예약 방식을 바로 변경할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "저장 및 홈페이지 반영 중..." : "전체 설정 저장하기"}
        </button>
      </div>

      {isOfflineMode && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800 sm:text-sm">
          방문 고객 체험 모드로 기본 설정 목록을 불러왔습니다. 항목을 자유롭게 변경해 보실 수 있습니다.
        </div>
      )}

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {notice}
        </div>
      )}

      <div className="space-y-8">
        {sortedGroups.map((groupName) => (
          <section key={groupName} className="space-y-3">
            <h2 className="text-base font-extrabold text-slate-800">
              {GROUP_LABELS[groupName] || groupName}
            </h2>

            <div className="space-y-3">
              {grouped[groupName].map((cfg) => {
                const label = KEY_LABELS[cfg.configKey] || cfg.description || cfg.configKey;

                return (
                  <div
                    key={cfg.configKey}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{label}</span>
                        {REQUIRED_CONFIG_KEYS.has(cfg.configKey) ? (
                          <span
                            className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                            title="홈페이지 운영에 필요한 기본 필수 설정입니다"
                          >
                            <Lock className="h-3 w-3" /> 필수 항목
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                            title="비워두면 화면에서 자동으로 숨겨지거나 기본값이 적용됩니다"
                          >
                            선택 항목
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{cfg.description}</span>
                    </div>

                    {/* 1. 사업자 정보 (5개 개별 입력 폼 제공) */}
                    {cfg.configKey === "footer_company_info" ? (
                      (() => {
                        const info = parseCompanyInfo(cfg.configValue);
                        return (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                상호명
                              </label>
                              <input
                                type="text"
                                value={info.name}
                                onChange={(e) =>
                                  updateCompanyField(cfg.configKey, cfg.configValue, "name", e.target.value)
                                }
                                placeholder="엘레브웹 (eleveWeb)"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                대표자명
                              </label>
                              <input
                                type="text"
                                value={info.ceo}
                                onChange={(e) =>
                                  updateCompanyField(cfg.configKey, cfg.configValue, "ceo", e.target.value)
                                }
                                placeholder="김준호"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                사업자등록번호
                              </label>
                              <input
                                type="text"
                                value={info.bizNo}
                                onChange={(e) =>
                                  updateCompanyField(cfg.configKey, cfg.configValue, "bizNo", e.target.value)
                                }
                                placeholder="449-14-03005"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                대표 전화번호
                              </label>
                              <input
                                type="text"
                                value={info.phone}
                                onChange={(e) =>
                                  updateCompanyField(cfg.configKey, cfg.configValue, "phone", e.target.value)
                                }
                                placeholder="010-4404-5263"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-xs font-medium text-slate-600">
                                사업장 주소
                              </label>
                              <input
                                type="text"
                                value={info.address}
                                onChange={(e) =>
                                  updateCompanyField(cfg.configKey, cfg.configValue, "address", e.target.value)
                                }
                                placeholder="100% 비대면 온라인 스튜디오 (전국 온라인 지원)"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                          </div>
                        );
                      })()
                    ) : cfg.configKey === "site_theme_preset" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-96"
                      >
                        <option value="AGENCY">AGENCY (모던 다크 · 블루 에이전시 표준형)</option>
                        <option value="CORP">CORP (신뢰 중심 기업 · 제조 · B2B형)</option>
                        <option value="CLINIC">CLINIC (청결한 병원 · 의원 · 클리닉형)</option>
                      </select>
                    ) : cfg.valueType === "COLOR" ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="color"
                          value={cfg.configValue || "#2563EB"}
                          onChange={(e) => updateField(cfg.configKey, e.target.value)}
                          className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300"
                        />
                        <input
                          type="text"
                          value={cfg.configValue}
                          onChange={(e) => updateField(cfg.configKey, e.target.value)}
                          className="w-36 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                        />
                        <span className="text-xs text-slate-500">
                          색상을 클릭해서 자유롭게 변경하세요.
                        </span>
                      </div>
                    ) : cfg.valueType === "IMAGE" ? (
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                          {cfg.configValue ? (
                            <SmartPreviewImage
                              src={cfg.configValue}
                              alt={label}
                              className="h-full w-full object-contain p-1"
                              iconClassName="h-7 w-7 text-slate-300"
                            />
                          ) : (
                            <ImageIcon className="h-7 w-7 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-2">
                          <p className="text-xs font-medium text-slate-600">
                            {cfg.configValue
                              ? "현재 적용된 사진이 있습니다."
                              : "아직 등록된 사진이 없습니다."}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                              <Upload className="h-3.5 w-3.5" />
                              <span>
                                {uploadingKey === cfg.configKey
                                  ? "업로드 중..."
                                  : cfg.configValue
                                  ? "사진 변경"
                                  : "사진 선택"}
                              </span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setBrokenImages((prev) => ({ ...prev, [cfg.configKey]: false }));
                                    handleImageUpload(cfg.configKey, file);
                                  }
                                }}
                              />
                            </label>
                            {cfg.configValue && (
                              <button
                                type="button"
                                onClick={() => {
                                  void deletePublicMedia(cfg.configValue);
                                  updateField(cfg.configKey, "");
                                  setBrokenImages((prev) => ({ ...prev, [cfg.configKey]: false }));
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>제거</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : cfg.configKey === "reservation_mode" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-96"
                      >
                        <option value="OFF">사용 안 함 (예약 메뉴 숨김)</option>
                        <option value="NAVER">네이버 스마트플레이스 예약 연결</option>
                        <option value="INTERNAL">홈페이지 자체 예약만 사용</option>
                        <option value="BOTH">홈페이지 자체 예약 + 네이버 예약 모두 사용</option>
                      </select>
                    ) : cfg.configKey === "reservation_capacity_mode" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-96"
                      >
                        <option value="SINGLE">1:1 단독 예약 (시간대당 1팀만 예약 가능)</option>
                        <option value="MULTI">시간대별 정원제 (시간대당 여러 명 예약 가능)</option>
                      </select>
                    ) : cfg.configKey === "reservation_auto_confirm" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-96"
                      >
                        <option value="false">수동 확정 (접수대기 상태로 저장 후 관리자 승인)</option>
                        <option value="true">자동 확정 (정원 내 예약 시 즉시 확정 처리)</option>
                      </select>
                    ) : cfg.valueType === "BOOLEAN" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-96"
                      >
                        <option value="true">노출 (ON)</option>
                        <option value="false">숨김 (OFF)</option>
                      </select>
                    ) : cfg.configKey === "robots_txt_custom" ? (
                      <textarea
                        rows={3}
                        value={(cfg.configValue || "").replace(/\\n/g, "\n")}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs"
                      />
                    ) : (
                      <input
                        type={cfg.valueType === "NUMBER" ? "number" : "text"}
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

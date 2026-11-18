"use client";

import { useEffect, useState } from "react";
import { Lock, Save, Upload } from "lucide-react";
import { adminApiFetch } from "@/lib/api";

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
  BRANDING: "브랜드 · 업종 테마 · 디자인",
  SEO: "검색엔진 최적화 (무코드 SEO)",
  RESERVATION: "하이브리드 온라인 예약 설정",
  NOTIFICATION: "알림 설정",
};

const KEY_LABELS: Record<string, string> = {
  footer_company_info: "푸터 하단 사업자 정보",
  site_theme_preset: "홈페이지 메인 업종 테마 프리셋",
  demo_bar_enabled: "상단 실시간 샘플 전환 바 노출 여부",
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
};

const FALLBACK_SITE_CONFIGS: SiteConfigItem[] = [
  {
    configKey: "footer_company_info",
    configValue: JSON.stringify({
      name: "스타터웹 스튜디오 (주식회사 스타터)",
      ceo: "홍길동",
      bizNo: "123-45-67890",
      phone: "02-1234-5678",
      address: "서울시 강남구 테헤란로 123 스타터타워 8층",
    }),
    valueType: "JSON",
    groupName: "COMPANY",
    description: "홈페이지 하단 푸터 및 회사소개에 자동 연동되는 사업자 정보",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "site_theme_preset",
    configValue: "AGENCY",
    valueType: "STRING",
    groupName: "BRANDING",
    description: "업종별 메인 화면 레이아웃 프리셋 (즉시 전환)",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "demo_bar_enabled",
    configValue: "true",
    valueType: "BOOLEAN",
    groupName: "BRANDING",
    description: "크몽·숨고 방문객용 상단 샘플 전환 바 노출 스위치",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "brand_primary_color",
    configValue: "#1E40AF",
    valueType: "COLOR",
    groupName: "BRANDING",
    description: "버튼·배지·강조 영역에 즉시 적용되는 브랜드 포인트 색상",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "brand_logo_url",
    configValue: "/uploads/public/logo.webp",
    valueType: "IMAGE",
    groupName: "BRANDING",
    description: "상단 헤더 로고 이미지 (업로드 시 WebP 자동 변환)",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "seo_title",
    configValue: "스타터웹 스튜디오 | Java·Next.js 정통 반응형 홈페이지 & 맞춤 관리자 구축 전문",
    valueType: "STRING",
    groupName: "SEO",
    description: "브라우저 탭 및 네이버·구글 검색 결과 대표 제목",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "seo_description",
    configValue:
      "월 임대료 0원, 100% 고객사 소유 정통 웹 개발. 무코드 SEO·AEO 검색최적화, 스팸방어 견적문의, 하이브리드 예약 시스템을 합리적인 정찰제로 구축합니다.",
    valueType: "STRING",
    groupName: "SEO",
    description: "네이버·구글 검색 결과 요약 설명문 (Meta Description)",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "seo_keywords",
    configValue: "홈페이지제작,반응형웹제작,기업홈페이지,병원홈페이지,예약홈페이지,SpringBoot,Nextjs",
    valueType: "STRING",
    groupName: "SEO",
    description: "검색 엔진 수집 핵심 키워드 (쉼표 구분)",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "seo_og_image",
    configValue: "/uploads/public/default-og.webp",
    valueType: "IMAGE",
    groupName: "SEO",
    description: "카카오톡·SNS 링크 공유 시 노출되는 대표 썸네일 이미지",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "naver_site_verification",
    configValue: "",
    valueType: "STRING",
    groupName: "SEO",
    description: "네이버 서치어드바이저 소유권 확인 메타태그 값",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "google_site_verification",
    configValue: "",
    valueType: "STRING",
    groupName: "SEO",
    description: "구글 서치콘솔 소유권 확인 메타태그 값",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "robots_txt_custom",
    configValue: "User-agent: *\nAllow: /\nDisallow: /admin/",
    valueType: "STRING",
    groupName: "SEO",
    description: "검색 로봇 수집 허용/차단 규칙 설정",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "reservation_mode",
    configValue: "BOTH",
    valueType: "STRING",
    groupName: "RESERVATION",
    description: "자체 예약 폼과 네이버 예약 버튼의 노출 조합 설정",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "reservation_capacity_mode",
    configValue: "SINGLE",
    valueType: "STRING",
    groupName: "RESERVATION",
    description: "1:1 단독 예약(SINGLE) 또는 시간대별 정원제(MULTI) 선택",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "reservation_default_capacity",
    configValue: "1",
    valueType: "NUMBER",
    groupName: "RESERVATION",
    description: "MULTI 정원제 모드 시 시간대별 기본 수용 인원",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "reservation_auto_confirm",
    configValue: "false",
    valueType: "BOOLEAN",
    groupName: "RESERVATION",
    description: "고객 예약 신청 시 관리자 승인 없이 즉시 확정할지 여부",
    isPublic: true,
    isSystem: true,
  },
  {
    configKey: "naver_booking_url",
    configValue: "https://booking.naver.com/",
    valueType: "STRING",
    groupName: "RESERVATION",
    description: "네이버 스마트플레이스 예약 페이지 연결 URL",
    isPublic: true,
    isSystem: true,
  },
];

function mergeWithFallback(loaded: SiteConfigItem[]): SiteConfigItem[] {
  if (!Array.isArray(loaded) || loaded.length === 0) return FALLBACK_SITE_CONFIGS;
  const existingKeys = new Set(loaded.map((c) => c.configKey));
  const missing = FALLBACK_SITE_CONFIGS.filter((f) => !existingKeys.has(f.configKey));
  return [...loaded, ...missing];
}

export default function AdminConfigsPage() {
  const [configs, setConfigs] = useState<SiteConfigItem[]>(FALLBACK_SITE_CONFIGS);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminApiFetch<SiteConfigItem[]>("/api/admin/configs")
      .then((res) => setConfigs(mergeWithFallback(res)))
      .catch(() => {
        // API 오프라인 상태일 때도 기본 폴백 배열 유지
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
      setNotice(
        "이미지가 업로드되어 WebP 변환이 시작되었습니다. '전체 설정 저장하기'를 눌러 반영해 주세요."
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
      setConfigs(mergeWithFallback(updated));
      setNotice("설정이 저장되었으며 홈페이지 화면 및 SEO 캐시가 즉시(0.1초) 갱신되었습니다.");
    } catch (err) {
      setNotice(
        err instanceof Error
          ? `${err.message} (현재 화면에서 변경된 설정값 프리뷰는 유지됩니다.)`
          : "저장 중 오류가 발생했습니다."
      );
    } finally {
      setSaving(false);
    }
  }

  const grouped = configs.reduce<Record<string, SiteConfigItem[]>>((acc, item) => {
    const g = item.groupName || "OTHER";
    if (!acc[g]) acc[g] = [];
    acc[g].push(item);
    return acc;
  }, {});

  const groupOrder = ["COMPANY", "BRANDING", "SEO", "RESERVATION", "NOTIFICATION"];
  const sortedGroups = Object.keys(grouped).sort((a, b) => {
    const idxA = groupOrder.indexOf(a);
    const idxB = groupOrder.indexOf(b);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            무코드 홈페이지 · 업종 테마 · SEO · 예약 설정
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            개발자 없이 회사 정보, 업종별 테마 프리셋, 색상, 검색엔진 제목, 예약 방식을 바로 변경할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-extrabold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "저장 및 캐시 갱신 중..." : "전체 설정 저장하기"}
        </button>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
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
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{label}</span>
                        {cfg.isSystem && (
                          <span
                            className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                            title="필수 항목은 삭제할 수 없습니다"
                          >
                            <Lock className="h-3 w-3" /> 필수 항목
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{cfg.description}</span>
                    </div>

                    {/* 1. 사업자 정보 (JSON 대신 5개 개별 입력 폼 제공) */}
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
                                  updateCompanyField(
                                    cfg.configKey,
                                    cfg.configValue,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="주식회사 스타터"
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
                                  updateCompanyField(
                                    cfg.configKey,
                                    cfg.configValue,
                                    "ceo",
                                    e.target.value
                                  )
                                }
                                placeholder="홍길동"
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
                                  updateCompanyField(
                                    cfg.configKey,
                                    cfg.configValue,
                                    "bizNo",
                                    e.target.value
                                  )
                                }
                                placeholder="123-45-67890"
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
                                  updateCompanyField(
                                    cfg.configKey,
                                    cfg.configValue,
                                    "phone",
                                    e.target.value
                                  )
                                }
                                placeholder="02-1234-5678"
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
                                  updateCompanyField(
                                    cfg.configKey,
                                    cfg.configValue,
                                    "address",
                                    e.target.value
                                  )
                                }
                                placeholder="서울시 강남구 테헤란로 123"
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
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 sm:w-96"
                      >
                        <option value="AGENCY">AGENCY: 웹 에이전시 공식 홈</option>
                        <option value="CORP">CORP: 기업·시공·제조형 샘플</option>
                        <option value="CLINIC">CLINIC: 병의원·로펌 예약형 샘플</option>
                      </select>
                    ) : cfg.configKey === "demo_bar_enabled" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-900 sm:w-96"
                      >
                        <option value="true">true: 방문객용 샘플 전환 바 노출</option>
                        <option value="false">false: 실제 고객 납품 모드(숨김)</option>
                      </select>
                    ) : cfg.valueType === "COLOR" ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={cfg.configValue || "#1E40AF"}
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
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={cfg.configValue}
                          onChange={(e) => updateField(cfg.configKey, e.target.value)}
                          placeholder="/uploads/public/..."
                          className="min-w-[240px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                          <Upload className="h-3.5 w-3.5" />
                          <span>
                            {uploadingKey === cfg.configKey ? "업로드 중..." : "이미지 바로 올리기"}
                          </span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(cfg.configKey, file);
                            }}
                          />
                        </label>
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
                    ) : cfg.configKey === "robots_txt_custom" ? (
                      <textarea
                        rows={3}
                        value={cfg.configValue}
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

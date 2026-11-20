"use client";

import { useEffect, useState } from "react";
import { Lock, Save, Upload } from "lucide-react";
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
  BRANDING: "브랜드 · 디자인",
  SEO: "검색엔진 최적화 (SEO)",
  RESERVATION: "온라인 예약 설정",
  FLOATING: "플로팅 퀵바 · SNS 채널",
  NOTIFICATION: "알림 설정",
};

const KEY_LABELS: Record<string, string> = {
  footer_company_info: "푸터 하단 사업자 정보",
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
  floating_left_enabled: "좌측 상담 플로팅 바 노출 여부",
  floating_right_enabled: "우측 플로팅 사이드바 노출 여부",
  quick_kakao_url: "카카오톡 채널 상담 URL",
  quick_wechat_id: "WeChat 상담 ID",
  sns_instagram_url: "인스타그램 공식 URL",
  sns_blog_url: "네이버 블로그 URL",
  sns_youtube_url: "유튜브 채널 URL",
};

const REQUIRED_CONFIG_KEYS = new Set<string>([
  "footer_company_info",
  "seo_title",
  "brand_primary_color",
  "site_theme_preset",
  "reservation_mode",
]);

export default function AdminConfigsPage() {
  const [configs, setConfigs] = useState<SiteConfigItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    adminApiFetch<SiteConfigItem[]>("/api/admin/configs").then(setConfigs).catch(() => {});
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

  function updateCompanyField(configKey: string, currentRaw: string, field: keyof CompanyInfoForm, value: string) {
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
      setNotice("이미지가 업로드되었습니다. '전체 설정 저장하기'를 눌러 반영해 주세요.");
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
      setConfigs(updated);
      setNotice("설정이 저장되었으며 홈페이지에 즉시 반영되었습니다.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "저장 중 오류 발생");
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

  const groupOrder = ["COMPANY", "BRANDING", "SEO", "RESERVATION", "FLOATING", "NOTIFICATION"];
  const sortedGroups = Object.keys(grouped).sort((a, b) => {
    const idxA = groupOrder.indexOf(a);
    const idxB = groupOrder.indexOf(b);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">홈페이지 · SEO · 예약 설정</h1>
          <p className="mt-1 text-sm text-slate-500">
            코드 수정 없이 회사 정보, 색상, 검색엔진 제목, 예약 방식을 바로 변경할 수 있습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl btn-primary px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "저장 및 반영 중..." : "전체 설정 저장하기"}
        </button>
      </div>

      {notice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {notice}
        </div>
      )}

      <div className="space-y-8">
        {sortedGroups.map((groupName) => (
          <section key={groupName} className="space-y-3">
            <h2 className="text-base font-bold text-slate-800">
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

                    {/* 1. 사업자 정보 (JSON 대신 5개 개별 입력 폼 제공) */}
                    {cfg.configKey === "footer_company_info" ? (
                      (() => {
                        const info = parseCompanyInfo(cfg.configValue);
                        return (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">상호명</label>
                              <input
                                type="text"
                                value={info.name}
                                onChange={(e) => updateCompanyField(cfg.configKey, cfg.configValue, "name", e.target.value)}
                                placeholder="주식회사 스타터"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">대표자명</label>
                              <input
                                type="text"
                                value={info.ceo}
                                onChange={(e) => updateCompanyField(cfg.configKey, cfg.configValue, "ceo", e.target.value)}
                                placeholder="홍길동"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">사업자등록번호</label>
                              <input
                                type="text"
                                value={info.bizNo}
                                onChange={(e) => updateCompanyField(cfg.configKey, cfg.configValue, "bizNo", e.target.value)}
                                placeholder="123-45-67890"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-600">대표 전화번호</label>
                              <input
                                type="text"
                                value={info.phone}
                                onChange={(e) => updateCompanyField(cfg.configKey, cfg.configValue, "phone", e.target.value)}
                                placeholder="02-1234-5678"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="mb-1 block text-xs font-medium text-slate-600">사업장 주소</label>
                              <input
                                type="text"
                                value={info.address}
                                onChange={(e) => updateCompanyField(cfg.configKey, cfg.configValue, "address", e.target.value)}
                                placeholder="서울시 강남구 테헤란로 123"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </div>
                          </div>
                        );
                      })()
                    ) : cfg.valueType === "COLOR" ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={cfg.configValue || "#4F46E5"}
                          onChange={(e) => updateField(cfg.configKey, e.target.value)}
                          className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300"
                        />
                        <input
                          type="text"
                          value={cfg.configValue}
                          onChange={(e) => updateField(cfg.configKey, e.target.value)}
                          className="w-36 rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                        />
                        <span className="text-xs text-slate-500">색상을 클릭해서 자유롭게 변경하세요.</span>
                      </div>
                    ) : cfg.valueType === "IMAGE" ? (
                      <div className="flex flex-wrap items-center gap-4">
                        {cfg.configValue ? (
                          <div className="flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                            <SmartPreviewImage
                              src={cfg.configValue}
                              alt={label}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-[11px] text-slate-400">
                            사진 없음
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50">
                            <Upload className="h-3.5 w-3.5 text-primary" />
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
                                if (file) handleImageUpload(cfg.configKey, file);
                              }}
                            />
                          </label>
                          {cfg.configValue && (
                            <button
                              type="button"
                              onClick={() => {
                                void deletePublicMedia(cfg.configValue);
                                updateField(cfg.configKey, "");
                              }}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
                            >
                              제거
                            </button>
                          )}
                        </div>
                      </div>
                    ) : cfg.configKey === "reservation_mode" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-80"
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
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-80"
                      >
                        <option value="SINGLE">1:1 단독 예약 (시간대당 1팀만 예약 가능)</option>
                        <option value="MULTI">시간대별 정원제 (시간대당 여러 명 예약 가능)</option>
                      </select>
                    ) : cfg.configKey === "reservation_auto_confirm" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-80"
                      >
                        <option value="false">수동 확정 (접수대기 상태로 저장 후 관리자 승인)</option>
                        <option value="true">자동 확정 (정원 내 예약 시 즉시 확정 처리)</option>
                      </select>
                    ) : cfg.valueType === "BOOLEAN" ? (
                      <select
                        value={cfg.configValue}
                        onChange={(e) => updateField(cfg.configKey, e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:w-64"
                      >
                        <option value="true">노출 (ON)</option>
                        <option value="false">숨김 (OFF)</option>
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

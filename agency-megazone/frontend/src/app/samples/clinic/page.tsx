"use client";

import { useState } from "react";
import Link from "next/link";
import { clientApiFetch } from "@/lib/api";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Droplets,
  HeartPulse,
  MapPin,
  Menu,
  Microscope,
  ParkingCircle,
  Phone,
  ShieldPlus,
  Stethoscope,
  TrainFront,
  UserCheck,
  X,
} from "lucide-react";

const CLINIC_DEPARTMENTS = [
  "소화기 내시경",
  "만성질환 클리닉",
  "5대 암·종합검진",
  "수액·면역 클리닉",
] as const;

type ClinicDepartment = (typeof CLINIC_DEPARTMENTS)[number];

interface BookingConfirmation {
  department: string;
  date: string;
  name: string;
  phone: string;
  channel: string;
}

export default function YonseiBarunClinicSamplePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 히어로 하단 빠른 예약 바 상태
  const [department, setDepartment] =
    useState<ClinicDepartment>("소화기 내시경");
  const [hopeDate, setHopeDate] = useState<string>("2026-11-20");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [quickError, setQuickError] = useState("");

  // 접수 완료 확인 모달
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null
  );

  // 네이버 예약 안내 모달
  const [naverModalOpen, setNaverModalOpen] = useState(false);

  const handleQuickBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hopeDate || !patientName.trim() || !patientPhone.trim()) {
      setQuickError("희망날짜, 성함, 연락처를 모두 입력해 주세요.");
      return;
    }
    setQuickError("");
    const body = {
      category: "ESTIMATE",
      customerName: patientName.trim() || "샘플 체험 고객",
      customerPhone: patientPhone.trim() || "010-0000-0000",
      customerEmail: null,
      title: `[샘플체험-병의원] ${department} 빠른 진료예약 (${hopeDate})`,
      content: `진료과목: ${department} / 희망날짜: ${hopeDate} / 접수경로: 빠른 온라인 진료예약`,
      customFieldsJson: JSON.stringify({
        sampleSource: "clinic",
        department,
        hopeDate,
      }),
      attachmentMediaId: null,
      privacyAgreed: true,
      websiteUrl: "",
    };
    try {
      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch {
      if (typeof window !== "undefined") {
        const existing = JSON.parse(
          localStorage.getItem("demo_sample_inquiries") || "[]"
        );
        existing.unshift({
          id: Date.now(),
          ...body,
          status: "NEW",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("demo_sample_inquiries", JSON.stringify(existing));
      }
    }
    setConfirmation({
      department,
      date: hopeDate,
      name: patientName.trim(),
      phone: patientPhone.trim(),
      channel: "빠른 온라인 진료예약",
    });
    setPatientName("");
    setPatientPhone("");
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-900 antialiased selection:bg-[#0F766E] selection:text-white">
      {/* 최상단 데모 안내 띠 */}
      <div className="bg-slate-950 px-4 py-2 text-xs text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
          <p className="min-w-0 text-slate-300">
            현재 보고 계신 페이지는 업종별 맞춤형 구축 데모 샘플입니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-semibold">
            <Link
              href="/"
              className="text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:text-teal-300"
            >
              에이전시 메인으로 돌아가기
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/login"
              className="text-teal-300 underline decoration-teal-500/60 underline-offset-4 transition-colors hover:text-teal-200"
            >
              관리자(/admin) 체험하기
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/inquiries"
              className="text-emerald-300 underline decoration-emerald-500/60 underline-offset-4 transition-colors hover:text-emerald-200"
            >
              관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
            </Link>
          </div>
        </div>
      </div>

      {/* 1. 상단 진료시간 안내 띠 + 병원 로고 헤더 */}
      <header className="sticky top-0 z-40 bg-white/95 shadow-xs backdrop-blur-md">
        {/* 상단 진료시간 안내 띠 */}
        <div className="bg-[#0F766E] px-4 py-2 text-[11px] font-medium text-teal-50 sm:text-xs">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <span>평일 09:00~18:30</span>
              <span className="text-teal-300/60" aria-hidden="true">
                |
              </span>
              <span>토요일 09:00~14:00</span>
              <span className="text-teal-300/60" aria-hidden="true">
                |
              </span>
              <span>점심 13:00~14:00</span>
            </div>
            <a
              href="tel:02-555-8275"
              className="inline-flex items-center gap-1 font-bold text-white hover:text-teal-100"
            >
              <Phone className="h-3 w-3" />
              <span>대표전화 02-555-8275</span>
            </a>
          </div>
        </div>

        {/* 병원 로고 헤더 */}
        <div className="border-b border-slate-200">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
            <a href="#top" className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F766E] to-[#0284C7] text-white shadow-sm">
                <ShieldPlus className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  연세바른내과
                </div>
                <div className="truncate text-[11px] font-semibold text-[#0F766E]">
                  소화기내시경 · 건강검진센터
                </div>
              </div>
            </a>

            <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 lg:flex">
              <a
                href="#clinics"
                className="transition-colors hover:text-[#0F766E]"
              >
                진료과목
              </a>
              <a
                href="#doctors"
                className="transition-colors hover:text-[#0F766E]"
              >
                의료진 소개
              </a>
              <a
                href="#hours-location"
                className="transition-colors hover:text-[#0F766E]"
              >
                진료시간·오시는길
              </a>
              <a
                href="#quick-booking"
                className="transition-colors hover:text-[#0F766E]"
              >
                온라인 예약
              </a>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setNaverModalOpen(true)}
                className="hidden rounded-lg border border-[#03C75A] bg-[#03C75A]/10 px-3.5 py-2 text-xs font-bold text-[#029E47] transition-colors hover:bg-[#03C75A] hover:text-white sm:inline-flex"
              >
                네이버 예약
              </button>
              <a
                href="#quick-booking"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0D625B] sm:px-4 sm:text-sm"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>빠른 진료예약</span>
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="메뉴 열기"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-2.5 text-sm font-semibold text-slate-700">
              {[
                { label: "진료과목", href: "#clinics" },
                { label: "의료진 소개", href: "#doctors" },
                { label: "진료시간·오시는길", href: "#hours-location" },
                { label: "온라인 예약", href: "#quick-booking" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 hover:bg-teal-50 hover:text-[#0F766E]"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setNaverModalOpen(true);
                }}
                className="mt-1 rounded-lg border border-[#03C75A] bg-[#03C75A]/10 px-3 py-2 text-left text-xs font-bold text-[#029E47]"
              >
                네이버 예약 바로가기
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 2. 밝은 병원 히어로 + 하단 플로팅 빠른 예약 바 */}
      <section id="top" className="relative bg-slate-50 pb-12 lg:pb-24">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#F0FDFA] via-white to-[#F0F9FF]">
          <img
            src="/images/samples/clinic-hero.jpg"
            alt="연세바른내과·건강검진센터 밝고 쾌적한 진료 공간"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/samples/fallback.svg";
            }}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-[#E0F2FE]/60" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
            <div className="max-w-2xl min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F766E]/25 bg-[#0F766E]/10 px-3.5 py-1 text-xs font-bold text-[#0F766E]">
                <UserCheck className="h-3.5 w-3.5" />
                대학병원급 내시경 · 국민건강보험공단 검진 지정기관
              </span>

              <h1 className="mt-5 text-3xl font-extrabold leading-[1.22] tracking-tight text-slate-900 sm:text-5xl">
                과잉 진료 없이 정직하게,
                <br />
                <span className="text-[#0F766E]">정밀 내시경·평생 주치의</span>
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                연세대학교·서울대학교 의과대학 출신 내과 전문의 3인 협진.
                당일 위·대장 내시경 용종 절제부터 고혈압·당뇨 만성질환 관리,
                5대 암 국가검진까지 한 곳에서 안전하게 받으실 수 있습니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-xl border border-teal-100 bg-white/90 px-4 py-2.5 shadow-xs">
                  <div className="text-xs text-slate-500">누적 내시경 검사</div>
                  <div className="text-base font-extrabold text-[#0F766E]">
                    38,000건+
                  </div>
                </div>
                <div className="rounded-xl border border-sky-100 bg-white/90 px-4 py-2.5 shadow-xs">
                  <div className="text-xs text-slate-500">내시경 장비</div>
                  <div className="text-base font-extrabold text-[#0284C7]">
                    올림푸스 HQ290
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 shadow-xs">
                  <div className="text-xs text-slate-500">감염 관리</div>
                  <div className="text-base font-extrabold text-slate-800">
                    1회용 내시경 포셉
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 히어로 하단에 겹쳐진 1줄 빠른 예약 바 */}
        <div
          id="quick-booking"
          className="relative z-20 mx-auto -mt-12 max-w-6xl px-4 sm:px-6 lg:-mt-14 lg:px-8"
        >
          <form
            onSubmit={handleQuickBooking}
            className="rounded-2xl border border-teal-200/80 bg-white p-4 shadow-xl shadow-teal-900/5 sm:p-6"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F766E]">
                <Calendar className="h-4 w-4" />
                <span>실시간 빠른 진료·검진 예약</span>
              </div>
              <span className="text-xs text-slate-500">
                접수 후 10분 이내 원무과 확인 연락을 드립니다
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-12 md:items-end">
              <div className="min-w-0 md:col-span-3">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  진료과목
                </label>
                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(e.target.value as ClinicDepartment)
                  }
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-900 focus:border-[#0F766E] focus:bg-white focus:outline-none"
                >
                  {CLINIC_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="min-w-0 md:col-span-3">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  희망날짜
                </label>
                <input
                  type="date"
                  value={hopeDate}
                  onChange={(e) => setHopeDate(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-900 focus:border-[#0F766E] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  성함
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="홍길동"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  연락처
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0F766E] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="min-w-0 md:col-span-2">
                <button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-gradient-to-r from-[#0F766E] to-[#0284C7] px-4 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95"
                >
                  빠른 예약 신청
                </button>
              </div>
            </div>

            {quickError && (
              <p className="mt-2.5 text-xs font-medium text-rose-600">
                {quickError}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* 3. 4대 특화 진료 클리닉 카드 */}
      <section id="clinics" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0284C7] uppercase">
              Specialized Clinics
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-4xl">
              연세바른내과 4대 특화 진료 클리닉
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              분과별 전문의의 정확한 진단과 최신 의료 장비를 통해 대학병원
              수준의 세심한 진료를 제공합니다.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Microscope,
                badge: "당일 용종 절제",
                title: "소화기 내시경",
                desc: "올림푸스 최상위 고화질 내시경으로 미세 병변까지 판독하며, 1인 회복실과 CO2 무통 가스를 적용합니다.",
                points: [
                  "위·대장 수면내시경 당일 검사",
                  "용종 발견 즉시 원스톱 절제술",
                  "철저한 1:1 멸균 소독 시스템",
                ],
                accent: "text-[#0F766E] bg-teal-50 border-teal-200",
              },
              {
                icon: HeartPulse,
                badge: "평생 주치의",
                title: "만성질환 클리닉",
                desc: "고혈압, 당뇨병, 고지혈증, 갑상선 질환 등 합병증 예방을 위한 주기적 혈액·초음파 추적 관리를 시행합니다.",
                points: [
                  "개인별 맞춤 약물·식단 처방",
                  "당화혈색소·경동맥 초음파 즉시 확인",
                  "공단 만성질환 통합관리 시범기관",
                ],
                accent: "text-[#0284C7] bg-sky-50 border-sky-200",
              },
              {
                icon: Activity,
                badge: "국가검진 지정",
                title: "5대 암·종합검진",
                desc: "국민건강보험공단 5대 암 검진(위·대장·간·유방·자궁경부) 및 직장인·개인 맞춤형 정밀 종합검진을 운영합니다.",
                points: [
                  "검진 당일 주요 결과 1차 브리핑",
                  "초음파·CT·혈액 정밀 암표지자 검사",
                  "상급종합병원 신속 진료 의뢰 연계",
                ],
                accent: "text-[#0F766E] bg-teal-50 border-teal-200",
              },
              {
                icon: Droplets,
                badge: "맞춤 면역 케어",
                title: "수액·면역 클리닉",
                desc: "전문의 문진 후 만성피로, 감기 몸살, 장염 탈수, 갱년기 증상 등 컨디션에 맞는 1:1 수액 요법을 처방합니다.",
                points: [
                  "프리미엄 프라이빗 1인 수액실",
                  "고용량 비타민·아미노산·태반 수액",
                  "대상포진·독감·폐렴구균 예방접종",
                ],
                accent: "text-[#0284C7] bg-sky-50 border-sky-200",
              },
            ].map((clinic) => {
              const Icon = clinic.icon;
              return (
                <div
                  key={clinic.title}
                  className="flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#0F766E]/50 hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${clinic.accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        {clinic.badge}
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-slate-900">
                      {clinic.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {clinic.desc}
                    </p>
                  </div>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-700">
                    {clinic.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 대표 원장 & 의료진 프로필 카드 3인 */}
      <section
        id="doctors"
        className="border-y border-slate-200 bg-[#F8FAFC] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#0F766E] uppercase">
                Medical Team
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-4xl">
                풍부한 임상 경험의 전문의 의료진
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              모든 내시경과 초음파 검사는 내과 전문의가 직접 시행하고
              판독합니다.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "김도현",
                role: "대표원장 · 소화기내과 전문의",
                image: "/images/samples/clinic-doc1.jpg",
                careers: [
                  "연세대학교 의과대학 졸업 및 의학석사",
                  "세브란스병원 내과 전공의 · 소화기내과 전임의",
                  "대한소화기내시경학회 세부전문의 · 평생회원",
                  "위·대장 내시경 22,000건 이상 직접 시술",
                ],
              },
              {
                name: "이수진",
                role: "원장 · 내분비내과 전문의",
                image: "/images/samples/clinic-doc2.jpg",
                careers: [
                  "서울대학교 의과대학 졸업",
                  "서울대학교병원 내과 전공의 · 내분비내과 전임의",
                  "대한당뇨병학회 · 대한내분비학회 정회원",
                  "갑상선 초음파 및 대사질환 정밀 클리닉 전담",
                ],
              },
              {
                name: "박준영",
                role: "건강검진센터장 · 가정의학과 전문의",
                image: "/images/samples/clinic-doc3.jpg",
                careers: [
                  "연세대학교 의과대학 졸업",
                  "강남세브란스병원 건강증진센터 임상교수 역임",
                  "대한가정의학회 정회원 · 노인병 인정의",
                  "5대 암 국가검진 및 면역·수액 클리닉 총괄",
                ],
              },
            ].map((doc) => (
              <article
                key={doc.name}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={doc.image}
                    alt={`${doc.name} ${doc.role}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/samples/fallback.svg";
                    }}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="p-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-[#0F766E]">
                    <Stethoscope className="h-3.5 w-3.5" />
                    <span>{doc.role}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-extrabold text-slate-900">
                    {doc.name} 원장
                  </h3>
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {doc.careers.map((line) => (
                      <li key={line} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0284C7]" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 한국 병의원 필수 섹션: 2단 진료시간 안내표 + 오시는 길 */}
      <section id="hours-location" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0F766E] uppercase">
              Hours &amp; Location
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-4xl">
              진료시간 및 오시는 길
            </h2>
          </div>

          {/* 2단 진료시간 안내표 */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-lg font-extrabold text-slate-900">
                <Clock className="h-5 w-5 text-[#0F766E]" />
                <span>외래 및 검진 진료시간 안내</span>
              </div>

              <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white text-sm">
                <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <span className="font-semibold text-slate-700">
                    평일 (월 ~ 금)
                  </span>
                  <span className="font-bold text-slate-900">
                    09:00 ~ 18:30
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <span className="font-semibold text-slate-700">
                    토요일 (점심시간 없음)
                  </span>
                  <span className="font-bold text-[#0284C7]">
                    09:00 ~ 14:00
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <span className="font-semibold text-slate-700">점심시간</span>
                  <span className="font-medium text-slate-700">
                    13:00 ~ 14:00
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3.5">
                  <span className="font-semibold text-rose-600">
                    일요일 · 공휴일
                  </span>
                  <span className="font-bold text-rose-600">휴진</span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                * 위·대장 내시경 검진은 오전 08:30부터 사전 예약자 우선
                진행됩니다. 접수 마감은 진료 종료 30분 전입니다.
              </p>
            </div>

            {/* 우측: 대표전화 & 오시는 길 */}
            <div className="min-w-0 rounded-2xl border border-teal-200/80 bg-gradient-to-br from-[#F0FDFA] to-white p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-lg font-extrabold text-slate-900">
                <MapPin className="h-5 w-5 text-[#0F766E]" />
                <span>병원 위치 및 주차 안내</span>
              </div>

              <div className="mt-5 space-y-4 text-sm">
                <div className="rounded-xl border border-teal-100 bg-white p-4">
                  <div className="text-xs font-semibold text-[#0F766E]">
                    도로명 주소
                  </div>
                  <div className="mt-1 font-bold text-slate-900">
                    서울특별시 서초구 강남대로 465 교보타워 B동 4층
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-teal-100 bg-white p-4">
                  <TrainFront className="mt-0.5 h-5 w-5 shrink-0 text-[#0284C7]" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900">
                      지하철 이용 시
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      9호선·신분당선 <strong>신논현역 6번 출구 도보 2분</strong>
                      <br />
                      2호선·신분당선 강남역 10번 출구 도보 7분
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-teal-100 bg-white p-4">
                  <ParkingCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#0F766E]" />
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900">주차 안내</div>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      건물 내 지하 주차장{" "}
                      <strong className="text-[#0F766E]">
                        무료주차 2시간 지원
                      </strong>
                      <br />
                      (수면내시경 시 당일 자가운전 금지, 대중교통 이용 권장)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#0F766E] px-5 py-4 text-white">
                  <div>
                    <div className="text-xs text-teal-100">
                      진료 및 검진 예약 직통번호
                    </div>
                    <div className="text-xl font-extrabold">02-555-8275</div>
                  </div>
                  <a
                    href="#quick-booking"
                    className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#0F766E] transition-colors hover:bg-teal-50"
                  >
                    온라인 예약하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 자체 병원 푸터 (의료기관 개설 정보) */}
      <footer className="border-t border-slate-200 bg-slate-900 pb-20 pt-12 text-slate-400 sm:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-slate-800 pb-8 md:flex-row md:items-center">
            <div>
              <div className="text-base font-bold text-white">
                연세바른내과·건강검진센터
              </div>
              <p className="mt-1 text-xs text-slate-400">
                국민건강보험공단 지정 건강검진기관 · 대한소화기내시경학회
                우수내시경실 인증
              </p>
            </div>
            <div className="flex flex-wrap gap-5 text-xs">
              <a href="#clinics" className="hover:text-white">
                진료과목
              </a>
              <a href="#doctors" className="hover:text-white">
                의료진 소개
              </a>
              <a href="#hours-location" className="hover:text-white">
                진료시간·오시는길
              </a>
              <a href="#quick-booking" className="hover:text-white">
                온라인 예약
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-slate-500 sm:flex-row">
            <div className="space-y-1">
              <p>
                의료기관명: 연세바른내과의원 | 개설자(대표원장): 김도현 |
                사업자등록번호: 214-91-48210 | 요양기관번호: 11398420
              </p>
              <p>
                소재지: 서울특별시 서초구 강남대로 465 교보타워 B동 4층 |
                대표전화: 02-555-8275 | 비급여 진료비용 원내 및 홈페이지 고지
              </p>
            </div>
            <p className="shrink-0">
              © 2026 연세바른내과의원. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 빠른 예약 접수 완료 확인 모달 */}
      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-teal-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-[#0F766E]">
                <CheckCircle2 className="h-5 w-5" />
                <span>진료 예약 접수 완료</span>
              </div>
              <button
                type="button"
                onClick={() => setConfirmation(null)}
                aria-label="닫기"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 rounded-xl bg-[#F0FDFA] p-4 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">접수 경로</span>
                <span className="font-semibold text-slate-900">
                  {confirmation.channel}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">진료과목</span>
                <span className="font-bold text-[#0F766E]">
                  {confirmation.department}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">희망날짜</span>
                <span className="font-semibold text-slate-900">
                  {confirmation.date}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">예약자</span>
                <span className="font-semibold text-slate-900">
                  {confirmation.name} ({confirmation.phone})
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-600">
              원무과 담당자가 확인 후 10분 이내에 예약 확정 안내 전화를
              드리겠습니다. 내시경 검진 예약 시 검사 전날 금식 안내 문자를 함께
              발송해 드립니다.
            </p>
            <div className="mt-3 space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
              <p>
                ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가
                기록되었습니다.
              </p>
              <Link
                href="/admin/inquiries"
                className="inline-block font-bold text-[#0F766E] underline underline-offset-4 hover:text-teal-900"
              >
                관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="mt-5 w-full rounded-xl bg-[#0F766E] py-3 text-sm font-bold text-white transition-colors hover:bg-[#0D625B]"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 네이버 예약 모달 */}
      {naverModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-base font-bold text-slate-900">
                네이버 예약 연계 안내
              </span>
              <button
                type="button"
                onClick={() => setNaverModalOpen(false)}
                aria-label="닫기"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              실제 병원 납품 시 고객사의 네이버 플레이스 예약 URL과 즉시
              연동됩니다. 아래 버튼을 누르시면 페이지 내 빠른 예약 바에서도
              동일하게 예약 접수를 테스트해 보실 수 있습니다.
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href="#quick-booking"
                onClick={() => setNaverModalOpen(false)}
                className="flex-1 rounded-xl bg-[#0F766E] py-2.5 text-center text-sm font-bold text-white hover:bg-[#0D625B]"
              >
                빠른 예약 바로가기
              </a>
              <button
                type="button"
                onClick={() => setNaverModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

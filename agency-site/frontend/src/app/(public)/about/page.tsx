import Link from "next/link";
import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  FileCheck2,
  Lock,
  Mail,
  MapPin,
  Phone,
  SearchCheck,
  Server,
  ShieldCheck,
  Sparkles,
  Train,
} from "lucide-react";
import { fetchPublicSiteConfigs } from "@/lib/api";

interface CompanyInfo {
  name?: string;
  ceo?: string;
  bizNo?: string;
  phone?: string;
  email?: string;
  address?: string;
}

const CORE_PRINCIPLES = [
  {
    badge: "01 · 완전 독립 소유",
    title: "월 고정 임대료 0원 독립 소유",
    desc: "매월 고정 이용료를 납부해야 하는 일반 임대형 웹빌더와 달리, 구축 완료 즉시 홈페이지와 관리자 프로그램, 데이터베이스 원본 전체를 100% 고객사 명의로 이전해 드립니다.",
    icon: Building2,
  },
  {
    badge: "02 · 검증된 제작 기술력",
    title: "초고속 검색 최적화 홈페이지 + 안정적인 전용 관리자 시스템",
    desc: "기존 임대형 플랫폼과 달리, 국내 주요 기업 환경에서 검증된 최신 웹 기술(Spring Boot · Next.js)로 구축하여 빠른 페이지 로딩 속도와 추후 기능 확장성을 보장합니다.",
    icon: Code2,
  },
  {
    badge: "03 · 저작권 안심 보장",
    title: "100% 라이선스 클린 보장 (폰트·아이콘·프로그램 저작권 걱정 0%)",
    desc: "납품 후 폰트나 디자인 요소의 저작권 문제로 불편을 겪으시는 일이 없도록 상업적 무료 사용이 공식 확인된 안전한 라이선스만 엄격하게 선별하여 적용합니다.",
    icon: ShieldCheck,
  },
  {
    badge: "04 · 검색엔진 상위노출 설계",
    title: "네이버·구글 검색 최적화 기본 탑재",
    desc: "글자가 이미지로 통째로 들어가 검색이 되지 않는 홈페이지가 아닙니다. 검색 로봇이 홈페이지 내용을 잘 읽을 수 있는 표준 문서 구조와 사이트맵, 검색 등록 기능을 기본 탑재해 홍보 효율을 높입니다.",
    icon: SearchCheck,
  },
];

const TECH_SPECS = [
  {
    layer: "보안 연결 (SSL 인증서)",
    stack: "무료 보안인증서 자동 갱신 시스템 (Caddy)",
    benefit: "주소창 자물쇠(https) 보안인증서를 무료로 자동 발급·갱신하여 매년 발생하는 인증서 연장 비용(연 5~15만 원)을 아껴드립니다.",
  },
  {
    layer: "홈페이지 화면 & 검색 최적화",
    stack: "초고속 검색 최적화 웹 엔진 (Next.js)",
    benefit: "네이버·구글 검색 로봇이 홈페이지 정보를 빠르게 수집할 수 있도록 돕고, 관리자에서 수정한 내용을 새로고침 즉시 화면에 반영합니다.",
  },
  {
    layer: "전용 관리자 & 고객 정보 보호",
    stack: "안정적인 전용 관리 서버 (Spring Boot)",
    benefit: "관리자 2단계 보안 로그인, 광고성 자동 스팸 문의 차단, 고객이 첨부한 견적 서류의 비공개 암호화 보관을 지원합니다.",
  },
  {
    layer: "데이터 저장 & 예약 관리",
    stack: "정밀 예약·데이터 관리 시스템 (PostgreSQL)",
    benefit: "동시 접속 시에도 같은 시간대에 중복 예약이 발생하지 않도록 방지하며, 홈페이지 설정과 문의 내역을 안전하게 보관합니다.",
  },
  {
    layer: "사진 용량 자동 최적화",
    stack: "고화질 사진 자동 경량화 기능 (WebP)",
    benefit: "스마트폰이나 카메라로 찍은 대용량 원본 사진을 그대로 올려도 화질 저하 없이 용량을 약 75% 줄여 모바일 로딩 속도를 높입니다.",
  },
];

const TIMELINE = [
  {
    period: "STEP 01 · 핵심 기능 표준화",
    title: "중소기업·병의원·전문직 필수 기능 올인원 모듈 구축",
    desc: "현장에서 가장 많이 찾으시는 검색엔진 문구 설정, 맞춤형 상담 문의폼, 온라인 예약 달력, 공지·포트폴리오 게시판을 하나의 안정적인 시스템으로 통합하여 제작 기간과 비용 부담을 줄였습니다.",
  },
  {
    period: "STEP 02 · 업종별 맞춤 구성",
    title: "기업·시공·제조형(CORP) 및 병의원·로펌 예약형(CLINIC) 특화 설계",
    desc: "업종별 방문 고객이 가장 궁금해하는 정보 배치와 문의 동선을 반영하여, 초기 원고와 사진 자료가 부족한 사장님도 빠르게 홈페이지를 오픈할 수 있도록 구성했습니다.",
  },
  {
    period: "STEP 03 · 합리적인 서버 운영비",
    title: "원클릭 간편 서버 설치 패키지 & 365일 안정적인 운영 구조",
    desc: "비싼 서버 호스팅 비용을 매달 지출하지 않으셔도 월 5천 원~1만 원대의 합리적인 단독 서버에서 쾌적하게 운영할 수 있도록 최적화했습니다.",
  },
];

export default async function AboutPage() {
  const configs = await fetchPublicSiteConfigs();
  let companyInfo: CompanyInfo = {
    name: "웹오너 스튜디오 (주식회사 스타터)",
    ceo: "홍길동",
    bizNo: "123-45-67890",
    phone: "02-1234-5678",
    email: "contact@starter-agency.kr",
    address: "서울시 강남구 테헤란로 123 스타터타워 8층",
  };

  try {
    const parsed = JSON.parse(configs.footer_company_info || "{}") as CompanyInfo;
    companyInfo = {
      name: parsed.name || companyInfo.name,
      ceo: parsed.ceo || companyInfo.ceo,
      bizNo: parsed.bizNo || companyInfo.bizNo,
      phone: parsed.phone || companyInfo.phone,
      email: parsed.email || companyInfo.email,
      address: parsed.address || companyInfo.address,
    };
  } catch {
    // ignore JSON error
  }

  return (
    <div className="overflow-x-hidden bg-slate-50 pb-20">
      {/* 1. 상단 비주얼 헤더 */}
      <section className="relative overflow-hidden bg-slate-900 py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1e3a8a,transparent_60%)] opacity-70" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>KOREAN FULL-STACK WEB AGENCY · 회사 및 제작 방식 소개</span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            단순 웹빌더 대행이 아닌,
            <br className="hidden sm:inline" />{" "}
            <span className="text-blue-400">100% 고객사 소유의 웹 자산</span>을 구축합니다
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {companyInfo.name}는 매달 고정 임대료를 내고도 홈페이지 원본을 이전받기 어려웠던 기존 임대형 플랫폼의
            아쉬움을 해결합니다. 10년 이상 경력의 전담 개발자가 기획부터 디자인 구성, 검색 등록, 서버 이관까지 직접
            책임지고 수행합니다.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "월 고정 관리·임대료", value: "0원 (평생 독립 소유)" },
              { label: "평균 구축 완료 기간", value: "5~10 영업일" },
              { label: "폰트·디자인 저작권", value: "100% 상업 무료 안심" },
              { label: "세금계산서·현금영수증", value: "100% 당일 정식 발행" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs"
              >
                <div className="text-xs text-slate-400">{stat.label}</div>
                <div className="mt-1 text-base font-extrabold text-white sm:text-lg">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-14 sm:px-6">
        {/* 2. 핵심 제작 철학 4대 원칙 카드 */}
        <section>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                OUR CORE PRINCIPLES
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                고객사 만족을 위한 4대 제작 원칙
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-sm">
              납품 후에도 대표님과 직원이 개발자 도움 없이 쉽게 운영할 수 있도록 설계합니다.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {CORE_PRINCIPLES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {item.badge}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white transition group-hover:bg-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. 시스템 구성 및 보안 안내 표 */}
        <section className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="min-w-0">
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                SYSTEM & SECURITY OVERVIEW
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                홈페이지 핵심 시스템 및 보안 설계 안내
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                복잡한 관리 부담은 줄이고, 속도와 보안은 높인 실용적인 독립형 시스템을 납품합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              <Lock className="h-4 w-4 shrink-0" />
              <span>표준 웹 보안 및 개인정보 보호 적용</span>
            </div>
          </div>

          <div className="mt-6 w-full min-w-0 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                  <th className="px-4 py-3.5">구분</th>
                  <th className="px-4 py-3.5">제공 시스템</th>
                  <th className="px-4 py-3.5">사장님이 체감하시는 실제 운영 효과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TECH_SPECS.map((spec) => (
                  <tr key={spec.stack} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-semibold text-slate-700">{spec.layer}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                        <Cpu className="h-3.5 w-3.5 text-blue-400" />
                        {spec.stack}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{spec.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. 수행 역량 및 제공 산출물 안내 */}
        <section className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              TRACK RECORD & DELIVERABLES
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              수행 역량 및 100% 원본 인도 원칙
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              외주 재하청 없이 전담 엔지니어가 처음 상담부터 관리자 화면 맞춤 설정, 도메인 연결까지
              전 과정을 1:1로 꼼꼼하게 챙겨드립니다.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                <Award className="h-4 w-4 text-blue-600" />
                <span>구축 완료 시 기본 제공해 드리는 산출물</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>홈페이지 화면 + 전용 관리자 서버 원본 소스코드 전체 (Next.js · Spring Boot)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>원클릭 간편 서버 설치 패키지 및 데이터베이스 자동 구성 파일</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>비개발자 눈높이 관리자 사용 설명서 및 1:1 원격 인수인계 안내</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-7">
            {TIMELINE.map((step, idx) => (
              <div
                key={step.period}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-blue-600">{step.period}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    핵심 강점 #{idx + 1}
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. 한국형 오시는 길 및 고객센터 운영 안내 섹션 */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                LOCATION & CUSTOMER CENTER
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                오시는 길 및 고객센터 운영 안내
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                온라인 1:1 화상 미팅(Zoom/구글미트), 크몽 메시지, 전화 상담 및 방문 미팅 모두 편하게 이용하실 수 있습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/inquiries"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-700"
              >
                무료 견적 문의하기
              </Link>
              <Link
                href="/reservations"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                1:1 상담 예약하기
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* 약도/교통편 시각화 카드 */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>오피스 위치 안내</span>
                </div>
                <h3 className="mt-3 text-lg font-bold">{companyInfo.address}</h3>
                <p className="mt-1 text-xs text-slate-300">
                  상호: {companyInfo.name} · 대표: {companyInfo.ceo} · 사업자등록번호: {companyInfo.bizNo}
                </p>
              </div>

              <div className="my-6 grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-200">
                <div className="flex items-start gap-2.5">
                  <Train className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                  <div>
                    <span className="font-bold text-white">지하철 이용 시:</span> 2호선·신분당선 강남역 / 역삼역
                    도보 5분 거리 (방문 전 사전 예약 시 1층 로비 안내)
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Server className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-bold text-white">주차 안내:</span> 건물 내 지하주차장 방문객 2시간 무료
                    주차 지원 (예약 시 차량번호 사전 등록)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                <span>전국 비대면 원격 화상 미팅 상시 가능</span>
                <span className="font-semibold text-blue-300">당일 견적서 즉시 발송</span>
              </div>
            </div>

            {/* 고객센터 상세 정보 카드 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>대표 상담 전화</span>
                </div>
                <div className="mt-2 text-xl font-extrabold text-slate-900">{companyInfo.phone}</div>
                <p className="mt-1 text-xs text-slate-500">
                  상담 중일 경우 문자나 견적문의를 남겨주시면 빠르게 연락드립니다.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span>공식 이메일 · 자료 송부</span>
                </div>
                <div className="mt-2 truncate text-base font-extrabold text-slate-900">
                  {companyInfo.email}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  제안요청서, 기존 홍보물, 참고 사이트 주소 접수 가능
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>고객센터 운영시간</span>
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  평일 10:00 ~ 18:00 (점심 12:30~13:30)
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  온라인 견적문의 및 긴급 점검 요청은 365일 상시 접수
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  <span>세금계산서 · 증빙 서류 발행</span>
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-900">
                  전자세금계산서 · 비교견적서 당일 발행
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  법인·개인사업자 지출증빙, 정부지원사업 수행 증빙 완벽 지원
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

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
    desc: "매월 3~10만 원씩 평생 빠져나가는 임대형 웹빌더와 다릅니다. 구축 완료 즉시 프론트엔드·백엔드·DB 원본 소스코드를 100% 고객사 명의로 귀속시켜 드립니다.",
    icon: Building2,
  },
  {
    badge: "02 · 엔터프라이즈 기술력",
    title: "Java 21 · Spring Boot 3.4 · Next.js 15 정통 아키텍처",
    desc: "저가형 PHP·워드프레스 플러그인 조합이 아닌, 국내 금융·공공·대기업 표준인 Spring Boot 3.4와 Next.js 15 SSR 정통 아키텍처로 압도적인 속도와 확장성을 보장합니다.",
    icon: Code2,
  },
  {
    badge: "03 · 법무 리스크 ZERO",
    title: "100% 라이선스 클린 보장 (폰트·아이콘·오픈소스 법무 리스크 0%)",
    desc: "납품 후 폰트·이미지 저작권 내용증명으로 당황하시는 일이 없도록 상업적 무료 라이선스(SIL OFL, MIT, Apache-2.0)만 엄격하게 검증하여 적용합니다.",
    icon: ShieldCheck,
  },
  {
    badge: "04 · 검색엔진 상위노출 설계",
    title: "네이버·구글 SEO/AEO 기본 탑재",
    desc: "단순히 예쁘기만 한 통이미지 사이트가 아닙니다. 시맨틱 마크업, 동적 사이트맵, JSON-LD 구조화 데이터, 서치어드바이저 연동을 기본 탑재해 광고비 효율을 극대화합니다.",
    icon: SearchCheck,
  },
];

const TECH_SPECS = [
  {
    layer: "Edge & SSL 게이트웨이",
    stack: "Caddy 2 무료 자동 SSL",
    benefit: "Let's Encrypt 인증서 무중단 자동 발급·갱신 (연간 SSL 갱신 비용 0원) 및 HTTP/3 보안 통신",
  },
  {
    layer: "프론트엔드 & SEO 렌더링",
    stack: "Next.js 15 SSR (App Router)",
    benefit: "네이버·구글 검색 로봇이 0.1초 만에 수집하는 서버사이드 렌더링 & 무코드 설정 즉시 반영",
  },
  {
    layer: "백엔드 비즈니스 엔진",
    stack: "Spring Boot 3.4 Modular Monolith",
    benefit: "Java 21 기반 시큐어 코딩, JWT 이중 인증, Honeypot 스팸 방어, 비공개 첨부파일 스트리밍",
  },
  {
    layer: "데이터베이스 & 트랜잭션",
    stack: "PostgreSQL 16",
    benefit: "예약 정원 동시성 제어(비관적 락), 무코드 설정 JSON 관리 및 일일 자동 백업",
  },
  {
    layer: "미디어 & 성능 최적화",
    stack: "WebP 자동 압축 워커",
    benefit: "고해상도 원본 업로드 시 백그라운드에서 차세대 WebP 포맷으로 자동 변환·용량 75% 절감",
  },
];

const TIMELINE = [
  {
    period: "STEP 01 · 아키텍처 표준화",
    title: "Spring Boot + Next.js 하이브리드 웹 스타터 엔진 독자 개발",
    desc: "중소기업·병의원·전문직 현장에서 가장 자주 쓰이는 무코드 SEO, 상담폼, 예약 달력, CMS를 단일 고성능 엔진으로 표준화하여 제작 단가와 기간을 혁신적으로 단축했습니다.",
  },
  {
    period: "STEP 02 · 업종별 특화 프리셋 구축",
    title: "기업·시공·제조형(CORP) 및 병의원·로펌 예약형(CLINIC) 검증",
    desc: "업종별 고객 동선과 전환율(CVR) 데이터를 반영하여, 원고와 사진이 부족한 초기 창업자도 즉시 비즈니스에 투입할 수 있는 고밀도 템플릿 체계를 완성했습니다.",
  },
  {
    period: "STEP 03 · 2GB 저사양 VPS 최적화",
    title: "단일 서버 Docker Compose 원클릭 배포 & 365일 무중단 운영",
    desc: "고가의 클라우드 비용 없이 월 5천 원~1만 원대 가성비 VPS에서도 쾌적하게 돌아가도록 JVM/Node 메모리 튜닝과 자동 헬스체크 구조를 확립했습니다.",
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
    <div className="bg-slate-50 pb-20">
      {/* 1. 상단 비주얼 헤더 */}
      <section className="relative overflow-hidden bg-slate-900 py-16 text-white sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1e3a8a,transparent_60%)] opacity-70" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>KOREAN FULL-STACK WEB AGENCY · 회사 및 기술 소개</span>
          </div>

          <h1 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            단순 웹빌더 대행이 아닌,
            <br className="hidden sm:inline" />{" "}
            <span className="text-blue-400">100% 고객사 소유의 웹 자산</span>을 구축합니다
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {companyInfo.name}는 매달 고정 임대료를 내고도 소스코드를 이전받지 못하는 기존 홈페이지 제작 시장의
            불합리함을 해결합니다. 10년 이상 경력의 시니어 풀스택 엔지니어가 기획부터 개발·SEO·서버 이관까지 직접
            책임지고 수행합니다.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "월 고정 관리·임대료", value: "0원 (평생 독립 소유)" },
              { label: "평균 구축 완료 기간", value: "5~10 영업일" },
              { label: "폰트·오픈소스 저작권", value: "100% 상업 무료 클린" },
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
        {/* 2. 핵심 엔지니어링 철학 4대 원칙 카드 */}
        <section>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                ENGINEERING PHILOSOPHY
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                우리의 핵심 엔지니어링 철학 4대 원칙
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-sm">
              납품 후에도 대표님과 실무자가 개발자 없이 직접 운영할 수 있도록 설계합니다.
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

        {/* 3. 기술 스택 및 보안 아키텍처 요약 표 */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                SYSTEM ARCHITECTURE & SECURITY
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                기술 스택 및 보안 아키텍처 명세표
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                대기업·금융권 프로젝트에 투입되는 정통 엔터프라이즈 스택을 경량화하여 납품합니다.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              <Lock className="h-4 w-4" />
              <span>OWASP 웹 보안 가이드라인 준수</span>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
                  <th className="px-4 py-3.5">아키텍처 계층</th>
                  <th className="px-4 py-3.5">적용 핵심 기술</th>
                  <th className="px-4 py-3.5">고객사 비즈니스 이점 및 보안 효과</th>
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

        {/* 4. 연혁 및 수행 역량 타임라인 */}
        <section className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              TRACK RECORD & CAPABILITY
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              수행 역량 및 아키텍처 고도화 연혁
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              외주 재하청이나 공장식 찍어내기를 일절 하지 않습니다. 담당 엔지니어가 요구사항 분석부터
              관리자 콘솔 커스터마이징, 도메인·SSL 연결까지 전 과정을 1:1 전담합니다.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
                <Award className="h-4 w-4 text-blue-600" />
                <span>표준 납품 산출물 5종 기본 제공</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>프론트엔드(Next.js 15) + 백엔드(Spring Boot 3.4) 원본 소스코드 전체</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>Docker Compose 원클릭 운영 스크립트 및 DB 초기 마이그레이션(Flyway)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  <span>비개발자용 한국형 관리자 콘솔 매뉴얼 및 1:1 원격 인수인계 교육</span>
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
                    검증 완료 #{idx + 1}
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
                온라인 1:1 화상 미팅(Zoom/구글미트), 크몽 메시지, 유선 및 대면 미팅 모두 열려 있습니다.
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
                  회의 중일 경우 문자나 견적문의를 남겨주시면 즉시 회신드립니다.
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
                  RFP(제안요청서), 화면설계서, 참고 사이트 링크 접수 가능
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
                  온라인 견적문의 및 긴급 서버 장애 대응은 365일 상시 접수
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

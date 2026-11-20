import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  MapPin,
  Phone,
  Receipt,
  SearchCheck,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { fetchPublicSiteConfigs } from "@/lib/api";

interface CompanyInfo {
  name?: string;
  ceo?: string;
  bizNo?: string;
  phone?: string;
  address?: string;
}

const PRINCIPLES = [
  {
    icon: Wallet,
    badge: "01. 비용 투명성",
    title: "월 임대료 0원",
    desc: "초기 제작 비용 외에 매달 빠져나가는 플랫폼 이용료나 숨겨진 유지비가 전혀 없습니다.",
  },
  {
    icon: ShieldCheck,
    badge: "02. 완전한 소유권",
    title: "100% 자체 소유",
    desc: "디자인 원본, 도메인, 고객 데이터까지 모두 고객사 명의와 서버로 온전히 귀속됩니다.",
  },
  {
    icon: SearchCheck,
    badge: "03. 유입 최적화",
    title: "검색엔진 최적화",
    desc: "네이버와 구글 검색 로봇이 회사명과 핵심 키워드를 정확히 읽어 상단에 노출되도록 설계합니다.",
  },
  {
    icon: FileCheck2,
    badge: "04. 분쟁 예방",
    title: "법무·라이선스 100% 안전",
    desc: "저작권 분쟁 걱정 없는 정품 폰트·이미지와 자체 검증된 표준 코드만 사용하여 안심할 수 있습니다.",
  },
];

const TIMELINE = [
  {
    step: "STEP 01",
    period: "1~2일",
    title: "업종 맞춤 상담 및 기획 확정",
    desc: "대표님의 업종 특성과 핵심 고객층을 분석해 꼭 필요한 메뉴와 견적을 투명하게 확정합니다.",
  },
  {
    step: "STEP 02",
    period: "3~5일",
    title: "브랜드 디자인 및 메인 시안 제작",
    desc: "신뢰감을 주는 기업형 디자인과 모바일(360px)·PC 완벽 호환 화면을 빠르게 구성합니다.",
  },
  {
    step: "STEP 03",
    period: "자료 전달 후 7~14일",
    title: "상담·예약 기능 연동 및 검색 등록",
    desc: "필요 자료(사진·홈페이지 문구 등) 전달 완료 후 7~14일 내 기능 연동 및 검색 등록을 완료합니다.",
  },
  {
    step: "STEP 04",
    period: "구축 완료",
    title: "관리자 사용 교육 및 평생 소유 이관",
    desc: "비개발자도 쉽게 수정하는 관리자 콘솔 사용법을 안내하고 모든 소유권을 100% 이관합니다.",
  },
];

export default async function AboutPage() {
  const configs = await fetchPublicSiteConfigs();
  let info: CompanyInfo = {
    name: "엘레브웹 (eleveWeb)",
    ceo: "김준호",
    bizNo: "449-14-03005",
    phone: "010-4404-5263",
    address: "100% 비대면 온라인 스튜디오 (전국 온라인 지원)",
  };

  try {
    const parsed = JSON.parse(configs.footer_company_info || "{}") as CompanyInfo;
    info = { ...info, ...parsed };
  } catch {
    // 기본값 유지
  }

  const companyName = info.name || "엘레브웹 (eleveWeb)";

  return (
    <div className="overflow-x-hidden bg-white">
      {/* 상단 다크 네이비/바이올렛 2단 컴팩트 배너 헤더 */}
      <section className="relative overflow-hidden bg-[#0B0F19] py-10 text-white sm:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-blue-600/20" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-300">
                <Building2 className="h-3.5 w-3.5" />
                회사 소개 · ABOUT US
              </span>
              <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                {companyName}, 대표님의 비즈니스를
                <br className="hidden sm:block" /> 가장 든든하게 지키는 홈페이지 파트너
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                매달 내는 임대료 부담 없이, 한 번의 합리적인 구축으로 평생 100% 소유하는
                표준 기업 홈페이지를 만듭니다.
              </p>
            </div>

            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>리스크 제로 3대 보장</span>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-slate-200 sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-sky-400">①</span>
                    <span>1차 시안 불만족 시 100% 전액 환불 보장</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-sky-400">②</span>
                    <span>패키지별 최대 3개월 무상 하자보수 지원</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-sky-400">③</span>
                    <span>전자계약 · 전자세금계산서 100% 정식 발행</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4대 구축 원칙 */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              CORE PRINCIPLES
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              타협 없는 4대 구축 원칙
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              복잡한 전문 용어 대신, 사업 운영에 실질적인 도움이 되는 4가지 약속을 지킵니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition hover:border-sky-300 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-xs font-semibold text-blue-600">{item.badge}</div>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 역량 타임라인 */}
      <section className="border-y border-slate-100 bg-slate-50 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
              WORKFLOW & CAPABILITY
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              자료 전달 완료 후 7~14일 완성, 체계적인 구축 타임라인
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              상담부터 검색 등록, 관리자 교육까지 한 번에 진행되는 투명한 제작 과정입니다.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((t) => (
              <div
                key={t.step}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-[#0B0F19] px-2.5 py-1 text-xs font-bold text-white">
                    {t.step}
                  </span>
                  <span className="text-xs font-semibold text-blue-600">{t.period}</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 shrink-0 text-blue-600" />
              <div>
                <div className="text-sm font-bold text-slate-900">100% 반응형 웹 표준</div>
                <div className="text-xs text-slate-500">PC·태블릿·모바일 자동 최적화</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-blue-600" />
              <div>
                <div className="text-sm font-bold text-slate-900">무코드 관리자 콘솔</div>
                <div className="text-xs text-slate-500">문구·이미지·색상 직접 즉시 변경</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-blue-600" />
              <div>
                <div className="text-sm font-bold text-slate-900">패키지별 무상 하자보수</div>
                <div className="text-xs text-slate-500">1~3개월 무상 지원 및 긴급 장애 12시간 대응 SLA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 비대면 진행 안내 및 고객센터 · 세금계산서 안내 */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 100% 비대면 온라인 진행 & 기업 정보 */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs sm:p-8">
              <h3 className="text-xl font-extrabold text-slate-900">100% 비대면 온라인 진행 · 기업 정보</h3>
              <p className="mt-1 text-sm text-slate-500">
                100% 비대면 온라인 진행 (1차 온라인 상담·견적 접수 → 필요 시 사전 예약 전화·화상 미팅)으로 운영됩니다.
              </p>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <dt className="font-semibold text-slate-700">상호 / 대표자</dt>
                    <dd className="mt-0.5 text-slate-600">
                      {companyName} (대표: {info.ceo || "김준호"})
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <dt className="font-semibold text-slate-700">진행 방식 · 사업장 소재지</dt>
                    <dd className="mt-0.5 text-slate-600">
                      100% 비대면 온라인 전담 ({info.address || "전국 온라인 지원"})
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <div>
                    <dt className="font-semibold text-slate-700">전화 · 화상 미팅 안내</dt>
                    <dd className="mt-0.5 text-slate-600">
                      온라인 상담 접수 후 사전 예약 시 진행 ({info.phone || "010-4404-5263"})
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* 고객센터 및 세금계산서 안내 */}
            <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h3 className="text-xl font-extrabold text-slate-900">고객센터 · 세금계산서 안내</h3>
              <p className="mt-1 text-sm text-slate-500">
                모든 기업·병원·개인사업자 고객께 투명한 정식 증빙을 발행해 드립니다.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>상담 운영 시간</span>
                  </div>
                  <p className="mt-1.5 text-slate-600">
                    온라인 접수: 24시간 상시 (접수 후 최대 24시간 이내 순차 회신)
                    <br />
                    전화·화상 미팅: 사전 예약제 운영 (평일 야간 / 주말 집중)
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Receipt className="h-4 w-4 text-blue-600" />
                    <span>세금계산서 및 결제 안내</span>
                  </div>
                  <p className="mt-1.5 text-slate-600">
                    일반과세자 전자세금계산서 100% 발행 · 계좌이체 및 카드 결제 지원
                    <br />
                    사업자등록번호: {info.bizNo || "449-14-03005"} (일반과세자)
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/inquiries"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <span>무료 상담 및 견적 문의</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <span>구축 사례 보기</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
